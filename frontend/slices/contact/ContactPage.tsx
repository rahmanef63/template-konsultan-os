"use client";

import * as React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHead } from "@/features/_shared/ui/section-head";
import { Stagger } from "@/features/_shared/motion";
import { DEFAULT_SITE_CONFIG } from "@/features/_app/site-config";

export function ContactPage() {
  const settings = useQuery(api.settings.get);
  const submit = useMutation(api.contact.submit);
  const email = settings?.contactEmail || DEFAULT_SITE_CONFIG.email;
  const phone = settings?.contactPhone || "+62 21-555-1234";
  const address = settings?.contactAddress || "SCBD Lot 3, Jakarta Selatan";

  const [name, setName] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);

  async function send() {
    setSending(true);
    try {
      await submit({
        name,
        company: company || undefined,
        email: formEmail,
        phone: formPhone || undefined,
        topic: topic || undefined,
        message,
      });
      toast.success("Brief terkirim", { description: "Kami akan kembali dalam 2 hari kerja." });
      setName("");
      setCompany("");
      setFormEmail("");
      setFormPhone("");
      setTopic("");
      setMessage("");
    } catch (e) {
      toast.error("Gagal mengirim", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <SectionHead
        eyebrow="Kontak"
        title="Konsultasi gratis 30 menit"
        subtitle="Ceritakan tantangan tim/perusahaan Anda — kami akan kembali dalam 2 hari kerja."
      />

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Stagger itemClassName="h-full">
        <Card className="h-full border-border/60 bg-card/60">
          <CardContent className="space-y-3 p-6">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label className="text-xs">Nama</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Perusahaan</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Nama perusahaan" className="mt-1" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label className="text-xs">Email</Label>
                <Input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@perusahaan.com" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">No. WhatsApp</Label>
                <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+62..." className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Topik konsultasi</Label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Strategi / Operasi / Org / Lainnya" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Detail tantangan</Label>
              <Textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ceritakan situasi dan goal..." className="mt-1" />
            </div>
            <Button className="w-full" onClick={send} disabled={sending}>
              {sending ? "Mengirim…" : "Kirim brief"}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-full border-border/60 bg-card/60">
          <CardContent className="space-y-4 p-6 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
                <p>{email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Telepon</p>
                <p>{phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 text-muted-foreground" />
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Kantor</p>
                <p>{address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </Stagger>
      </div>
    </section>
  );
}
