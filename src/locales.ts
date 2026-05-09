// Single COPY map keyed by locale id (2-char code). New keys must be added
// to every locale at the same time — missing keys fall through to `en`.
export type Locale = 'en' | 'ru' | 'uk' | 'de' | 'pl'

export const COPY = {
    en: {
        title: 'Support the server',
        subtitle: 'Pick a tier that fits, then send the donation through any method below.',
        signInRequired: 'Sign in to view donation tiers and payment links.',
        loading: 'Loading…',

        tierVipName: 'VIP',
        tierVipPrice: '29 ₴',
        tierPremiumName: 'Premium',
        tierPremiumPrice: '99 ₴',
        tierUltraName: 'Ultra',
        tierUltraPrice: '199 ₴',
        tierMostPopular: 'Most popular',

        perkPrivates: (n: number) => `${n} land claim${n === 1 ? '' : 's'}`,
        perkHomes: (n: number) => `${n} home points`,
        perkKitVip: 'VIP kit',
        perkKitPremium: 'Premium kit',
        perkKitUltra: 'Ultra kit',
        perkWarp: 'Create your own warp',
        perkRtp: 'Improved random teleport',

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
    },
    ru: {
        title: 'Поддержать сервер',
        subtitle: 'Выбери удобный уровень и отправь донат любым из способов ниже.',
        signInRequired: 'Войди, чтобы увидеть тарифы и ссылки для оплаты.',
        loading: 'Загрузка…',

        tierVipName: 'VIP',
        tierVipPrice: '29 ₴',
        tierPremiumName: 'Премиум',
        tierPremiumPrice: '99 ₴',
        tierUltraName: 'Ультра',
        tierUltraPrice: '199 ₴',
        tierMostPopular: 'Популярный',

        perkPrivates: (n: number) => n === 1 ? '1 приват' : `${n} привата`,
        perkHomes: (n: number) => `${n} ${n === 1 ? 'точка' : 'точки'} дома`,
        perkKitVip: 'Кит VIP',
        perkKitPremium: 'Кит премиума',
        perkKitUltra: 'Кит ультра',
        perkWarp: 'Возможность создать варп',
        perkRtp: 'Улучшенный RTP',

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
    },
    uk: {
        title: 'Підтримати сервер',
        subtitle: 'Обери зручний рівень і надішли донат будь-яким зі способів нижче.',
        signInRequired: 'Увійди, щоб побачити тарифи та посилання для оплати.',
        loading: 'Завантаження…',

        tierVipName: 'VIP',
        tierVipPrice: '29 ₴',
        tierPremiumName: 'Преміум',
        tierPremiumPrice: '99 ₴',
        tierUltraName: 'Ультра',
        tierUltraPrice: '199 ₴',
        tierMostPopular: 'Популярний',

        perkPrivates: (n: number) => n === 1 ? '1 приват' : `${n} привати`,
        perkHomes: (n: number) => `${n} ${n === 1 ? 'точка' : 'точки'} дому`,
        perkKitVip: 'Кіт VIP',
        perkKitPremium: 'Кіт преміуму',
        perkKitUltra: 'Кіт ультра',
        perkWarp: 'Можливість створити варп',
        perkRtp: 'Покращений RTP',

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
    },
    de: {
        title: 'Server unterstützen',
        subtitle: 'Wähle einen Rang, der zu dir passt, und schicke die Spende über eine der Methoden unten.',
        signInRequired: 'Melde dich an, um Spendenränge und Zahlungs-Links zu sehen.',
        loading: 'Lädt…',

        tierVipName: 'VIP',
        tierVipPrice: '29 ₴',
        tierPremiumName: 'Premium',
        tierPremiumPrice: '99 ₴',
        tierUltraName: 'Ultra',
        tierUltraPrice: '199 ₴',
        tierMostPopular: 'Am beliebtesten',

        perkPrivates: (n: number) => `${n} ${n === 1 ? 'Schutzgebiet' : 'Schutzgebiete'}`,
        perkHomes: (n: number) => `${n} Home-Punkte`,
        perkKitVip: 'VIP-Kit',
        perkKitPremium: 'Premium-Kit',
        perkKitUltra: 'Ultra-Kit',
        perkWarp: 'Eigenen Warp erstellen',
        perkRtp: 'Verbesserter Random-TP',

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
    },
    pl: {
        title: 'Wesprzyj serwer',
        subtitle: 'Wybierz pasujący poziom i wyślij darowiznę dowolną z poniższych metod.',
        signInRequired: 'Zaloguj się, aby zobaczyć poziomy i linki płatności.',
        loading: 'Ładowanie…',

        tierVipName: 'VIP',
        tierVipPrice: '29 ₴',
        tierPremiumName: 'Premium',
        tierPremiumPrice: '99 ₴',
        tierUltraName: 'Ultra',
        tierUltraPrice: '199 ₴',
        tierMostPopular: 'Najpopularniejszy',

        perkPrivates: (n: number) => `${n} ${n === 1 ? 'prywatka' : 'prywatki'}`,
        perkHomes: (n: number) => `${n} ${n === 1 ? 'punkt' : 'punkty'} domu`,
        perkKitVip: 'Zestaw VIP',
        perkKitPremium: 'Zestaw Premium',
        perkKitUltra: 'Zestaw Ultra',
        perkWarp: 'Stwórz własny warp',
        perkRtp: 'Ulepszony RTP',

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
    },
} satisfies Record<Locale, Record<string, any>>

export type T = typeof COPY['en']

export function copyFor(lang: string | undefined | null): T {
    const k = (lang || '').slice(0, 2).toLowerCase() as Locale
    return (COPY[k] ?? COPY.en) as unknown as T
}
