import Link from "next/link";
import {
  ChevronRight,
  Building2,
  Palette,
  Clock,
  MapPin,
  Share2,
  Monitor,
  Blocks,
  Settings,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMyCompanyInfo } from "@/app/actions/company";
import { CompanyBasicInfoForm } from "./components/company-basic-info-form";
import { CompanyImagesSection } from "./components/company-images-section";
import { CompanyBusinessHoursForm } from "./components/company-business-hours-form";
import { ScrollableTabsWrapper } from "./components/scrollable-tabs-wrapper";
import { ThemeEditor } from "./theme/components/theme-editor";

export async function generateMetadata() {
  const response = await getMyCompanyInfo();
  const company = response?.success ? response.data : null;

  return {
    title: company
      ? `${company.name} – Gerenciar Empresa`
      : "Gerenciar Empresa",
  };
}

export default async function CompanyDashboardPage() {
  const response = await getMyCompanyInfo();
  const company = response?.success ? response.data : null;

  if (!company) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">
            Erro ao carregar dados da empresa.
          </h2>
          <p className="text-muted-foreground mt-2">
            Por favor, tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Cabeçalho do Dashboard */}
      <div className="relative overflow-hidden border-b border-border/50 bg-background/50 backdrop-blur-xl">
        {/* Efeito sutil de gradiente ao fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-background pointer-events-none" />
        <div className="w-full py-6 px-4 md:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Minha empresa
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-md">
            Gerencie as informações da sua empresa.
          </p>
        </div>
      </div>
      <div className="container mx-auto py-10 px-4 md:px-8 space-y-8">
        <div className="space-y-12">
          <Tabs defaultValue="basic" className="w-full">
            <ScrollableTabsWrapper>
              <TabsList className="w-max min-w-full justify-start bg-card border border-border/50 h-auto p-2 md:py-6 gap-2 rounded-2xl flex-nowrap">
                <TabsTrigger
                  value="basic"
                  className="shrink-0 cursor-pointer flex items-center gap-2 py-4 px-4 md:py-5 whitespace-nowrap rounded-xl hover:bg-muted data-active:!bg-primary data-active:!text-primary-foreground data-active:shadow-md transition-all"
                >
                  <Building2 className="w-4 h-4" />
                  Informações Básicas
                </TabsTrigger>
                <TabsTrigger
                  value="visual"
                  className="shrink-0 cursor-pointer flex items-center gap-2 py-4 px-4 md:py-5 whitespace-nowrap rounded-xl hover:bg-muted data-active:!bg-primary data-active:!text-primary-foreground data-active:shadow-md transition-all"
                >
                  <Palette className="w-4 h-4" />
                  Identidade Visual
                </TabsTrigger>
                <TabsTrigger
                  value="hours"
                  className="shrink-0 cursor-pointer flex items-center gap-2 py-4 px-4 md:py-5 whitespace-nowrap rounded-xl hover:bg-muted data-active:!bg-primary data-active:!text-primary-foreground data-active:shadow-md transition-all"
                >
                  <Clock className="w-4 h-4" />
                  Horários
                </TabsTrigger>
                <TabsTrigger
                  value="address"
                  className="shrink-0 cursor-pointer flex items-center gap-2 py-4 px-4 md:py-5 whitespace-nowrap rounded-xl hover:bg-muted data-active:!bg-primary data-active:!text-primary-foreground data-active:shadow-md transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  Endereços
                </TabsTrigger>
                <TabsTrigger
                  value="social"
                  className="shrink-0 cursor-pointer flex items-center gap-2 py-4 px-4 md:py-5 whitespace-nowrap rounded-xl hover:bg-muted data-active:!bg-primary data-active:!text-primary-foreground data-active:shadow-md transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Redes Sociais
                </TabsTrigger>
                <TabsTrigger
                  value="theme"
                  className="shrink-0 cursor-pointer flex items-center gap-2 py-4 px-4 md:py-5 whitespace-nowrap rounded-xl hover:bg-muted data-active:!bg-primary data-active:!text-primary-foreground data-active:shadow-md transition-all"
                >
                  <Monitor className="w-4 h-4" />
                  Tema e Aparência
                </TabsTrigger>
                <TabsTrigger
                  value="integrations"
                  className="shrink-0 cursor-pointer flex items-center gap-2 py-4 px-4 md:py-5 whitespace-nowrap rounded-xl hover:bg-muted data-active:!bg-primary data-active:!text-primary-foreground data-active:shadow-md transition-all"
                >
                  <Blocks className="w-4 h-4" />
                  Integrações
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="shrink-0 cursor-pointer flex items-center gap-2 py-4 px-4 md:py-5 whitespace-nowrap rounded-xl hover:bg-muted data-active:!bg-primary data-active:!text-primary-foreground data-active:shadow-md transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Configurações Gerais
                </TabsTrigger>
              </TabsList>
            </ScrollableTabsWrapper>

            <TabsContent value="basic" className="space-y-6 mt-2">
              <CompanyBasicInfoForm company={company} />
            </TabsContent>

            <TabsContent value="visual" className="space-y-6 mt-4">
              <CompanyImagesSection company={company} />
            </TabsContent>

            <TabsContent value="hours" className="mt-4">
              <CompanyBusinessHoursForm businessHours={company?.businessHours} />
            </TabsContent>

            <TabsContent value="address" className="mt-4">
              <div className="py-12 text-center border border-dashed border-border rounded-xl bg-card/50">
                <h3 className="text-lg font-medium text-foreground">
                  Endereços
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerenciamento de endereços físicos será implementado em breve.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="social" className="mt-4">
              <div className="py-12 text-center border border-dashed border-border rounded-xl bg-card/50">
                <h3 className="text-lg font-medium text-foreground">
                  Redes Sociais
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Links e integrações sociais serão implementados em breve.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="theme" className="mt-4">
              <ThemeEditor initialTheme={company?.theme} />
            </TabsContent>

            <TabsContent value="integrations" className="mt-4">
              <div className="py-12 text-center border border-dashed border-border rounded-xl bg-card/50">
                <h3 className="text-lg font-medium text-foreground">
                  Integrações
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerenciamento de integrações externas será implementado em
                  breve.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <div className="py-12 text-center border border-dashed border-border rounded-xl bg-card/50">
                <h3 className="text-lg font-medium text-foreground">
                  Configurações Gerais
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Preferências sistêmicas serão implementadas em breve.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
