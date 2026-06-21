"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { IS_DEMO } from "@/lib/stage";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { pagesReducer } from "@/features/_shared/pages/reducer";
import type { LandingSection } from "@/features/_shared/landing/types";
import { reducer } from "./store-reducer";
import { saveDemoState, broadcastAction, openDemoChannel } from "@/lib/demo-store";
import type { Action, State } from "./types";

// DEMO dispatch: every action runs through the same pure `reducer`, the next
// State is persisted to localStorage, and the action is broadcast so the
// sibling iframe (public<->admin) re-renders live. Mounted only when
// NEXT_PUBLIC_DEMO=1 (see store.tsx DemoProvider); replaces the Convex mutation
// path for the demo. Real clones never call this — they use useConvexDispatch.
export function useDemoDispatch(
  setState: React.Dispatch<React.SetStateAction<State>>,
): (a: Action) => void {
  // One channel per provider instance; closed on unmount.
  const channelRef = React.useRef<BroadcastChannel | null>(null);
  React.useEffect(() => {
    channelRef.current = openDemoChannel();
    return () => channelRef.current?.close();
  }, []);

  return React.useCallback(
    (action: Action) => {
      setState((s) => {
        const next = reducer(s, action);
        saveDemoState(next);
        return next;
      });
      broadcastAction(channelRef.current, action);
    },
    [setState],
  );
}

// Dispatch wiring, split out of store.tsx (move-only): routes each store
// action to the matching Convex mutation. `id` is passed to upsert only when
// it's a known Convex id (existing row); a fresh client-generated id -> insert.

