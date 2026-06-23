import { mutation, internalMutation } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireUser } from "./_shared/auth";
import {
  HERO,
  STATS,
  CLIENTS as LANDING_CLIENTS,
  SERVICES as LANDING_SERVICES,
  FEATURES,
  TESTIMONIALS,
  PRICING,
  FAQS as LANDING_FAQS,
} from "./landingContent";

// Demo seed for Konsultan OS.
// - `seed:run`        — CLI/power use: wipes content then inserts (npx convex run seed:run).
// - `seed:seedSample` — in-app one-click for non-coders: requires login, inserts
//                       ONLY when the site is still empty (never wipes real work).
//
// Data mirrors components/templates/konsultan/shared/*-seed.ts (the former
// localStorage SEED_STATE), converted to Convex inserts.
//
// Cross-entity refs in the source use stable string ids (cl-1, pp-1, …). On
// insert, Convex assigns fresh `_id`s and the store maps `_id` -> frontend `id`,
// so we remap every ref through `seedId -> _id` maps to preserve integrity.
const now = 1_780_000_000_000;
const day = (n: number) => now - n * 24 * 60 * 60 * 1000;
const future = (n: number) => now + n * 24 * 60 * 60 * 1000;

const CLIENTS = [
  { seedId: "cl-1", name: "Aditya Pratama", company: "PT Sinar Mandiri", industry: "Manufaktur", email: "aditya@sinarmandiri.co.id", phone: "+62 812-1111-2222", city: "Jakarta", status: "active" as const, createdAt: day(40) },
  { seedId: "cl-2", name: "Putri Maharani", company: "Nusantara Group", industry: "F&B", email: "putri@nusantaragroup.co.id", phone: "+62 813-3333-4444", city: "Bandung", status: "lead" as const, createdAt: day(8) },
  { seedId: "cl-3", name: "Bayu Setiawan", company: "Bahtera Logistik", industry: "Technology", email: "bayu@bahteralogistik.co.id", phone: "+62 814-5555-6666", city: "Surabaya", status: "completed" as const, createdAt: day(120) },
];

const PROPOSALS = [
  { seedId: "pp-1", clientId: "cl-1", title: "Lean Operations Audit Q2", scope: "Audit operasional 3 pabrik di Jawa Barat. Deliverable: peta value-stream + 12 quick-wins.", valueLabel: "Rp 240jt", durationLabel: "8 minggu", status: "accepted" as const, createdAt: day(38) },
  { seedId: "pp-2", clientId: "cl-2", title: "GTM Strategy Workshop", scope: "Workshop intensif 5 hari + roadmap GTM untuk launch line baru produk frozen food.", valueLabel: "Rp 80jt", durationLabel: "5 hari", status: "sent" as const, createdAt: day(6) },
  { seedId: "pp-3", clientId: "cl-3", title: "Engineering Org Design", scope: "Reorganisasi tim engineering dari 12 → 28 orang. Career ladder + interview rubric.", valueLabel: "Rp 120jt", durationLabel: "6 minggu", status: "accepted" as const, createdAt: day(110) },
];

const CONTRACTS = [
  { seedId: "ct-1", proposalId: "pp-1", clientId: "cl-1", title: "Kontrak Kerja — Lean Ops Audit", termsSummary: "8 minggu, milestone bulanan, payment 40/30/30. PPN 11% included.", status: "signed" as const, signedAt: day(36), endsAt: future(20) },
  { seedId: "ct-2", proposalId: "pp-3", clientId: "cl-3", title: "Kontrak Kerja — Engineering Org", termsSummary: "6 minggu, fixed fee, payment 50/50. Bahasa Indonesia + English bilingual.", status: "expired" as const, signedAt: day(108), endsAt: day(60) },
];

const PROJECTS = [
  { seedId: "pr-1", contractId: "ct-1", clientId: "cl-1", name: "Lean Ops Audit — Sinar Mandiri", description: "Audit operasional 3 pabrik. Phase 2 dari 4.", status: "in-progress" as const, progress: 48, startedAt: day(35), endsAt: future(20), image: "https://picsum.photos/seed/konsultan-pr-1/800/600" },
  { seedId: "pr-2", contractId: "ct-2", clientId: "cl-3", name: "Engineering Org — Bahtera Logistik", description: "Sudah delivered. Maintenance phase.", status: "delivered" as const, progress: 100, startedAt: day(105), endsAt: day(60), image: "https://picsum.photos/seed/konsultan-pr-2/800/600" },
];

