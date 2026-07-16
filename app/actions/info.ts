"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  return {
    ...(token ? { Cookie: `access_token=${token}` } : {}),
    "Content-Type": "application/json",
  };
}

export async function getWorlds() {
  try {
    const res = await fetch(`${API_URL}/info/list/worlds`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return { success: false, data: [] };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function getCharms() {
  try {
    const res = await fetch(`${API_URL}/info/list/charms`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return { success: false, data: [] };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function getOutfits() {
  try {
    const res = await fetch(`${API_URL}/info/list/outfits`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return { success: false, data: [] };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function getMounts() {
  try {
    const res = await fetch(`${API_URL}/info/list/mounts`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return { success: false, data: [] };
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [] };
  }
}
