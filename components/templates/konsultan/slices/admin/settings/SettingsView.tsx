"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHead } from "@/components/templates/_shared/ui/section-head";
import { UpdateCard } from "@/components/admin/update-card";
import { BackupCard } from "@/components/admin/backup-card";
import { ThemePresetSwitcher } from "@/features/theme-presets";
import { ImagePickerButton, imageRef } from "@/features/image-picker";
import { DEFAULT_SITE_CONFIG } from "../../../shared/site-config";

export function SettingsView() {
  const c = DEFAULT_SITE_CONFIG;
  const settings = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);
  const genUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getUrl);

  const [siteName, setSiteName] = React.useState("");
  const [ownerName, setOwnerName] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [logoUrl, setLogoUrl] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const hydrated = React.useRef(false);

  React.useEffect(() => {
    if (settings === undefined || hydrated.current) return;
    hydrated.current = true;
    setSiteName(settings?.siteName ?? c.brandName);
    setOwnerName(settings?.ownerName ?? c.ownerName);
    setContactEmail(settings?.contactEmail ?? c.email);
    setTagline(settings?.tagline ?? c.tagline);
    setLogoUrl(settings?.logoUrl ?? "");
  }, [settings, c]);

  const onUpload = async (file: File): Promise<string> => {
    const uploadUrl = await genUploadUrl();
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = (await res.json()) as { storageId: string };
    return ((await getFileUrl({ storageId: storageId as never })) as string) ?? "";
  };

  async function save() {
    setSaving(true);
    try {
      await upsert({ siteName, ownerName, contactEmail, tagline, logoUrl });
      toast.success("Pengaturan tersimpan");
    } catch (e) {
      toast.error("Gagal menyimpan", { description: e instanceof Error ? e.message : undefined });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Pengaturan" title="Settings" subtitle="Konfigurasi firma, AI proposal, dan invoicing." />

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-3 p-5">
          <h3 className="text-base font-medium">Brand firma</h3>
          <p className="text-sm text-muted-foreground">
            Identitas situs disimpan di Convex dan langsung tampil di situs publik
            (header, footer, kontak). Default template ada di
            components/templates/konsultan/shared/site-config.ts.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label className="text-xs">Brand name</Label>
              <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Principal</Label>
              <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Tagline</Label>
              <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Logo</Label>
              <div className="mt-1 flex items-center gap-3">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Logo" className="h-9 w-auto rounded-md object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground">Belum ada logo — header pakai wordmark teks.</span>
                )}
                <ImagePickerButton
                  label={logoUrl ? "Ganti logo" : "Upload logo"}
                  title="Logo"
                  onUpload={onUpload}
                  searchUnsplash={undefined}
                  onChange={(img) => setLogoUrl(imageRef(img) ?? "")}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={save} disabled={saving || settings === undefined}>
              {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-3 p-5">
          <h3 className="text-base font-medium">Invoicing & PPN</h3>
          <p className="text-sm text-muted-foreground">
            PPN default 11%, e-Faktur compatible. NPWP firma tersimpan di vault. Reminder otomatis 7 + 3 + 0
            hari sebelum jatuh tempo.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="flex items-center justify-between gap-4 p-5 text-sm">
          <div>
            <p className="font-medium text-foreground">Appearance</p>
            <p className="text-muted-foreground">
              Pilih display mode (light/dark/system) + color preset. Tersimpan
              di browser, berlaku ke seluruh dashboard &amp; situs publik.
            </p>
          </div>
          <ThemePresetSwitcher />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <UpdateCard />
        <BackupCard />
      </div>
    </div>
  );
}