const INVOICES = [
  { seedId: "in-1", projectId: "pr-1", clientId: "cl-1", number: "INV-2026-001", amountLabel: "Rp 96jt", ppnLabel: "Rp 10.56jt (11%)", totalLabel: "Rp 106.56jt", status: "paid" as const, dueAt: day(20), issuedAt: day(30) },
  { seedId: "in-2", projectId: "pr-1", clientId: "cl-1", number: "INV-2026-002", amountLabel: "Rp 72jt", ppnLabel: "Rp 7.92jt (11%)", totalLabel: "Rp 79.92jt", status: "sent" as const, dueAt: future(8), issuedAt: day(2) },
  { seedId: "in-3", projectId: "pr-2", clientId: "cl-3", number: "INV-2026-003", amountLabel: "Rp 60jt", ppnLabel: "Rp 6.6jt (11%)", totalLabel: "Rp 66.6jt", status: "paid" as const, dueAt: day(58), issuedAt: day(70) },
];

const DOCUMENTS = [
  { seedId: "dc-1", projectId: "pr-1", title: "Phase 1 — Value Stream Map", kind: "deliverable" as const, status: "shared" as const, updatedAt: day(20) },
  { seedId: "dc-2", projectId: "pr-1", title: "Weekly memo W6", kind: "memo" as const, status: "shared" as const, updatedAt: day(2) },
  { seedId: "dc-3", projectId: "pr-2", title: "Final report — Engineering Org", kind: "report" as const, status: "shared" as const, updatedAt: day(60) },
];

const CALENDAR = [
  { title: "Sinar Mandiri — Steering committee", clientId: "cl-1", projectId: "pr-1", kind: "session" as const, dayOfWeek: 1, hour: 9, durationHours: 2, location: "Zoom", notes: "Review Phase 2 progress. Bawa value-stream map terbaru." },
  { title: "Nusantara — Discovery call", clientId: "cl-2", kind: "session" as const, dayOfWeek: 1, hour: 14, durationHours: 1, location: "Zoom", notes: "Probe pain-point GTM, hint workshop format." },
  { title: "Internal — Sprint planning", kind: "internal" as const, dayOfWeek: 2, hour: 10, durationHours: 1, location: "SCBD Office" },
  { title: "Sinar Mandiri — Plant visit Bekasi", clientId: "cl-1", projectId: "pr-1", kind: "session" as const, dayOfWeek: 2, hour: 13, durationHours: 4, location: "Pabrik Bekasi", notes: "Gemba walk lini 2 & 3. Wawancara supervisor shift." },
  { title: "Nusantara — GTM Workshop Day 1", clientId: "cl-2", kind: "workshop" as const, dayOfWeek: 3, hour: 9, durationHours: 6, location: "Hotel Aryaduta Bandung" },
  { title: "Nusantara — GTM Workshop Day 2", clientId: "cl-2", kind: "workshop" as const, dayOfWeek: 4, hour: 9, durationHours: 6, location: "Hotel Aryaduta Bandung" },
  { title: "Deadline — INV-2026-002 jatuh tempo", clientId: "cl-1", kind: "deadline" as const, dayOfWeek: 4, hour: 17, durationHours: 1, location: "—" },
  { title: "Sinar Mandiri — Weekly memo review", clientId: "cl-1", projectId: "pr-1", kind: "session" as const, dayOfWeek: 5, hour: 10, durationHours: 1, location: "Zoom" },
  { title: "Bahtera Logistik — Follow-up call", clientId: "cl-3", kind: "session" as const, dayOfWeek: 5, hour: 15, durationHours: 1, location: "Zoom", notes: "Discuss retainer extension Q3." },
  { title: "Internal — Knowledge base writing", kind: "internal" as const, dayOfWeek: 5, hour: 16, durationHours: 2, location: "Async" },
  { title: "Deadline — Phase 2 deliverable Sinar Mandiri", clientId: "cl-1", projectId: "pr-1", kind: "deadline" as const, dayOfWeek: 1, hour: 17, durationHours: 1, location: "—" },
  { title: "Networking — IDX Consulting Summit", kind: "internal" as const, dayOfWeek: 6, hour: 9, durationHours: 4, location: "Ritz-Carlton Pacific Place" },
  { title: "Nusantara — Workshop debrief", clientId: "cl-2", kind: "session" as const, dayOfWeek: 0, hour: 19, durationHours: 1, location: "Zoom" },
  { title: "Sinar Mandiri — Mid-week sync", clientId: "cl-1", projectId: "pr-1", kind: "session" as const, dayOfWeek: 3, hour: 16, durationHours: 1, location: "Zoom" },
];

