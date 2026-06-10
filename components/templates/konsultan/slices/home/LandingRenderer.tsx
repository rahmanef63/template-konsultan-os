"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  HeroBlock,
  SectionHead,
  FeatureGrid,
  CtaBand,
} from "@/components/templates/_shared";
import { LandingSectionShell } from "@/components/templates/_shared/landing/LandingSectionShell";
import { CountUp, Stagger } from "@/components/templates/_shared/motion";
import { parseConfigBadge } from "@/components/templates/_shared/landing/parse-config";
import {
  CustomSection,
  FaqSection,
  NewsletterSection,
  PricingSection,
  StatsSection,
  TestimonialsSection,
} from "@/components/templates/_shared/landing/sections";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import { ADMIN_BASE, PUBLIC_BASE } from "../../shared/nav-config";
import type { Project } from "../../shared/types";
import {
  FEATURE_ITEMS,
  InsightsTeaser,
  KONSULTAN_CLIENTS,
  KONSULTAN_FAQS,
  KONSULTAN_STATS,
  KONSULTAN_TESTIMONIALS,
  KONSULTAN_TIERS,
  SERVICE_ITEMS,
} from "./LandingExtras";

interface Deps {
  projects: Project[];
  onSubscribe?: (email: string) => Promise<{ ok: boolean; notice?: string }>;
}

/**
 * Maps each enabled landingSection.kind to its konsultan renderer.
 * Admin-editable title/subtitle thread through; section.config JSON
 * overrides the template defaults (see _shared/landing/sections).
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

    case "stats":
      return (
        <LandingSectionShell section={section} defaultClassName="border-y border-border/50 bg-muted/10">
          <StatsSection section={section} stats={KONSULTAN_STATS} clients={KONSULTAN_CLIENTS} />
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
          <TestimonialsSection section={section} items={KONSULTAN_TESTIMONIALS} />
        </LandingSectionShell>
      );

    case "pricing":
      return (
        <LandingSectionShell section={section}>
          <PricingSection section={section} tiers={KONSULTAN_TIERS} />
        </LandingSectionShell>
      );

    case "faq":
      return (
        <LandingSectionShell section={section}>
          <FaqSection
            section={section}
            items={KONSULTAN_FAQS}
            ctaLabel="Hubungi kami"
            ctaHref={`${PUBLIC_BASE}/contact`}
          />
        </LandingSectionShell>
      );

    case "blog":
    case "changelog":
      return (
        <LandingSectionShell section={section} defaultClassName="border-t border-border/50">
          <InsightsTeaser section={section} />
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

    case "newsletter":
      return (
        <LandingSectionShell section={section}>
          <NewsletterSection section={section} placeholder="Email kerja Anda" buttonLabel="Berlangganan insight" onSubscribe={deps.onSubscribe} />
        </LandingSectionShell>
      );

    case "custom":
      return (
        <LandingSectionShell section={section}>
          <CustomSection section={section} />
        </LandingSectionShell>
      );

    default:
      return null;
  }
}
