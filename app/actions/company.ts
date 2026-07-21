"use server";

import { getAuthHeaders } from "@/lib/auth";

const API_URL = process.env.API_URL!;

export async function getCompanyInfo(code: string) {
  try {
    const res = await fetch(`${API_URL}/company/info/${code}`, {
      method: "GET",
      headers: await getAuthHeaders(),
      next: { revalidate: 3600 }, // Cache por 1 hora (ajuste conforme necessário)
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar dados da empresa" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}