const para = (...p: string[]) => p.join("\n\n");
const KB = [
  { slug: "strategy-sprint-methodology", title: "Strategy Sprint — Metodologi 5 hari", category: "Strategi" as const, summary: "Format intensif untuk validasi inisiatif strategis besar dalam satu minggu kerja. Diadaptasi dari GV Sprint untuk konteks korporat ID.", body: para("Strategy Sprint adalah format kerja 5 hari yang dipakai untuk menjawab pertanyaan strategis kritis sebelum komitmen sumber daya besar. Tim klien (5–7 orang lintas-fungsi) full-time bersama 1–2 konsultan kami.", "Hari 1 framing & landscape, Hari 2 divergent ideation, Hari 3 storyboard solusi, Hari 4 prototype eksekutif (slide / financial model / mock-up), Hari 5 stress-test dengan steering committee dan keputusan go/no-go.", "Output: keputusan terdokumentasi + minimum viable plan (12 minggu). Jangan ditawarkan ke klien tanpa CEO/COO sponsor — sprint butuh decision-maker hadir minimum 4 dari 5 hari."), author: "Arif Wibowo", updatedAt: day(5), status: "published" as const },
  { slug: "lean-ops-audit-checklist", title: "Lean Operations Audit — Checklist 12 area", category: "Operasi" as const, summary: "Checklist baseline untuk audit operasional manufaktur. Cover 12 area dari demand planning sampai after-sales. Versi rev-7.", body: para("Checklist ini turunan dari toolkit yang dipakai di engagement Sinar Mandiri, Nusantara Group, dan Sentosa Manufaktur. 12 area: demand planning, S&OP, master scheduling, MRP, supplier mgmt, inbound logistics, plant ops, quality, maintenance, warehouse, outbound, after-sales.", "Setiap area punya 8–12 pertanyaan probe + 3–5 tanda red-flag. Total ~120 pertanyaan. Selesai diisi penuh dalam 2 minggu (1 plant visit per area kluster).", "Penting: jangan share checklist ke klien sebelum kick-off. Klien yang tahu pertanyaan akan menyiapkan jawaban skripted — kita kehilangan sinyal jujur."), author: "Arif Wibowo", updatedAt: day(2), status: "published" as const },
  { slug: "ma-due-diligence-id", title: "M&A Due Diligence — Checklist Indonesia", category: "M&A" as const, summary: "Diligence checklist yang sudah disesuaikan dengan UU PT, UU Cipta Kerja, dan praktek pajak ID. Bilingual ID/EN.", body: para("Checklist diligence standar Big-4 sering miss konteks ID: BPJS arrears, izin lingkungan (AMDAL/UKL-UPL), tanah HGB vs SHM, dan praktek transfer pricing intra-grup. Versi kami cover semua itu.", "Struktur: Legal (40 item), Finance (35), Tax (28 — fokus PPh 23/26 & PPN), HR (22), Commercial (30), IT (15), ESG (18). Total 188 item, ~3 minggu untuk perusahaan medium-size.", "Pakai bareng template Data Room Index (lihat kb-5). Klien biasanya tidak punya data room rapi — bantu mereka set up sebelum mulai diligence formal, kalau tidak timeline molor 2–4 minggu."), author: "Aditya Wibowo", updatedAt: day(18), status: "published" as const },
  { slug: "org-design-career-ladder", title: "Org Design — Career Ladder template engineering", category: "Organisasi" as const, summary: "Career ladder 7-level untuk tim engineering 10–50 orang. Format Stripe/Carta-style, diadaptasi untuk pay band rupiah.", body: para("Career ladder mendefinisikan 7 level (Junior 1 → Staff 2) dengan 4 dimensi: Technical Craft, Scope of Influence, Communication, Leadership. Setiap sel punya behavioral indicator konkret.", "Pay band terlampir (rentang gaji per level, kota Jakarta/Bandung/Surabaya). Update terakhir Q1 2026 — review band Q3 ketika data Mercer keluar.", "Jangan publikasi ladder ke klien tanpa dorong proses calibration: minimal 2 sesi 3-jam dengan tech leads untuk re-rate semua engineer existing. Tanpa kalibrasi, ladder jadi politik, bukan tool growth."), author: "Sari Putri", updatedAt: day(12), status: "published" as const },
  { slug: "data-room-index-template", title: "Data Room Index — Template", category: "Template" as const, summary: "Folder structure standar untuk virtual data room. Cocok untuk diligence M&A, fund-raising, atau audit eksternal.", body: para("Struktur 8-folder top-level: 01 Corporate, 02 Financial, 03 Tax, 04 Legal Contracts, 05 HR & Org, 06 Commercial, 07 IT & Data, 08 ESG & Compliance. Sub-folder bernomor untuk preservasi urutan di Dropbox/Drive.", "Setiap folder punya README.md yang list expected documents. Klien tinggal isi — saat dokumen di-upload, README auto-update via Apps Script (tidak diship default; tanya saja ke ops).", "Sudah dipakai di 12 engagement. Iterasi terakhir tambah folder ESG karena bank/investor mulai minta data emisi & supplier audit."), author: "Arif Wibowo", updatedAt: day(30), status: "published" as const },
  { slug: "workshop-facilitation-playbook", title: "Workshop Facilitation — Playbook", category: "Workshop" as const, summary: "Panduan fasilitasi workshop intensif (2–5 hari). Cover agenda design, energy management, dan handling konflik eksekutif.", body: para("Workshop konsultan beda dari training. Output yang dituju: keputusan + komitmen, bukan transfer pengetahuan. Setiap sesi harus produce artifact (canvas terisi, prioritas terurut, ownership tertulis).", "Rule energy management: jangan plenary >90 menit. Break-out 4–6 orang lebih produktif. Hari ke-3 selalu paling berat — siapkan ice-breaker dan ubah seating.", "Konflik eksekutif: jangan disolve di ruangan. Park ke 1:1 follow-up. Yang penting di workshop adalah surface, bukan resolve. Resolusi private menjaga muka semua pihak."), author: "Bayu Setiawan", updatedAt: day(8), status: "published" as const },
  { slug: "client-discovery-call-script", title: "Discovery Call — Script & probe questions", category: "Strategi" as const, summary: "Script 30 menit untuk discovery call. 4 fase: rapport, situation probe, need probe, next-step framing.", body: para("Discovery call gratis 30 menit yang ditawarkan di /services adalah filter, bukan sales pitch. Tujuan: assess fit + decide apakah lanjut proposal atau decline halus.", "Fase 1 rapport (3 menit), Fase 2 situation (10 menit — probe 'di mana sekarang', 'apa sudah dicoba'), Fase 3 need (10 menit — probe 'kalau ini selesai, apa berubah'), Fase 4 framing (7 menit — sketch dua-tiga opsi engagement + range pricing).", "Red flag yang biasa dropping deal: klien minta 'gambaran solusi' detail di call. Itu sinyal mereka cari free advice, bukan partner. Politely defer ke proposal berbayar."), author: "Arif Wibowo", updatedAt: day(1), status: "draft" as const },
];

