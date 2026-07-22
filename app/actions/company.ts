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

    let code = "";
    let urlString = host;
    if (!urlString.startsWith("http")) {
      urlString = `http://${urlString}`;
    }
    const url = new URL(urlString);
    const parts = url.hostname.split(".");
    // Ignora subdomínios como 'www' ou 'api' (ex: api.thygas-coins.com.br vira thygas-coins)
    if ((parts[0] === "www" || parts[0] === "api") && parts.length > 1) {
      code = parts[1];
    } else {
      code = parts[0];
    }

    const res = await fetch(`${API_URL}/company/info/${code}`, {
      method: "GET",
      headers: await getAuthHeaders(),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar dados da empresa" };
    }

    const data = await res.json();
    console.log({ data });
    return { success: true, data };
  } catch (error) {
    console.log({ error });
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}
