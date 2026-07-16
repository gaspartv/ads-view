"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.API_URL!;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  return {
    "Content-Type": "application/json",
    ...(token ? { Cookie: `access_token=${token}` } : {}),
  };
}

export async function addStockBatch(data: {
  amount: number;
  costPrice: number;
  supplierName?: string;
  productId: string;
}) {
  try {
    const res = await fetch(`${API_URL}/stock-batch/add`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message || "Erro ao repor estoque." };
    }

    revalidatePath("/admin/dashboard/product");
    return { success: true, message: "Estoque adicionado com sucesso!" };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor." };
  }
}
