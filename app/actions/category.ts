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

export async function getCategoriesForSelect() {
  try {
    const res = await fetch(`${API_URL}/category/list-for-select`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar categorias para seleção" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function getCategories(
  page = 1, 
  limit = 10, 
  search = "", 
  orderBy = "createdAt", 
  orderType = "desc"
) {
  try {
    const url = new URL(`${API_URL}/category/list`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (search) url.searchParams.append("search", search);
    if (orderBy) url.searchParams.append("orderBy", orderBy);
    if (orderType) url.searchParams.append("orderType", orderType);

    const res = await fetch(url.toString(), {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar categorias" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name");
    const description = formData.get("description");

    const res = await fetch(`${API_URL}/category/create`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ name, description }),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao criar categoria",
      };

    revalidatePath("/admin/dashboard/category");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function editCategory(id: string, formData: FormData) {
  try {
    const name = formData.get("name");
    const description = formData.get("description");

    const res = await fetch(`${API_URL}/category/edit/${id}`, {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ name, description }),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao editar categoria",
      };

    revalidatePath("/admin/dashboard/category");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const res = await fetch(`${API_URL}/category/delete/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(false),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao deletar categoria",
      };

    revalidatePath("/admin/dashboard/category");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function toggleCategoryStatus(
  id: string,
  currentStatus: "enable" | "disable",
) {
  try {
    const endpoint = currentStatus === "enable" ? "enable" : "disable";
    const res = await fetch(`${API_URL}/category/${endpoint}/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(false),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao alterar status",
      };

    revalidatePath("/admin/dashboard/category");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function uploadCategoryImage(id: string, formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${API_URL}/category/upload/${id}/image`, {
      method: "POST",
      headers: {
        ...(token ? { Cookie: `access_token=${token}` } : {}),
      },
      body: formData, // fetch will automatically set the correct Content-Type with boundary for FormData
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro no upload da imagem",
      };

    revalidatePath("/admin/dashboard/category");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function deleteCategoryImage(categoryId: string, imageId: string) {
  try {
    const res = await fetch(
      `${API_URL}/category/delete/${categoryId}/image/${imageId}`,
      {
        method: "DELETE",
        headers: await getAuthHeaders(false),
      },
    );

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao remover imagem",
      };

    revalidatePath("/admin/dashboard/category");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function reorderCategoryImages(categoryId: string, imageIds: string[]) {
  try {
    const res = await fetch(`${API_URL}/category/reorder/${categoryId}/images`, {
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

    revalidatePath("/admin/dashboard/category");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}
