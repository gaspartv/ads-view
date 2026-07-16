import { ProductCard } from "./product-card";

interface CategorySectionProps {
  category: any;
}

export function CategorySection({ category }: CategorySectionProps) {
  if (!category || !category.Products || category.Products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 relative w-full">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-muted-foreground mt-2 max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
          {/* Opcional: Um botão de "Ver todos" aqui no futuro */}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {category.Products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
