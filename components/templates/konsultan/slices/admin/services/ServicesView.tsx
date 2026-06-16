"use client";

import { CrudListView } from "@/components/templates/_shared/crud/CrudListView";
import { FIELDS, useServicesController } from "./ServiceEditorView";
import type { ColumnDef, EntityMeta } from "@/components/templates/_shared/crud/types";
import { ADMIN_BASE, PUBLIC_BASE } from "../../../shared/nav-config";
import type { Service } from "../../../shared/types";

const META: EntityMeta = {
  label: "Service",
  labelPlural: "Services",
  publicHref: (item) => `${PUBLIC_BASE}/services#${(item as Service).slug}`,
};

const COLUMNS: ColumnDef<Service>[] = [
  { key: "name", header: "Nama", width: "w-[26%]" },
  { key: "priceLabel", header: "Harga", width: "w-[18%]" },
  { key: "durationLabel", header: "Durasi", width: "w-[24%]", hideOnMobile: true },
  { key: "accent", header: "Aksen", width: "w-[14%]", badge: "outline", hideOnMobile: true },
  { key: "featured", header: "Featured", width: "w-[12%]", badge: "outline" },
];

export function ServicesView() {
  const controller = useServicesController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/services/${id}`}
      description="Paket layanan publik — tampil di halaman /services"
    />
  );
}
