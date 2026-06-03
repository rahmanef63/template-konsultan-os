"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHead } from "@/components/templates/_shared/ui/section-head";
import { UpdateCard } from "@/components/admin/update-card";
import { BackupCard } from "@/components/admin/backup-card";
import { DEFAULT_SITE_CONFIG } from "../../../shared/site-config";

export function SettingsView() {
  const c = DEFAULT_SITE_CONFIG;
  const settings = useQuery(api.settings.get);
  return (
    <div className="space-y-5">
      <SectionHead eyebrow="Pengaturan" title="Settings" subtitle="Konfigurasi firma, AI proposal, dan invoicing." />

      <Card className="border-border/60 bg-card/60">
        <CardContent className="space-y-3 p-5">
          <h3 className="text-base font-medium">Brand firma</h3>
          <p className="text-sm text-muted-foreground">
            Identitas situs disimpan di Convex (diisi lewat wizard onboarding). Default
            template ada di components/templates/konsultan/shared/site-config.ts.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label className="text-xs">Brand name</Label>
              <Input defaultValue={settings?.siteName || c.brandName} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Principal</Label>
              <Input defaultValue={settings?.ownerName || c.ownerName} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input defaultValue={settings?.contactEmail || c.email} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Domain</Label>
              <Input defaultValue={c.baseUrl} className="mt-1" />
            </div>
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

      <div className="grid gap-4 md:grid-cols-2">
        <UpdateCard />
        <BackupCard />
      </div>
    </div>
  );
}
