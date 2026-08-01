"use client";

import { useEffect } from "react";
import { useCompany } from "@/contexts/company-context";

const DEFAULT_FAVICON = "/favicon.ico";

/**
 * Atualiza dinamicamente o favicon da aba do navegador.
 * - Se a company tiver favicon configurado, usa ele.
 * - Caso contrário, usa o favicon padrão do sistema.
 * Funciona em conjunto com o generateMetadata (SSR) para cobrir
 * tanto o carregamento inicial quanto navegações client-side.
 */
export function FaviconInjector() {
  const { company } = useCompany();

  useEffect(() => {
    const faviconUrl = company?.favicon || DEFAULT_FAVICON;
    applyFavicon(faviconUrl);
  }, [company?.favicon]);

  return null;
}

function applyFavicon(url: string) {
  // Remove todos os <link rel="icon"> e variações existentes
  const selectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.remove());
  });

  // Insere o novo <link rel="icon">
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = url + "?v=" + Date.now(); // cache-bust para forçar atualização
  document.head.appendChild(link);
}
