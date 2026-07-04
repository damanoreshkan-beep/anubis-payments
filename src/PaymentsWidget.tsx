import { useEffect, useState, useRef } from 'preact/hooks'
import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js'
import { animate, stagger, hover } from 'motion'
import QRCode from 'qrcode'
import { copyFor, type T } from './locales'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const prefersReduced = () =>
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
import { fetchRates, readCachedRates, isFresh, type Rates } from '@anubis/widget-core'
import qrDonatelloUrl from './assets/qr-donatello.jpg'
import qrDonatepayUrl from './assets/qr-donatepay.jpg'

interface Props {
    supabaseUrl?: string
    supabaseKey?: string
    lang?: string
    /** `web` (default) — full layout. `launcher` — embedded inline. */
    mode?: 'web' | 'launcher'
}

// Coordinated single Supabase client. See the long comment in
// anubis-cabinet for the rationale — race on refresh-token rotation
// breaks getSession() in whichever client refreshes second.
function obtainSharedClient(url?: string, key?: string): SupabaseClient | null {
    if (typeof document === 'undefined') {
        return url && key ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null
    }
    const ev = new CustomEvent('anubis-need-supabase', {
        detail: {} as { client?: SupabaseClient },
        bubbles: true,
        composed: true,
    })
    document.dispatchEvent(ev)
    const provided = (ev.detail as { client?: SupabaseClient }).client
    if (provided) return provided
    if (!url || !key) return null
    const fresh = createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
    document.addEventListener('anubis-need-supabase', (e) => {
        const d = (e as CustomEvent).detail as { client?: SupabaseClient }
        if (d && !d.client) d.client = fresh
    })
    return fresh
}

const MONO_URL      = 'https://send.monobank.ua/jar/75xtF3s12M'
const DONATELLO_URL = 'https://donatello.to/AnubisWorld'
const DONATEPAY_URL = 'https://donatepay.ru/don/AnubisWorld'

interface Tier {
    id: 'vip' | 'premium' | 'ultra' | 'legend'
    nameKey: 'tierVipName' | 'tierPremiumName' | 'tierUltraName' | 'tierLegendName'
    /** Price in hryvnia — converted on the fly to USD / RUB. */
    priceUAH: number
    privates: number
    homes: number
    kitKey: 'perkKitVip' | 'perkKitPremium' | 'perkKitUltra' | 'perkKitLegend'
    extras: ('warp' | 'rtp' | 'cape' | 'title' | 'allCosmetics' | 'permVip')[]
    popular?: boolean
    /** Whale tier — gold treatment, anchors the top of the ladder. */
    legendary?: boolean
}

const TIERS: Tier[] = [
    { id: 'vip',     nameKey: 'tierVipName',     priceUAH:  49, privates: 1, homes: 2, kitKey: 'perkKitVip',     extras: ['warp'] },
    { id: 'premium', nameKey: 'tierPremiumName', priceUAH: 149, privates: 2, homes: 3, kitKey: 'perkKitPremium', extras: ['warp'], popular: true },
    { id: 'ultra',   nameKey: 'tierUltraName',   priceUAH: 349, privates: 3, homes: 4, kitKey: 'perkKitUltra',   extras: ['warp', 'rtp'] },
    { id: 'legend',  nameKey: 'tierLegendName',  priceUAH: 999, privates: 5, homes: 6, kitKey: 'perkKitLegend',  extras: ['warp', 'rtp', 'permVip', 'cape', 'title', 'allCosmetics'], legendary: true },
]

export function PaymentsWidget({ supabaseUrl, supabaseKey, lang }: Props) {
    const t = copyFor(lang)

    const sbRef = useRef<SupabaseClient | null>(null)
    if (!sbRef.current) {
        sbRef.current = obtainSharedClient(supabaseUrl, supabaseKey)
    }
    const sb = sbRef.current

    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!sb) { setLoading(false); return }
        sb.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
        const { data: sub } = sb.auth.onAuthStateChange((_event, sess) => setSession(sess))
        return () => sub.subscription.unsubscribe()
    }, [sb])

    if (loading) {
        return (
            <div class="aw-payments-scope flex items-center justify-center p-12 text-gray-400">
                <div class="w-6 h-6 rounded-full border-2 border-brand-500/30 border-t-brand-400 animate-spin" />
            </div>
        )
    }

    if (!session?.user) {
        return (
            <div class="aw-payments-scope p-8 text-center text-gray-400 text-sm">
                {t.signInRequired}
            </div>
        )
    }

    return (
        <div class="aw-payments-scope">
            <PaymentsBody t={t} />
        </div>
    )
}

