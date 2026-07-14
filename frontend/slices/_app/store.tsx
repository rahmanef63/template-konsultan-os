"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  PagesProvider,
  type PagesStore,
} from "@/features/_shared/pages/pages-context";
import type { PageEntry } from "@/features/_shared/pages/types";
import {
  LandingProvider,
  type LandingStore,
} from "@/features/_shared/landing/landing-context";
import type { LandingSection } from "@/features/_shared/landing/types";
import { ADMIN_BASE, PUBLIC_BASE } from "./nav-config";
import { StoreCtx, useStore, type Ctx } from "./store-context";
import { useConvexDispatch, useDemoDispatch } from "./store-dispatch";
import { reducer } from "./store-reducer";
import { SEED_STATE } from "./seed";
import { loadDemoState, openDemoChannel } from "@/lib/demo-store";
import { IS_DEMO } from "@/lib/stage";
import type { Action, State } from "./types";

// Convex-backed store. Replaces the old localStorage reducer: `state` is
// assembled from live Convex queries; `dispatch` routes each action to the
// matching Convex mutation (see store-dispatch.tsx). Consuming slices are
// UNCHANGED — they still call useStore()/useX()/dispatch(action).
//
// id mapping: frontend objects key by `id` (string); Convex keys by `_id`.
// On read we map `_id` -> `id`. On upsert we pass `id` only when it's a known
// Convex id (existing row); a fresh client-generated id -> insert.

// Map Convex `_id` -> frontend `id` AND drop the system fields (`_id`,
// `_creationTime`). Keeping them meant edit-dispatch forwarded them into the
// strict upsert validators (which declare no such args), so every "edit
// existing row -> Save" threw ArgumentValidationError and silently no-op'd.
const withId = <T,>(rows: ReadonlyArray<Record<string, unknown>> | undefined): T[] =>
  ((rows ?? []) as Array<Record<string, unknown>>).map(
    ({ _id, _creationTime: _ct, ...r }) => ({ ...r, id: _id }),
  ) as T[];

function Provider({ children }: { children: React.ReactNode }) {
  if (IS_DEMO) return <DemoProvider>{children}</DemoProvider>;
  return <ConvexProvider>{children}</ConvexProvider>;
}

