import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Tibia Coins - Thygas Coins",
};

export default function TibiaCoinsPage() {
  return (
    <div className="cursor-default w-full px-4 md:px-8 py-12 flex flex-col items-center min-h-[calc(100vh-200px)]">
      <nav className="w-full flex items-center justify-start space-x-1.5 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Início</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground transition-colors">Produtos</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Tibia Coins</span>
      </nav>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 text-center">
        Tibia Coins
      </h1>
      <p className="text-lg text-muted-foreground mb-2 text-center max-w-2xl">
        Escolha a operação que deseja realizar.
      </p>
      <p className="text-sm text-muted-foreground mb-24 text-center max-w-2xl">
        Compramos e vendemos Tibia Coins com a melhor cotação do mercado.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* BUY Card */}
        <Card className="flex flex-col h-full hover:border-primary/50 transition-colors duration-300 shadow-sm hover:shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl text-primary font-bold">
              Comprar
            </CardTitle>
            <CardDescription className="text-sm mt-2">
              Adquira de forma rápida e segura.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center pt-8 pb-8">
            <Link href="/products/tibia-coins/buy" className="w-full">
              <Button
                size="lg"
                className="cursor-pointer w-full text-lg h-16 font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Quero Comprar
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* SELL Card */}
        <Card className="flex flex-col h-full hover:border-primary/50 transition-colors duration-300 shadow-sm hover:shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold">Vender</CardTitle>
            <CardDescription className="text-sm mt-2">
              Venda com a melhor taxa e receba rapidamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center pt-8 pb-8">
            <Link href="/products/tibia-coins/sell" className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer w-full text-lg h-16 font-semibold border-primary text-primary hover:bg-primary/10 shadow-sm hover:shadow-md transition-all"
              >
                Quero Vender
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