export function useConvexDispatch(state: State): (a: Action) => void {
  const mClientUpsert = useMutation(api.clients.upsert);
  const mClientRemove = useMutation(api.clients.remove);
  const mProposalUpsert = useMutation(api.proposals.upsert);
  const mProposalRemove = useMutation(api.proposals.remove);
  const mContractUpsert = useMutation(api.contracts.upsert);
  const mContractRemove = useMutation(api.contracts.remove);
  const mProjectUpsert = useMutation(api.projects.upsert);
  const mProjectRemove = useMutation(api.projects.remove);
  const mInvoiceUpsert = useMutation(api.invoices.upsert);
  const mInvoiceRemove = useMutation(api.invoices.remove);
  const mDocumentUpsert = useMutation(api.documents.upsert);
  const mDocumentRemove = useMutation(api.documents.remove);
  const mCalendarUpsert = useMutation(api.calendar.upsert);
  const mCalendarRemove = useMutation(api.calendar.remove);
  const mKbUpsert = useMutation(api.kb.upsert);
  const mKbRemove = useMutation(api.kb.remove);
  const mServiceUpsert = useMutation(api.services.upsert);
  const mServiceRemove = useMutation(api.services.remove);
  const mTeamUpsert = useMutation(api.team.upsert);
  const mTeamRemove = useMutation(api.team.remove);
  const mFaqUpsert = useMutation(api.faqs.upsert);
  const mFaqRemove = useMutation(api.faqs.remove);
  const mPageUpsert = useMutation(api.pages.upsert);
  const mPageRemove = useMutation(api.pages.remove);
  const mLandingUpsert = useMutation(api.landing.upsert);
  const mLandingRemove = useMutation(api.landing.remove);

  const knownIds = React.useMemo(
    () => ({
      clients: new Set(state.clients.map((c) => c.id)),
      proposals: new Set(state.proposals.map((p) => p.id)),
      contracts: new Set(state.contracts.map((c) => c.id)),
      projects: new Set(state.projects.map((p) => p.id)),
      invoices: new Set(state.invoices.map((i) => i.id)),
      documents: new Set(state.documents.map((d) => d.id)),
      calendarEvents: new Set(state.calendarEvents.map((e) => e.id)),
      kbArticles: new Set(state.kbArticles.map((a) => a.id)),
      services: new Set(state.services.map((s) => s.id)),
      team: new Set(state.team.map((m) => m.id)),
      faqs: new Set(state.faqs.map((f) => f.id)),
    }),
    [state],
  );

  return React.useCallback(
    (action: Action) => {
      // Demo-stage read-only gate: every business write flows through here
      // BEFORE the switch, so a shared-DB showcase visitor can't stomp the
      // seeded content other visitors are viewing. No-op on real clones /
      // the owner deployment (IS_DEMO false) — full Convex CRUD stays live.
      if (IS_DEMO) {
        toast.info("Mode demo — clone template untuk menyimpan perubahan");
        return;
      }
      const fail = (e: unknown) => console.error(`[store] ${action.type} failed`, e);
      switch (action.type) {
        case "client.upsert": {
          const { id, ...d } = action.client;
          void (knownIds.clients.has(id)
            ? mClientUpsert({ id: id as Id<"konsultanClients">, ...d })
            : mClientUpsert(d)
          ).catch(fail);
          break;
        }
        case "client.delete":
          void mClientRemove({ id: action.id as Id<"konsultanClients"> }).catch(fail);
          break;

        case "proposal.upsert": {
          const { id, ...d } = action.proposal;
          void (knownIds.proposals.has(id)
            ? mProposalUpsert({ id: id as Id<"konsultanProposals">, ...d })
            : mProposalUpsert(d)
          ).catch(fail);
          break;
        }
        case "proposal.delete":
          void mProposalRemove({ id: action.id as Id<"konsultanProposals"> }).catch(fail);
          break;

        case "contract.upsert": {
          const { id, ...d } = action.contract;
          void (knownIds.contracts.has(id)
            ? mContractUpsert({ id: id as Id<"konsultanContracts">, ...d })
            : mContractUpsert(d)
          ).catch(fail);
          break;
        }
        case "contract.delete":
          void mContractRemove({ id: action.id as Id<"konsultanContracts"> }).catch(fail);
          break;

        case "project.upsert": {
          const { id, ...d } = action.project;
          void (knownIds.projects.has(id)
            ? mProjectUpsert({ id: id as Id<"konsultanProjects">, ...d })
            : mProjectUpsert(d)
          ).catch(fail);
          break;
        }
        case "project.delete":
          void mProjectRemove({ id: action.id as Id<"konsultanProjects"> }).catch(fail);
          break;

        case "invoice.upsert": {
          const { id, ...d } = action.invoice;
          void (knownIds.invoices.has(id)
            ? mInvoiceUpsert({ id: id as Id<"konsultanInvoices">, ...d })
            : mInvoiceUpsert(d)
          ).catch(fail);
          break;
        }
        case "invoice.delete":
          void mInvoiceRemove({ id: action.id as Id<"konsultanInvoices"> }).catch(fail);
          break;

        case "document.upsert": {
          const { id, ...d } = action.doc;
          void (knownIds.documents.has(id)
            ? mDocumentUpsert({ id: id as Id<"konsultanDocuments">, ...d })
            : mDocumentUpsert(d)
          ).catch(fail);
          break;
        }
        case "document.delete":
          void mDocumentRemove({ id: action.id as Id<"konsultanDocuments"> }).catch(fail);
          break;

        case "calendar.upsert": {
          const { id, ...d } = action.event;
          void (knownIds.calendarEvents.has(id)
            ? mCalendarUpsert({ id: id as Id<"konsultanCalendarEvents">, ...d })
            : mCalendarUpsert(d)
          ).catch(fail);
          break;
        }
        case "calendar.delete":
          void mCalendarRemove({ id: action.id as Id<"konsultanCalendarEvents"> }).catch(fail);
          break;

        case "kb.upsert": {
          const { id, ...d } = action.article;
          void (knownIds.kbArticles.has(id)
            ? mKbUpsert({ id: id as Id<"konsultanKbArticles">, ...d })
            : mKbUpsert(d)
          ).catch(fail);
          break;
        }
        case "kb.delete":
          void mKbRemove({ id: action.id as Id<"konsultanKbArticles"> }).catch(fail);
          break;

        case "service.upsert": {
          const { id, ...d } = action.service;
          void (knownIds.services.has(id)
            ? mServiceUpsert({ id: id as Id<"konsultanServices">, ...d })
            : mServiceUpsert(d)
          ).catch(fail);
          break;
        }
        case "service.delete":
          void mServiceRemove({ id: action.id as Id<"konsultanServices"> }).catch(fail);
          break;

        case "team.upsert": {
          const { id, ...d } = action.member;
          void (knownIds.team.has(id)
            ? mTeamUpsert({ id: id as Id<"konsultanTeam">, ...d })
            : mTeamUpsert(d)
          ).catch(fail);
          break;
        }
        case "team.delete":
          void mTeamRemove({ id: action.id as Id<"konsultanTeam"> }).catch(fail);
          break;

        case "faq.upsert": {
          const { id, ...d } = action.faq;
          void (knownIds.faqs.has(id)
            ? mFaqUpsert({ id: id as Id<"konsultanFaqs">, ...d })
            : mFaqUpsert(d)
          ).catch(fail);
          break;
        }
        case "faq.delete":
          void mFaqRemove({ id: action.id as Id<"konsultanFaqs"> }).catch(fail);
          break;

        case "PAGE_DELETE":
          void mPageRemove({ entryId: action.payload.id }).catch(fail);
          break;
        case "PAGE_CREATE":
        case "PAGE_UPDATE":
        case "PAGE_REORDER_BLOCK":
        case "PAGE_SECTION_UPSERT":
        case "PAGE_SECTION_DELETE": {
          const next = pagesReducer({ pages: state.pages }, action);
          const pid =
            (action.payload as { id?: string; pageId?: string }).id ??
            (action.payload as { pageId?: string }).pageId;
          const entry = next.pages.find((p) => p.id === pid);
          if (entry) void mPageUpsert({ entryId: entry.id, slug: entry.slug, data: entry }).catch(fail);
          break;
        }

        case "LANDING_UPSERT": {
          const s = action.payload as LandingSection;
          void mLandingUpsert({ sectionId: s.id, data: s }).catch(fail);
          break;
        }
        case "LANDING_DELETE":
          void mLandingRemove({ sectionId: (action.payload as { id: string }).id }).catch(fail);
          break;

        case "hydrate":
        case "reset":
          // Convex is the source of truth — no-op.
          break;
      }
    },
    [knownIds, state.pages], // eslint-disable-line react-hooks/exhaustive-deps
  );
}
