import { useEffect, useState, useRef } from 'preact/hooks'
import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js'
import QRCode from 'qrcode'
import { copyFor, type T } from './locales'
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
    id: 'vip' | 'premium' | 'ultra'
    nameKey: 'tierVipName' | 'tierPremiumName' | 'tierUltraName'
    priceKey: 'tierVipPrice' | 'tierPremiumPrice' | 'tierUltraPrice'
    privates: number
    homes: number
    kitKey: 'perkKitVip' | 'perkKitPremium' | 'perkKitUltra'
    extras: ('warp' | 'rtp')[]
    popular?: boolean
}

const TIERS: Tier[] = [
    { id: 'vip',     nameKey: 'tierVipName',     priceKey: 'tierVipPrice',     privates: 1, homes: 2, kitKey: 'perkKitVip',     extras: ['warp'] },
    { id: 'premium', nameKey: 'tierPremiumName', priceKey: 'tierPremiumPrice', privates: 2, homes: 3, kitKey: 'perkKitPremium', extras: ['warp'], popular: true },
    { id: 'ultra',   nameKey: 'tierUltraName',   priceKey: 'tierUltraPrice',   privates: 3, homes: 4, kitKey: 'perkKitUltra',   extras: ['warp', 'rtp'] },
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
    return (
        <div class="w-full mx-auto max-w-5xl text-gray-100 space-y-8">
            <div class="text-center">
                <h2 class="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                    <span class="gold-text">{t.title}</span>
                </h2>
                <p class="text-sm text-gray-400 max-w-xl mx-auto">{t.subtitle}</p>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
                {TIERS.map(tier => <TierCard key={tier.id} tier={tier} t={t} />)}
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
                    />
                    <PaymentMethod
                        label={t.methodDonatelloLabel}
                        hint={t.methodDonatelloHint}
                        url={DONATELLO_URL}
                        qrSource={qrDonatelloUrl}
                        t={t}
                        accent="from-blue-500/20 to-blue-500/5"
                        icon={<DonatelloIcon />}
                    />
                    <PaymentMethod
                        label={t.methodDonatePayLabel}
                        hint={t.methodDonatePayHint}
                        url={DONATEPAY_URL}
                        qrSource={qrDonatepayUrl}
                        t={t}
                        accent="from-emerald-500/20 to-emerald-500/5"
                        icon={<DonatePayIcon />}
                    />
                </div>
            </div>
        </div>
    )
}

function TierCard({ tier, t }: { tier: Tier; t: T }) {
    const popular = tier.popular
    return (
        <div
            class={`relative rounded-2xl p-5 ${popular ? 'tier-card-pop' : 'glass'} flex flex-col gap-4`}
        >
            {popular && (
                <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-violet-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {t.tierMostPopular}
                </span>
            )}
            <div class="text-center">
                <div class="text-xs uppercase tracking-widest text-brand-300 mb-1">{t[tier.nameKey]}</div>
                <div class="text-3xl font-bold gold-text">{t[tier.priceKey]}</div>
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
}

function PaymentMethod({ label, hint, url, qrSource, t, accent, icon }: MethodProps) {
    const [showQr, setShowQr] = useState(false)
    const [generatedQr, setGeneratedQr] = useState<string | null>(null)

    useEffect(() => {
        if (qrSource !== 'generate' || !showQr || generatedQr) return
        // High error-correction so a tiny logo overlay still scans.
        QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'H', margin: 1, color: { dark: '#070612', light: '#ffffff' } })
            .then(svg => setGeneratedQr(svg))
            .catch(() => { /* leave empty */ })
    }, [qrSource, showQr, url, generatedQr])

    return (
        <div class={`glass rounded-2xl p-4 flex flex-col gap-3 bg-gradient-to-br ${accent}`}>
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center flex-shrink-0">
                    {icon}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-sm text-white truncate">{label}</div>
                    <div class="text-[11px] text-gray-400 truncate">{hint}</div>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-glow flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md shadow-brand-600/30"
                >
                    {t.openLink}
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
                <button
                    type="button"
                    onClick={() => setShowQr(v => !v)}
                    aria-label={t.scanQr}
                    title={t.scanQr}
                    class={`w-9 h-9 rounded-xl border ${showQr ? 'border-brand-400 bg-brand-500/15' : 'border-brand-500/30 bg-brand-500/5'} hover:border-brand-400 hover:bg-brand-500/15 transition flex items-center justify-center`}
                >
                    <QrIcon />
                </button>
            </div>
            {showQr && (
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
            )}
        </div>
    )
}

const CheckIcon = () => (
    <svg class="w-4 h-4 text-egypt-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

const QrIcon = () => (
    <svg class="w-4 h-4 text-brand-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 4h2m-2-4h6m-3 0v6" />
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
