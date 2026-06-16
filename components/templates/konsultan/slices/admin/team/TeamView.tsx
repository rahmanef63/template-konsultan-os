"use client";

import { CrudListView } from "@/components/templates/_shared/crud/CrudListView";
import { FIELDS, useTeamController } from "./TeamEditorView";
import type { ColumnDef, EntityMeta } from "@/components/templates/_shared/crud/types";
import { ADMIN_BASE, PUBLIC_BASE } from "../../../shared/nav-config";
import type { TeamMember } from "../../../shared/types";

const META: EntityMeta = {
  label: "Member",
  labelPlural: "Team",
  publicHref: () => `${PUBLIC_BASE}/team`,
};

const COLUMNS: ColumnDef<TeamMember>[] = [
  { key: "name", header: "Nama", width: "w-[26%]" },
  { key: "role", header: "Jabatan", width: "w-[26%]" },
  { key: "city", header: "Kota", width: "w-[16%]", hideOnMobile: true },
  { key: "yearsExp", header: "Tahun", width: "w-[12%]", hideOnMobile: true },
];

export function TeamView() {
  const controller = useTeamController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/team/${id}`}
      description="Tim konsultan publik — tampil di halaman /team"
    />
  );
}
