import { FaqEditorView } from "@/components/templates/konsultan/slices/admin/faq/FaqEditorView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FaqEditorView id={id} />;
}
