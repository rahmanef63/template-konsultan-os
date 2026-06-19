import { FaqEditorView } from "@/features/admin/faq/FaqEditorView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FaqEditorView id={id} />;
}
