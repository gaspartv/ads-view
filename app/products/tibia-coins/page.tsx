import { TibiaCoinPackageCard } from "@/components/tibia-coin-package-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const API_URL = process.env.API_URL;

async function getTibiaCoinsProducts() {
  try {
    const res = await fetch(`${API_URL}/product-tibia-coins/list/public`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

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

export default async function TibiaCoinsPage() {
  const response = await getTibiaCoinsProducts();

  if (!response || !Array.isArray(response) || response.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Erro ao carregar os produtos
        </h2>
        <Link href="/">
          <Button>Voltar para o início</Button>
        </Link>
      </div>
    );
  }

  const product = response[0];
  const variables = product?.Variables || [];

  return (
    <div className="cursor-default flex flex-col min-h-screen bg-background font-sans pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative flex items-center justify-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-center">
            Tibia Coins
          </h1>
        </div>

        {variables.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {variables.map((variable: any) => (
              <TibiaCoinPackageCard
                key={variable.id}
                variable={variable}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="text-xl font-semibold text-muted-foreground mb-4">
              Nenhum produto encontrado.
            </h3>
            <Link href="/">
              <Button variant="default">Voltar para o início</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
