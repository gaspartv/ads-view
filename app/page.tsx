import { getHomeData } from "@/app/actions/home";
import { CategoryCarousel } from "@/components/category-carousel";

export const metadata = {
  title: "Thygas Coins",
};

export default async function Home() {
  const response = await getHomeData();
  const categories = response?.success && response.data ? response.data : [];

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* Hero Banner Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-24 pb-6 md:pt-32 md:pb-6">
        {/* Elementos decorativos (Glassmorphism blobs) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2" />
        </div>

        <div className="container relative z-10 px-4 md:px-8 mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-6">
            Novas Ofertas Disponíveis
          </div>

          <h1 className="max-w-4xl text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Sua jornada começa aqui
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10">
            Encontre contas, personagens e Tibia Coins com a melhor cotação do
            mercado. Transações rápidas, seguras e com entrega imediata.
          </p>
        </div>
      </section>

      {/* Categorias */}
      <main className="flex-1 w-full pb-24 container mx-auto px-4 md:px-8 overflow-hidden">
        {categories.length > 0 ? (
          <div className="w-full flex justify-center">
            <CategoryCarousel />
          </div>
        ) : (
          <div className="py-24 text-center">
            <h3 className="text-2xl font-semibold text-muted-foreground">
              Nenhuma categoria disponível no momento.
            </h3>
          </div>
        )}
      </main>
    </div>
  );
}
