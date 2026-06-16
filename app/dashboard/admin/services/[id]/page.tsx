import { ServiceEditorView } from "@/components/templates/konsultan/slices/admin/services/ServiceEditorView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServiceEditorView id={id} />;
}
