"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.API_URL!;

async function getAuthHeaders(includeContentType = true) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const headers: Record<string, string> = {
    ...(token ? { Cookie: `access_token=${token}` } : {}),
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

export async function getProducts(
  page = 1,
  limit = 10,
  search = "",
  orderBy = "createdAt",
  orderType = "desc",
  status?: string,
  type?: string,
  featured?: string,
  categoryId?: string
) {
  try {
    const url = new URL(`${API_URL}/product/list`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (search) url.searchParams.append("search", search);
    if (orderBy) url.searchParams.append("orderBy", orderBy);
    if (orderType) url.searchParams.append("orderType", orderType);
    if (status) url.searchParams.append("status", status);
    if (type) url.searchParams.append("type", type);
    if (featured) url.searchParams.append("featured", featured);
    if (categoryId) url.searchParams.append("categoryId", categoryId);

    const res = await fetch(url.toString(), {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar produtos" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const payload = Object.fromEntries(formData.entries());

    // Format specific fields for create
    const dataToSend = {
      ...payload,
      isFixed: payload.isFixed === "true",
      featured: payload.featured === "true",
      price: Number(payload.price),
      promotionalPrice: payload.promotionalPrice ? Number(payload.promotionalPrice) : undefined,
      amount: Number(payload.amount),
      multiples: Number(payload.multiples),
      costPrice: Number(payload.costPrice),
      categoryIds: payload.categoryIds ? JSON.parse(payload.categoryIds as string) : [],
    };

    const res = await fetch(`${API_URL}/product/create`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao criar produto",
      };

    revalidatePath("/admin/dashboard/product");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function editProduct(id: string, formData: FormData) {
  try {
    const payload = Object.fromEntries(formData.entries());

    // Format specific fields for edit
    const dataToSend = {
      ...payload,
      isFixed: payload.isFixed === "true",
      featured: payload.featured === "true",
      price: Number(payload.price),
      promotionalPrice: payload.promotionalPrice ? Number(payload.promotionalPrice) : undefined,
      amount: Number(payload.amount),
      multiples: Number(payload.multiples),
      categoryIds: payload.categoryIds ? JSON.parse(payload.categoryIds as string) : undefined,
    };

    // Remove empty fields
    Object.keys(dataToSend).forEach(key => {
      if ((dataToSend as any)[key] === "" || (dataToSend as any)[key] === undefined) {
        delete (dataToSend as any)[key];
      }
    });

    const res = await fetch(`${API_URL}/product/edit/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao editar produto",
      };

    revalidatePath("/admin/dashboard/product");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/product/delete/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(false),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao deletar produto",
      };

    revalidatePath("/admin/dashboard/product");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function toggleProductStatus(
  id: string,
  currentStatus: "enable" | "disable",
) {
  try {
    const endpoint = currentStatus === "enable" ? "enable" : "disable";
    const res = await fetch(`${API_URL}/product/${endpoint}/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(false),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao alterar status",
      };

    revalidatePath("/admin/dashboard/product");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function uploadProductImage(productId: string, formData: FormData) {
  try {
    const res = await fetch(`${API_URL}/product/upload/${productId}/image`, {
      method: "POST",
      headers: await getAuthHeaders(false),
      body: formData,
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao fazer upload da imagem",
      };

    revalidatePath("/admin/dashboard/product");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function deleteProductImage(productId: string, imageId: string) {
  try {
    const res = await fetch(`${API_URL}/product/delete/${productId}/image/${imageId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(false),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao deletar imagem",
      };

    revalidatePath("/admin/dashboard/product");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function reorderProductImages(productId: string, imageIds: string[]) {
  try {
    const res = await fetch(`${API_URL}/product/reorder/${productId}/images`, {
      method: "PATCH",
      headers: await getAuthHeaders(true),
      body: JSON.stringify({ imageIds }),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao reordenar imagens",
      };

    revalidatePath("/admin/dashboard/product");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}