// Public services — mirror components/templates/konsultan/shared/services-seed.ts.
const SERVICES = [
  { slug: "strategy-sprint", name: "Strategy Sprint", tagline: "Diagnosa & rekomendasi strategi 6 minggu.", priceLabel: "Rp 180jt", durationLabel: "6 minggu · 2 konsultan", accent: "violet" as const, featured: true, order: 10,
    bullets: ["Kick-off workshop dengan tim leadership", "Diagnostic interview (8–12 stakeholder)", "Market & competitor scan", "Strategic options paper (3 opsi)", "Board-ready recommendation deck"],
    outcomes: ["Pilihan strategi yang teruji secara data", "Roadmap implementasi 12 bulan", "Konsensus internal lintas divisi"] },
  { slug: "quarterly-retainer", name: "Quarterly Retainer", tagline: "Pendamping eksekusi strategis tiap kuartal.", priceLabel: "Rp 120jt / kuartal", durationLabel: "3 bulan · billing per kuartal", accent: "emerald" as const, order: 20,
    bullets: ["Bi-weekly steering committee", "OKR review & coaching", "On-demand consultation (8 jam/bulan)", "Akses Slack channel ke tim konsultan", "Quarterly board memo"],
    outcomes: ["Eksekusi strategi yang konsisten", "Tim leadership lebih percaya diri ambil keputusan", "Track record progress yang jelas"] },
  { slug: "workshop-facilitation", name: "Workshop Facilitation", tagline: "Fasilitasi sesi intensif untuk tim leadership.", priceLabel: "Rp 45jt", durationLabel: "1–2 hari · max 20 peserta", accent: "amber" as const, order: 30,
    bullets: ["Design workshop bersama klien", "Fasilitasi onsite (Jakarta / luar kota)", "Pre-read materials & frameworks", "Synthesis deck pasca-workshop", "Follow-up coaching 1 jam"],
    outcomes: ["Tim selaras dalam 2 hari, bukan 2 bulan", "Output yang siap eksekusi", "Energi baru di tim leadership"] },
];

