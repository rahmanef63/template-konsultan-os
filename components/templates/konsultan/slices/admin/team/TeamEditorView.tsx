"use client";

import * as React from "react";
import { CrudFormView } from "@/components/templates/_shared/crud/CrudFormView";
import type { CrudController, EntityMeta, FieldDef } from "@/components/templates/_shared/crud/types";
import { useStore } from "../../../shared/store";
import { ADMIN_BASE } from "../../../shared/nav-config";
import { slugify } from "@/components/templates/_shared/utils";
import type { TeamMember } from "../../../shared/types";

const META: EntityMeta = { label: "Member", labelPlural: "Team" };

export const FIELDS: FieldDef<TeamMember>[] = [
  { kind: "text", key: "name", label: "Nama" },
  { kind: "text", key: "slug", label: "Slug", mono: true },
  { kind: "text", key: "role", label: "Jabatan" },
  { kind: "text", key: "city", label: "Kota" },
  { kind: "text", key: "initials", label: "Inisial", hint: "2 huruf untuk avatar." },
  { kind: "number", key: "yearsExp", label: "Tahun pengalaman", min: 0, step: 1 },
  { kind: "text", key: "linkedinUrl", label: "LinkedIn URL", wide: true },
  { kind: "textarea", key: "bio", label: "Bio", rows: 5 },
  { kind: "tags", key: "expertise", label: "Keahlian (koma-pisah)" },
  { kind: "number", key: "order", label: "Urutan", min: 0, step: 1 },
];

export function useTeamController(): CrudController<TeamMember> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: [...state.team].sort((a, b) => a.order - b.order),
      getId: (m) => m.id,
      blank: () => ({
        id: `tm-${Math.random().toString(36).slice(2, 10)}`,
        slug: `member-${Math.random().toString(36).slice(2, 6)}`,
        name: "Konsultan baru",
        role: "Consultant",
        city: "Jakarta",
        initials: "KB",
        bio: "Bio singkat konsultan.",
        expertise: [],
        yearsExp: 5,
        order: state.team.length + 1,
      }),
      create: (member) =>
        dispatch({ type: "team.upsert", member: { ...member, slug: member.slug || slugify(member.name) } }),
      update: (id, patch) => {
        const cur = state.team.find((m) => m.id === id);
        if (!cur) return;
        dispatch({ type: "team.upsert", member: { ...cur, ...patch, id } });
      },
      remove: (id) => dispatch({ type: "team.delete", id }),
    }),
    [state.team, dispatch],
  );
}

export function TeamEditorView({ id }: { id: string }) {
  const controller = useTeamController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/team`}
    />
  );
}
