import { CategoryCarousel } from "@/components/category-carousel";
import { WhatsappCtaButton } from "@/components/whatsapp-cta-button";
import { ShieldCheck, Zap, Trophy } from "lucide-react";
import { getCompanyInfo } from "./actions/company";

export async function generateMetadata() {
  const response = await getCompanyInfo();
  const company = response?.success ? response.data : null;

  return {
    title: company?.name + " – Tibia Coins, Personagens e Contas com Loyalty",
    description:
      "Compre Tibia Coins, personagens e contas com Loyalty com a melhor cotação do mercado. Entrega imediata e transações seguras.",
  };
}

const trustItems = [
  {
    icon: Zap,
    label: "Entrega imediata",
  },
  {
    icon: ShieldCheck,
    label: "Transação segura",
  },
  {
    icon: Trophy,
    label: "Melhor cotação",
  },
];

export default async function Home() {
  return (
    <div className="cursor-default flex flex-col min-h-screen bg-background font-sans">
      {/* Hero Banner Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-10 pb-8 md:pt-16 md:pb-10">
        {/* Elementos decorativos */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden
        >
          <div className="absolute -top-20 -left-16 w-72 h-72 md:w-96 md:h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-1/2 right-0 w-60 h-60 md:w-80 md:h-80 bg-amber-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 opacity-50" />
        </div>

        <div className="container relative z-10 px-5 md:px-8 mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border-primary/20 mb-5">
            Novas Ofertas Disponíveis
          </span>

          <h1 className="max-w-4xl text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            Sua jornada começa aqui
          </h1>

          <p className="max-w-xl text-base md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Encontre contas, personagens e Tibia Coins com a melhor cotação do
            mercado. Rápido, seguro e com entrega imediata.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
            {/* Client Component isolado para acessar o contexto do lado cliente */}
            <WhatsappCtaButton />
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8">
            {trustItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias */}
      <main className="flex-1 w-full pb-24 container mx-auto px-4 md:px-8 overflow-hidden">
        <CategoryCarousel />
      </main>
    </div>
  );
}
