import { ProductCard } from "@/components/product-card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const API_URL = process.env.API_URL;

async function getCategoryProducts(categoryId: string) {
  try {
    const res = await fetch(
      `${API_URL}/product/list/category?categoryId=${categoryId}`,
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
    console.error("Error fetching category products:", error);
    return null;
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await getCategoryProducts(id);

  if (!response) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Erro ao carregar a categoria
        </h2>
        <Link href="/">
          <Button>Voltar para o início</Button>
        </Link>
      </div>
    );
  }

  const products = response.data || [];

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Produtos da Categoria
          </h1>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
            <h3 className="text-xl font-semibold text-muted-foreground mb-4">
              Nenhum produto encontrado nesta categoria.
            </h3>
            <Link href="/">
              <Button variant="default">Explorar outras categorias</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
