"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Calendar, Clock, FileSignature, FileText, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHead } from "@/features/_shared/ui/section-head";
import { Stagger } from "@/features/_shared/motion";
import type { FeatureItem } from "@/features/_shared";
import {
  cfgNumber,
  parseConfigObject,
  type FaqItem,
  type PricingTier,
  type StatItem,
  type TestimonialItem,
} from "@/features/_shared/landing/sections";
import type { LandingSection } from "@/features/_shared/landing/types";
import { fmtDate } from "@/features/_shared/utils";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import { useKbArticles } from "@/features/_app/store";
import { kbToArticle } from "@/features/_app/insights-seed";
import type { Article } from "@/features/_app/types";
import {
  SERVICES,
  FEATURES,
  STATS,
  CLIENTS,
  FAQS,
  PRICING,
  TESTIMONIALS,
} from "@/convex/landingContent";

/** Konsultan default landing content lives in convex/landingContent.ts — the
 *  SINGLE source the seed also reads (it writes the same content into Convex
 *  config). These re-exports are the render fallback before the seed runs;
 *  edit the content in that module, not here. Every value is overridable
 *  per-section via the admin landing editor's config JSON (see
 *  _shared/landing/sections/config.ts for keys). */

/** Feature icons live as lucide NAMES in the framework-pure module; map them
 *  back to components here so the local fallback renders real glyphs. */
const FEATURE_ICONS: Record<string, FeatureItem["icon"]> = {
  FileText,
  FileSignature,
  Receipt,
  Briefcase,
};

export const SERVICE_ITEMS: FeatureItem[] = SERVICES.map((s) => ({
  title: s.title,
  blurb: s.blurb,
}));

export const FEATURE_ITEMS: FeatureItem[] = FEATURES.map((f) => ({
  icon: FEATURE_ICONS[f.icon],
  title: f.title,
  blurb: f.blurb,
}));

export const KONSULTAN_STATS: StatItem[] = STATS;
export const KONSULTAN_CLIENTS = CLIENTS;
export const KONSULTAN_FAQS: FaqItem[] = FAQS;
export const KONSULTAN_TIERS: PricingTier[] = PRICING;
export const KONSULTAN_TESTIMONIALS: TestimonialItem[] = TESTIMONIALS;

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
  const articles = useKbArticles();
  const latest = articles
    .filter((a) => a.status === "published")
    .map(kbToArticle)
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
