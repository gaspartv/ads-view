"use server";

import { getAuthHeaders } from "@/lib/auth";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.API_URL!;

export async function getCharacters(
  page = 1,
  limit = 10,
  search = "",
  orderBy = "order",
  orderType = "asc",
  status?: string,
  featured?: string,
) {
  try {
    const url = new URL(`${API_URL}/product-character/list`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (search) url.searchParams.append("search", search);
    if (orderBy) url.searchParams.append("orderBy", orderBy);
    if (orderType) url.searchParams.append("orderType", orderType);
    if (status) url.searchParams.append("status", status);
    if (featured) url.searchParams.append("featured", featured);

    const res = await fetch(url.toString(), {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar personagens" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function createCharacter(formData: FormData) {
  try {
    const payload = Object.fromEntries(formData.entries());

    const dataToSend = {
      ...payload,
      isFeatured: payload.isFeatured === "true" ? "true" : "false",
      price: Number(payload.price),
      promotionalPrice: payload.promotionalPrice
        ? Number(payload.promotionalPrice)
        : undefined,
      priceTibiaCoins: Number(payload.priceTibiaCoins),
      promotionalPriceTibiaCoins: payload.promotionalPriceTibiaCoins
        ? Number(payload.promotionalPriceTibiaCoins)
        : undefined,
      level: Number(payload.level),
      loyalty: Number(payload.loyalty),
      magicLevel: payload.magicLevel,
      fistFighting: payload.fistFighting,
      swordFighting: payload.swordFighting,
      axeFighting: payload.axeFighting,
      clubFighting: payload.clubFighting,
      distanceFighting: payload.distanceFighting,
      shielding: payload.shielding,
      fishing: payload.fishing,
      charmPoints: Number(payload.charmPoints),
      inventoryValue: payload.inventoryValue
        ? Number(payload.inventoryValue)
        : undefined,
      charmExpansion: payload.charmExpansion === "true" ? "true" : "false",
      transferable: payload.transferable === "true" ? "true" : "false",
      hasRecoveryKey: payload.hasRecoveryKey === "true" ? "true" : "false",
      safeAddress: payload.safeAddress === "true" ? "true" : "false",
      charmsId: payload.charmsId ? JSON.parse(payload.charmsId as string) : [],
      mountsId: payload.mountsId ? JSON.parse(payload.mountsId as string) : [],
      outfits: payload.outfits ? JSON.parse(payload.outfits as string) : [],
      metadata: payload.metadata ? JSON.parse(payload.metadata as string) : undefined,
    };

    const res = await fetch(`${API_URL}/product-character/create`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao criar personagem",
      };

    revalidatePath("/admin/dashboard/products/characters");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function editCharacter(id: string, formData: FormData) {
  try {
    const payload = Object.fromEntries(formData.entries());

    const dataToSend = {
      ...payload,
      isFeatured: payload.isFeatured === "true" ? "true" : "false",
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
      level: payload.level ? Number(payload.level) : undefined,
      loyalty: payload.loyalty ? Number(payload.loyalty) : undefined,
      magicLevel: payload.magicLevel ? payload.magicLevel : undefined,
      fistFighting: payload.fistFighting ? payload.fistFighting : undefined,
      swordFighting: payload.swordFighting ? payload.swordFighting : undefined,
      axeFighting: payload.axeFighting ? payload.axeFighting : undefined,
      clubFighting: payload.clubFighting ? payload.clubFighting : undefined,
      distanceFighting: payload.distanceFighting ? payload.distanceFighting : undefined,
      shielding: payload.shielding ? payload.shielding : undefined,
      fishing: payload.fishing ? payload.fishing : undefined,
      charmPoints: payload.charmPoints
        ? Number(payload.charmPoints)
        : undefined,
      inventoryValue: payload.inventoryValue
        ? Number(payload.inventoryValue)
        : undefined,
      charmExpansion: payload.charmExpansion === "true" ? "true" : "false",
      transferable: payload.transferable === "true" ? "true" : "false",
      hasRecoveryKey: payload.hasRecoveryKey === "true" ? "true" : "false",
      safeAddress: payload.safeAddress === "true" ? "true" : "false",
      charmsId: payload.charmsId
        ? JSON.parse(payload.charmsId as string)
        : undefined,
      mountsId: payload.mountsId
        ? JSON.parse(payload.mountsId as string)
        : undefined,
      outfits: payload.outfits
        ? JSON.parse(payload.outfits as string)
        : undefined,
      metadata: payload.metadata
        ? JSON.parse(payload.metadata as string)
        : undefined,
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

    const res = await fetch(`${API_URL}/product-character/edit/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao editar personagem",
      };

    revalidatePath("/admin/dashboard/products/characters");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function deleteCharacter(id: string) {
  try {
    const res = await fetch(`${API_URL}/product-character/delete/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(false),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao deletar personagem",
      };

    revalidatePath("/admin/dashboard/products/characters");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function toggleCharacterStatus(
  id: string,
  currentStatus: "enable" | "disable",
) {
  try {
    const endpoint = currentStatus === "enable" ? "enable" : "disable";
    const res = await fetch(`${API_URL}/product-character/${endpoint}/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(false),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao alterar status",
      };

    revalidatePath("/admin/dashboard/products/characters");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function uploadCharacterImage(
  characterId: string,
  formData: FormData,
) {
  try {
    const res = await fetch(
      `${API_URL}/product-character/upload/${characterId}/image`,
      {
        method: "POST",
        headers: await getAuthHeaders(false),
        body: formData,
      },
    );

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao fazer upload da imagem",
      };

    revalidatePath("/admin/dashboard/products/characters");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function deleteCharacterImage(
  characterId: string,
  imageId: string,
) {
  try {
    const res = await fetch(
      `${API_URL}/product-character/delete/${characterId}/image/${imageId}`,
      {
        method: "DELETE",
        headers: await getAuthHeaders(false),
      },
    );

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao deletar imagem",
      };

    revalidatePath("/admin/dashboard/products/characters");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function reorderCharacterImages(
  characterId: string,
  imageIds: string[],
) {
  try {
    const res = await fetch(
      `${API_URL}/product-character/reorder/${characterId}/images`,
      {
        method: "PATCH",
        headers: await getAuthHeaders(true),
        body: JSON.stringify({ imageIds }),
      },
    );

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao reordenar imagens",
      };

    revalidatePath("/admin/dashboard/products/characters");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function reorderCharacters(characterIds: string[]) {
  try {
    const res = await fetch(`${API_URL}/product-character/reorder`, {
      method: "PATCH",
      headers: await getAuthHeaders(true),
      body: JSON.stringify({ characterIds }),
    });

    const data = await res.json();
    if (!res.ok)
      return {
        success: false,
        message: data.message || "Erro ao reordenar personagens",
      };

    revalidatePath("/admin/dashboard/products/characters");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}

export async function getCharacterPublic(slug: string) {
  try {
    const res = await fetch(`${API_URL}/product-character/find/${slug}/public`, {
      headers: await getAuthHeaders(),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return { success: false, message: "Erro ao buscar personagem" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: "Erro de conexão com o servidor" };
  }
}