function PaymentsBody({ t }: { t: T }) {
    // Seed from cache so the price subtitle is filled in on first
    // paint when the user has visited before. Refetch in the
    // background if the cached rates are older than the TTL or absent.
    const [rates, setRates] = useState<Rates | null>(() => readCachedRates())
    useEffect(() => {
        if (isFresh(rates)) return
        let cancelled = false
        fetchRates().then(r => { if (!cancelled) setRates(r) }).catch(() => { /* keep UAH-only */ })
        return () => { cancelled = true }
    // Intentionally empty deps — only run once per widget mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Motion: stagger the tier/method cards in on mount, and add a spring
    // lift on hover. Scoped to this widget's root so it never touches other
    // widgets on the page. Reduced-motion users get the static layout —
    // the cards render at full opacity (no [data-anim] opacity:0 is set).
    const reduce = prefersReduced()
    const rootRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const root = rootRef.current
        if (!root || reduce) return
        const items = [...root.querySelectorAll('[data-anim-in]')] as HTMLElement[]
        animate(items, { opacity: [0, 1], y: [16, 0] },
            { duration: 0.5, delay: stagger(0.06), ease: EASE })
        const spring = { type: 'spring', stiffness: 320, damping: 26 } as const
        const stops = [...root.querySelectorAll('[data-anim-hover]')].map((c) => {
            const el = c as HTMLElement
            return hover(el, () => {
                animate(el, { y: -6, scale: 1.015 }, spring)
                return () => animate(el, { y: 0, scale: 1 }, spring)
            })
        })
        return () => stops.forEach((stop) => stop())
    }, [reduce])

    return (
        <div ref={rootRef} class="w-full mx-auto max-w-5xl text-gray-100 space-y-8">
            <div class="text-center">
                <h2 class="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                    <span class="gold-text">{t.title}</span>
                </h2>
                <p class="text-sm text-gray-400 max-w-xl mx-auto">{t.subtitle}</p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {TIERS.map(tier => <TierCard key={tier.id} tier={tier} t={t} rates={rates} reduce={reduce} />)}
            </div>

            <div class="glass rounded-2xl p-5 space-y-2">
                <h3 class="text-sm font-semibold text-brand-300">{t.afterPaymentTitle}</h3>
                <p class="text-sm text-gray-400 leading-relaxed">{t.afterPaymentBody}</p>
            </div>

            <div class="space-y-3">
                <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-400">{t.methodsTitle}</h3>
                <div class="grid gap-3 md:grid-cols-3">
                    <PaymentMethod
                        label={t.methodMonoLabel}
                        hint={t.methodMonoHint}
                        url={MONO_URL}
                        qrSource="generate"
                        t={t}
                        accent="from-amber-400/20 to-amber-400/5"
                        icon={<MonoIcon />}
                        reduce={reduce}
                    />
                    <PaymentMethod
                        label={t.methodDonatelloLabel}
                        hint={t.methodDonatelloHint}
                        url={DONATELLO_URL}
                        qrSource={qrDonatelloUrl}
                        t={t}
                        accent="from-blue-500/20 to-blue-500/5"
                        icon={<DonatelloIcon />}
                        reduce={reduce}
                    />
                    <PaymentMethod
                        label={t.methodDonatePayLabel}
                        hint={t.methodDonatePayHint}
                        url={DONATEPAY_URL}
                        qrSource={qrDonatepayUrl}
                        t={t}
                        accent="from-emerald-500/20 to-emerald-500/5"
                        icon={<DonatePayIcon />}
                        reduce={reduce}
                    />
                </div>
            </div>

            <div class="pt-2 text-center text-xs text-gray-500">
                {t.supportPrefix}{' '}
                <a href="https://t.me/AnubisWorld_Support" target="_blank" rel="noopener noreferrer"
                   class="text-brand-300 hover:text-brand-200 font-mono">
                    @AnubisWorld_Support
                </a>
            </div>
        </div>
    )
}

