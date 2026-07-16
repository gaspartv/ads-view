"use server";

import { encrypt } from "../lib/crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type ActionState = {
  success: boolean;
  message: string;
  data?: any;
};

const API_URL = process.env.API_URL!;

export async function signUpAction(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !email || !password) {
    return { success: false, message: "Campos obrigatórios faltando." };
  }

  try {
    const emailHash = await encrypt(email);
    const passwordHash = await encrypt(password);

    const sk = process.env.APP_SECRET_KEY;
    if (!sk) {
      throw new Error("Missing APP_SECRET_KEY in environment");
    }

    const response = await fetch(`${API_URL}/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        sk: sk,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        emailHash,
        passwordHash,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || "Erro ao criar usuário.",
      };
    }

    return {
      success: true,
      message: "Usuário criado com sucesso. Você já pode fazer login.",
    };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { success: false, message: "Erro interno no servidor." };
  }
}

export async function signInAction(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "E-mail e senha são obrigatórios." };
  }

  let isSuccess = false;

  try {
    const emailHash = await encrypt(email);
    const passwordHash = await encrypt(password);

    const response = await fetch(`${API_URL}/user/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailHash,
        passwordHash,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || "Credenciais inválidas.",
      };
    }

    const data = await response.json();

    if (data.accessToken) {
      const cookieStore = await cookies();

      cookieStore.set("access_token", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // Assume default 1 day matching backend SESSION_EXPIRES_IN_DAY
        maxAge: 24 * 60 * 60,
      });

      isSuccess = true;
    }
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { success: false, message: "Erro interno no servidor." };
  }

  if (isSuccess) {
    const callbackUrl = formData.get("callbackUrl") as string || "/";
    redirect(callbackUrl);
  }

  return { success: false, message: "Não foi possível concluir o login." };
}
