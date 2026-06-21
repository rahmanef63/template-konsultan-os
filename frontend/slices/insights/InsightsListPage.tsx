"use client";

import { ConceptListPage } from "@/features/_shared/concepts/ConceptListPage";
import { insightsAdapter } from "@/features/_app/concepts";

export function InsightsListPage() {
  return <ConceptListPage adapter={insightsAdapter} />;
}