function TierCard({ tier, t, rates, reduce }: { tier: Tier; t: T; rates: Rates | null; reduce: boolean }) {
    const popular = tier.popular
    // Round USD to 2 decimals, RUB to whole rubles — looks tighter than
    // raw floating-point output. Fall back to UAH-only when rates fail
    // to load (network down, ad blocker, etc.).
    const usd = rates ? (tier.priceUAH * rates.USD).toFixed(2) : null
    const rub = rates ? Math.round(tier.priceUAH * rates.RUB) : null
    return (
        <div
            data-anim-in
            data-anim-hover
            style={reduce ? undefined : 'opacity:0'}
            class={`relative rounded-2xl p-5 ${tier.legendary ? 'tier-card-legend' : popular ? 'tier-card-pop' : 'glass'} flex flex-col gap-4`}
        >
            {popular && !tier.legendary && (
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-violet-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {t.tierMostPopular}
                </span>
            )}
            {tier.legendary && (
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {t.tierTopBadge}
                </span>
            )}
            <div class="text-center">
                <div class="text-xs uppercase tracking-widest text-brand-300 mb-1">{t[tier.nameKey]}</div>
                <div class="text-3xl font-bold gold-text leading-none">{tier.priceUAH} ₴</div>
                {usd && rub && (
                    // Secondary prices: same readable size as the
                    // tier perks list, slightly muted so the UAH
                    // amount still wins the visual hierarchy. The
                    // "≈" prefix signals these are conversions, not
                    // separate prices.
                    <div class="text-sm text-gray-300 mt-2 flex items-center justify-center gap-2 flex-wrap">
                        <span>≈&nbsp;{rub}&nbsp;₽</span>
                        <span class="text-brand-400/40">/</span>
                        <span>≈&nbsp;${usd}</span>
                    </div>
                )}
            </div>
            <ul class="space-y-2 text-sm">
                <li class="flex items-center gap-2"><CheckIcon /> {t.perkPrivates(tier.privates)}</li>
                <li class="flex items-center gap-2"><CheckIcon /> {t.perkHomes(tier.homes)}</li>
                <li class="flex items-center gap-2"><CheckIcon /> {t[tier.kitKey]}</li>
                {tier.extras.includes('warp') && (
                    <li class="flex items-center gap-2"><CheckIcon /> {t.perkWarp}</li>
                )}
                {tier.extras.includes('rtp') && (
                    <li class="flex items-center gap-2"><CheckIcon /> {t.perkRtp}</li>
                )}
                {tier.extras.includes('permVip') && (
                    <li class="flex items-center gap-2"><CheckIcon /> {t.perkPermVip}</li>
                )}
                {tier.extras.includes('cape') && (
                    <li class="flex items-center gap-2"><CheckIcon /> {t.perkCape}</li>
                )}
                {tier.extras.includes('title') && (
                    <li class="flex items-center gap-2"><CheckIcon /> {t.perkTitle}</li>
                )}
                {tier.extras.includes('allCosmetics') && (
                    <li class="flex items-center gap-2"><CheckIcon /> {t.perkAllCosmetics}</li>
                )}
            </ul>
        </div>
    )
}

interface MethodProps {
    label: string
    hint: string
    url: string
    /** Either a JPEG asset URL or 'generate' to render an SVG QR live. */
    qrSource: string | 'generate'
    t: T
    accent: string
    icon: any
    reduce: boolean
}

function PaymentMethod({ label, hint, url, qrSource, t, accent, icon, reduce }: MethodProps) {
    const [generatedQr, setGeneratedQr] = useState<string | null>(null)

    useEffect(() => {
        if (qrSource !== 'generate' || generatedQr) return
        // High error-correction so a tiny logo overlay would still scan.
        QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'H', margin: 1, color: { dark: '#070612', light: '#ffffff' } })
            .then(svg => setGeneratedQr(svg))
            .catch(() => { /* leave empty */ })
    }, [qrSource, url, generatedQr])

    return (
        <div
            data-anim-in
            data-anim-hover
            style={reduce ? undefined : 'opacity:0'}
            class={`glass rounded-2xl p-4 flex flex-col gap-3 bg-gradient-to-br ${accent}`}
        >
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center flex-shrink-0">
                    {icon}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-sm text-white truncate">{label}</div>
                    <div class="text-[11px] text-gray-400 truncate">{hint}</div>
                </div>
            </div>
            {/* QR is rendered up-front — visitors don't have to click
                anything to scan from a phone. Mono renders client-side
                via the qrcode lib; Donatello / DonatePay are inlined
                JPEGs from the bundle. */}
            <div class="rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center" style="min-height:140px">
                {qrSource === 'generate' ? (
                    generatedQr ? (
                        <div class="w-full max-w-[180px]" dangerouslySetInnerHTML={{ __html: generatedQr }} />
                    ) : (
                        <div class="text-xs text-gray-400">{t.loading}</div>
                    )
                ) : (
                    <img src={qrSource} alt={label} class="max-w-[180px] w-full h-auto" />
                )}
            </div>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                class="btn-glow inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md shadow-brand-600/30"
            >
                {t.openLink}
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </a>
        </div>
    )
}

const CheckIcon = () => (
    <svg class="w-4 h-4 text-egypt-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

const MonoIcon = () => (
    <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none" />
        <text x="12" y="16" text-anchor="middle" font-size="11" font-weight="bold" fill="currentColor">₴</text>
    </svg>
)

const DonatelloIcon = () => (
    <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
        <text x="12" y="17" text-anchor="middle" font-size="14" font-weight="900" fill="currentColor">D</text>
    </svg>
)

const DonatePayIcon = () => (
    <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m4-12H10a2 2 0 100 4h4a2 2 0 010 4H8" />
    </svg>
)
