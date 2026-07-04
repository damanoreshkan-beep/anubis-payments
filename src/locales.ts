// Single COPY map keyed by locale id (2-char code). New keys must be added
// to every locale at the same time — missing keys fall through to `en`.
export type Locale = 'en' | 'ru' | 'uk' | 'de' | 'pl'

// Slavic 3-form plural (1 / 2–4 / 5+) — needed once tiers reach counts of 5+
// (e.g. the Legend tier), where the simple one/other split reads wrong.
const slav = (n: number, one: string, few: string, many: string): string => {
    const m10 = n % 10, m100 = n % 100
    if (m10 === 1 && m100 !== 11) return one
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
    return many
}

export const COPY = {
    en: {
        title: 'Support the server',
        subtitle: 'Pick a tier that fits, then send the donation through any method below.',
        signInRequired: 'Sign in to view donation tiers and payment links.',
        loading: 'Loading…',

        tierVipName: 'VIP',
        tierVipPrice: '49 ₴',
        tierPremiumName: 'Premium',
        tierPremiumPrice: '149 ₴',
        tierUltraName: 'Ultra',
        tierUltraPrice: '349 ₴',
        tierLegendName: 'Legend',
        tierLegendPrice: '999 ₴',
        tierMostPopular: 'Most popular',
        tierTopBadge: 'Top tier',

        perkPrivates: (n: number) => `${n} land claim${n === 1 ? '' : 's'}`,
        perkHomes: (n: number) => `${n} home points`,
        perkKitVip: 'VIP kit',
        perkKitPremium: 'Premium kit',
        perkKitUltra: 'Ultra kit',
        perkKitLegend: 'Legend kit',
        perkWarp: 'Create your own warp',
        perkRtp: 'Improved random teleport',
        perkPermVip: 'Permanent VIP',
        perkCape: 'Exclusive cape',
        perkTitle: 'Unique title',
        perkAllCosmetics: 'All cosmetics included',

        afterPaymentTitle: 'After paying',
        afterPaymentBody: 'Send a screenshot of the payment with your Minecraft nickname to our Telegram or Discord — the role is granted within 24 hours.',

        methodsTitle: 'Payment methods',
        methodMonoLabel: 'Mono jar (UAH)',
        methodMonoHint: 'Send any amount in hryvnia',
        methodDonatelloLabel: 'Donatello',
        methodDonatelloHint: 'UAH · cards · Apple Pay',
        methodDonatePayLabel: 'DonatePay',
        methodDonatePayHint: 'RUB · cards · YooMoney',

        openLink: 'Open',
        scanQr: 'Scan QR code',
        supportPrefix: 'Issues or questions? Reach us on Telegram —',
    },
    ru: {
        title: 'Поддержать сервер',
        subtitle: 'Выбери удобный уровень и отправь донат любым из способов ниже.',
        signInRequired: 'Войди, чтобы увидеть тарифы и ссылки для оплаты.',
        loading: 'Загрузка…',

        tierVipName: 'VIP',
        tierVipPrice: '49 ₴',
        tierPremiumName: 'Премиум',
        tierPremiumPrice: '149 ₴',
        tierUltraName: 'Ультра',
        tierUltraPrice: '349 ₴',
        tierLegendName: 'Легенда',
        tierLegendPrice: '999 ₴',
        tierMostPopular: 'Популярный',
        tierTopBadge: 'Максимум',

        perkPrivates: (n: number) => `${n} ${slav(n, 'приват', 'привата', 'приватов')}`,
        perkHomes: (n: number) => `${n} ${slav(n, 'точка', 'точки', 'точек')} дома`,
        perkKitVip: 'Кит VIP',
        perkKitPremium: 'Кит премиума',
        perkKitUltra: 'Кит ультра',
        perkKitLegend: 'Кит легенды',
        perkWarp: 'Возможность создать варп',
        perkRtp: 'Улучшенный RTP',
        perkPermVip: 'VIP навсегда',
        perkCape: 'Эксклюзивный плащ',
        perkTitle: 'Уникальный титул',
        perkAllCosmetics: 'Вся косметика включена',

        afterPaymentTitle: 'После оплаты',
        afterPaymentBody: 'Отправь скриншот платежа со своим Minecraft-ником нам в Telegram или Discord — выдача роли в течение 24 часов.',

        methodsTitle: 'Способы оплаты',
        methodMonoLabel: 'Mono-банка (грн)',
        methodMonoHint: 'Любая сумма в гривне',
        methodDonatelloLabel: 'Donatello',
        methodDonatelloHint: 'UAH · карты · Apple Pay',
        methodDonatePayLabel: 'DonatePay',
        methodDonatePayHint: 'RUB · карты · ЮMoney',

        openLink: 'Открыть',
        scanQr: 'Скан QR-кода',
        supportPrefix: 'По всем сложностям и вопросам пиши в Telegram —',
    },
    uk: {
        title: 'Підтримати сервер',
        subtitle: 'Обери зручний рівень і надішли донат будь-яким зі способів нижче.',
        signInRequired: 'Увійди, щоб побачити тарифи та посилання для оплати.',
        loading: 'Завантаження…',

        tierVipName: 'VIP',
        tierVipPrice: '49 ₴',
        tierPremiumName: 'Преміум',
        tierPremiumPrice: '149 ₴',
        tierUltraName: 'Ультра',
        tierUltraPrice: '349 ₴',
        tierLegendName: 'Легенда',
        tierLegendPrice: '999 ₴',
        tierMostPopular: 'Популярний',
        tierTopBadge: 'Максимум',

        perkPrivates: (n: number) => `${n} ${slav(n, 'приват', 'привати', 'приватів')}`,
        perkHomes: (n: number) => `${n} ${slav(n, 'точка', 'точки', 'точок')} дому`,
        perkKitVip: 'Кіт VIP',
        perkKitPremium: 'Кіт преміуму',
        perkKitUltra: 'Кіт ультра',
        perkKitLegend: 'Кіт легенди',
        perkWarp: 'Можливість створити варп',
        perkRtp: 'Покращений RTP',
        perkPermVip: 'VIP назавжди',
        perkCape: 'Ексклюзивний плащ',
        perkTitle: 'Унікальний тайтл',
        perkAllCosmetics: 'Уся косметика включена',

        afterPaymentTitle: 'Після оплати',
        afterPaymentBody: 'Надішли скрін платежу зі своїм Minecraft-ніком нам у Telegram або Discord — видача ролі протягом 24 годин.',

        methodsTitle: 'Способи оплати',
        methodMonoLabel: 'Mono-банка (грн)',
        methodMonoHint: 'Будь-яка сума в гривні',
        methodDonatelloLabel: 'Donatello',
        methodDonatelloHint: 'UAH · карти · Apple Pay',
        methodDonatePayLabel: 'DonatePay',
        methodDonatePayHint: 'RUB · картки · ЮMoney',

        openLink: 'Відкрити',
        scanQr: 'Скан QR-коду',
        supportPrefix: 'З усіма складнощами та питаннями — у Telegram до',
    },
    de: {
        title: 'Server unterstützen',
        subtitle: 'Wähle einen Rang, der zu dir passt, und schicke die Spende über eine der Methoden unten.',
        signInRequired: 'Melde dich an, um Spendenränge und Zahlungs-Links zu sehen.',
        loading: 'Lädt…',

        tierVipName: 'VIP',
        tierVipPrice: '49 ₴',
        tierPremiumName: 'Premium',
        tierPremiumPrice: '149 ₴',
        tierUltraName: 'Ultra',
        tierUltraPrice: '349 ₴',
        tierLegendName: 'Legende',
        tierLegendPrice: '999 ₴',
        tierMostPopular: 'Am beliebtesten',
        tierTopBadge: 'Top-Rang',

        perkPrivates: (n: number) => `${n} ${n === 1 ? 'Schutzgebiet' : 'Schutzgebiete'}`,
        perkHomes: (n: number) => `${n} Home-Punkte`,
        perkKitVip: 'VIP-Kit',
        perkKitPremium: 'Premium-Kit',
        perkKitUltra: 'Ultra-Kit',
        perkKitLegend: 'Legenden-Kit',
        perkWarp: 'Eigenen Warp erstellen',
        perkRtp: 'Verbesserter Random-TP',
        perkPermVip: 'Dauerhaftes VIP',
        perkCape: 'Exklusiver Umhang',
        perkTitle: 'Einzigartiger Titel',
        perkAllCosmetics: 'Alle Kosmetika inklusive',

        afterPaymentTitle: 'Nach der Zahlung',
        afterPaymentBody: 'Schick uns einen Screenshot der Zahlung mit deinem Minecraft-Nick auf Telegram oder Discord — der Rang wird innerhalb von 24 Stunden vergeben.',

        methodsTitle: 'Zahlungsmethoden',
        methodMonoLabel: 'Mono-Glas (UAH)',
        methodMonoHint: 'Beliebiger Betrag in Hrywnja',
        methodDonatelloLabel: 'Donatello',
        methodDonatelloHint: 'UAH · Karten · Apple Pay',
        methodDonatePayLabel: 'DonatePay',
        methodDonatePayHint: 'RUB · Karten · YooMoney',

        openLink: 'Öffnen',
        scanQr: 'QR-Code scannen',
        supportPrefix: 'Probleme oder Fragen? Schreib uns auf Telegram —',
    },
    pl: {
        title: 'Wesprzyj serwer',
        subtitle: 'Wybierz pasujący poziom i wyślij darowiznę dowolną z poniższych metod.',
        signInRequired: 'Zaloguj się, aby zobaczyć poziomy i linki płatności.',
        loading: 'Ładowanie…',

        tierVipName: 'VIP',
        tierVipPrice: '49 ₴',
        tierPremiumName: 'Premium',
        tierPremiumPrice: '149 ₴',
        tierUltraName: 'Ultra',
        tierUltraPrice: '349 ₴',
        tierLegendName: 'Legenda',
        tierLegendPrice: '999 ₴',
        tierMostPopular: 'Najpopularniejszy',
        tierTopBadge: 'Najwyższy',

        perkPrivates: (n: number) => `${n} ${slav(n, 'prywatka', 'prywatki', 'prywatek')}`,
        perkHomes: (n: number) => `${n} ${slav(n, 'punkt', 'punkty', 'punktów')} domu`,
        perkKitVip: 'Zestaw VIP',
        perkKitPremium: 'Zestaw Premium',
        perkKitUltra: 'Zestaw Ultra',
        perkKitLegend: 'Zestaw Legenda',
        perkWarp: 'Stwórz własny warp',
        perkRtp: 'Ulepszony RTP',
        perkPermVip: 'VIP na zawsze',
        perkCape: 'Ekskluzywna peleryna',
        perkTitle: 'Unikalny tytuł',
        perkAllCosmetics: 'Wszystkie kosmetyki w zestawie',

        afterPaymentTitle: 'Po opłaceniu',
        afterPaymentBody: 'Wyślij zrzut ekranu płatności z nickiem Minecraft na nasz Telegram lub Discord — rola zostaje przyznana w ciągu 24 godzin.',

        methodsTitle: 'Metody płatności',
        methodMonoLabel: 'Mono-słoik (UAH)',
        methodMonoHint: 'Dowolna kwota w hrywnach',
        methodDonatelloLabel: 'Donatello',
        methodDonatelloHint: 'UAH · karty · Apple Pay',
        methodDonatePayLabel: 'DonatePay',
        methodDonatePayHint: 'RUB · karty · YooMoney',

        openLink: 'Otwórz',
        scanQr: 'Zeskanuj QR',
        supportPrefix: 'Pytania lub problemy? Napisz na Telegrama —',
    },
} satisfies Record<Locale, Record<string, any>>

export type T = typeof COPY['en']

export function copyFor(lang: string | undefined | null): T {
    const k = (lang || '').slice(0, 2).toLowerCase() as Locale
    return (COPY[k] ?? COPY.en) as unknown as T
}
