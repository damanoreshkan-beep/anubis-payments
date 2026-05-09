import register from 'preact-custom-element'
import { PaymentsWidget } from './PaymentsWidget'
import css from './widget.css?inline'

// Inject CSS once into document.head. No Shadow DOM — we use Tailwind
// utilities scoped to .aw-payments-scope, same convention as the auth
// and cabinet widgets, and Shadow DOM would force consumers to copy
// the style block themselves.
const STYLE_ID = 'anubis-payments-styles'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const el = document.createElement('style')
    el.id = STYLE_ID
    el.textContent = css
    document.head.appendChild(el)
}

register(
    PaymentsWidget as any,
    'anubis-payments',
    ['supabase-url', 'supabase-key', 'lang', 'mode'],
    { shadow: false },
)
