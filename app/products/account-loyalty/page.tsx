import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientTable } from "./client-table";
import { getAuthHeaders } from "@/lib/auth";
import { getCompanyInfo } from "@/app/actions/company";

const API_URL = process.env.API_URL;

export async function generateMetadata() {
  const response = await getCompanyInfo();
  const company = response?.success ? response.data : null;

  return {
    title: "Lista de Contas Loyalty - " + company?.name,
  };
}

async function getLoyaltyAccounts() {
  try {
    const res = await fetch(
      `${API_URL}/product-account-loyalty/list/public?status=ativo`,
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
    console.error("Error fetching account loyalty:", error);
    return null;
  }
}

export default async function AccountLoyaltyPage() {
  const response = await getLoyaltyAccounts();

  if (!response) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Erro ao carregar as contas de loyalty
        </h2>
        <Link href="/">
          <Button>Voltar para o início</Button>
        </Link>
      </div>
    );
  }

  const accounts = response.data || [];

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
          <span className="text-foreground font-medium">Contas Loyalty</span>
        </nav>

        {accounts.length > 0 ? (
          <ClientTable accounts={accounts} />
        ) : (
          <div className="py-24 text-center border rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="text-xl font-semibold text-muted-foreground mb-4">
              Nenhuma conta encontrada.
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
