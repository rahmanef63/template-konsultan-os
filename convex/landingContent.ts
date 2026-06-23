// SINGLE SOURCE of konsultan's landing example content.
//
// Imported by BOTH:
//  - convex/seed.ts → seeds each item section's `config` into landingSections,
//    so a fresh clone gets EDITABLE example data in the admin landing editor
//    (not just code-only defaults).
//  - frontend/slices/home/* → the render fallback (used before the seed runs).
//
// MUST stay framework-pure: no convex/server, no convex/values, no React/lucide
// imports — only literals + plain types — so the Convex bundler AND the Next
// client can both import it. Feature icons are lucide NAMES (string), resolved
// to components in LandingExtras.tsx. Hrefs are root-relative (publicBase = "").
//
// Edit content HERE once; the seed and the render both follow. No drift.

export type LcStat = { value: number; prefix?: string; suffix?: string; label: string };
export type LcService = { title: string; blurb: string };
export type LcFeature = { icon: string; title: string; blurb: string };
export type LcTestimonial = { quote: string; author: string; role?: string; rating?: number };
export type LcTier = {
  name: string;
  price: string;
  period?: string;
  blurb?: string;
  features: string[];
  ctaLabel?: string;
  ctaHref?: string;
  featured?: boolean;
};
export type LcFaq = { q: string; a: string };

export const HERO = {
  title: "Konsultan independen, tools setara firma global.",
  subtitle:
    "Proposal AI, kontrak ID-aware, PajakAware invoicing — workspace lengkap untuk konsultan Indonesia yang serius.",
  badge: "Boutique consulting · Indonesia",
};

export const STATS: LcStat[] = [
  { value: 60, suffix: "+", label: "Klien ditangani" },
  { value: 12, suffix: " tahun", label: "Pengalaman praktik" },
  { value: 140, suffix: "+", label: "Proyek selesai" },
  { value: 92, suffix: "%", label: "Retensi klien" },
];

export const CLIENTS: string[] = [
  "PT Sinar Mandiri",
  "Nusantara Group",
  "Bahtera Logistik",
  "Sentosa Manufaktur",
  "Andalan Retail",
  "Mitra Sehat Group",
];

// "services" landing section — area-of-practice cards (no icon; rendered via
// FeatureGrid as title + blurb).
export const SERVICES: LcService[] = [
  { title: "Strategi & GTM", blurb: "Roadmap go-to-market, ICP definition, pricing strategy untuk launch baru." },
  { title: "Operations Audit", blurb: "Lean operations audit + quick-wins implementable dalam 8 minggu." },
  { title: "Org Design & Hiring", blurb: "Career ladder, interview rubric, onboarding system untuk scaling tim." },
  { title: "Workshop & Mentoring", blurb: "Intensive workshop fasilitasi + mentoring untuk leadership team." },
];

// "features" landing section — product tooling cards (icon = lucide NAME).
export const FEATURES: LcFeature[] = [
  { icon: "FileText", title: "Proposal AI", blurb: "Generate proposal dari brief 1 paragraf — siap dipresentasikan." },
  { icon: "FileSignature", title: "Kontrak ID-aware", blurb: "Template kontrak sesuai hukum Indonesia — bilingual." },
  { icon: "Receipt", title: "PajakAware Invoice", blurb: "Auto PPN 11%, e-Faktur compatible, reminder otomatis." },
  { icon: "Briefcase", title: "Project Tracking", blurb: "Status proyek live + progress milestone untuk klien." },
];

export const TESTIMONIALS: LcTestimonial[] = [
  {
    quote:
      "Roadmap GTM dari tim ini langsung kami eksekusi minggu berikutnya. Tidak ada slide pemanis — semua actionable.",
    author: "Dewi Lestari",
    role: "CEO, retail F&B — Jakarta",
  },
  {
    quote:
      "Operations audit 8 minggu memangkas lead time produksi 30%. Quick-wins-nya benar-benar quick.",
    author: "Bayu Pratama",
    role: "COO, manufaktur — Bekasi",
  },
  {
    quote:
      "Career ladder + interview rubric mereka jadi standar hiring kami sampai sekarang.",
    author: "Sari Wulandari",
    role: "HR Director, SaaS — Bandung",
  },
  {
    quote:
      "Workshop leadership-nya membumi. Tim kami keluar ruangan dengan rencana 90 hari, bukan teori.",
    author: "Andi Kurniawan",
    role: "Founder, logistik — Surabaya",
  },
  {
    quote:
      "Proposal dan kontraknya rapi, bilingual, sadar regulasi lokal. Engagement paling mulus yang pernah kami jalani.",
    author: "Rina Mahendra",
    role: "GM, properti — Tangerang",
  },
];

export const PRICING: LcTier[] = [
  {
    name: "Diagnostik",
    price: "Mulai Rp 45jt",
    blurb: "Audit cepat untuk memetakan masalah dan prioritas.",
    features: ["Assessment 2–4 minggu", "Wawancara stakeholder + review data", "Laporan temuan + rekomendasi prioritas", "Presentasi ke leadership"],
    ctaLabel: "Mulai diagnostik",
    ctaHref: "/contact",
  },
  {
    name: "Pendampingan",
    price: "Mulai Rp 120jt",
    blurb: "Implementasi end-to-end bersama tim Anda.",
    features: ["Engagement 8–12 minggu", "Konsultan dedicated on-site/remote", "Milestone + check-in mingguan", "Transfer knowledge ke tim internal"],
    featured: true,
    ctaLabel: "Diskusikan scope",
    ctaHref: "/contact",
  },
  {
    name: "Retainer Bulanan",
    price: "Rp 25jt",
    period: "/bulan",
    blurb: "Akses advisory berkelanjutan untuk leadership.",
    features: ["Sesi advisory 2x per bulan", "Review dokumen & keputusan strategis", "Akses prioritas via email", "Berhenti kapan saja"],
    ctaLabel: "Hubungi kami",
    ctaHref: "/contact",
  },
];

export const FAQS: LcFaq[] = [
  { q: "Bagaimana proses engagement berjalan?", a: "Mulai dari discovery call gratis 45 menit. Dari situ kami susun proposal berisi scope, deliverable, dan timeline. Setelah disepakati, engagement berjalan dengan milestone jelas dan check-in mingguan bersama tim Anda." },
  { q: "Berapa lama satu engagement biasanya?", a: "Diagnostik 2–4 minggu, pendampingan implementasi 8–12 minggu. Untuk kebutuhan advisory berkelanjutan tersedia retainer bulanan yang bisa dihentikan kapan saja." },
  { q: "Bagaimana struktur biayanya?", a: "Fixed fee per scope — bukan per jam — supaya anggaran bisa dikunci sejak awal. Pembayaran mengikuti milestone (umumnya 40/30/30), sudah memperhitungkan PPN 11%, tanpa biaya tersembunyi." },
  { q: "Apakah kerahasiaan data kami terjamin (NDA)?", a: "Ya. NDA ditandatangani sebelum discovery dimulai. Seluruh deliverable menjadi milik klien, dan data internal Anda kami hapus setelah engagement selesai bila diminta." },
  { q: "Dari mana sebaiknya kami mulai?", a: "Paket Diagnostik adalah titik masuk paling aman: dalam 2–4 minggu Anda mendapat peta masalah + rekomendasi prioritas. Hasilnya jadi dasar memutuskan lanjut pendampingan atau eksekusi mandiri." },
];
