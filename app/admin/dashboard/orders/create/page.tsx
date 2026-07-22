import { getCompanyInfo } from "@/app/actions/company";
import { CreateOrderForm } from "./components/create-order-form";

export async function generateMetadata() {
  const response = await getCompanyInfo();
  const company = response?.success ? response.data : null;

  return {
    title: "Nova Venda - " + company?.name,
  };
}

export default function CreateOrderPage() {
  return (
    <div className="cursor-default flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Criar Nova Venda</h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <CreateOrderForm />
      </div>
    </div>
  );
}
