"use server";

import { getAuthHeaders } from "@/lib/auth";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.API_URL!;

export async function getAccountLoyalties(
  page = 1,
  limit = 10,
  search = "",
  orderBy = "createdAt",
  orderType = "desc",
  status?: string,
) {
  try {
    const url = new URL(`${API_URL}/product-account-loyalty/list`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (search) url.searchParams.append("search", search);
    if (orderBy) url.searchParams.append("orderBy", orderBy);
    if (orderType) url.searchParams.append("orderType", orderType);
    if (status) url.searchParams.append("status", status);

    const res = await fetch(url.toString(), {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar contas loyalty" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function createAccountLoyalty(formData: FormData) {
  try {
    const payload = Object.fromEntries(formData.entries());

    const dataToSend = {
      ...payload,
      points: Number(payload.points),
      percentage: Number(payload.percentage),
      price: Number(payload.price),
      promotionalPrice: payload.promotionalPrice
        ? Number(payload.promotionalPrice)
        : undefined,
      priceTibiaCoins: Number(payload.priceTibiaCoins),
      promotionalPriceTibiaCoins: payload.promotionalPriceTibiaCoins
        ? Number(payload.promotionalPriceTibiaCoins)
        : undefined,
      hasRecoveryKey: payload.hasRecoveryKey === "true" ? "true" : "false",
      safeAddress: payload.safeAddress === "true" ? "true" : "false",
    };

    const res = await fetch(`${API_URL}/product-account-loyalty/create`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao criar conta loyalty",
      };

    revalidatePath("/admin/dashboard/products/account-loyalty");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function editAccountLoyalty(id: string, formData: FormData) {
  try {
    const payload = Object.fromEntries(formData.entries());

    const dataToSend = {
      ...payload,
      points: payload.points ? Number(payload.points) : undefined,
      percentage: payload.percentage ? Number(payload.percentage) : undefined,
      price: payload.price ? Number(payload.price) : undefined,
      promotionalPrice: payload.promotionalPrice
        ? Number(payload.promotionalPrice)
        : undefined,
      priceTibiaCoins: payload.priceTibiaCoins
        ? Number(payload.priceTibiaCoins)
        : undefined,
      promotionalPriceTibiaCoins: payload.promotionalPriceTibiaCoins
        ? Number(payload.promotionalPriceTibiaCoins)
        : undefined,
      hasRecoveryKey: payload.hasRecoveryKey === "true" ? "true" : "false",
      safeAddress: payload.safeAddress === "true" ? "true" : "false",
    };

    // Remove empty fields
    Object.keys(dataToSend).forEach((key) => {
      if (
        (dataToSend as any)[key] === "" ||
        (dataToSend as any)[key] === undefined
      ) {
        delete (dataToSend as any)[key];
      }
    });

    const res = await fetch(`${API_URL}/product-account-loyalty/edit/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao editar conta loyalty",
      };

    revalidatePath("/admin/dashboard/products/account-loyalty");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function deleteAccountLoyalty(id: string) {
  try {
    const res = await fetch(`${API_URL}/product-account-loyalty/delete/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(false),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao deletar conta loyalty",
      };

    revalidatePath("/admin/dashboard/products/account-loyalty");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function toggleAccountLoyaltyStatus(
  id: string,
  currentStatus: "enable" | "disable",
) {
  try {
    const endpoint = currentStatus === "enable" ? "enable" : "disable";
    const res = await fetch(`${API_URL}/product-account-loyalty/${endpoint}/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(false),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao alterar status",
      };

    revalidatePath("/admin/dashboard/products/account-loyalty");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}
