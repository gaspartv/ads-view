"use server";

import { getAuthHeaders } from "@/lib/auth";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

export async function searchCustomerByWhatsapp(whatsapp: string) {
  try {
    const res = await fetch(`${API_URL}/customer/search?whatsapp=${encodeURIComponent(whatsapp)}`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar cliente" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function createCustomer(name: string, whatsappNumber?: string) {
  try {
    const res = await fetch(`${API_URL}/customer`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ name, whatsappNumber }),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao criar cliente",
      };

    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}
