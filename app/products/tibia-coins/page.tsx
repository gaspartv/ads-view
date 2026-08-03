import { TibiaCoinDynamicCard } from "@/components/tibia-coin-dynamic-card";
import { TibiaCoinsTabs } from "@/components/tibia-coins-tabs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getAuthHeaders } from "@/lib/auth";
import { getCompanyInfo } from "@/app/actions/company";

const API_URL = process.env.API_URL;

export async function generateMetadata() {
  const response = await getCompanyInfo();
  const company = response?.success ? response.data : null;

  return {
    title: "Tibia Coins - " + (company?.name || "Lojas"),
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
    console.error(`Error fetching tibia coins products (${type}):`, error);
    return null;
  }
}

export default async function TibiaCoinsV2Page() {
  // Buscar BUY e SELL concorrentemente
  const [buyResponse, sellResponse] = await Promise.all([
    getTibiaCoinsProducts("BUY"),
    getTibiaCoinsProducts("SELL"),
  ]);

  const buyProduct =
    Array.isArray(buyResponse) && buyResponse.length > 0
      ? buyResponse[0]
      : null;
  const sellProduct =
    Array.isArray(sellResponse) && sellResponse.length > 0
      ? sellResponse[0]
      : null;

  const hasBuy = buyProduct?.Variables?.length > 0;
  const hasSell = sellProduct?.Variables?.length > 0;
  const bothHaveContent = hasBuy && hasSell;

  const buyCard = (
    <div className="flex flex-col items-center w-full">
      <TibiaCoinDynamicCard product={buyProduct} type="BUY" />
    </div>
  );

  const sellCard = (
    <div className="flex flex-col items-center w-full">
      <TibiaCoinDynamicCard product={sellProduct} type="SELL" />
    </div>
  );

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
          <span className="text-foreground font-medium">Tibia Coins</span>
        </nav>

        <div className="w-full">
          <TibiaCoinsTabs
            buyCard={buyCard}
            sellCard={sellCard}
            hasBuy={hasBuy}
            hasSell={hasSell}
          />
        </div>
      </div>
    </div>
  );
}
