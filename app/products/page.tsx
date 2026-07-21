import { CategoryCarousel } from "@/components/category-carousel";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Produtos - Thygas Coins",
};

export default function ProductsPage() {
  return (
    <div className="cursor-default flex flex-col min-h-[calc(100vh-200px)] bg-background font-sans pt-12 pb-24">
      <div className="w-full px-4 md:px-8">
        <nav className="flex items-center space-x-1.5 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Início</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Produtos</span>
        </nav>
        <div className="relative flex flex-col items-center justify-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-center mb-4">
            Nossos Produtos
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Explore nossa variedade de produtos. De Tibia Coins a personagens e contas com loyalty, temos as melhores opções para você.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <CategoryCarousel />
        </div>
      </div>
    </div>
  );
}
