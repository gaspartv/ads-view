import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight, Users, Award, Coins } from "lucide-react";

export const metadata = {
  title: "Dashboard - Produtos",
};

export default function ProductsDashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Cabeçalho do Dashboard */}
      <div className="relative overflow-hidden border-b border-border/50 bg-background/50 backdrop-blur-xl">
        {/* Efeito sutil de gradiente ao fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-background pointer-events-none" />
        <div className="container mx-auto py-6 px-4 md:px-8 relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Produtos
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-md">
            Selecione a categoria de produto que deseja gerenciar.
          </p>
        </div>
      </div>

      {/* Grid de Módulos */}
      <div className="container mx-auto py-10 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Personagens */}
          <Link
            href="/admin/dashboard/products/characters"
            className="group outline-none"
          >
            <Card className="relative overflow-hidden h-full border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl flex items-center justify-between">
                  <span>Personagens</span>
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                </CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed">
                  Gerencie os personagens à venda no catálogo.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Card Contas com loyalty */}
          <Link
            href="/admin/dashboard/products/account-loyalty"
            className="group outline-none"
          >
            <Card className="relative overflow-hidden h-full border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl flex items-center justify-between">
                  <span>Contas com loyalty</span>
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                </CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed">
                  Gerencie as contas com benefícios de loyalty e seus
                  respectivos detalhes.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Card Tibia Coins */}
          <Link
            href="/admin/dashboard/products/tibia-coins"
            className="group outline-none"
          >
            <Card className="relative overflow-hidden h-full border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <Coins className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl flex items-center justify-between">
                  <span>Tibia Coins</span>
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                </CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed">
                  Gerencie os pacotes e preços de Tibia Coins disponíveis para
                  os usuários.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