// DEMO-only provider: no Convex queries run (the demo store lives entirely in
// localStorage), state syncs across the public<->admin iframes via a
// BroadcastChannel. Mounted only when NEXT_PUBLIC_DEMO=1; tree-shaken/never
// reached in real clones (IS_DEMO is a build-time const false).
function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(() => loadDemoState(SEED_STATE));

  // Apply actions broadcast from the *other* iframe through the same reducer,
  // so a create/edit/delete in the admin frame re-renders the public frame.
  React.useEffect(() => {
    const ch = openDemoChannel();
    if (!ch) return;
    ch.onmessage = (e: MessageEvent<Action>) => setState((s) => reducer(s, e.data));
    return () => ch.close();
  }, []);

  const dispatch = useDemoDispatch(setState);

  const value = React.useMemo<Ctx>(
    // ponytail: ready=true immediately + progress=100 — the demo state is in
    // hand synchronously, no network load phase to report.
    () => ({ state, dispatch, ready: true, progress: 100 }),
    [state, dispatch],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function ConvexProvider({ children }: { children: React.ReactNode }) {
  const clients = useQuery(api.clients.list, {});
  const proposals = useQuery(api.proposals.list, {});
  const contracts = useQuery(api.contracts.list, {});
  const projects = useQuery(api.projects.list, {});
  const invoices = useQuery(api.invoices.list, {});
  const documents = useQuery(api.documents.list, {});
  const calendarEvents = useQuery(api.calendar.list, {});
  const kbArticles = useQuery(api.kb.list, {});
  const services = useQuery(api.services.list, {});
  const team = useQuery(api.team.list, {});
  const faqs = useQuery(api.faqs.list, {});
  const pageRows = useQuery(api.pages.list, {});
  const landingRows = useQuery(api.landing.list, {});

  const queries = [
    clients, proposals, contracts, projects, invoices, documents,
    calendarEvents, kbArticles, services, team, faqs, pageRows, landingRows,
  ];
  const ready = queries.every((q) => q !== undefined);
  const progress = Math.round((queries.filter((q) => q !== undefined).length / queries.length) * 100);

  const state = React.useMemo<State>(
    () => ({
      clients: withId(clients),
      proposals: withId(proposals),
      contracts: withId(contracts),
      projects: withId(projects),
      invoices: withId(invoices),
      documents: withId(documents),
      calendarEvents: withId(calendarEvents),
      kbArticles: withId(kbArticles),
      services: withId(services),
      team: withId(team),
      faqs: withId(faqs),
      pages: (pageRows ?? []) as PageEntry[],
      landingSections: (landingRows ?? []) as LandingSection[],
    }),
    [clients, proposals, contracts, projects, invoices, documents, calendarEvents, kbArticles, services, team, faqs, pageRows, landingRows],
  );

  const dispatch = useConvexDispatch(state);

  const value = React.useMemo<Ctx>(
    () => ({ state, dispatch, ready, progress }),
    [state, dispatch, ready, progress],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

function PagesAdapter({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const value = React.useMemo<PagesStore>(
    () => ({
      pages: state.pages,
      create: (entry: PageEntry) => dispatch({ type: "PAGE_CREATE", payload: entry }),
      update: (id, patch) => dispatch({ type: "PAGE_UPDATE", payload: { id, patch } }),
      remove: (id: string) => dispatch({ type: "PAGE_DELETE", payload: { id } }),
      reorderBlock: (id, from, to) =>
        dispatch({ type: "PAGE_REORDER_BLOCK", payload: { id, from, to } }),
      upsertSection: (pageId, section) =>
        dispatch({ type: "PAGE_SECTION_UPSERT", payload: { pageId, section } }),
      removeSection: (pageId, sectionId) =>
        dispatch({ type: "PAGE_SECTION_DELETE", payload: { pageId, sectionId } }),
    }),
    [state.pages, dispatch],
  );
  return <PagesProvider value={value}>{children}</PagesProvider>;
}

function LandingAdapter({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useStore();
  const value = React.useMemo<LandingStore>(
    () => ({
      items: state.landingSections,
      publicBase: PUBLIC_BASE,
      adminBase: ADMIN_BASE,
      create: (section: LandingSection) =>
        dispatch({ type: "LANDING_UPSERT", payload: section }),
      update: (id, patch) => {
        const current = state.landingSections.find((s) => s.id === id);
        if (!current) return;
        dispatch({ type: "LANDING_UPSERT", payload: { ...current, ...patch, id } });
      },
      remove: (id: string) => dispatch({ type: "LANDING_DELETE", payload: { id } }),
    }),
    [state.landingSections, dispatch],
  );
  return <LandingProvider value={value}>{children}</LandingProvider>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <PagesAdapter>
        <LandingAdapter>{children}</LandingAdapter>
      </PagesAdapter>
    </Provider>
  );
}

export { useStore };
export const usePages = () => useStore().state.pages;
export const useLandingSections = () => useStore().state.landingSections;

export function useClients() {
  return useStore().state.clients;
}
export function useProposals() {
  return useStore().state.proposals;
}
export function useContracts() {
  return useStore().state.contracts;
}
export function useProjects() {
  return useStore().state.projects;
}
export function useInvoices() {
  return useStore().state.invoices;
}
export function useDocuments() {
  return useStore().state.documents;
}
export function useCalendarEvents() {
  return useStore().state.calendarEvents;
}
export function useKbArticles() {
  return useStore().state.kbArticles;
}
export function useServices() {
  return useStore().state.services;
}
export function useTeam() {
  return useStore().state.team;
}
export function useFaqs() {
  return useStore().state.faqs;
}

export { nid, slugify, fmtDate, rel } from "@/features/_shared/utils";
