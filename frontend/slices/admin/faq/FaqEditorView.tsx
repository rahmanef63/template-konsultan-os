"use client";

import * as React from "react";
import { CrudFormView } from "@/features/_shared/crud/CrudFormView";
import type { CrudController, EntityMeta, FieldDef } from "@/features/_shared/crud/types";
import { useStore } from "@/features/_app/store";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import type { FaqItem } from "@/features/_app/types";

const META: EntityMeta = { label: "FAQ", labelPlural: "FAQ" };

export const FIELDS: FieldDef<FaqItem>[] = [
  {
    kind: "select",
    key: "category",
    label: "Kategori",
    options: [
      { value: "Umum", label: "Umum" },
      { value: "Pricing", label: "Pricing" },
      { value: "Proses", label: "Proses" },
      { value: "Engagement", label: "Engagement" },
    ],
  },
  { kind: "text", key: "question", label: "Pertanyaan", wide: true },
  { kind: "textarea", key: "answer", label: "Jawaban", rows: 6 },
  { kind: "number", key: "order", label: "Urutan", min: 0, step: 1 },
];

export function useFaqController(): CrudController<FaqItem> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: [...state.faqs].sort((a, b) => a.order - b.order),
      getId: (f) => f.id,
      blank: () => ({
        id: `faq-${Math.random().toString(36).slice(2, 10)}`,
        category: "Umum",
        question: "Pertanyaan baru?",
        answer: "Jawaban.",
        order: state.faqs.length + 1,
      }),
      create: (faq) => dispatch({ type: "faq.upsert", faq }),
      update: (id, patch) => {
        const cur = state.faqs.find((f) => f.id === id);
        if (!cur) return;
        dispatch({ type: "faq.upsert", faq: { ...cur, ...patch, id } });
      },
      remove: (id) => dispatch({ type: "faq.delete", id }),
    }),
    [state.faqs, dispatch],
  );
}

export function FaqEditorView({ id }: { id: string }) {
  const controller = useFaqController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/faq`}
    />
  );
}
