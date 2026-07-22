"use server";

import { headers } from "next/headers";
import { getAuthHeaders } from "@/lib/auth";

const API_URL = process.env.API_URL!;

export async function getCompanyInfo() {
  try {
    const headersList = await headers();
    const host =
      headersList.get("x-forwarded-host") || headersList.get("host") || "";
    // Remove porta se existir (ex: "localhost:3000" -> "localhost")
    const hostname = host.split(":")[0];

    const res = await fetch(`${API_URL}/company/info/${hostname}`, {
      method: "GET",
      headers: await getAuthHeaders(),
      next: { revalidate: 3600 },
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
