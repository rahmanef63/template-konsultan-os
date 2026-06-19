"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fmtDate } from "@/features/_shared/utils";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import { useKbArticles } from "@/features/_app/store";
import { kbToArticle } from "@/features/_app/insights-seed";
import { CommentsSection } from "@/features/_app/comments-section";

const TAG_TONE = {
  Strategi: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  Operasi: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  Organisasi: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  Industri: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
} as const;

export function InsightsDetailPage({ slug }: { slug: string }) {
  const kb = useKbArticles();
  const published = kb.filter((a) => a.status === "published").map(kbToArticle);
  const article = published.find((a) => a.slug === slug);
  if (!article) {
    return (
      <article className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm text-muted-foreground">Artikel tidak ditemukan.</p>
        <Button asChild variant="ghost" size="sm" className="mt-4 gap-1.5">
          <Link href={`${PUBLIC_BASE}/insights`}>
            <ArrowLeft className="size-3.5" /> Semua insights
          </Link>
        </Button>
      </article>
    );
  }

  const related = published
    .filter((a) => a.slug !== article.slug && a.tag === article.tag)
    .slice(0, 2);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Button asChild variant="ghost" size="sm" className="mb-8 gap-1.5 -ml-2">
        <Link href={`${PUBLIC_BASE}/insights`}>
          <ArrowLeft className="size-3.5" /> Semua insights
        </Link>
      </Button>

      <header className="space-y-5">
        <Badge className={`rounded-full text-[10px] ${TAG_TONE[article.tag]}`}>
          {article.tag}
        </Badge>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {article.title}
        </h1>
        <p className="text-lg text-muted-foreground">{article.excerpt}</p>
        <div className="flex flex-wrap items-center gap-4 border-y border-border/40 py-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted/50 text-[10px] font-semibold text-foreground">
              {article.author
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{article.author}</p>
              <p>{article.authorRole}</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {fmtDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {article.readMinutes} menit baca
          </span>
        </div>
      </header>

      <div className="prose prose-neutral mt-10 max-w-none space-y-5 dark:prose-invert">
        {article.body.map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground/90">
            {p}
          </p>
        ))}
      </div>

      <Card className="mt-12 border-border/60 bg-gradient-to-br from-foreground/[0.04] to-transparent">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Diskusi topik ini lebih dalam?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              30 menit konsultasi gratis dengan {article.author}.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href={`${PUBLIC_BASE}/contact`}>
              Hubungi kami <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {related.length > 0 && (
        <section className="mt-16">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Artikel terkait
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {related.map((r) => (
              <Link key={r.id} href={`${PUBLIC_BASE}/insights/${r.slug}`}>
                <Card className="h-full border-border/60 bg-card/60 transition-colors hover:border-foreground/30">
                  <CardContent className="space-y-2 p-5">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {r.tag}
                    </p>
                    <h4 className="text-base font-medium leading-snug">{r.title}</h4>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CommentsSection kind="insights" slug={article.slug} title="Diskusi" />
    </article>
  );
}