// Public team — mirror components/templates/konsultan/shared/team-seed.ts.
const TEAM = [
  { slug: "arif-wibowo", name: "Arif Wibowo", role: "Principal Consultant & Founder", city: "Jakarta", initials: "AW", yearsExp: 18, order: 10, expertise: ["Corporate Strategy", "M&A Integration", "Board Advisory"], bio: "Arif memimpin engagement strategis untuk klien tier-1 di sektor consumer, finance, dan healthcare. Sebelum mendirikan Konsultan OS, ia menghabiskan 12 tahun di tier-1 strategy firm di Singapura dan Jakarta." },
  { slug: "sari-widyaningsih", name: "Sari Widyaningsih", role: "Senior Manager", city: "Jakarta", initials: "SW", yearsExp: 11, order: 20, expertise: ["Organization Design", "Leadership Development", "Change Management"], bio: "Sari mendampingi tim leadership dalam transformasi organisasi pasca-merger dan ekspansi regional. Latar belakang industrial-organizational psychology dari Universitas Indonesia dan certified executive coach (ICF PCC)." },
  { slug: "bagas-hermawan", name: "Bagas Hermawan", role: "Operations Director", city: "Surabaya", initials: "BH", yearsExp: 14, order: 30, expertise: ["Manufacturing Excellence", "Supply Chain", "Lean Six Sigma"], bio: "Bagas memimpin praktik operasi dengan fokus pada manufaktur dan supply chain. Sebelumnya plant director di multinasional FMCG, dan certified Lean Six Sigma Black Belt." },
  { slug: "rizki-pratama", name: "Rizki Pratama", role: "Engagement Manager", city: "Bandung", initials: "RP", yearsExp: 8, order: 40, expertise: ["Digital Transformation", "Data Strategy", "Product Strategy"], bio: "Rizki memimpin engagement yang melibatkan transformasi digital dan data strategy. Background computer science ITB dan pengalaman 5 tahun di product management di scale-up regional." },
];

// Public FAQ — mirror components/templates/konsultan/shared/faq-seed.ts.
const FAQS = [
  { category: "Umum" as const, order: 10, question: "Apa fokus utama praktik konsultasi Anda?", answer: "Kami fokus di tiga area: strategi pertumbuhan (GTM, market entry, M&A), efisiensi operasi (lean, supply chain, manufacturing), dan desain organisasi (career ladder, reorg, comp design). Skala klien: scale-up sampai mid-cap dengan revenue Rp 50 milyar–Rp 5 triliun." },
  { category: "Umum" as const, order: 20, question: "Industri apa saja yang pernah dikerjakan?", answer: "Mayoritas engagement di manufaktur (otomotif, FMCG, F&B), teknologi (SaaS B2B, marketplace), jasa keuangan (multifinance, fintech), dan retail/distribusi. Kami tidak menerima engagement di tobacco, gambling, atau ekstraktif tanpa pre-screening ESG." },
  { category: "Umum" as const, order: 30, question: "Apakah bahasa kerja Indonesia atau Inggris?", answer: "Bilingual — default Bahasa Indonesia untuk klien lokal, English untuk klien dengan stakeholder regional/global. Semua deliverable bisa dipesan bilingual (tambah ~15% durasi untuk translasi-review)." },
  { category: "Pricing" as const, order: 40, question: "Bagaimana model pricing engagement?", answer: "Tiga model: (1) Fixed-fee per project (paling umum, untuk scope yang jelas), (2) Retainer bulanan (untuk advisory ongoing, Rp 40jt–Rp 120jt/bulan), (3) Workshop intensif (Rp 60jt–Rp 150jt per workshop 2–5 hari, all-in untuk 1 tim)." },
  { category: "Pricing" as const, order: 50, question: "Apakah harga sudah termasuk PPN?", answer: "Harga proposal selalu pre-tax. PPN 11% ditambahkan saat invoice sesuai regulasi DJP. Kami PKP terdaftar — invoice resmi dengan e-faktur, bisa di-credit ke PPN masukan klien yang juga PKP." },
  { category: "Pricing" as const, order: 60, question: "Term pembayaran standar bagaimana?", answer: "Project fixed-fee: split 40/30/30 (down payment, mid-milestone, deliverable final), term net-14 per termin. Retainer: invoice di awal bulan, net-7. Workshop: 100% pre-payment minimum 5 hari kerja sebelum mulai." },
  { category: "Pricing" as const, order: 70, question: "Apa ada discovery call gratis?", answer: "Ya. Discovery call 30 menit gratis untuk semua calon klien. Tujuan: assess fit + sketsa awal opsi engagement. Tidak ada commitment dari kedua sisi. Booking via /contact." },
  { category: "Proses" as const, order: 80, question: "Berapa lama dari kontak pertama sampai kick-off?", answer: "Rata-rata 2 minggu: discovery call (minggu 1), proposal kirim (3–5 hari kerja), revisi & negosiasi (3–5 hari), kontrak sign (1–2 hari), kick-off (1 minggu setelah sign). Bisa di-fast-track jadi 1 minggu kalau urgent." },
  { category: "Proses" as const, order: 90, question: "Siapa yang akan kerja di engagement saya?", answer: "Setiap engagement punya 1 principal (titik akuntabel + presence ke C-level) + 1–3 senior associate (kerja sehari-hari). Tidak ada model 'pitch dengan partner, eksekusi dengan junior' — principal selalu hands-on di analisis kunci." },
  { category: "Proses" as const, order: 100, question: "Bagaimana laporan progress dilakukan?", answer: "Weekly memo singkat (1 halaman, async via email/WA) + bi-weekly steering committee 60 menit dengan executive sponsor. Final deliverable selalu di-walk-through live dengan tim klien, tidak di-drop file lalu hilang." },
  { category: "Proses" as const, order: 110, question: "Bagaimana kalau scope berubah di tengah jalan?", answer: "Scope creep dihandle via Change Request (CR) tertulis singkat — kami estimate impact ke timeline & fee, klien approve sebelum kerja lanjut. Untuk perubahan kecil (<10% effort), biasanya kami absorb tanpa CR formal." },
  { category: "Engagement" as const, order: 120, question: "Apakah Anda menandatangani NDA?", answer: "Ya, NDA standar mutual disediakan sebelum discovery call kalau diminta. Kami juga punya template NDA bilingual (ID/EN) yang biasanya bisa diterima compliance klien tanpa revisi besar. Sharing template via email." },
  { category: "Engagement" as const, order: 130, question: "Boleh meminta klien existing sebagai referensi?", answer: "Bisa — kami minta izin ke klien existing dulu. Beberapa klien (terutama yang publik / scale-up well-known) bersedia di-quoted. Untuk industri sensitif kami biasanya share case study anonim atau referensi by-phone, bukan tertulis." },
  { category: "Engagement" as const, order: 140, question: "Apakah engagement bisa di-pause atau dihentikan?", answer: "Bisa. Termination clause: notice 14 hari kerja dari salah satu pihak. Fee yang dibayar untuk milestone yang sudah selesai tidak refundable; milestone yang belum mulai di-refund 100%. Tidak ada penalty." },
  { category: "Engagement" as const, order: 150, question: "Bagaimana hak intelektual deliverable diatur?", answer: "Deliverable spesifik untuk klien (analisis, rekomendasi, slide) jadi milik klien penuh setelah fee dilunasi. Tools & framework underlying (template kami, model proprietary) tetap milik kami — klien dapat license non-exclusive untuk pakai internal." },
];

