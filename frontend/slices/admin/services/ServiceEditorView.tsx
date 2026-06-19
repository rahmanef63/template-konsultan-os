"use client";

import * as React from "react";
import { CrudFormView } from "@/features/_shared/crud/CrudFormView";
import type { CrudController, EntityMeta, FieldDef } from "@/features/_shared/crud/types";
import { useStore } from "@/features/_app/store";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import { slugify } from "@/features/_shared/utils";
import type { Service } from "@/features/_app/types";

const META: EntityMeta = { label: "Service", labelPlural: "Services" };

export const FIELDS: FieldDef<Service>[] = [
  { kind: "text", key: "name", label: "Nama" },
  { kind: "text", key: "slug", label: "Slug", mono: true },
  { kind: "text", key: "tagline", label: "Tagline", wide: true },
  { kind: "text", key: "priceLabel", label: "Harga (label)" },
  { kind: "text", key: "durationLabel", label: "Durasi (label)" },
  {
    kind: "select",
    key: "accent",
    label: "Aksen warna",
    options: [
      { value: "violet", label: "Violet" },
      { value: "amber", label: "Amber" },
      { value: "emerald", label: "Emerald" },
      { value: "rose", label: "Rose" },
    ],
  },
  { kind: "switch", key: "featured", label: "Featured (paling diminati)" },
  { kind: "tags", key: "bullets", label: "Bullets (Enter koma-pisah)", hint: "Daftar yang termasuk dalam paket." },
  { kind: "tags", key: "outcomes", label: "Outcomes", hint: "Hasil yang diharapkan klien." },
  { kind: "number", key: "order", label: "Urutan", min: 0, step: 1 },
];

export function useServicesController(): CrudController<Service> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: [...state.services].sort((a, b) => a.order - b.order),
      getId: (s) => s.id,
      blank: () => ({
        id: `svc-${Math.random().toString(36).slice(2, 10)}`,
        slug: `service-${Math.random().toString(36).slice(2, 6)}`,
        name: "Layanan baru",
        tagline: "Deskripsi singkat layanan.",
        priceLabel: "Rp 0",
        durationLabel: "—",
        bullets: [],
        outcomes: [],
        featured: false,
        accent: "violet",
        order: state.services.length + 1,
      }),
      create: (service) =>
        dispatch({ type: "service.upsert", service: { ...service, slug: service.slug || slugify(service.name) } }),
      update: (id, patch) => {
        const cur = state.services.find((s) => s.id === id);
        if (!cur) return;
        dispatch({ type: "service.upsert", service: { ...cur, ...patch, id } });
      },
      remove: (id) => dispatch({ type: "service.delete", id }),
    }),
    [state.services, dispatch],
  );
}

export function ServiceEditorView({ id }: { id: string }) {
  const controller = useServicesController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/services`}
    />
  );
}
