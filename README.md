# nodebb-plugin-cloudflare-turnstile

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-sqlik-FFDD00?logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/sqlik)

Lightweight, dedicated **Cloudflare Turnstile** plugin for NodeBB **v4.x**. Adds CAPTCHA verification to the registration form and (optionally) the login form. No reCAPTCHA, no hCaptcha, no Akismet, no StopForumSpam, no Honeypot — just Turnstile.

## Why this plugin

Turnstile is Cloudflare's privacy-friendly CAPTCHA alternative — most legitimate visitors solve it without an interaction. The existing all-in-one anti-spam plugins for NodeBB bundle Turnstile with multiple other providers; this one does **one thing**:

- Inject the Turnstile widget on `/register` (and optionally `/login`)
- Verify the token server-side via Cloudflare's `siteverify` endpoint before allowing the form to proceed

That's it. Less surface area, easier to audit, easier to keep working across NodeBB upgrades.

## How it works

1. Plugin reads its config from the ACP page (site key, secret key, theme/size/appearance).
2. The site key + display options are exposed to the client through `filter:config.get` (so they end up in `window.config`).
3. A small client-side script (`public/lib/main.js`) hooks `action:ajaxify.end`. When the user lands on `/register` (or `/login`, if enabled), it dynamically loads the Turnstile script from `challenges.cloudflare.com` and renders the widget into the form.
4. On form submit, the browser includes a `cf-turnstile-response` field with the visitor's token.
5. NodeBB fires `filter:register.check` (or `filter:login.check`). The plugin POSTs the token to Cloudflare's `siteverify` endpoint with the secret key. Verification failure throws an error and aborts the submit.

The Turnstile JavaScript is **only** loaded on pages where the widget will actually render — not on the rest of the forum.

## Install

```bash
cd /path/to/nodebb
npm install nodebb-plugin-cloudflare-turnstile
./nodebb activate nodebb-plugin-cloudflare-turnstile
./nodebb build
./nodebb restart
```

### Cloudron

Open the NodeBB app's **Web Terminal** and run:

```bash
cd /app/code
/usr/local/bin/gosu cloudron:cloudron npm install nodebb-plugin-cloudflare-turnstile
/usr/local/bin/gosu cloudron:cloudron ./nodebb build
```

Then restart the app from the Cloudron Dashboard. Activate via **ACP → Extend → Plugins**.

## Configure

1. **Cloudflare Dashboard → Turnstile → Add site** — enter your forum's hostname, pick a widget mode (Managed is the default), copy the **Site Key** and **Secret Key**.
2. In NodeBB: **ACP → Plugins → Cloudflare Turnstile**:
   - Toggle **Enable Cloudflare Turnstile** ON
   - Paste both keys
   - Pick whether to verify on registration only, login only, or both
   - Optionally tweak theme / size / appearance

| Field | Default | Notes |
|---|---|---|
| Enable | OFF | Master switch |
| Site Key | — | Public, embedded in the page |
| Secret Key | — | Server-only; used for `siteverify` |
| Verify on register | ON | Adds widget to `/register` |
| Verify on login | OFF | Adds widget to `/login` (useful against credential stuffing) |
| Theme | `auto` | `auto` / `light` / `dark` |
| Size | `normal` | `normal` / `flexible` / `compact` |
| Appearance | `always` | `always` / `execute` / `interaction-only` |

## Notes

- **The widget script `api.js` always loads from `challenges.cloudflare.com`** — Cloudflare doesn't allow self-hosting it. If you have a strict Content Security Policy, allow `challenges.cloudflare.com` in `script-src` and `frame-src`.
- **You don't need your domain to be on Cloudflare DNS** to use Turnstile. Account is enough.
- **Failure handling**: when the `siteverify` call itself fails (Cloudflare unreachable, malformed response), the plugin fails *closed* — submission is rejected. This is the safer default; opt-in fail-open is on the roadmap if there's demand.

## Roadmap

- [ ] Fail-open toggle (allow submission if Cloudflare itself is unreachable)
- [ ] Per-request action / cdata for tracking different forms
- [ ] Turnstile Pre-clearance integration

## Support

This plugin is free, MIT-licensed, and maintained in spare time. If it kept your registration form spam-free without dragging in a kitchen sink of other anti-spam services — a coffee is a nice way to say thanks.

[☕ Buy me a coffee](https://buymeacoffee.com/sqlik)

Not required, ever. Issues and PRs are always welcome regardless.

## License

MIT