// Keep in sync with components/templates/konsultan/shared/seed.ts
// SEED_LANDING_SECTIONS. `syncLanding` below pushes additions/order to an
// already-seeded deployment without touching admin-edited copy.
// Item-bearing sections (stats/services/features/testimonials/pricing/faq)
// seed their example content into `config` from convex/landingContent.ts — the
// SAME module the frontend render falls back to — so a fresh clone gets
// editable example data and there is no convex<->render drift. Table-backed
// kinds (portfolio/blog) render from their own tables and carry no config here.
const LANDING = [
  { id: "ls-hero", order: 10, kind: "hero", title: HERO.title, subtitle: HERO.subtitle, enabled: true, config: JSON.stringify({ badge: HERO.badge }), layers: [{ id: "hero-photo", type: "image", placement: "background", opacity: 100, enabled: true, url: "/hero.webp" }] },
  { id: "ls-stats", order: 15, kind: "stats", title: "Track record yang bisa diaudit", subtitle: "Angka berjalan dari engagement yang kami tangani sejak hari pertama.", enabled: true, config: JSON.stringify({ stats: STATS, clients: LANDING_CLIENTS }) },
  { id: "ls-services", order: 20, kind: "services", title: "Empat area utama", subtitle: "Fokus di strategi, operasi, organisasi, dan workshop intensif.", enabled: true, config: JSON.stringify({ items: LANDING_SERVICES }) },
  { id: "ls-features", order: 30, kind: "features", title: "Tools yang menjalankan praktik kami", subtitle: "Sistem ini sama yang juga bisa Anda pakai untuk firma sendiri.", enabled: true, config: JSON.stringify({ items: FEATURES }) },
  { id: "ls-portfolio", order: 40, kind: "portfolio", title: "Proyek terbaru", subtitle: "Sebagian engagement yang sedang/telah berjalan.", enabled: true },
  { id: "ls-testimonials", order: 45, kind: "testimonials", title: "Apa kata klien kami", subtitle: "Dari founder, COO, sampai HR director — lintas industri dan kota.", enabled: true, config: JSON.stringify({ items: TESTIMONIALS }) },
  { id: "ls-pricing", order: 50, kind: "pricing", title: "Model engagement yang jelas", subtitle: "Mulai dari diagnostik cepat sampai retainer advisory — fixed fee, tanpa kejutan.", enabled: true, config: JSON.stringify({ tiers: PRICING }) },
  { id: "ls-faq", order: 55, kind: "faq", title: "Pertanyaan sebelum engagement", subtitle: "Soal proses, durasi, biaya, dan kerahasiaan data Anda.", enabled: true, config: JSON.stringify({ items: LANDING_FAQS }) },
  { id: "ls-insights", order: 60, kind: "blog", title: "Insights dari lapangan", subtitle: "Pola yang berulang di klien kami, ditulis jadi pelajaran praktis.", enabled: true },
  { id: "ls-cta", order: 65, kind: "cta", title: "Siap mulai konsultasi?", subtitle: "Konsultasi awal gratis. Respons dalam 24 jam.", enabled: true },
  { id: "ls-newsletter", order: 70, kind: "newsletter", title: "Insight bulanan ke inbox Anda", subtitle: "Satu email per bulan berisi pelajaran dari engagement nyata. Tanpa spam.", enabled: true },
];

