import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Clock,
  Settings,
  Palette,
  Share2,
  Blocks,
  MapPin,
  Globe,
  ChevronRight,
} from "lucide-react";
import { getMyCompanyInfo } from "@/app/actions/company";
import { CompanyBasicInfoForm } from "./components/company-basic-info-form";

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
    <div className="container mx-auto py-10 px-4 md:px-8 space-y-8">
      <div className="space-y-4">
        {/* Navegação - Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-sm text-muted-foreground">
          <span>Admin</span>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/admin/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Empresa</span>
        </nav>
      </div>

      <div className="space-y-12">
        {/* Topo: Logo e Nome */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {company.logo && (
            <div className="w-24 h-24 relative rounded-2xl overflow-hidden shadow-sm border border-border/50 bg-white flex-shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={company.logo}
                alt="Logo"
                className="max-w-full max-h-full object-contain p-2"
              />
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              {company.name}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-2">
              <Globe className="w-4 h-4" />
              {company.site}
            </p>
          </div>
          {company.favicon && (
            <div className="hidden md:flex w-12 h-12 relative rounded-xl overflow-hidden border border-border/50 bg-white shadow-sm flex-shrink-0 items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={company.favicon}
                alt="Favicon"
                className="max-w-full max-h-full object-contain p-1"
              />
            </div>
          )}
        </div>
        {/* Banner Section */}
        {company.banner && (
          <div className="w-full h-48 md:h-64 relative rounded-3xl overflow-hidden shadow-2xl border border-border/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={company.banner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        <CompanyBasicInfoForm company={company} />

        {/* Grid de Ações / Módulos */}
        <div>
          <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3">
            <Settings className="w-7 h-7 text-primary" />
            Gerenciar Módulos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Horários */}
            <Link
              href="/admin/dashboard/company/business-hours"
              className="group outline-none"
            >
              <Card className="relative overflow-hidden h-full border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Horários</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    Configure o horário de funcionamento e atendimento da sua
                    empresa.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Endereços */}
            <Link
              href="/admin/dashboard/company/address"
              className="group outline-none"
            >
              <Card className="relative overflow-hidden h-full border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Endereços</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    Gerencie os endereços físicos associados à sua marca.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Redes Sociais */}
            <Link
              href="/admin/dashboard/company/social-networks"
              className="group outline-none"
            >
              <Card className="relative overflow-hidden h-full border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Share2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Redes Sociais</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    Adicione links para suas plataformas (Instagram, Facebook,
                    etc).
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Tema */}
            <Link
              href="/admin/dashboard/company/theme"
              className="group outline-none"
            >
              <Card className="relative overflow-hidden h-full border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Palette className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Tema e Aparência</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    Personalize as cores, aparência e identidade visual do
                    portal.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Integrações */}
            <Link
              href="/admin/dashboard/company/integrations"
              className="group outline-none"
            >
              <Card className="relative overflow-hidden h-full border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Blocks className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Integrações</CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    Gerencie chaves de API, webhooks e serviços de terceiros.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Configurações */}
            <Link
              href="/admin/dashboard/company/settings"
              className="group outline-none"
            >
              <Card className="relative overflow-hidden h-full border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    Configurações Gerais
                  </CardTitle>
                  <CardDescription className="text-sm mt-2 leading-relaxed">
                    Ajuste informações básicas e preferências sistêmicas.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
