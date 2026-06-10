"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { pagesReducer } from "@/components/templates/_shared/pages/reducer";
import type { LandingSection } from "@/components/templates/_shared/landing/types";
import type { Action, State } from "./types";

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
    }),
    [state],
  );

  return React.useCallback(
    (action: Action) => {
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
