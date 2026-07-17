import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientTable } from "./client-table";

const API_URL = process.env.API_URL;

export const metadata = {
  title: "Lista de Contas Loyalty - " + process.env.NEXT_PUBLIC_APP_NAME,
};

async function getLoyaltyAccounts() {
  try {
    const res = await fetch(
      `${API_URL}/product-account-loyalty/list/public?status=ativo`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative flex items-center justify-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-center">
            Contas Loyalty
          </h1>
        </div>

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
