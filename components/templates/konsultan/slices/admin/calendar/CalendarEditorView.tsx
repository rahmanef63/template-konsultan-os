"use client";

import * as React from "react";
import { CrudListView } from "@/components/templates/_shared/crud/CrudListView";
import type { ColumnDef, CrudController, EntityMeta, FieldDef } from "@/components/templates/_shared/crud/types";
import { useStore } from "../../../shared/store";
import { ADMIN_BASE } from "../../../shared/nav-config";
import type { CalendarEvent } from "../../../shared/types";

const META: EntityMeta = { label: "Event", labelPlural: "Calendar" };

const DAY_OPTS = [
  { value: "0", label: "Minggu" },
  { value: "1", label: "Senin" },
  { value: "2", label: "Selasa" },
  { value: "3", label: "Rabu" },
  { value: "4", label: "Kamis" },
  { value: "5", label: "Jumat" },
  { value: "6", label: "Sabtu" },
];

export const FIELDS: FieldDef<CalendarEvent>[] = [
  { kind: "text", key: "title", label: "Judul", wide: true },
  {
    kind: "select",
    key: "kind",
    label: "Jenis",
    options: [
      { value: "session", label: "Sesi klien" },
      { value: "deadline", label: "Deadline" },
      { value: "workshop", label: "Workshop" },
      { value: "internal", label: "Internal" },
    ],
  },
  { kind: "select", key: "dayOfWeek", label: "Hari", options: DAY_OPTS },
  { kind: "number", key: "hour", label: "Jam mulai (0-23)", min: 0, max: 23, step: 1 },
  { kind: "number", key: "durationHours", label: "Durasi (jam)", min: 1, step: 1 },
  { kind: "text", key: "location", label: "Lokasi" },
  { kind: "text", key: "clientId", label: "Client ID (opsional)", mono: true },
  { kind: "textarea", key: "notes", label: "Catatan", rows: 3 },
];

export function useCalendarController(): CrudController<CalendarEvent> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: [...state.calendarEvents].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.hour - b.hour),
      getId: (e) => e.id,
      blank: () => ({
        id: `evt-${Math.random().toString(36).slice(2, 10)}`,
        title: "Event baru",
        kind: "session",
        dayOfWeek: 1,
        hour: 9,
        durationHours: 1,
        location: "Zoom",
      }),
      create: (event) => dispatch({ type: "calendar.upsert", event }),
      update: (id, patch) => {
        const cur = state.calendarEvents.find((e) => e.id === id);
        if (!cur) return;
        const next = { ...cur, ...patch, id };
        // select fields return strings; coerce numerics back.
        next.dayOfWeek = Number(next.dayOfWeek);
        next.hour = Number(next.hour);
        next.durationHours = Number(next.durationHours);
        dispatch({ type: "calendar.upsert", event: next });
      },
      remove: (id) => dispatch({ type: "calendar.delete", id }),
    }),
    [state.calendarEvents, dispatch],
  );
}

const COLUMNS: ColumnDef<CalendarEvent>[] = [
  { key: "title", header: "Judul", width: "w-[40%]" },
  { key: "kind", header: "Jenis", width: "w-[16%]", badge: "outline" },
  {
    key: "dayOfWeek",
    header: "Hari",
    width: "w-[14%]",
    hideOnMobile: true,
    render: (v) => DAY_OPTS.find((d) => d.value === String(v))?.label ?? String(v),
  },
  { key: "location", header: "Lokasi", width: "w-[20%]", hideOnMobile: true },
];

export function CalendarEditorView() {
  const controller = useCalendarController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/calendar/${id}`}
      description="Kelola event terjadwal — sesi klien, deadline, workshop, internal"
    />
  );
}
