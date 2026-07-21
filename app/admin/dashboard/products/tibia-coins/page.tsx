import { TibiaCoinsClient } from "./components/tibia-coins-client";
import { getProductTibiaCoins, getProductTibiaCoinsVariables } from "@/app/actions/product-tibia-coins";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Dashboard - Tibia Coins",
};

export default async function TibiaCoinsDashboardPage() {
  const [tibiaCoinsRes, variablesRes] = await Promise.all([
    getProductTibiaCoins(),
    getProductTibiaCoinsVariables(),
  ]);

  const tibiaCoins = Array.isArray(tibiaCoinsRes) ? tibiaCoinsRes : [];
  const variables = Array.isArray(variablesRes) ? variablesRes : [];

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
          <Link
            href="/admin/dashboard/products"
            className="hover:text-foreground transition-colors"
          >
            Produtos
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Tibia Coins</span>
        </nav>
      </div>

      <TibiaCoinsClient tibiaCoins={tibiaCoins} variables={variables} />
    </div>
  );
}
