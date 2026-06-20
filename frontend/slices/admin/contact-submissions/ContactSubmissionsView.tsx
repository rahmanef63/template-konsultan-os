"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHead } from "@/features/_shared/ui/section-head";
import { rel } from "@/features/_shared/utils";

export function ContactSubmissionsView() {
  const submissions = useQuery(api.contact.list, {});
  const markRead = useMutation(api.contact.markRead);
  const remove = useMutation(api.contact.remove);

  async function onDelete(id: Id<"konsultanContactSubmissions">) {
    if (!confirm("Hapus pesan ini?")) return;
    try {
      await remove({ id });
      toast.success("Pesan dihapus");
    } catch (e) {
      toast.error("Gagal menghapus", { description: e instanceof Error ? e.message : undefined });
    }
  }

  async function onRead(id: Id<"konsultanContactSubmissions">) {
    try {
      await markRead({ id });
    } catch {
      /* non-fatal */
    }
  }

  return (
    <div className="space-y-5">
      <SectionHead
        eyebrow="Inbox"
        title="Pesan kontak"
        subtitle="Brief konsultasi yang dikirim dari halaman /contact."
      />

      {submissions === undefined ? (
        <p className="text-sm text-muted-foreground">Memuat…</p>
      ) : submissions.length === 0 ? (
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Belum ada pesan masuk. Brief dari halaman kontak publik akan muncul di sini.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <Card key={s._id} className="border-border/60 bg-card/60">
              <CardContent className="space-y-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-medium">{s.name}</h3>
                      {s.status === "new" && <Badge variant="default">Baru</Badge>}
                      {s.topic && <Badge variant="outline">{s.topic}</Badge>}
                    </div>
                    {s.company && (
                      <p className="text-sm text-muted-foreground">{s.company}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{rel(s.ts)}</span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <a href={`mailto:${s.email}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                    <Mail className="size-4" /> {s.email}
                  </a>
                  {s.phone && (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="size-4" /> {s.phone}
                    </span>
                  )}
                </div>

                <p className="whitespace-pre-wrap text-sm">{s.message}</p>

                <div className="flex justify-end gap-2">
                  {s.status === "new" && (
                    <Button size="sm" variant="outline" onClick={() => onRead(s._id)}>
                      Tandai dibaca
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => onDelete(s._id)}>
                    <Trash2 className="size-4" /> Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
