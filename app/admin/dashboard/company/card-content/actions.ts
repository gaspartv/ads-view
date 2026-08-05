'use server';

import { getAuthHeaders } from "@/lib/auth";

const API_URL = process.env.API_URL!;

export async function getCardContent() {
  try {
    const res = await fetch(`${API_URL}/product-character/card-content`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
       console.error('Failed to get card content, status:', res.status);
       return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to get card content', error);
    return [];
  }
}

export async function saveCardContent(cardContent: string[]) {
  try {
    const res = await fetch(`${API_URL}/product-character/card-content`, {
      method: "PATCH",
      headers: await getAuthHeaders(true),
      body: JSON.stringify({ cardContent }),
    });

    if (!res.ok) {
       return { success: false, error: 'Falha ao salvar configuração' };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to save card content', error);
    return { success: false, error: 'Falha ao salvar configuração' };
  }
}