const pubBase = "/konsultan-os";
const PAGES = [
  { id: "sys-home", slug: "", title: "Home", description: "Consultancy landing — pitch, sectors, CTA.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true, isLanding: true },
  { id: "sys-case-studies", slug: "case-studies", title: "Case Studies", description: "Selected engagements, outcomes, references.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  { id: "sys-contact", slug: "contact", title: "Contact", description: "Konsultasi gratis form, calendar, address.", blocks: [], status: "published", createdAt: day(180), updatedAt: day(180), systemPage: true },
  {
    id: "custom-approach", slug: "approach", title: "Pendekatan kami", description: "Metodologi 4-fase, dari diagnosis sampai handover.",
    blocks: [
      { kind: "hero", headline: "Diagnosis → Desain → Eksekusi → Handover", sub: "Cara kami bekerja, transparan dan terukur." },
      { kind: "feature-list", heading: "Empat fase", items: [
        { title: "1. Diagnosis", body: "Wawancara stakeholder, audit data, peta masalah." },
        { title: "2. Desain", body: "Workshop solusi, prototyping, biaya & manfaat." },
        { title: "3. Eksekusi", body: "Pendampingan tim internal, milestone mingguan." },
        { title: "4. Handover", body: "SOP, training, knowledge transfer terdokumentasi." },
      ] },
      { kind: "stats", heading: "Track record", items: [
        { value: "60+", label: "engagement selesai" },
        { value: "92%", label: "klien repeat order" },
        { value: "8 thn", label: "pengalaman tim" },
      ] },
      { kind: "cta", headline: "Konsultasi gratis 30 menit", cta: { label: "Jadwalkan", href: `${pubBase}/contact` } },
    ],
    status: "published", createdAt: day(18), updatedAt: day(2), systemPage: false,
  },
];

// All demo content inserts (no wipe). Shared by `run` and `seedSample`.
async function insertAll(ctx: any, opts: { landing?: boolean } = {}) {
  const clientId = new Map<string, string>();
  for (const { seedId, ...d } of CLIENTS) clientId.set(seedId, await ctx.db.insert("konsultanClients", d));

  const proposalId = new Map<string, string>();
  for (const { seedId, clientId: cid, ...d } of PROPOSALS)
    proposalId.set(seedId, await ctx.db.insert("konsultanProposals", { ...d, clientId: clientId.get(cid) ?? cid }));

  const contractId = new Map<string, string>();
  for (const { seedId, proposalId: pid, clientId: cid, ...d } of CONTRACTS)
    contractId.set(seedId, await ctx.db.insert("konsultanContracts", { ...d, proposalId: proposalId.get(pid) ?? pid, clientId: clientId.get(cid) ?? cid }));

  const projectId = new Map<string, string>();
  for (const { seedId, contractId: ctid, clientId: cid, ...d } of PROJECTS)
    projectId.set(seedId, await ctx.db.insert("konsultanProjects", { ...d, contractId: contractId.get(ctid) ?? ctid, clientId: clientId.get(cid) ?? cid }));

  for (const { seedId, projectId: pid, clientId: cid, ...d } of INVOICES) {
    void seedId;
    await ctx.db.insert("konsultanInvoices", { ...d, projectId: projectId.get(pid) ?? pid, clientId: clientId.get(cid) ?? cid });
  }

  for (const { seedId, projectId: pid, ...d } of DOCUMENTS) {
    void seedId;
    await ctx.db.insert("konsultanDocuments", { ...d, projectId: projectId.get(pid) ?? pid });
  }

  for (const e of CALENDAR) {
    const { clientId: cid, projectId: pid, ...d } = e as typeof e & { clientId?: string; projectId?: string };
    await ctx.db.insert("konsultanCalendarEvents", {
      ...d,
      ...(cid ? { clientId: clientId.get(cid) ?? cid } : {}),
      ...(pid ? { projectId: projectId.get(pid) ?? pid } : {}),
    });
  }

  for (const a of KB) await ctx.db.insert("konsultanKbArticles", a);
  for (const s of SERVICES) await ctx.db.insert("konsultanServices", s);
  for (const m of TEAM) await ctx.db.insert("konsultanTeam", m);
  for (const f of FAQS) await ctx.db.insert("konsultanFaqs", f);
  if (opts.landing !== false) for (const s of LANDING) await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
  for (const p of PAGES) await ctx.db.insert("pages", { entryId: p.id, slug: p.slug, data: p });

  return {
    clients: CLIENTS.length,
    proposals: PROPOSALS.length,
    contracts: CONTRACTS.length,
    projects: PROJECTS.length,
    invoices: INVOICES.length,
    documents: DOCUMENTS.length,
    calendarEvents: CALENDAR.length,
    kbArticles: KB.length,
    services: SERVICES.length,
    team: TEAM.length,
    faqs: FAQS.length,
    landing: LANDING.length,
    pages: PAGES.length,
  };
}

const CONTENT_TABLES = [
  "konsultanClients",
  "konsultanProposals",
  "konsultanContracts",
  "konsultanProjects",
  "konsultanInvoices",
  "konsultanDocuments",
  "konsultanCalendarEvents",
  "konsultanKbArticles",
  "konsultanServices",
  "konsultanTeam",
  "konsultanFaqs",
  "landingSections",
  "pages",
] as const;

// Power/CLI seed: wipes content tables first, then inserts. Destructive — only
// for terminal use where you explicitly want a reset.
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    for (const t of CONTENT_TABLES) {
      for (const row of await ctx.db.query(t).take(1000)) await ctx.db.delete(row._id);
    }
    return insertAll(ctx);
  },
});

