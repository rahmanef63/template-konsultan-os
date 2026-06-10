"use client";

import Autoplay from "embla-carousel-autoplay";
import { Briefcase, FileSignature, FileText, Quote, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  HeroBlock,
  SectionHead,
  FeatureGrid,
  CtaBand,
  type FeatureItem,
} from "@/components/templates/_shared";
import { LandingSectionShell } from "@/components/templates/_shared/landing/LandingSectionShell";
import { CountUp, Stagger } from "@/components/templates/_shared/motion";
import { parseConfigBadge } from "@/components/templates/_shared/landing/parse-config";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import { ADMIN_BASE, PUBLIC_BASE } from "../../shared/nav-config";
import type { Project } from "../../shared/types";

interface Deps {
  projects: Project[];
}

const SERVICE_ITEMS: FeatureItem[] = [
  { title: "Strategi & GTM", blurb: "Roadmap go-to-market, ICP definition, pricing strategy untuk launch baru." },
  { title: "Operations Audit", blurb: "Lean operations audit + quick-wins implementable dalam 8 minggu." },
  { title: "Org Design & Hiring", blurb: "Career ladder, interview rubric, onboarding system untuk scaling tim." },
  { title: "Workshop & Mentoring", blurb: "Intensive workshop fasilitasi + mentoring untuk leadership team." },
];

const FEATURE_ITEMS: FeatureItem[] = [
  { icon: FileText, title: "Proposal AI", blurb: "Generate proposal dari brief 1 paragraf — siap dipresentasikan." },
  { icon: FileSignature, title: "Kontrak ID-aware", blurb: "Template kontrak sesuai hukum Indonesia — bilingual." },
  { icon: Receipt, title: "PajakAware Invoice", blurb: "Auto PPN 11%, e-Faktur compatible, reminder otomatis." },
  { icon: Briefcase, title: "Project Tracking", blurb: "Status proyek live + progress milestone untuk klien." },
];

const TESTIMONIAL_ITEMS = [
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

/**
 * Maps each enabled landingSection.kind to its konsultan renderer.
 * Admin-editable title/subtitle thread through; unknown kinds render a
 * minimal stub so admin still sees them without crashing the page.
 */
export function renderLanding(section: LandingSection, deps: Deps) {
  switch (section.kind) {
    case "hero":
      return (
        <LandingSectionShell section={section}>
          <HeroBlock
            glow
            badge={parseConfigBadge(section.config) ?? "Boutique consulting · Indonesia"}
            title={section.title}
            subtitle={section.subtitle}
            primaryCta={{ label: "Konsultasi gratis", href: `${PUBLIC_BASE}/contact` }}
            secondaryCta={{ label: "Lihat case studies", href: `${PUBLIC_BASE}/case-studies` }}
            image={section.imageUrl ? { url: section.imageUrl, ratio: section.imageRatio } : undefined}
          />
        </LandingSectionShell>
      );

    case "services":
      return (
        <LandingSectionShell section={section} defaultClassName="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            eyebrow="Layanan"
            title={section.title}
            subtitle={section.subtitle}
          />
          <FeatureGrid items={SERVICE_ITEMS} columns={4} className="mt-10" />
        </LandingSectionShell>
      );

    case "features":
      return (
        <LandingSectionShell section={section} defaultClassName="border-y border-border/50 bg-muted/10">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <SectionHead
              eyebrow="Workspace"
              title={section.title}
              subtitle={section.subtitle}
              cta={{ label: "Buka demo", href: ADMIN_BASE }}
            />
            <FeatureGrid items={FEATURE_ITEMS} columns={4} className="mt-10" />
          </div>
        </LandingSectionShell>
      );

    case "portfolio":
      return (
        <LandingSectionShell section={section} defaultClassName="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHead
            eyebrow="Pengalaman"
            title={section.title}
            subtitle={section.subtitle}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Stagger itemClassName="h-full">
              {deps.projects.map((p) => (
                <Card key={p.id} className="h-full border-border/60 bg-card/60 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="space-y-2 p-5">
                    <Badge variant="outline" className="rounded-full text-[10px] capitalize">
                      {p.status}
                    </Badge>
                    <h3 className="text-base font-medium">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                      <div className="h-full bg-foreground/70" style={{ width: `${p.progress}%` }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      <CountUp value={p.progress} />% complete
                    </p>
                  </CardContent>
                </Card>
              ))}
            </Stagger>
          </div>
        </LandingSectionShell>
      );

    case "testimonials":
      return (
        <LandingSectionShell section={section} defaultClassName="border-y border-border/50 bg-muted/10">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <SectionHead
              eyebrow="Testimoni"
              title={section.title}
              subtitle={section.subtitle}
            />
            <Carousel
              className="mt-10"
              opts={{ align: "start", loop: TESTIMONIAL_ITEMS.length > 3 }}
              plugins={[Autoplay({ delay: 4500, stopOnInteraction: true })]}
            >
              <div className="mb-4 flex items-center justify-end gap-2">
                <CarouselPrevious />
                <CarouselNext />
              </div>
              <CarouselContent>
                {TESTIMONIAL_ITEMS.map((t) => (
                  <CarouselItem key={t.author} className="basis-full sm:basis-1/2 lg:basis-1/3">
                    <Card className="h-full border-border/60 bg-card/60">
                      <CardContent className="flex h-full flex-col gap-3 p-5">
                        <Quote className="size-4 text-muted-foreground/50" aria-hidden />
                        <p className="flex-1 text-sm leading-relaxed text-foreground/85">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                        <div>
                          <p className="text-sm font-medium leading-tight">{t.author}</p>
                          <p className="text-xs text-muted-foreground">{t.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </LandingSectionShell>
      );

    case "cta":
      return (
        <LandingSectionShell section={section}>
          <CtaBand
            title={section.title}
            subtitle={section.subtitle ?? "Respons dalam 24 jam."}
            cta={{ label: "Mulai konsultasi", href: `${PUBLIC_BASE}/contact` }}
          />
        </LandingSectionShell>
      );

    case "stats":
    case "pricing":
    case "blog":
    case "changelog":
    case "faq":
    case "newsletter":
    case "custom":
      return (
        <LandingSectionShell
          section={section}
          defaultClassName="border-b border-border/40 bg-muted/10 py-12"
        >
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {section.kind}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{section.title}</h2>
            {section.subtitle ? (
              <p className="mt-3 text-sm text-muted-foreground">{section.subtitle}</p>
            ) : null}
          </div>
        </LandingSectionShell>
      );

    default:
      return null;
  }
}

