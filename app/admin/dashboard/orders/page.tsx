import { OrderTable } from "./components/order-table";
import { getOrders } from "@/app/actions/orders";

export const metadata = {
  title: "Dashboard - Vendas",
};

export default async function OrdersDashboardPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const status =
    typeof searchParams?.status === "string" ? searchParams.status : undefined;

  const res = await getOrders(page, limit, status);
  const orders = res.success ? res.data?.data || [] : [];

  // A API agora retorna pagination no padrão
  const pagination =
    res.success && res.data?.pagination
      ? res.data.pagination
      : { total: orders.length, page, limit, totalPages: 1 };

  return (
    <div className="cursor-default flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Vendas</h2>
      </div>
      <OrderTable orders={orders} pagination={pagination} />
    </div>
  );
}
