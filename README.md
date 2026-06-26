<div align="center">

# Konsultan OS

**A 100% headless operating system for a consulting / advisory firm — one you fully own.**
Clone it to your own Vercel + Convex, sign in, and run the whole practice — public site,
clients, proposals, contracts, projects, invoices, documents, calendar and knowledge base —
from one admin dashboard. No code required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-konsultan-os)

![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![React 19](https://img.shields.io/badge/React-19-149eca)
![Convex](https://img.shields.io/badge/Convex-realtime-orange)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

[**Live demo**](https://konsultan-os.vercel.app)

</div>

---

## What is this?

A **clone-to-own** firm OS. Deploy it to **your** infrastructure and you get a complete
consulting-firm website *and* back office whose data lives in **your** Convex database —
managed entirely from the admin panel. The frontend is stateless, so updates never touch
your data.

- 🌐 **For clients & visitors** — a fast, SEO-ready public site: services, team, case
  studies, insights, FAQ, contact, and custom builder pages.
- 🛠️ **For the firm** — an admin dashboard to run the delivery pipeline (clients →
  proposals → contracts → projects → invoices → documents) plus calendar and knowledge base,
  with zero coding.
- 🔒 **Yours** — your repo, your Vercel, your Convex. No vendor lock-in.

## ✨ Features

- **Headless firm data on Convex** — clients, proposals, contracts, projects, invoices,
  documents, calendar events, knowledge-base articles, public services, team, FAQs,
  contact submissions, subscribers, builder pages and landing sections. Realtime, edited
  from `/dashboard/admin`.
- **Consulting delivery pipeline** — the data model wires the engagement lifecycle end to
  end: a lead becomes a client, a proposal, a signed contract, a project, then invoices and
  deliverable documents.
- **Zero-touch setup** — deploy → open `/admin` → claim owner → run the onboarding wizard.
  No env editing, no terminal. Auth keys auto-provision at build.
- **Branding from the dashboard** — site name, tagline, owner & contact details, logo,
  **favicon**, brand colour, light/dark/system theme, SEO description. Stored in Convex and
  applied across the site at runtime.
- **One-button image picker** — gallery · upload · paste-URL · curated Unsplash
  (`UNSPLASH_ACCESS_KEY` optional; degrades gracefully to a bundled set).
- **AI assistant** — a chat FAB backed by Claude via the AI SDK (`@ai-sdk/anthropic`).
  Key-guarded: it activates only when `ANTHROPIC_API_KEY` is set on the deployment.
- **Admin panel** — workspace settings, user & role management, AI config, analytics
  (Recharts), webhooks + delivery log, API keys, and an audit-event stream.
- **Secure admin** — keyless first-owner claim, then signup gates behind an optional invite
  key (`ADMIN_SIGNUP_KEY`), or auto-create the owner from env (`ADMIN_EMAIL` /
  `ADMIN_PASSWORD`). Optional GitHub / Google OAuth.
- **`/setup` health page** — a plain-language checklist of what's done and what's left,
  each step linking to its fix. No log-reading.
- **In-app updates** — admin sees current vs latest version (from `version.json`) and
  rebuilds in one click via a Vercel deploy hook (`VERCEL_DEPLOY_HOOK_URL`).
- **Backup & restore** — download / re-import all firm content as JSON (auth tables
  excluded), no terminal.
- **Real roles** — owner / admin / editor / viewer, surfaced in the dashboard and recorded
  in the audit log.
- **Production Next.js** — SSR metadata, true HTTP 404s, error/loading boundaries, branded
  not-found, a splash loader until data is ready, robots + sitemap.
- **Demo / clone stages** — a "Deploy your own" ribbon shows on the demo only
  (`NEXT_PUBLIC_DEMO=1`).
- **Tested clones** — `npm run smoke` checks a clone can deploy (local, no CI cost).

## 🚀 Quick start (non-coder)

1. Click **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/rahmanef63/template-konsultan-os)** → connect GitHub → add the **Convex** integration → Deploy.
2. Open `https://your-site.vercel.app/admin` → register the **first account** (it becomes the owner).
3. Follow the **onboarding wizard** to set branding and seed sample content. Done.

## 💻 Local development

```bash
npm install --legacy-peer-deps
cp .env.example .env.local        # set NEXT_PUBLIC_CONVEX_URL
npx convex dev --once             # generates convex/_generated
npm run dev                       # http://localhost:3000
```

## 🔐 Environment — two places

Variables live in **two** dashboards. The Deploy/clone button only fills the Vercel ones;
set the Convex ones in the Convex dashboard (or let the build do it).

| Variable | Where | Required | Purpose |
|----------|-------|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel | ✅ | Convex deployment URL (`.convex.cloud`) |
| `CONVEX_DEPLOY_KEY` | Vercel | ✅ | deploys functions + schema at build via `build:auto` — needs `deploy` + `env:view` + `env:write` (or full access) |
| `JWT_PRIVATE_KEY` / `JWKS` / `SITE_URL` | Convex | ✅ | login signing — **auto-set at build** by `scripts/setup-auth.mjs` (or `npx @convex-dev/auth`) |
| `ADMIN_SIGNUP_KEY` | Convex | – | invite key gating extra admin signups |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Convex | – | auto-create the owner on first load |
| `VERCEL_DEPLOY_HOOK_URL` | Convex | – | enables the in-app "Rebuild now" button |
| `UNSPLASH_ACCESS_KEY` | Convex / server | – | enables the Unsplash tab in the image picker |
| `ANTHROPIC_API_KEY` | Convex | – | enables the AI assistant FAB |
| `AUTH_GITHUB_*` / `AUTH_GOOGLE_*` | Convex | – | optional OAuth sign-in |
| `NEXT_PUBLIC_DEMO` | Vercel | – | demo only — shows the "Deploy your own" ribbon |

> `vercel.json` sets the Build Command to `npm run build:auto`, which runs `convex deploy`
> automatically when `CONVEX_DEPLOY_KEY` is present — leave the Vercel Build Command on its
> default, no manual change needed.

## 🧱 Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 · Tailwind CSS 4 · shadcn/ui · Radix |
| Backend / DB | Convex (Cloud or self-hosted) — realtime |
| Auth | `@convex-dev/auth` (Password + optional OAuth) |
| Theme | next-themes (light / dark / system) |
| Charts / DnD | Recharts · dnd-kit (calendar & ordering) |
| AI | `ai` SDK · `@ai-sdk/anthropic` (Claude) |
| Images | `image-picker` slice (gallery · upload · link · Unsplash) |

## 🗂️ Project structure

```
app/
  (public)/        public site — home, services, team, case-studies, insights,
                   faq, contact, builder pages ([...slug], blocks) (+ loading/error/404)
  dashboard/admin/ admin CMS + admin-panel (users, settings, ai-config, analytics,
                   audit-log, webhooks); plus clients, proposals, contracts, projects,
                   invoices, documents, calendar, knowledge-base, services, team, faq…
  admin/           redirect → /dashboard/admin
  setup/           /setup health checklist page
  login/           auth screen
  api/unsplash/    server-side Unsplash proxy for the image picker
  icon.tsx · robots.ts · sitemap.ts · opengraph-image
components/
  onboarding/      onboarding-wizard
  setup/           setup-health · setup-banner
  admin/           backup-card · update-card
  public-chrome.tsx · admin-gate.tsx · site-loader.tsx · demo-ribbon.tsx · ai-chat-fab.tsx
frontend/slices/   image-picker · ai-chat (portable feature slices)
convex/
  schema.ts        auth + firm content + siteSettings + admin-panel tables
  auth.ts setup.ts settings.ts backup.ts update.ts files.ts seed.ts  …function modules
  features/        aiChat · comments · notion
lib/headless-core/ settings + version manifest (in-app update source of truth)
scripts/           setup-auth.mjs (build-time JWT keys) · smoke-test.mjs
version.json       version manifest the update channel reads
```

## 🗺️ Roadmap

- [x] **headless-core** module + version manifest (`lib/headless-core/`)
- [x] One-click **"Update available"** in admin
- [x] One-click **backup / restore**
- [x] Roles (owner / admin / editor / viewer) + audit log
- [x] **`/setup`** health page + clone **smoke-test**
- [x] AI assistant FAB (Claude)
- [ ] Per-action RBAC across the delivery pipeline
- [ ] Optional Resend "forgot password" + invoice email flows

## 📄 License

MIT © Rahman ([rahmanef.com](https://rahmanef.com))

<div align="center"><sub>Built with <a href="https://resource.rahmanef.com">rahman-resources</a>.</sub></div>
