"use client";

import * as React from "react";
import { useKbArticles, useProjects, useClients, slugify } from "@/features/_app/store";
import { kbToArticle } from "@/features/_app/insights-seed";
import { PUBLIC_BASE } from "@/features/_app/nav-config";
import type {
  ConceptCard,
  ConceptListAdapter,
} from "@/features/_shared/concepts/ConceptListPage";

/**
 * Per-template CONCEPT REGISTRY — maps a canonical concept to {data selector +
 * field map + link}, consumed by the shared ConceptListPage (default grid via
 * ConceptCardView). Adapter-only: wraps existing selectors, no schema/table/
 * state rename → zero data migration. Konsultan ports its two public content
 * lists (Insights, Case Studies); commerce/forms/static pages stay bespoke.
 */

export const insightsAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Insights",
    title: "Pemikiran tim kami",
    subtitle:
      "Hasil refleksi dari engagement nyata. Sebagian besar artikel berasal dari pola yang berulang di klien kami.",
  },
  columns: 2,
  emptyText: "Belum ada artikel yang dipublikasikan.",
  hrefFor: (c) => `${PUBLIC_BASE}/insights/${c.slug}`,
  useCards: () => {
    const articles = useKbArticles();
    return React.useMemo<ConceptCard[]>(
      () =>
        articles
          .filter((a) => a.status === "published")
          .map(kbToArticle)
          .sort((a, b) => b.publishedAt - a.publishedAt)
          .map((a) => ({
            id: a.id,
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            date: a.publishedAt,
            tags: [a.tag],
          })),
      [articles],
    );
  },
};

export const caseStudiesAdapter: ConceptListAdapter = {
  header: {
    eyebrow: "Pengalaman",
    title: "Case Studies",
    subtitle: "Engagement yang telah dikerjakan untuk klien kami.",
  },
  columns: 2,
  emptyText: "Belum ada case study yang dipublikasikan.",
  hrefFor: (c) => `${PUBLIC_BASE}/case-studies/${c.slug}`,
  useCards: () => {
    const projects = useProjects();
    const clients = useClients();
    return React.useMemo<ConceptCard[]>(() => {
      const clientMap = new Map(clients.map((c) => [c.id, c]));
      return projects.map((p) => {
        const client = clientMap.get(p.clientId);
        return {
          id: p.id,
          slug: slugify(p.name),
          title: p.name,
          excerpt: p.description,
          cover: p.image ?? "",
          date: p.startedAt,
          tags: client?.industry ? [client.industry] : [],
        };
      });
    }, [projects, clients]);
  },
};
