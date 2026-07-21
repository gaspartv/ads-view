"use server";

import { getAuthHeaders } from "@/lib/auth";

const API_URL = process.env.API_URL!;

export async function getHomeData() {
  try {
    const res = await fetch(`${API_URL}/category/list-for-home`, {
      method: "GET",
      headers: await getAuthHeaders(),
      next: { revalidate: 60 }, // Cache por 60 segundos
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar dados da vitrine" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}
