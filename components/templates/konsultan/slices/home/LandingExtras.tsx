"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Calendar, Clock, FileSignature, FileText, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHead } from "@/components/templates/_shared/ui/section-head";
import { Stagger } from "@/components/templates/_shared/motion";
import type { FeatureItem } from "@/components/templates/_shared";
import {
  cfgNumber,
  parseConfigObject,
  type FaqItem,
  type PricingTier,
  type StatItem,
  type TestimonialItem,
} from "@/components/templates/_shared/landing/sections";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import { fmtDate } from "@/components/templates/_shared/utils";
import { PUBLIC_BASE } from "../../shared/nav-config";
import { SEED_ARTICLES } from "../../shared/insights-seed";
import type { Article } from "../../shared/types";

/** Konsultan default content for the shared landing sections — every
 *  value overridable per-section via the admin landing editor's config
 *  JSON (see _shared/landing/sections/config.ts for keys). */

export const SERVICE_ITEMS: FeatureItem[] = [
  { title: "Strategi & GTM", blurb: "Roadmap go-to-market, ICP definition, pricing strategy untuk launch baru." },
  { title: "Operations Audit", blurb: "Lean operations audit + quick-wins implementable dalam 8 minggu." },
  { title: "Org Design & Hiring", blurb: "Career ladder, interview rubric, onboarding system untuk scaling tim." },
  { title: "Workshop & Mentoring", blurb: "Intensive workshop fasilitasi + mentoring untuk leadership team." },
];

export const FEATURE_ITEMS: FeatureItem[] = [
  { icon: FileText, title: "Proposal AI", blurb: "Generate proposal dari brief 1 paragraf — siap dipresentasikan." },
  { icon: FileSignature, title: "Kontrak ID-aware", blurb: "Template kontrak sesuai hukum Indonesia — bilingual." },
  { icon: Receipt, title: "PajakAware Invoice", blurb: "Auto PPN 11%, e-Faktur compatible, reminder otomatis." },
  { icon: Briefcase, title: "Project Tracking", blurb: "Status proyek live + progress milestone untuk klien." },
];

export const KONSULTAN_STATS: StatItem[] = [
  { value: 60, suffix: "+", label: "Klien ditangani" },
  { value: 12, suffix: " tahun", label: "Pengalaman praktik" },
  { value: 140, suffix: "+", label: "Proyek selesai" },
  { value: 92, suffix: "%", label: "Retensi klien" },
];

export const KONSULTAN_CLIENTS = [
  "PT Acme Indonesia",
  "Foobar Group",
  "Beta Labs",
  "Lorem Manufaktur",
  "Ipsum Retail",
  "Dolor Logistik",
];

export const KONSULTAN_FAQS: FaqItem[] = [
  { q: "Bagaimana proses engagement berjalan?", a: "Mulai dari discovery call gratis 45 menit. Dari situ kami susun proposal berisi scope, deliverable, dan timeline. Setelah disepakati, engagement berjalan dengan milestone jelas dan check-in mingguan bersama tim Anda." },
  { q: "Berapa lama satu engagement biasanya?", a: "Diagnostik 2–4 minggu, pendampingan implementasi 8–12 minggu. Untuk kebutuhan advisory berkelanjutan tersedia retainer bulanan yang bisa dihentikan kapan saja." },
  { q: "Bagaimana struktur biayanya?", a: "Fixed fee per scope — bukan per jam — supaya anggaran bisa dikunci sejak awal. Pembayaran mengikuti milestone (umumnya 40/30/30), sudah memperhitungkan PPN 11%, tanpa biaya tersembunyi." },
  { q: "Apakah kerahasiaan data kami terjamin (NDA)?", a: "Ya. NDA ditandatangani sebelum discovery dimulai. Seluruh deliverable menjadi milik klien, dan data internal Anda kami hapus setelah engagement selesai bila diminta." },
  { q: "Dari mana sebaiknya kami mulai?", a: "Paket Diagnostik adalah titik masuk paling aman: dalam 2–4 minggu Anda mendapat peta masalah + rekomendasi prioritas. Hasilnya jadi dasar memutuskan lanjut pendampingan atau eksekusi mandiri." },
];

export const KONSULTAN_TIERS: PricingTier[] = [
  {
    name: "Diagnostik",
    price: "Mulai Rp 45jt",
    blurb: "Audit cepat untuk memetakan masalah dan prioritas.",
    features: ["Assessment 2–4 minggu", "Wawancara stakeholder + review data", "Laporan temuan + rekomendasi prioritas", "Presentasi ke leadership"],
    ctaLabel: "Mulai diagnostik",
    ctaHref: `${PUBLIC_BASE}/contact`,
  },
  {
    name: "Pendampingan",
    price: "Mulai Rp 120jt",
    blurb: "Implementasi end-to-end bersama tim Anda.",
    features: ["Engagement 8–12 minggu", "Konsultan dedicated on-site/remote", "Milestone + check-in mingguan", "Transfer knowledge ke tim internal"],
    featured: true,
    ctaLabel: "Diskusikan scope",
    ctaHref: `${PUBLIC_BASE}/contact`,
  },
  {
    name: "Retainer Bulanan",
    price: "Rp 25jt",
    period: "/bulan",
    blurb: "Akses advisory berkelanjutan untuk leadership.",
    features: ["Sesi advisory 2x per bulan", "Review dokumen & keputusan strategis", "Akses prioritas via email", "Berhenti kapan saja"],
    ctaLabel: "Hubungi kami",
    ctaHref: `${PUBLIC_BASE}/contact`,
  },
];

/** Wave-1 inline carousel items, migrated as defaults for the shared
 *  TestimonialsSection (admin overrides via config.items). */
export const KONSULTAN_TESTIMONIALS: TestimonialItem[] = [
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

const TAG_TONE: Record<Article["tag"], string> = {
  Strategi: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  Operasi: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  Organisasi: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  Industri: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
};

/** Latest insights teaser — backs the "blog"/"changelog" landing kinds
 *  with the same articles the /insights routes render (insights-seed). */
export function InsightsTeaser({ section }: { section: LandingSection }) {
  const limit = cfgNumber(parseConfigObject(section.config), "limit") ?? 3;
  const latest = [...SEED_ARTICLES]
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, limit);
  if (latest.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHead
        eyebrow="Insights"
        title={section.title}
        subtitle={section.subtitle}
        cta={{ label: "Semua insights", href: `${PUBLIC_BASE}/insights` }}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stagger itemClassName="h-full">
          {latest.map((a) => (
            <Link key={a.id} href={`${PUBLIC_BASE}/insights/${a.slug}`} className="group block h-full">
              <Card className="h-full border-border/60 bg-card/50 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center gap-2">
                    <Badge className={`rounded-full text-[10px] ${TAG_TONE[a.tag]}`}>{a.tag}</Badge>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="size-3" /> {fmtDate(a.publishedAt)}
                    </span>
                  </div>
                  <h3 className="font-medium leading-snug group-hover:underline">{a.title}</h3>
                  <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{a.excerpt}</p>
                  <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3" /> {a.readMinutes} menit baca · {a.author}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Stagger>
      </div>
      <div className="mt-8 text-center sm:hidden">
        <Button asChild variant="outline" size="sm">
          <Link href={`${PUBLIC_BASE}/insights`}>
            Semua insights <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
