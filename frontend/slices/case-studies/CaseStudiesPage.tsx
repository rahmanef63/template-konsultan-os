"use client";

import { ConceptListPage } from "@/features/_shared/concepts/ConceptListPage";
import { caseStudiesAdapter } from "@/features/_app/concepts";

export function CaseStudiesPage() {
  return <ConceptListPage adapter={caseStudiesAdapter} />;
}
