"use client";

import { Image as ImageIcon } from "lucide-react";
import {
  uploadCompanyLogo,
  uploadCompanyFavicon,
  uploadCompanyBanner,
} from "@/app/actions/company";
import { CompanyImageUpload } from "./company-image-upload";

interface CompanyImagesSectionProps {
  company: {
    logo?: string | null;
    favicon?: string | null;
    banner?: string | null;
  };
}

export function CompanyImagesSection({ company }: CompanyImagesSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <ImageIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold leading-none">
            Identidade Visual
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as imagens públicas da sua empresa
          </p>
        </div>
      </div>

      {/* Banner — full width, em destaque */}
      <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-5 space-y-4">
        <div>
          <p className="text-sm font-medium">Banner</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Imagem de destaque exibida no topo da sua página pública · máx. 10MB
          </p>
        </div>

        <CompanyImageUpload
          label="Banner"
          currentUrl={company.banner}
          onUpload={uploadCompanyBanner}
          variant="wide"
          fieldName="banner"
          maxSizeLabel="10MB"
          hideLabel
        />
      </div>

      {/* Logo + Favicon — lado a lado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Logo */}
        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-5 space-y-4">
          <div>
            <p className="text-sm font-medium">Logo</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Logotipo principal da empresa · máx. 2MB
            </p>
          </div>
          <div className="flex justify-center">
            <CompanyImageUpload
              label="Logo"
              currentUrl={company.logo}
              onUpload={uploadCompanyLogo}
              variant="square"
              fieldName="logo"
              maxSizeLabel="2MB"
              hideLabel
            />
          </div>
        </div>

        {/* Favicon */}
        <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-5 space-y-4">
          <div>
            <p className="text-sm font-medium">Favicon</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ícone exibido na aba do navegador · máx. 512KB
            </p>
          </div>
          <div className="flex justify-center">
            <CompanyImageUpload
              label="Favicon"
              currentUrl={company.favicon}
              onUpload={uploadCompanyFavicon}
              variant="square"
              fieldName="favicon"
              maxSizeLabel="512KB"
              hideLabel
            />
          </div>
        </div>
      </div>
    </div>
  );
}