// Demo/CLI seed (NO auth, internal — run via `npx convex run seed:seedDemo`).
// For SHOWCASE/demo deployments only. Refills the content tables for a full
// demo and seeds landing only when empty, WITHOUT wiping admin-edited landing
// copy. Idempotent.
export const seedDemo = internalMutation({
  args: {},
  handler: async (ctx) => {
    for (const t of CONTENT_TABLES) {
      if (t === "landingSections") continue;
      for (const row of await ctx.db.query(t).take(1000)) await ctx.db.delete(row._id);
    }
    const counts = await insertAll(ctx, { landing: false });
    // Seed landing only if the table is empty (preserve admin-edited copy).
    const hasLanding = await ctx.db.query("landingSections").first();
    if (!hasLanding) {
      for (const s of LANDING) await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
    }
    return counts;
  },
});

// Additive landing sync for already-seeded deployments: inserts LANDING
// entries whose sectionId is missing and aligns `order` to the canonical
// lineup. Never touches admin-edited copy/enabled/config on existing rows.
export const syncLanding = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    let inserted = 0;
    let reordered = 0;
    for (const s of LANDING) {
      const existing = await ctx.db
        .query("landingSections")
        .withIndex("by_sectionId", (q) => q.eq("sectionId", s.id))
        .unique();
      if (!existing) {
        await ctx.db.insert("landingSections", { sectionId: s.id, data: s });
        inserted++;
      } else if ((existing.data as { order?: number }).order !== s.order) {
        await ctx.db.patch(existing._id, {
          data: { ...(existing.data as Record<string, unknown>), order: s.order },
        });
        reordered++;
      }
    }
    return { inserted, reordered };
  },
});

// Additive image backfill for already-seeded deployments: matches each PROJECTS
// seed row (which carries an `image`) to its existing konsultanProjects row by
// the unique `name`, and patches `image` ONLY when the row has none yet. Never
// overwrites an admin-set photo. Returns the count of rows patched.
export const syncProjectImages = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx);
    let patched = 0;
    const rows = await ctx.db.query("konsultanProjects").take(1000);
    for (const seed of PROJECTS) {
      if (!seed.image) continue;
      const row = rows.find((r) => r.name === seed.name);
      if (row && !row.image) {
        await ctx.db.patch(row._id, { image: seed.image });
        patched++;
      }
    }
    return { patched };
  },
});

// In-app one-click seed for non-technical owners. Safe: requires an authenticated
// admin AND only runs on an empty site, so it can never wipe real content.
export const seedSample = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    const hasClients = await ctx.db.query("konsultanClients").first();
    const hasLanding = await ctx.db.query("landingSections").first();
    if (hasClients || hasLanding) {
      return { seeded: false, reason: "already-has-content" as const };
    }
    const counts = await insertAll(ctx);
    return { seeded: true, ...counts };
  },
});
