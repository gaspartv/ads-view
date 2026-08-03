"use server";

import { getAuthHeaders } from "@/lib/auth";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.API_URL!;

export async function getProductTibiaCoins() {
  try {
    const res = await fetch(`${API_URL}/product-tibia-coins/list`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tibia coins products: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getProductTibiaCoins:", error);
    throw error;
  }
}

export async function editProductTibiaCoins(id: string, data: any) {
  try {
    const res = await fetch(`${API_URL}/product-tibia-coins/edit/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || `Failed to edit product: ${res.status}` };
    }

    revalidatePath("/admin/dashboard/products/tibia-coins");
    return { success: true };
  } catch (error: any) {
    console.error("Error in editProductTibiaCoins:", error);
    return { success: false, message: error.message || "Erro de conexão" };
  }
}

export async function toggleProductTibiaCoinsStatus(id: string, isActive: boolean) {
  try {
    const endpoint = isActive ? "disable" : "enable";
    const res = await fetch(`${API_URL}/product-tibia-coins/${endpoint}/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(false),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to change status: ${res.status}`);
    }

    revalidatePath("/admin/dashboard/products/tibia-coins");
    return { success: true };
  } catch (error) {
    console.error("Error in toggleProductTibiaCoinsStatus:", error);
    throw error;
  }
}

export async function getProductTibiaCoinsVariables() {
  try {
    const res = await fetch(`${API_URL}/product-tibia-coins/variables/list`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tibia coins variables: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getProductTibiaCoinsVariables:", error);
    throw error;
  }
}

export async function createStockBatch(data: any) {
  try {
    const res = await fetch(`${API_URL}/product-tibia-coins/stock-batch/create`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create stock batch: ${res.status}`);
    }

    revalidatePath("/admin/dashboard/products/tibia-coins");
    return { success: true };
  } catch (error) {
    console.error("Error in createStockBatch:", error);
    throw error;
  }
}

export async function createProductTibiaCoinsVariable(data: any) {
  try {
    const res = await fetch(`${API_URL}/product-tibia-coins/variables`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || `Failed to create variable: ${res.status}` };
    }

    revalidatePath("/admin/dashboard/products/tibia-coins");
    return { success: true };
  } catch (error: any) {
    console.error("Error in createProductTibiaCoinsVariable:", error);
    return { success: false, message: error.message || "Erro de conexão" };
  }
}

export async function updateProductTibiaCoinsVariable(id: string, data: any) {
  try {
    const res = await fetch(`${API_URL}/product-tibia-coins/variables/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || `Failed to update variable: ${res.status}` };
    }

    revalidatePath("/admin/dashboard/products/tibia-coins");
    return { success: true };
  } catch (error: any) {
    console.error("Error in updateProductTibiaCoinsVariable:", error);
    return { success: false, message: error.message || "Erro de conexão" };
  }
}

export async function toggleProductTibiaCoinsVariableStatus(id: string, isActive: boolean) {
  try {
    const endpoint = isActive ? "disable" : "enable";
    const res = await fetch(`${API_URL}/product-tibia-coins/variables/${endpoint}/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(false),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.message || `Failed to change variable status: ${res.status}` };
    }

    revalidatePath("/admin/dashboard/products/tibia-coins");
    return { success: true };
  } catch (error: any) {
    console.error("Error in toggleProductTibiaCoinsVariableStatus:", error);
    return { success: false, message: error.message || "Erro de conexão" };
  }
}

export async function deleteProductTibiaCoinsVariable(id: string) {
  try {
    const res = await fetch(`${API_URL}/product-tibia-coins/variable/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(false),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to delete variable: ${res.status}`);
    }

    revalidatePath("/admin/dashboard/products/tibia-coins");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteProductTibiaCoinsVariable:", error);
    throw error;
  }
}

export async function uploadProductTibiaCoinsVariableImage(variableId: string, formData: FormData) {
  try {
    const res = await fetch(`${API_URL}/product-tibia-coins/variables/upload/${variableId}/image`, {
      method: "POST",
      headers: await getAuthHeaders(false),
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to upload image: ${res.status}`);
    }

    revalidatePath("/admin/dashboard/products/tibia-coins");
    return { success: true, message: "Imagem enviada com sucesso" };
  } catch (error) {
    console.error("Error in uploadProductTibiaCoinsVariableImage:", error);
    return { success: false, message: "Erro ao enviar imagem" };
  }
}
