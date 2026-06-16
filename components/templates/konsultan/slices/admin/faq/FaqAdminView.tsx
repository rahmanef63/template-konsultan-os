"use client";

import { CrudListView } from "@/components/templates/_shared/crud/CrudListView";
import { FIELDS, useFaqController } from "./FaqEditorView";
import type { ColumnDef, EntityMeta } from "@/components/templates/_shared/crud/types";
import { ADMIN_BASE, PUBLIC_BASE } from "../../../shared/nav-config";
import type { FaqItem } from "../../../shared/types";

const META: EntityMeta = {
  label: "FAQ",
  labelPlural: "FAQ",
  publicHref: () => `${PUBLIC_BASE}/faq`,
};

const COLUMNS: ColumnDef<FaqItem>[] = [
  { key: "question", header: "Pertanyaan", width: "w-[58%]" },
  { key: "category", header: "Kategori", width: "w-[20%]", badge: "outline" },
  { key: "order", header: "Urutan", width: "w-[12%]", hideOnMobile: true },
];

export function FaqAdminView() {
  const controller = useFaqController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/faq/${id}`}
      description="Pertanyaan publik — tampil di halaman /faq"
    />
  );
}
