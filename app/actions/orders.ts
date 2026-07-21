"use server";

import { getAuthHeaders } from "@/lib/auth";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.API_URL!;

export async function getOrders(
  page = 1,
  limit = 10,
  status?: string,
  customerId?: string,
) {
  try {
    const url = new URL(`${API_URL}/order/list`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (status) url.searchParams.append("status", status);
    if (customerId) url.searchParams.append("customerId", customerId);

    const res = await fetch(url.toString(), {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar vendas" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function getOrderById(id: string) {
  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar detalhes da venda" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function createOrder(dataToSend: any) {
  try {
    const res = await fetch(`${API_URL}/order`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao criar venda",
      };

    revalidatePath("/admin/dashboard/orders");
    return { success: true, message: "Venda criada com sucesso", data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const res = await fetch(`${API_URL}/order/${id}/status`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao atualizar status",
      };

    revalidatePath("/admin/dashboard/orders");
    revalidatePath(`/admin/dashboard/orders/${id}`);
    return { success: true, message: "Status atualizado com sucesso" };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function updateOrder(id: string, dataToSend: any) {
  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao atualizar venda",
      };

    revalidatePath("/admin/dashboard/orders");
    revalidatePath(`/admin/dashboard/orders/${id}`);
    return { success: true, message: "Venda atualizada com sucesso" };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}
