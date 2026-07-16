import { ProductTable } from "./components/product-table";
import { getProducts } from "@/app/actions/product";
import { getCategoriesForSelect } from "@/app/actions/category";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Dashboard - Produtos",
};

export default async function ProductDashboardPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const search =
    typeof searchParams?.search === "string" ? searchParams.search : "";
  const orderBy =
    typeof searchParams?.orderBy === "string" ? searchParams.orderBy : "createdAt";
  const orderType =
    typeof searchParams?.orderType === "string" ? searchParams.orderType : "desc";
  const status = typeof searchParams?.status === "string" ? searchParams.status : undefined;
  const type = typeof searchParams?.type === "string" ? searchParams.type : undefined;
  const featured = typeof searchParams?.featured === "string" ? searchParams.featured : undefined;
  const categoryId = typeof searchParams?.categoryId === "string" ? searchParams.categoryId : undefined;

  const [response, categoriesRes] = await Promise.all([
    getProducts(page, limit, search, orderBy, orderType, status, type, featured, categoryId),
    getCategoriesForSelect()
  ]);

  const products =
    response?.success && response.data?.data ? response.data.data : [];
  const pagination = 
    response?.success && response.data?.pagination ? response.data.pagination : { total: 0, page: 1, limit: 10, totalPages: 1 };
  
  const categories = categoriesRes?.success && categoriesRes.data ? categoriesRes.data : [];

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
          <span className="text-foreground font-medium">Produtos</span>
        </nav>
      </div>

      <ProductTable products={products} categories={categories} pagination={pagination} />
    </div>
  );
}
