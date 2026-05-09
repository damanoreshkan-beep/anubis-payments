# anubis-payments

Donations / payments web component for **Anubis World**. Shows three donation tiers (VIP / Premium / Ultra) and three payment methods (Mono jar, Donatello, DonatePay) with click-to-open links and inline QR codes — for any host page that embeds it (the launcher's Settings panel, the website, anywhere).

Sister to [`anubis-auth-widget`](https://github.com/damanoreshkan-beep/anubis-auth-widget) and [`anubis-cabinet`](https://github.com/damanoreshkan-beep/anubis-cabinet): same design system, same Supabase project, separate concern.

## Embed

```html
<script type="module" src="https://damanoreshkan-beep.github.io/anubis-payments/anubis-payments.js"></script>

<anubis-payments
  supabase-url="https://ckfinpywlpllvhvzagnw.supabase.co"
  supabase-key="sb_publishable_…"
  lang="uk"
  mode="web"
></anubis-payments>
```

Attributes:

| | |
|---|---|
| `supabase-url` | Project URL of the Supabase instance backing the auth widget. Only used for the sign-in check. |
| `supabase-key` | Publishable (anon) key. |
| `lang` | `en` · `ru` · `uk` · `de` · `pl` (defaults to `en`). |
| `mode` | `web` (default) or `launcher`. Currently no behaviour difference — kept for parity with the other widgets. |

## What it does

The widget is a **gated marketing surface**: visitors who aren't signed in see a sign-in prompt and nothing else; signed-in users see the full set of tiers and payment methods. Donations themselves are dispatched off-site (Mono / Donatello / DonatePay handle the funds).

* **Three tiers** — VIP (29 ₴) / Premium (99 ₴, marked popular) / Ultra (199 ₴), each with its perks list (privates, home points, kit, optional warp / RTP).
* **Three methods** — every method card shows the QR code up-front (no extra clicks) plus an "Open" button that opens the donation page in a new tab. The Mono QR is generated at runtime from the jar URL via the `qrcode` npm package; Donatello / DonatePay QRs are inlined JPEG assets.
* **After-payment instructions** — a glass card reminds the donator to forward the payment screenshot with their Minecraft nick to Discord / Telegram so the role gets granted.

## Why a sign-in gate

Donations are tied to a player profile — granting a role server-side requires knowing which player paid. The gate is an explicit reminder: visitors must auth via the sister auth widget first, then the cabinet shows them their nick and the tiers. The widget itself doesn't post anywhere on Supabase; it only reads the session.

## Architecture

```
   anubis-payments (web component)         Sibling widgets / host
   ───────────────────────────────         ──────────────────────
   on mount:
     dispatch CustomEvent
     `anubis-need-supabase` ──────→  launcher / auth-widget / cabinet
                                       respond with their Supabase
                                       client through event.detail.client
     ← shared client                
                                       (avoids the multi-client
                                        refresh-token rotation race)

   sb.auth.getSession()
     no session?  →  render sign-in prompt
     has session? →  render tiers + payment methods + QR codes
```

## Build from source

Requires Node 22.

```bash
git clone https://github.com/damanoreshkan-beep/anubis-payments.git
cd anubis-payments
npm ci
npm run dev          # vite dev server with auto-mounted <anubis-payments>
npm run build        # → dist/anubis-payments.js (single ES module, CSS inlined)
```

A push to `main` triggers `.github/workflows/deploy.yml` which republishes the bundle to GitHub Pages at https://damanoreshkan-beep.github.io/anubis-payments/anubis-payments.js.

QR JPEGs live in `src/assets/qr-donatello.jpg` and `src/assets/qr-donatepay.jpg` — Vite inlines them as base64 in the bundle (`assetsInlineLimit: 64 KB`), so the widget ships as a single `.js` file with no extra fetches.

## CSS isolation

Same scoping pattern as the auth and cabinet widgets. Tailwind's `important: '.aw-payments-scope'` config wraps every utility selector with that ancestor. Custom rules in `src/widget.css` are prefixed manually. `scripts/scope-tailwind-globals.js` rewrites Tailwind's `*, :before, :after` and `::backdrop` resets so they don't reset host-page CSS variables.

## Locales

5 locales live as a single `COPY` object in `src/locales.ts`. Adding a key requires updating every locale at once. Plural forms (e.g. "1 приват" vs "2 привата") are handled by per-locale callable strings (`perkPrivates(n)`).
