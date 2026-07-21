import { getOrderById } from "@/app/actions/orders";
import { OrderDetails } from "./components/order-details";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Detalhes da Venda",
};

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const res = await getOrderById(params.id);

  if (!res.success || !res.data) {
    notFound();
  }

  const order = res.data;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Detalhes da Venda</h2>
      </div>
      <OrderDetails order={order} />
    </div>
  );
}
