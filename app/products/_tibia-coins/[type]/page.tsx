import { TibiaCoinPackageCard } from "@/components/tibia-coin-package-card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";
import { getCompanyInfo } from "@/app/actions/company";

const API_URL = process.env.API_URL;

export async function generateMetadata() {
  const response = await getCompanyInfo();
  const company = response?.success ? response.data : null;

  return {
    title: "Tibia Coins - " + company?.name,
  };
}

async function getTibiaCoinsProducts(type: string) {
  try {
    const res = await fetch(
      `${API_URL}/product-tibia-coins/list/public?type=${type}`,
      {
        method: "GET",
        headers: await getAuthHeaders(),
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching tibia coins products:", error);
    return null;
  }
}

export default async function TibiaCoinsPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const apiType = type.toUpperCase();
  const response = await getTibiaCoinsProducts(apiType);

  const titleText =
    apiType === "SELL" ? "Vender Tibia Coins" : "Comprar Tibia Coins";

  if (!response || !Array.isArray(response) || response.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Erro ao carregar os produtos
        </h2>
        <Link href="/products/tibia-coins">
          <Button>Voltar</Button>
        </Link>
      </div>
    );
  }

  const product = response[0];
  const variables = product?.Variables || [];

  return (
    <div className="cursor-default flex flex-col min-h-screen bg-background font-sans pt-12 pb-24">
      <div className="w-full px-4 md:px-8">
        <nav className="flex items-center space-x-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Início
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/products"
            className="hover:text-foreground transition-colors"
          >
            Produtos
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/products/tibia-coins"
            className="hover:text-foreground transition-colors"
          >
            Tibia Coins
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium capitalize">
            {apiType.toLowerCase()}
          </span>
        </nav>
        <div className="relative flex items-center justify-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-center">
            {titleText}
          </h1>
        </div>

        {variables.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {variables.map((variable: any) => (
              <TibiaCoinPackageCard
                key={variable.id}
                variable={variable}
                product={product}
                type={apiType}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="text-xl font-semibold text-muted-foreground mb-4">
              Nenhum produto encontrado.
            </h3>
            <Link href="/products/tibia-coins">
              <Button variant="default">Voltar</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
