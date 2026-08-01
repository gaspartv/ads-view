"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getAuthHeaders } from "@/lib/auth";
import { CompanyTheme } from "@/lib/theme";

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
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function getCompanyContact() {
  try {
    const headersList = await headers();
    const host =
      headersList.get("x-forwarded-host") || headersList.get("host") || "";

    let code = "";
    let urlString = host;
    if (!urlString.startsWith("http")) {
      urlString = `http://${urlString}`;
    }
    const url = new URL(urlString);
    const parts = url.hostname.split(".");
    if ((parts[0] === "www" || parts[0] === "api") && parts.length > 1) {
      code = parts[1];
    } else {
      code = parts[0];
    }

    const res = await fetch(`${API_URL}/company/info/${code}/contact`, {
      method: "GET",
      headers: await getAuthHeaders(),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar contatos da empresa" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function updateCompanyTheme(themeData: CompanyTheme) {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_URL}/company/theme`, {
      method: "PATCH",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(themeData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Erro ao atualizar o tema da empresa",
      };
    }

    const data = await res.json();
    revalidatePath("/", "layout");
    return { success: true, data };
  } catch (error) {
    console.error("Erro em updateCompanyTheme:", error);
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function getMyCompanyInfo() {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_URL}/company/my`, {
      method: "GET",
      headers: authHeaders,
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar dados da sua empresa" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error("Erro em getMyCompanyInfo:", error);
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function updateCompanyInfo(data: any) {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${API_URL}/company/edit`, {
      method: "PATCH",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.message || "Erro ao atualizar dados da empresa",
      };
    }

    const responseData = await res.json();
    revalidatePath("/admin/dashboard/company");
    return { success: true, data: responseData };
  } catch (error) {
    console.error("Erro em updateCompanyInfo:", error);
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function uploadCompanyLogo(formData: FormData) {
  try {
    const res = await fetch(`${API_URL}/company/upload/logo`, {
      method: "POST",
      headers: await getAuthHeaders(false),
      body: formData,
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao fazer upload da logo",
      };

    revalidatePath("/admin/dashboard/company");
    revalidatePath("/", "layout"); // invalida cache do layout raiz (getCompanyInfo)
    return { success: true, message: data.message, url: data.url };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function uploadCompanyFavicon(formData: FormData) {
  try {
    const res = await fetch(`${API_URL}/company/upload/favicon`, {
      method: "POST",
      headers: await getAuthHeaders(false),
      body: formData,
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao fazer upload do favicon",
      };

    revalidatePath("/admin/dashboard/company");
    revalidatePath("/", "layout"); // invalida cache do layout raiz (getCompanyInfo)
    return { success: true, message: data.message, url: data.url };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function uploadCompanyBanner(formData: FormData) {
  try {
    const res = await fetch(`${API_URL}/company/upload/banner`, {
      method: "POST",
      headers: await getAuthHeaders(false),
      body: formData,
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao fazer upload do banner",
      };

    revalidatePath("/admin/dashboard/company");
    revalidatePath("/", "layout"); // invalida cache do layout raiz (getCompanyInfo)
    return { success: true, message: data.message, url: data.url };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}
