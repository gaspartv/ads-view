import { ProductCharacterCard } from "@/components/product-character-card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";
import { getCompanyInfo } from "@/app/actions/company";
import { CharacterFilters } from "@/components/character-filters";

const API_URL = process.env.API_URL;

export async function generateMetadata() {
  const response = await getCompanyInfo();
  const company = response?.success ? response.data : null;

  return {
    title: "Lista de personagens - " + company?.name,
  };
}

async function getCharacters(queryString: string) {
  try {
    const res = await fetch(
      `${API_URL}/product-character/list/public?status=ativo&${queryString}`,
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
    console.error("Error fetching characters:", error);
    return null;
  }
}

export default async function CharactersPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const query = new URLSearchParams();
  Object.entries(resolvedParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      query.set(key, value);
    } else if (Array.isArray(value)) {
      query.set(key, value[0]);
    }
  });

  const response = await getCharacters(query.toString());

  if (!response) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Erro ao carregar os personagens
        </h2>
        <Link href="/">
          <Button>Voltar para o início</Button>
        </Link>
      </div>
    );
  }

  const characters = response.data || [];

  const companyResponse = await getCompanyInfo();
  const company = companyResponse?.success ? companyResponse.data : null;
  const cardContent = company?.cardContent || [];

  return (
    <div className="cursor-default flex flex-col min-h-screen bg-background font-sans pt-12 pb-24">
      <div className="w-full px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <nav className="flex items-center space-x-1.5 text-xs text-muted-foreground">
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
            <span className="text-foreground font-medium">Personagens</span>
          </nav>
        </div>

        <CharacterFilters />

        <div className="flex-1 mt-4">
          {characters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {characters.map((character: any) => (
                <ProductCharacterCard
                  key={character.id}
                  character={character}
                  cardContent={cardContent}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
              <h3 className="text-xl font-semibold text-muted-foreground mb-4">
                Nenhum personagem encontrado com estes filtros.
              </h3>
              <Link href="/products/characters">
                <Button variant="default">Limpar Filtros</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
