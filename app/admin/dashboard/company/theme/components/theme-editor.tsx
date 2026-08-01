"use client";

import { useState, useEffect, useRef } from "react";
import { CompanyTheme, ThemeColorPalette } from "@/lib/theme";
import { updateCompanyTheme } from "@/app/actions/company";
import { useCompany } from "@/contexts/company-context";
import { toast } from "sonner";
import {
  Palette,
  RotateCcw,
  Save,
  Sun,
  Moon,
  Sparkles,
  Check,
  Layers,
  Layout,
  ShoppingBag,
  Info,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ThemeEditorProps {
  initialTheme?: CompanyTheme | null;
}

const PRESETS: Array<{
  id: string;
  name: string;
  description: string;
  theme: CompanyTheme;
  previewColor: string;
}> = [
  {
    id: "emerald",
    name: "Verde Esmeralda (Padrão)",
    description: "Vibrante, moderno e otimizado para e-commerce.",
    previewColor: "#10b981",
    theme: {
      light: {
        primary: "oklch(0.65 0.22 150)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.65 0.22 150)",
        background: "oklch(0.99 0.005 150)",
        foreground: "oklch(0.15 0.02 150)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.02 150)",
        secondary: "oklch(0.96 0.02 150)",
        secondaryForeground: "oklch(0.2 0.05 150)",
        accent: "oklch(0.96 0.03 150)",
        border: "oklch(0.92 0.02 150)",
        sidebar: "oklch(0.98 0.01 150)",
        sidebarForeground: "oklch(0.15 0.02 150)",
      },
      dark: {
        primary: "oklch(0.65 0.22 150)",
        primaryForeground: "oklch(0.15 0.02 150)",
        primaryOutline: "oklch(0.65 0.22 150)",
        background: "oklch(0.12 0.02 150)",
        foreground: "oklch(0.98 0.01 150)",
        card: "oklch(0.14 0.02 150)",
        cardForeground: "oklch(0.98 0.01 150)",
        secondary: "oklch(0.2 0.03 150)",
        secondaryForeground: "oklch(0.98 0.01 150)",
        accent: "oklch(0.22 0.04 150)",
        border: "oklch(0.2 0.03 150)",
        sidebar: "oklch(0.14 0.02 150)",
        sidebarForeground: "oklch(0.98 0.01 150)",
      },
      radius: "0.75rem",
    },
  },
  {
    id: "ocean",
    name: "Azul Oceano",
    description: "Elegante, seguro e confiável.",
    previewColor: "#2563eb",
    theme: {
      light: {
        primary: "oklch(0.55 0.25 260)",
        primaryForeground: "oklch(0.98 0.01 260)",
        primaryOutline: "oklch(0.55 0.25 260)",
        background: "oklch(0.99 0.01 260)",
        foreground: "oklch(0.15 0.03 260)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.03 260)",
        secondary: "oklch(0.96 0.03 260)",
        secondaryForeground: "oklch(0.2 0.05 260)",
        accent: "oklch(0.95 0.04 260)",
        border: "oklch(0.92 0.03 260)",
        sidebar: "oklch(0.98 0.01 260)",
        sidebarForeground: "oklch(0.15 0.03 260)",
        chart1: "oklch(0.6 0.2 260)",
        chart2: "oklch(0.7 0.15 250)",
        chart3: "oklch(0.5 0.15 270)",
      },
      dark: {
        primary: "oklch(0.65 0.2 260)",
        primaryForeground: "oklch(0.1 0.02 260)",
        primaryOutline: "oklch(0.65 0.2 260)",
        background: "oklch(0.12 0.02 260)",
        foreground: "oklch(0.98 0.01 260)",
        card: "oklch(0.15 0.02 260)",
        cardForeground: "oklch(0.98 0.01 260)",
        secondary: "oklch(0.25 0.05 260)",
        secondaryForeground: "oklch(0.98 0.01 260)",
        accent: "oklch(0.3 0.06 260)",
        border: "oklch(0.25 0.04 260)",
        sidebar: "oklch(0.12 0.02 260)",
        sidebarForeground: "oklch(0.98 0.01 260)",
        chart1: "oklch(0.65 0.2 260)",
        chart2: "oklch(0.75 0.15 250)",
        chart3: "oklch(0.55 0.15 270)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "ruby",
    name: "Rubi Carmesim",
    description: "Intenso, quente e apaixonante.",
    previewColor: "#e11d48",
    theme: {
      light: {
        primary: "oklch(0.55 0.22 15)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.55 0.22 15)",
        background: "oklch(0.99 0.01 15)",
        foreground: "oklch(0.15 0.05 15)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.05 15)",
        secondary: "oklch(0.96 0.03 15)",
        secondaryForeground: "oklch(0.25 0.08 15)",
        accent: "oklch(0.95 0.04 15)",
        border: "oklch(0.92 0.03 15)",
        sidebar: "oklch(0.99 0.01 15)",
        sidebarForeground: "oklch(0.15 0.05 15)",
        chart1: "oklch(0.6 0.2 15)",
        chart2: "oklch(0.7 0.15 25)",
        chart3: "oklch(0.5 0.15 5)",
      },
      dark: {
        primary: "oklch(0.6 0.22 15)",
        primaryForeground: "oklch(0.1 0.02 15)",
        primaryOutline: "oklch(0.6 0.22 15)",
        background: "oklch(0.12 0.03 15)",
        foreground: "oklch(0.98 0.02 15)",
        card: "oklch(0.15 0.03 15)",
        cardForeground: "oklch(0.98 0.02 15)",
        secondary: "oklch(0.25 0.05 15)",
        secondaryForeground: "oklch(0.98 0.02 15)",
        accent: "oklch(0.3 0.06 15)",
        border: "oklch(0.25 0.04 15)",
        sidebar: "oklch(0.12 0.03 15)",
        sidebarForeground: "oklch(0.98 0.02 15)",
        chart1: "oklch(0.6 0.2 15)",
        chart2: "oklch(0.7 0.15 25)",
        chart3: "oklch(0.5 0.15 5)",
      },
      radius: "0.25rem",
    },
  },
  {
    id: "amber",
    name: "Âmbar Dourado",
    description: "Luxuoso, chamativo e premium.",
    previewColor: "#d97706",
    theme: {
      light: {
        primary: "oklch(0.65 0.18 70)",
        primaryForeground: "oklch(0.1 0.05 70)",
        primaryOutline: "oklch(0.65 0.18 70)",
        background: "oklch(0.99 0.02 70)",
        foreground: "oklch(0.2 0.05 70)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.2 0.05 70)",
        secondary: "oklch(0.94 0.04 70)",
        secondaryForeground: "oklch(0.25 0.08 70)",
        accent: "oklch(0.92 0.05 70)",
        border: "oklch(0.88 0.05 70)",
        sidebar: "oklch(0.1 0.02 70)",
        sidebarForeground: "oklch(0.95 0.05 70)",
        chart1: "oklch(0.65 0.18 70)",
        chart2: "oklch(0.7 0.15 85)",
        chart3: "oklch(0.5 0.12 50)",
      },
      dark: {
        primary: "oklch(0.7 0.18 70)",
        primaryForeground: "oklch(0.1 0.05 70)",
        primaryOutline: "oklch(0.7 0.18 70)",
        background: "oklch(0.15 0.03 70)",
        foreground: "oklch(0.95 0.05 70)",
        card: "oklch(0.2 0.04 70)",
        cardForeground: "oklch(0.95 0.05 70)",
        secondary: "oklch(0.3 0.05 70)",
        secondaryForeground: "oklch(0.95 0.05 70)",
        accent: "oklch(0.35 0.06 70)",
        border: "oklch(0.3 0.05 70)",
        sidebar: "oklch(0.1 0.02 70)",
        sidebarForeground: "oklch(0.95 0.05 70)",
        chart1: "oklch(0.7 0.18 70)",
        chart2: "oklch(0.8 0.15 85)",
        chart3: "oklch(0.6 0.12 50)",
      },
      radius: "1rem",
    },
  },
  {
    id: "monochrome",
    name: "Minimalista Mono",
    description: "Sóbrio, alto contraste, focado no conteúdo.",
    previewColor: "#111827",
    theme: {
      light: {
        primary: "oklch(0.2 0 0)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.2 0 0)",
        background: "oklch(0.99 0 0)",
        foreground: "oklch(0.1 0 0)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.1 0 0)",
        secondary: "oklch(0.95 0 0)",
        secondaryForeground: "oklch(0.2 0 0)",
        accent: "oklch(0.92 0 0)",
        border: "oklch(0.9 0 0)",
        sidebar: "oklch(0.98 0 0)",
        sidebarForeground: "oklch(0.1 0 0)",
        chart1: "oklch(0.3 0 0)",
        chart2: "oklch(0.5 0 0)",
        chart3: "oklch(0.7 0 0)",
      },
      dark: {
        primary: "oklch(0.95 0 0)",
        primaryForeground: "oklch(0.1 0 0)",
        primaryOutline: "oklch(0.95 0 0)",
        background: "oklch(0.1 0 0)",
        foreground: "oklch(0.98 0 0)",
        card: "oklch(0.15 0 0)",
        cardForeground: "oklch(0.98 0 0)",
        secondary: "oklch(0.25 0 0)",
        secondaryForeground: "oklch(0.98 0 0)",
        accent: "oklch(0.3 0 0)",
        border: "oklch(0.25 0 0)",
        sidebar: "oklch(0.12 0 0)",
        sidebarForeground: "oklch(0.98 0 0)",
        chart1: "oklch(0.8 0 0)",
        chart2: "oklch(0.6 0 0)",
        chart3: "oklch(0.4 0 0)",
      },
      radius: "0rem",
    },
  },
  {
    id: "neon-cyberpunk",
    name: "Cyberpunk Neon",
    description: "Escuro, tons vibrantes de rosa e roxo.",
    previewColor: "#d946ef",
    theme: {
      light: {
        primary: "oklch(0.6 0.25 320)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.6 0.25 320)",
        background: "oklch(0.98 0.02 320)",
        foreground: "oklch(0.15 0.05 320)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.05 320)",
        secondary: "oklch(0.95 0.05 300)",
        secondaryForeground: "oklch(0.25 0.1 300)",
        accent: "oklch(0.92 0.08 300)",
        border: "oklch(0.9 0.05 320)",
        sidebar: "oklch(0.98 0.02 320)",
        sidebarForeground: "oklch(0.15 0.05 320)",
        chart1: "oklch(0.6 0.25 320)",
        chart2: "oklch(0.6 0.2 280)",
        chart3: "oklch(0.7 0.2 340)",
      },
      dark: {
        primary: "oklch(0.65 0.25 320)",
        primaryForeground: "oklch(0.1 0 0)",
        primaryOutline: "oklch(0.65 0.25 320)",
        background: "oklch(0.1 0.05 300)",
        foreground: "oklch(0.95 0.02 300)",
        card: "oklch(0.15 0.08 300)",
        cardForeground: "oklch(0.95 0.02 300)",
        secondary: "oklch(0.25 0.1 280)",
        secondaryForeground: "oklch(0.95 0.02 300)",
        accent: "oklch(0.3 0.15 280)",
        border: "oklch(0.25 0.1 300)",
        sidebar: "oklch(0.1 0.05 300)",
        sidebarForeground: "oklch(0.95 0.02 300)",
        chart1: "oklch(0.65 0.25 320)",
        chart2: "oklch(0.65 0.2 280)",
        chart3: "oklch(0.75 0.2 340)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "midnight-checkout",
    name: "Checkout Meia-Noite",
    description:
      "Tons escuros e sofisticados de azul marinho com detalhes contrastantes, focado em alta conversão noturna.",
    previewColor: "#0f172a",
    theme: {
      light: {
        primary: "oklch(0.5 0.2 250)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.5 0.2 250)",
        background: "oklch(0.98 0.01 240)",
        foreground: "oklch(0.15 0.03 240)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.03 240)",
        secondary: "oklch(0.95 0.02 240)",
        secondaryForeground: "oklch(0.2 0.05 240)",
        accent: "oklch(0.92 0.03 240)",
        border: "oklch(0.9 0.02 240)",
        sidebar: "oklch(0.98 0.01 240)",
        sidebarForeground: "oklch(0.15 0.03 240)",
        chart1: "oklch(0.5 0.2 250)",
        chart2: "oklch(0.6 0.15 220)",
        chart3: "oklch(0.4 0.1 270)",
      },
      dark: {
        primary: "oklch(0.65 0.2 250)",
        primaryForeground: "oklch(0.1 0.02 250)",
        primaryOutline: "oklch(0.65 0.2 250)",
        background: "oklch(0.15 0.02 240)",
        foreground: "oklch(0.95 0.01 240)",
        card: "oklch(0.2 0.03 240)",
        cardForeground: "oklch(0.95 0.01 240)",
        secondary: "oklch(0.25 0.04 240)",
        secondaryForeground: "oklch(0.95 0.01 240)",
        accent: "oklch(0.3 0.05 240)",
        border: "oklch(0.25 0.03 240)",
        sidebar: "oklch(0.12 0.02 240)",
        sidebarForeground: "oklch(0.95 0.01 240)",
        chart1: "oklch(0.65 0.2 250)",
        chart2: "oklch(0.75 0.15 220)",
        chart3: "oklch(0.55 0.1 270)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "boutique-blush",
    name: "Boutique Blush",
    description:
      "Tons suaves de rosa blush, elegante, feminino e focado em moda ou cosméticos.",
    previewColor: "#f43f5e",
    theme: {
      light: {
        primary: "oklch(0.6 0.2 10)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.6 0.2 10)",
        background: "oklch(0.99 0.01 10)",
        foreground: "oklch(0.2 0.05 10)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.2 0.05 10)",
        secondary: "oklch(0.96 0.03 10)",
        secondaryForeground: "oklch(0.3 0.1 10)",
        accent: "oklch(0.94 0.04 10)",
        border: "oklch(0.92 0.02 10)",
        sidebar: "oklch(0.98 0.01 10)",
        sidebarForeground: "oklch(0.2 0.05 10)",
        chart1: "oklch(0.6 0.2 10)",
        chart2: "oklch(0.7 0.15 350)",
        chart3: "oklch(0.8 0.1 30)",
      },
      dark: {
        primary: "oklch(0.65 0.2 10)",
        primaryForeground: "oklch(0.1 0.05 10)",
        primaryOutline: "oklch(0.65 0.2 10)",
        background: "oklch(0.15 0.02 10)",
        foreground: "oklch(0.95 0.02 10)",
        card: "oklch(0.2 0.03 10)",
        cardForeground: "oklch(0.95 0.02 10)",
        secondary: "oklch(0.25 0.04 10)",
        secondaryForeground: "oklch(0.95 0.02 10)",
        accent: "oklch(0.3 0.05 10)",
        border: "oklch(0.25 0.03 10)",
        sidebar: "oklch(0.12 0.02 10)",
        sidebarForeground: "oklch(0.95 0.02 10)",
        chart1: "oklch(0.65 0.2 10)",
        chart2: "oklch(0.75 0.15 350)",
        chart3: "oklch(0.85 0.1 30)",
      },
      radius: "0.75rem",
    },
  },
  {
    id: "carrinho-citrico",
    name: "Carrinho Cítrico",
    description: "Amarelo e verde limão vibrante.",
    previewColor: "#84cc16",
    theme: {
      light: {
        primary: "oklch(0.7 0.18 100)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.7 0.18 100)",
        background: "oklch(0.99 0.02 100)",
        foreground: "oklch(0.15 0.04 100)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.04 100)",
        secondary: "oklch(0.95 0.04 100)",
        secondaryForeground: "oklch(0.25 0.08 100)",
        accent: "oklch(0.92 0.06 100)",
        border: "oklch(0.9 0.04 100)",
        sidebar: "oklch(0.98 0.03 100)",
        sidebarForeground: "oklch(0.15 0.04 100)",
        chart1: "oklch(0.7 0.18 100)",
        chart2: "oklch(0.7999999999999999 0.18 85)",
        chart3: "oklch(0.6 0.18 115)",
      },
      dark: {
        primary: "oklch(0.7999999999999999 0.18 100)",
        primaryForeground: "oklch(0.1 0.02 100)",
        primaryOutline: "oklch(0.7999999999999999 0.18 100)",
        background: "oklch(0.15 0.04 100)",
        foreground: "oklch(0.95 0.02 100)",
        card: "oklch(0.2 0.04 100)",
        cardForeground: "oklch(0.95 0.02 100)",
        secondary: "oklch(0.25 0.06 100)",
        secondaryForeground: "oklch(0.95 0.02 100)",
        accent: "oklch(0.3 0.08 100)",
        border: "oklch(0.22999999999999998 0.048 100)",
        sidebar: "oklch(0.12 0.04 100)",
        sidebarForeground: "oklch(0.95 0.02 100)",
        chart1: "oklch(0.7999999999999999 0.18 100)",
        chart2: "oklch(0.8999999999999999 0.18 85)",
        chart3: "oklch(0.7 0.18 115)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "marmore-minimalista",
    name: "Mármore Minimalista",
    description: "Tons de branco, cinza claro e detalhes sutis.",
    previewColor: "#e5e7eb",
    theme: {
      light: {
        primary: "oklch(0.2 0 0)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.2 0 0)",
        background: "oklch(0.99 0 0)",
        foreground: "oklch(0.1 0 0)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.1 0 0)",
        secondary: "oklch(0.96 0 0)",
        secondaryForeground: "oklch(0.2 0 0)",
        accent: "oklch(0.94 0 0)",
        border: "oklch(0.9 0 0)",
        sidebar: "oklch(0.98 0 0)",
        sidebarForeground: "oklch(0.15 0 0)",
        chart1: "oklch(0.4 0 0)",
        chart2: "oklch(0.5 0 0)",
        chart3: "oklch(0.6 0 0)",
      },
      dark: {
        primary: "oklch(0.95 0 0)",
        primaryForeground: "oklch(0.1 0 0)",
        primaryOutline: "oklch(0.95 0 0)",
        background: "oklch(0.12 0 0)",
        foreground: "oklch(0.98 0 0)",
        card: "oklch(0.15 0 0)",
        cardForeground: "oklch(0.98 0 0)",
        secondary: "oklch(0.2 0 0)",
        secondaryForeground: "oklch(0.95 0 0)",
        accent: "oklch(0.25 0 0)",
        border: "oklch(0.22 0 0)",
        sidebar: "oklch(0.1 0 0)",
        sidebarForeground: "oklch(0.95 0 0)",
        chart1: "oklch(0.8 0 0)",
        chart2: "oklch(0.7 0 0)",
        chart3: "oklch(0.6 0 0)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "confianca-oceanica",
    name: "Confiança Oceânica",
    description: "Azul profundo e sereno, passa profissionalismo.",
    previewColor: "#0ea5e9",
    theme: {
      light: {
        primary: "oklch(0.5 0.15 250)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.5 0.15 250)",
        background: "oklch(0.98 0.01 250)",
        foreground: "oklch(0.15 0.02 250)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.02 250)",
        secondary: "oklch(0.95 0.02 250)",
        secondaryForeground: "oklch(0.25 0.04 250)",
        accent: "oklch(0.92 0.03 250)",
        border: "oklch(0.9 0.02 250)",
        sidebar: "oklch(0.98 0.015 250)",
        sidebarForeground: "oklch(0.15 0.02 250)",
        chart1: "oklch(0.5 0.15 250)",
        chart2: "oklch(0.6 0.15 235)",
        chart3: "oklch(0.4 0.15 265)",
      },
      dark: {
        primary: "oklch(0.6 0.15 250)",
        primaryForeground: "oklch(0.1 0.02 250)",
        primaryOutline: "oklch(0.6 0.15 250)",
        background: "oklch(0.15 0.02 250)",
        foreground: "oklch(0.95 0.01 250)",
        card: "oklch(0.2 0.02 250)",
        cardForeground: "oklch(0.95 0.01 250)",
        secondary: "oklch(0.25 0.03 250)",
        secondaryForeground: "oklch(0.95 0.01 250)",
        accent: "oklch(0.3 0.04 250)",
        border: "oklch(0.22999999999999998 0.024 250)",
        sidebar: "oklch(0.12 0.02 250)",
        sidebarForeground: "oklch(0.95 0.01 250)",
        chart1: "oklch(0.6 0.15 250)",
        chart2: "oklch(0.7 0.15 235)",
        chart3: "oklch(0.5 0.15 265)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "armazem-acolhedor",
    name: "Armazém Acolhedor",
    description: "Tons de madeira e terra, conforto e proximidade.",
    previewColor: "#a16207",
    theme: {
      light: {
        primary: "oklch(0.5 0.1 45)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.5 0.1 45)",
        background: "oklch(0.98 0.02 45)",
        foreground: "oklch(0.15 0.04 45)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.04 45)",
        secondary: "oklch(0.95 0.04 45)",
        secondaryForeground: "oklch(0.25 0.08 45)",
        accent: "oklch(0.92 0.06 45)",
        border: "oklch(0.9 0.04 45)",
        sidebar: "oklch(0.98 0.03 45)",
        sidebarForeground: "oklch(0.15 0.04 45)",
        chart1: "oklch(0.5 0.1 45)",
        chart2: "oklch(0.6 0.1 30)",
        chart3: "oklch(0.4 0.1 60)",
      },
      dark: {
        primary: "oklch(0.6 0.1 45)",
        primaryForeground: "oklch(0.1 0.02 45)",
        primaryOutline: "oklch(0.6 0.1 45)",
        background: "oklch(0.15 0.04 45)",
        foreground: "oklch(0.95 0.02 45)",
        card: "oklch(0.2 0.04 45)",
        cardForeground: "oklch(0.95 0.02 45)",
        secondary: "oklch(0.25 0.06 45)",
        secondaryForeground: "oklch(0.95 0.02 45)",
        accent: "oklch(0.3 0.08 45)",
        border: "oklch(0.22999999999999998 0.048 45)",
        sidebar: "oklch(0.12 0.04 45)",
        sidebarForeground: "oklch(0.95 0.02 45)",
        chart1: "oklch(0.6 0.1 45)",
        chart2: "oklch(0.7 0.1 30)",
        chart3: "oklch(0.5 0.1 60)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "desconto-neon",
    name: "Dia do Desconto Neon",
    description: "Cores gritantes para promoções de impacto.",
    previewColor: "#ec4899",
    theme: {
      light: {
        primary: "oklch(0.6 0.25 320)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.6 0.25 320)",
        background: "oklch(0.98 0.02 320)",
        foreground: "oklch(0.15 0.04 320)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.04 320)",
        secondary: "oklch(0.95 0.04 320)",
        secondaryForeground: "oklch(0.25 0.08 320)",
        accent: "oklch(0.92 0.06 320)",
        border: "oklch(0.9 0.04 320)",
        sidebar: "oklch(0.98 0.03 320)",
        sidebarForeground: "oklch(0.15 0.04 320)",
        chart1: "oklch(0.6 0.25 320)",
        chart2: "oklch(0.7 0.25 305)",
        chart3: "oklch(0.5 0.25 335)",
      },
      dark: {
        primary: "oklch(0.7 0.25 320)",
        primaryForeground: "oklch(0.1 0.02 320)",
        primaryOutline: "oklch(0.7 0.25 320)",
        background: "oklch(0.15 0.04 320)",
        foreground: "oklch(0.95 0.02 320)",
        card: "oklch(0.2 0.04 320)",
        cardForeground: "oklch(0.95 0.02 320)",
        secondary: "oklch(0.25 0.06 320)",
        secondaryForeground: "oklch(0.95 0.02 320)",
        accent: "oklch(0.3 0.08 320)",
        border: "oklch(0.22999999999999998 0.048 320)",
        sidebar: "oklch(0.12 0.04 320)",
        sidebarForeground: "oklch(0.95 0.02 320)",
        chart1: "oklch(0.7 0.25 320)",
        chart2: "oklch(0.7999999999999999 0.25 305)",
        chart3: "oklch(0.6 0.25 335)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "apoio-sage",
    name: "Apoio Sage",
    description: "Verde sálvia relaxante e natural.",
    previewColor: "#86efac",
    theme: {
      light: {
        primary: "oklch(0.65 0.08 150)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.65 0.08 150)",
        background: "oklch(0.99 0.01 150)",
        foreground: "oklch(0.15 0.02 150)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.02 150)",
        secondary: "oklch(0.95 0.02 150)",
        secondaryForeground: "oklch(0.25 0.04 150)",
        accent: "oklch(0.92 0.03 150)",
        border: "oklch(0.9 0.02 150)",
        sidebar: "oklch(0.98 0.015 150)",
        sidebarForeground: "oklch(0.15 0.02 150)",
        chart1: "oklch(0.65 0.08 150)",
        chart2: "oklch(0.75 0.08 135)",
        chart3: "oklch(0.55 0.08 165)",
      },
      dark: {
        primary: "oklch(0.75 0.08 150)",
        primaryForeground: "oklch(0.1 0.02 150)",
        primaryOutline: "oklch(0.75 0.08 150)",
        background: "oklch(0.15 0.02 150)",
        foreground: "oklch(0.95 0.01 150)",
        card: "oklch(0.2 0.02 150)",
        cardForeground: "oklch(0.95 0.01 150)",
        secondary: "oklch(0.25 0.03 150)",
        secondaryForeground: "oklch(0.95 0.01 150)",
        accent: "oklch(0.3 0.04 150)",
        border: "oklch(0.22999999999999998 0.024 150)",
        sidebar: "oklch(0.12 0.02 150)",
        sidebarForeground: "oklch(0.95 0.01 150)",
        chart1: "oklch(0.75 0.08 150)",
        chart2: "oklch(0.85 0.08 135)",
        chart3: "oklch(0.65 0.08 165)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "cobre-caxemira",
    name: "Cobre e Caxemira",
    description: "Elegância acolhedora com tons de cobre.",
    previewColor: "#b45309",
    theme: {
      light: {
        primary: "oklch(0.55 0.12 40)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.55 0.12 40)",
        background: "oklch(0.98 0.02 40)",
        foreground: "oklch(0.15 0.04 40)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.04 40)",
        secondary: "oklch(0.95 0.04 40)",
        secondaryForeground: "oklch(0.25 0.08 40)",
        accent: "oklch(0.92 0.06 40)",
        border: "oklch(0.9 0.04 40)",
        sidebar: "oklch(0.98 0.03 40)",
        sidebarForeground: "oklch(0.15 0.04 40)",
        chart1: "oklch(0.55 0.12 40)",
        chart2: "oklch(0.65 0.12 25)",
        chart3: "oklch(0.45000000000000007 0.12 55)",
      },
      dark: {
        primary: "oklch(0.65 0.12 40)",
        primaryForeground: "oklch(0.1 0.02 40)",
        primaryOutline: "oklch(0.65 0.12 40)",
        background: "oklch(0.15 0.04 40)",
        foreground: "oklch(0.95 0.02 40)",
        card: "oklch(0.2 0.04 40)",
        cardForeground: "oklch(0.95 0.02 40)",
        secondary: "oklch(0.25 0.06 40)",
        secondaryForeground: "oklch(0.95 0.02 40)",
        accent: "oklch(0.3 0.08 40)",
        border: "oklch(0.22999999999999998 0.048 40)",
        sidebar: "oklch(0.12 0.04 40)",
        sidebarForeground: "oklch(0.95 0.02 40)",
        chart1: "oklch(0.65 0.12 40)",
        chart2: "oklch(0.75 0.12 25)",
        chart3: "oklch(0.55 0.12 55)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "checkout-solar",
    name: "Checkout Solar",
    description: "Amarelo e laranja quentes e atrativos.",
    previewColor: "#eab308",
    theme: {
      light: {
        primary: "oklch(0.7 0.15 70)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.7 0.15 70)",
        background: "oklch(0.99 0.02 70)",
        foreground: "oklch(0.15 0.04 70)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.04 70)",
        secondary: "oklch(0.95 0.04 70)",
        secondaryForeground: "oklch(0.25 0.08 70)",
        accent: "oklch(0.92 0.06 70)",
        border: "oklch(0.9 0.04 70)",
        sidebar: "oklch(0.98 0.03 70)",
        sidebarForeground: "oklch(0.15 0.04 70)",
        chart1: "oklch(0.7 0.15 70)",
        chart2: "oklch(0.7999999999999999 0.15 55)",
        chart3: "oklch(0.6 0.15 85)",
      },
      dark: {
        primary: "oklch(0.7999999999999999 0.15 70)",
        primaryForeground: "oklch(0.1 0.02 70)",
        primaryOutline: "oklch(0.7999999999999999 0.15 70)",
        background: "oklch(0.15 0.04 70)",
        foreground: "oklch(0.95 0.02 70)",
        card: "oklch(0.2 0.04 70)",
        cardForeground: "oklch(0.95 0.02 70)",
        secondary: "oklch(0.25 0.06 70)",
        secondaryForeground: "oklch(0.95 0.02 70)",
        accent: "oklch(0.3 0.08 70)",
        border: "oklch(0.22999999999999998 0.048 70)",
        sidebar: "oklch(0.12 0.04 70)",
        sidebarForeground: "oklch(0.95 0.02 70)",
        chart1: "oklch(0.7999999999999999 0.15 70)",
        chart2: "oklch(0.8999999999999999 0.15 55)",
        chart3: "oklch(0.7 0.15 85)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "lealdade-lavanda",
    name: "Lealdade à lavanda",
    description: "Roxo pastel, calmo e fidelizador.",
    previewColor: "#c084fc",
    theme: {
      light: {
        primary: "oklch(0.7 0.1 290)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.7 0.1 290)",
        background: "oklch(0.99 0.01 290)",
        foreground: "oklch(0.15 0.02 290)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.02 290)",
        secondary: "oklch(0.95 0.02 290)",
        secondaryForeground: "oklch(0.25 0.04 290)",
        accent: "oklch(0.92 0.03 290)",
        border: "oklch(0.9 0.02 290)",
        sidebar: "oklch(0.98 0.015 290)",
        sidebarForeground: "oklch(0.15 0.02 290)",
        chart1: "oklch(0.7 0.1 290)",
        chart2: "oklch(0.7999999999999999 0.1 275)",
        chart3: "oklch(0.6 0.1 305)",
      },
      dark: {
        primary: "oklch(0.7999999999999999 0.1 290)",
        primaryForeground: "oklch(0.1 0.02 290)",
        primaryOutline: "oklch(0.7999999999999999 0.1 290)",
        background: "oklch(0.15 0.02 290)",
        foreground: "oklch(0.95 0.01 290)",
        card: "oklch(0.2 0.02 290)",
        cardForeground: "oklch(0.95 0.01 290)",
        secondary: "oklch(0.25 0.03 290)",
        secondaryForeground: "oklch(0.95 0.01 290)",
        accent: "oklch(0.3 0.04 290)",
        border: "oklch(0.22999999999999998 0.024 290)",
        sidebar: "oklch(0.12 0.02 290)",
        sidebarForeground: "oklch(0.95 0.01 290)",
        chart1: "oklch(0.7999999999999999 0.1 290)",
        chart2: "oklch(0.8999999999999999 0.1 275)",
        chart3: "oklch(0.7 0.1 305)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "mercado-florestal",
    name: "Mercado Florestal",
    description: "Verde escuro profundo e natural.",
    previewColor: "#15803d",
    theme: {
      light: {
        primary: "oklch(0.4 0.1 140)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.4 0.1 140)",
        background: "oklch(0.98 0.01 140)",
        foreground: "oklch(0.15 0.02 140)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.02 140)",
        secondary: "oklch(0.95 0.02 140)",
        secondaryForeground: "oklch(0.25 0.04 140)",
        accent: "oklch(0.92 0.03 140)",
        border: "oklch(0.9 0.02 140)",
        sidebar: "oklch(0.98 0.015 140)",
        sidebarForeground: "oklch(0.15 0.02 140)",
        chart1: "oklch(0.4 0.1 140)",
        chart2: "oklch(0.5 0.1 125)",
        chart3: "oklch(0.30000000000000004 0.1 155)",
      },
      dark: {
        primary: "oklch(0.5 0.1 140)",
        primaryForeground: "oklch(0.1 0.02 140)",
        primaryOutline: "oklch(0.5 0.1 140)",
        background: "oklch(0.15 0.02 140)",
        foreground: "oklch(0.95 0.01 140)",
        card: "oklch(0.2 0.02 140)",
        cardForeground: "oklch(0.95 0.01 140)",
        secondary: "oklch(0.25 0.03 140)",
        secondaryForeground: "oklch(0.95 0.01 140)",
        accent: "oklch(0.3 0.04 140)",
        border: "oklch(0.22999999999999998 0.024 140)",
        sidebar: "oklch(0.12 0.02 140)",
        sidebarForeground: "oklch(0.95 0.01 140)",
        chart1: "oklch(0.5 0.1 140)",
        chart2: "oklch(0.6 0.1 125)",
        chart3: "oklch(0.4 0.1 155)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "argila-feita-a-mao",
    name: "Argila feita à mão",
    description: "Terracota, remete ao artesanato.",
    previewColor: "#c2410c",
    theme: {
      light: {
        primary: "oklch(0.6 0.14 35)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.6 0.14 35)",
        background: "oklch(0.98 0.02 35)",
        foreground: "oklch(0.15 0.04 35)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.04 35)",
        secondary: "oklch(0.95 0.04 35)",
        secondaryForeground: "oklch(0.25 0.08 35)",
        accent: "oklch(0.92 0.06 35)",
        border: "oklch(0.9 0.04 35)",
        sidebar: "oklch(0.98 0.03 35)",
        sidebarForeground: "oklch(0.15 0.04 35)",
        chart1: "oklch(0.6 0.14 35)",
        chart2: "oklch(0.7 0.14 20)",
        chart3: "oklch(0.5 0.14 50)",
      },
      dark: {
        primary: "oklch(0.7 0.14 35)",
        primaryForeground: "oklch(0.1 0.02 35)",
        primaryOutline: "oklch(0.7 0.14 35)",
        background: "oklch(0.15 0.04 35)",
        foreground: "oklch(0.95 0.02 35)",
        card: "oklch(0.2 0.04 35)",
        cardForeground: "oklch(0.95 0.02 35)",
        secondary: "oklch(0.25 0.06 35)",
        secondaryForeground: "oklch(0.95 0.02 35)",
        accent: "oklch(0.3 0.08 35)",
        border: "oklch(0.22999999999999998 0.048 35)",
        sidebar: "oklch(0.12 0.04 35)",
        sidebarForeground: "oklch(0.95 0.02 35)",
        chart1: "oklch(0.7 0.14 35)",
        chart2: "oklch(0.7999999999999999 0.14 20)",
        chart3: "oklch(0.6 0.14 50)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "artico-minimo",
    name: "Ártico mínimo",
    description: "Fresco, limpo, gelo e neve.",
    previewColor: "#7dd3fc",
    theme: {
      light: {
        primary: "oklch(0.8 0.05 230)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.8 0.05 230)",
        background: "oklch(0.99 0.01 230)",
        foreground: "oklch(0.15 0.02 230)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.02 230)",
        secondary: "oklch(0.95 0.02 230)",
        secondaryForeground: "oklch(0.25 0.04 230)",
        accent: "oklch(0.92 0.03 230)",
        border: "oklch(0.9 0.02 230)",
        sidebar: "oklch(0.98 0.015 230)",
        sidebarForeground: "oklch(0.15 0.02 230)",
        chart1: "oklch(0.8 0.05 230)",
        chart2: "oklch(0.9 0.05 215)",
        chart3: "oklch(0.7000000000000001 0.05 245)",
      },
      dark: {
        primary: "oklch(0.8 0.05 230)",
        primaryForeground: "oklch(0.1 0.02 230)",
        primaryOutline: "oklch(0.8 0.05 230)",
        background: "oklch(0.15 0.02 230)",
        foreground: "oklch(0.95 0.01 230)",
        card: "oklch(0.2 0.02 230)",
        cardForeground: "oklch(0.95 0.01 230)",
        secondary: "oklch(0.25 0.03 230)",
        secondaryForeground: "oklch(0.95 0.01 230)",
        accent: "oklch(0.3 0.04 230)",
        border: "oklch(0.22999999999999998 0.024 230)",
        sidebar: "oklch(0.12 0.02 230)",
        sidebarForeground: "oklch(0.95 0.01 230)",
        chart1: "oklch(0.8 0.05 230)",
        chart2: "oklch(0.9 0.05 215)",
        chart3: "oklch(0.7000000000000001 0.05 245)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "ouro-rosa",
    name: "Promoção de ouro rosa",
    description: "Luxo moderno com toques femininos.",
    previewColor: "#fb7185",
    theme: {
      light: {
        primary: "oklch(0.65 0.1 20)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.65 0.1 20)",
        background: "oklch(0.99 0.01 20)",
        foreground: "oklch(0.15 0.02 20)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.02 20)",
        secondary: "oklch(0.95 0.02 20)",
        secondaryForeground: "oklch(0.25 0.04 20)",
        accent: "oklch(0.92 0.03 20)",
        border: "oklch(0.9 0.02 20)",
        sidebar: "oklch(0.98 0.015 20)",
        sidebarForeground: "oklch(0.15 0.02 20)",
        chart1: "oklch(0.65 0.1 20)",
        chart2: "oklch(0.75 0.1 5)",
        chart3: "oklch(0.55 0.1 35)",
      },
      dark: {
        primary: "oklch(0.75 0.1 20)",
        primaryForeground: "oklch(0.1 0.02 20)",
        primaryOutline: "oklch(0.75 0.1 20)",
        background: "oklch(0.15 0.02 20)",
        foreground: "oklch(0.95 0.01 20)",
        card: "oklch(0.2 0.02 20)",
        cardForeground: "oklch(0.95 0.01 20)",
        secondary: "oklch(0.25 0.03 20)",
        secondaryForeground: "oklch(0.95 0.01 20)",
        accent: "oklch(0.3 0.04 20)",
        border: "oklch(0.22999999999999998 0.024 20)",
        sidebar: "oklch(0.12 0.02 20)",
        sidebarForeground: "oklch(0.95 0.01 20)",
        chart1: "oklch(0.75 0.1 20)",
        chart2: "oklch(0.85 0.1 5)",
        chart3: "oklch(0.65 0.1 35)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "inventario-indigo",
    name: "Inventário Índigo",
    description: "Azul-arroxeado rico, moderno e digital.",
    previewColor: "#4f46e5",
    theme: {
      light: {
        primary: "oklch(0.5 0.15 275)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.5 0.15 275)",
        background: "oklch(0.98 0.01 275)",
        foreground: "oklch(0.15 0.02 275)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.02 275)",
        secondary: "oklch(0.95 0.02 275)",
        secondaryForeground: "oklch(0.25 0.04 275)",
        accent: "oklch(0.92 0.03 275)",
        border: "oklch(0.9 0.02 275)",
        sidebar: "oklch(0.98 0.015 275)",
        sidebarForeground: "oklch(0.15 0.02 275)",
        chart1: "oklch(0.5 0.15 275)",
        chart2: "oklch(0.6 0.15 260)",
        chart3: "oklch(0.4 0.15 290)",
      },
      dark: {
        primary: "oklch(0.6 0.15 275)",
        primaryForeground: "oklch(0.1 0.02 275)",
        primaryOutline: "oklch(0.6 0.15 275)",
        background: "oklch(0.15 0.02 275)",
        foreground: "oklch(0.95 0.01 275)",
        card: "oklch(0.2 0.02 275)",
        cardForeground: "oklch(0.95 0.01 275)",
        secondary: "oklch(0.25 0.03 275)",
        secondaryForeground: "oklch(0.95 0.01 275)",
        accent: "oklch(0.3 0.04 275)",
        border: "oklch(0.22999999999999998 0.024 275)",
        sidebar: "oklch(0.12 0.02 275)",
        sidebarForeground: "oklch(0.95 0.01 275)",
        chart1: "oklch(0.6 0.15 275)",
        chart2: "oklch(0.7 0.15 260)",
        chart3: "oklch(0.5 0.15 290)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "hortela-fresca",
    name: "Hortelã fresca",
    description: "Verde-água revitalizante e jovem.",
    previewColor: "#2dd4bf",
    theme: {
      light: {
        primary: "oklch(0.7 0.12 165)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.7 0.12 165)",
        background: "oklch(0.99 0.01 165)",
        foreground: "oklch(0.15 0.02 165)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.02 165)",
        secondary: "oklch(0.95 0.02 165)",
        secondaryForeground: "oklch(0.25 0.04 165)",
        accent: "oklch(0.92 0.03 165)",
        border: "oklch(0.9 0.02 165)",
        sidebar: "oklch(0.98 0.015 165)",
        sidebarForeground: "oklch(0.15 0.02 165)",
        chart1: "oklch(0.7 0.12 165)",
        chart2: "oklch(0.7999999999999999 0.12 150)",
        chart3: "oklch(0.6 0.12 180)",
      },
      dark: {
        primary: "oklch(0.7999999999999999 0.12 165)",
        primaryForeground: "oklch(0.1 0.02 165)",
        primaryOutline: "oklch(0.7999999999999999 0.12 165)",
        background: "oklch(0.15 0.02 165)",
        foreground: "oklch(0.95 0.01 165)",
        card: "oklch(0.2 0.02 165)",
        cardForeground: "oklch(0.95 0.01 165)",
        secondary: "oklch(0.25 0.03 165)",
        secondaryForeground: "oklch(0.95 0.01 165)",
        accent: "oklch(0.3 0.04 165)",
        border: "oklch(0.22999999999999998 0.024 165)",
        sidebar: "oklch(0.12 0.02 165)",
        sidebarForeground: "oklch(0.95 0.01 165)",
        chart1: "oklch(0.7999999999999999 0.12 165)",
        chart2: "oklch(0.8999999999999999 0.12 150)",
        chart3: "oklch(0.7 0.12 180)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "deserto-checkout",
    name: "Deserto Checkout",
    description: "Tons de areia, neutros e acolhedores.",
    previewColor: "#d6d3d1",
    theme: {
      light: {
        primary: "oklch(0.7 0.08 60)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.7 0.08 60)",
        background: "oklch(0.98 0.01 60)",
        foreground: "oklch(0.15 0.02 60)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.02 60)",
        secondary: "oklch(0.95 0.02 60)",
        secondaryForeground: "oklch(0.25 0.04 60)",
        accent: "oklch(0.92 0.03 60)",
        border: "oklch(0.9 0.02 60)",
        sidebar: "oklch(0.98 0.015 60)",
        sidebarForeground: "oklch(0.15 0.02 60)",
        chart1: "oklch(0.7 0.08 60)",
        chart2: "oklch(0.7999999999999999 0.08 45)",
        chart3: "oklch(0.6 0.08 75)",
      },
      dark: {
        primary: "oklch(0.7999999999999999 0.08 60)",
        primaryForeground: "oklch(0.1 0.02 60)",
        primaryOutline: "oklch(0.7999999999999999 0.08 60)",
        background: "oklch(0.15 0.02 60)",
        foreground: "oklch(0.95 0.01 60)",
        card: "oklch(0.2 0.02 60)",
        cardForeground: "oklch(0.95 0.01 60)",
        secondary: "oklch(0.25 0.03 60)",
        secondaryForeground: "oklch(0.95 0.01 60)",
        accent: "oklch(0.3 0.04 60)",
        border: "oklch(0.22999999999999998 0.024 60)",
        sidebar: "oklch(0.12 0.02 60)",
        sidebarForeground: "oklch(0.95 0.01 60)",
        chart1: "oklch(0.7999999999999999 0.08 60)",
        chart2: "oklch(0.8999999999999999 0.08 45)",
        chart3: "oklch(0.7 0.08 75)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "tinta-damasco",
    name: "Tinta e damasco",
    description: "Preto forte (tinta) com toques de laranja damasco.",
    previewColor: "#fdba74",
    theme: {
      light: {
        primary: "oklch(0.65 0.15 65)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.65 0.15 65)",
        background: "oklch(0.95 0 65)",
        foreground: "oklch(0.15 0 65)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0 65)",
        secondary: "oklch(0.95 0 65)",
        secondaryForeground: "oklch(0.25 0 65)",
        accent: "oklch(0.92 0 65)",
        border: "oklch(0.9 0 65)",
        sidebar: "oklch(0.98 0 65)",
        sidebarForeground: "oklch(0.15 0 65)",
        chart1: "oklch(0.65 0.15 65)",
        chart2: "oklch(0.75 0.15 50)",
        chart3: "oklch(0.55 0.15 80)",
      },
      dark: {
        primary: "oklch(0.75 0.15 65)",
        primaryForeground: "oklch(0.1 0.02 65)",
        primaryOutline: "oklch(0.75 0.15 65)",
        background: "oklch(0.15 0 65)",
        foreground: "oklch(0.95 0 65)",
        card: "oklch(0.2 0 65)",
        cardForeground: "oklch(0.95 0 65)",
        secondary: "oklch(0.25 0 65)",
        secondaryForeground: "oklch(0.95 0 65)",
        accent: "oklch(0.3 0 65)",
        border: "oklch(0.22999999999999998 0 65)",
        sidebar: "oklch(0.12 0 65)",
        sidebarForeground: "oklch(0.95 0 65)",
        chart1: "oklch(0.75 0.15 65)",
        chart2: "oklch(0.85 0.15 50)",
        chart3: "oklch(0.65 0.15 80)",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "mossy-wishlist",
    name: "Lista de desejos de Mossy",
    description: "Verde musgo terroso e aconchegante.",
    previewColor: "#4d7c0f",
    theme: {
      light: {
        primary: "oklch(0.55 0.12 125)",
        primaryForeground: "oklch(0.98 0 0)",
        primaryOutline: "oklch(0.55 0.12 125)",
        background: "oklch(0.98 0.01 125)",
        foreground: "oklch(0.15 0.02 125)",
        card: "oklch(1 0 0)",
        cardForeground: "oklch(0.15 0.02 125)",
        secondary: "oklch(0.95 0.02 125)",
        secondaryForeground: "oklch(0.25 0.04 125)",
        accent: "oklch(0.92 0.03 125)",
        border: "oklch(0.9 0.02 125)",
        sidebar: "oklch(0.98 0.015 125)",
        sidebarForeground: "oklch(0.15 0.02 125)",
        chart1: "oklch(0.55 0.12 125)",
        chart2: "oklch(0.65 0.12 110)",
        chart3: "oklch(0.45000000000000007 0.12 140)",
      },
      dark: {
        primary: "oklch(0.65 0.12 125)",
        primaryForeground: "oklch(0.1 0.02 125)",
        primaryOutline: "oklch(0.65 0.12 125)",
        background: "oklch(0.15 0.02 125)",
        foreground: "oklch(0.95 0.01 125)",
        card: "oklch(0.2 0.02 125)",
        cardForeground: "oklch(0.95 0.01 125)",
        secondary: "oklch(0.25 0.03 125)",
        secondaryForeground: "oklch(0.95 0.01 125)",
        accent: "oklch(0.3 0.04 125)",
        border: "oklch(0.22999999999999998 0.024 125)",
        sidebar: "oklch(0.12 0.02 125)",
        sidebarForeground: "oklch(0.95 0.01 125)",
        chart1: "oklch(0.65 0.12 125)",
        chart2: "oklch(0.75 0.12 110)",
        chart3: "oklch(0.55 0.12 140)",
      },
      radius: "0.5rem",
    },
  },
];

const THEME_VARIABLES = [
  {
    id: "background",
    label: "Fundo da Página",
    description: "Cor de fundo geral do site",
    defaultLight: "oklch(0.99 0.005 150)",
    defaultDark: "oklch(0.12 0.02 150)",
  },
  {
    id: "foreground",
    label: "Texto Principal",
    description: "Cor dos títulos e textos corporativos",
    defaultLight: "oklch(0.15 0.02 150)",
    defaultDark: "oklch(0.98 0.01 150)",
  },
  {
    id: "card",
    label: "Fundo de Cards",
    description: "Cor dos blocos de produto e containers",
    defaultLight: "oklch(1 0 0)",
    defaultDark: "oklch(0.14 0.02 150)",
  },
  {
    id: "cardForeground",
    label: "Texto do Card",
    description: "Texto dentro de cards",
    defaultLight: "oklch(0.15 0.02 150)",
    defaultDark: "oklch(0.98 0.01 150)",
  },
  {
    id: "popover",
    label: "Fundo Popover",
    description: "Menus suspensos e tooltips",
    defaultLight: "oklch(1 0 0)",
    defaultDark: "oklch(0.14 0.02 150)",
  },
  {
    id: "popoverForeground",
    label: "Texto Popover",
    description: "Texto em menus suspensos",
    defaultLight: "oklch(0.15 0.02 150)",
    defaultDark: "oklch(0.98 0.01 150)",
  },
  {
    id: "primary",
    label: "Cor Primária",
    description: "Botões de ação principal, destaques e links",
    defaultLight: "oklch(0.5 0.22 150)",
    defaultDark: "oklch(0.65 0.22 150)",
  },
  {
    id: "primaryOutline",
    label: "Cor de Contorno (Outline)",
    description: "Cor da borda e texto de botões secundários",
    defaultLight: "oklch(0.5 0.22 150)",
    defaultDark: "oklch(0.65 0.22 150)",
  },
  {
    id: "primaryForeground",
    label: "Texto da Cor Primária",
    description: "Cor do texto nos botões primários",
    defaultLight: "oklch(0.98 0 0)",
    defaultDark: "oklch(0.15 0.02 150)",
  },
  {
    id: "secondary",
    label: "Cor Secundária",
    description: "Fundo de botões secundários",
    defaultLight: "oklch(0.96 0.02 150)",
    defaultDark: "oklch(0.2 0.03 150)",
  },
  {
    id: "secondaryForeground",
    label: "Texto Secundário",
    description: "Texto em botões secundários",
    defaultLight: "oklch(0.2 0.05 150)",
    defaultDark: "oklch(0.98 0.01 150)",
  },
  {
    id: "muted",
    label: "Mudo (Muted)",
    description: "Fundo de elementos inativos",
    defaultLight: "oklch(0.96 0.02 150)",
    defaultDark: "oklch(0.2 0.03 150)",
  },
  {
    id: "mutedForeground",
    label: "Texto Mudo",
    description: "Textos discretos e placeholders",
    defaultLight: "oklch(0.55 0.02 150)",
    defaultDark: "oklch(0.7 0.02 150)",
  },
  {
    id: "accent",
    label: "Destaque (Accent)",
    description: "Elementos e botões de destaque leve",
    defaultLight: "oklch(0.96 0.03 150)",
    defaultDark: "oklch(0.22 0.04 150)",
  },
  {
    id: "accentForeground",
    label: "Texto Destaque",
    description: "Texto sobre o fundo de destaque",
    defaultLight: "oklch(0.2 0.05 150)",
    defaultDark: "oklch(0.98 0.01 150)",
  },
  {
    id: "destructive",
    label: "Cor Destrutiva",
    description: "Botões de excluir ou erros",
    defaultLight: "oklch(0.6 0.2 25)",
    defaultDark: "oklch(0.6 0.2 25)",
  },
  {
    id: "destructiveForeground",
    label: "Texto Destrutivo",
    description: "Texto sobre botões destrutivos",
    defaultLight: "oklch(0.98 0 0)",
    defaultDark: "oklch(0.98 0 0)",
  },
  {
    id: "border",
    label: "Bordas",
    description: "Linhas divisórias e contornos de caixas",
    defaultLight: "oklch(0.92 0.02 150)",
    defaultDark: "oklch(0.2 0.03 150)",
  },
  {
    id: "input",
    label: "Bordas de Input",
    description: "Bordas de campos de texto e seleções",
    defaultLight: "oklch(0.92 0.02 150)",
    defaultDark: "oklch(0.2 0.03 150)",
  },
  {
    id: "ring",
    label: "Anel de Foco (Ring)",
    description: "Cor do contorno ao focar em um campo",
    defaultLight: "oklch(0.5 0.22 150)",
    defaultDark: "oklch(0.65 0.22 150)",
  },
  {
    id: "chart1",
    label: "Gráfico 1",
    description: "Cor 1 para gráficos e métricas",
    defaultLight: "oklch(0.6 0.18 155)",
    defaultDark: "oklch(0.65 0.22 155)",
  },
  {
    id: "chart2",
    label: "Gráfico 2",
    description: "Cor 2 para gráficos e métricas",
    defaultLight: "oklch(0.6 0.15 130)",
    defaultDark: "oklch(0.5 0.15 130)",
  },
  {
    id: "chart3",
    label: "Gráfico 3",
    description: "Cor 3 para gráficos e métricas",
    defaultLight: "oklch(0.5 0.12 170)",
    defaultDark: "oklch(0.6 0.15 170)",
  },
  {
    id: "chart4",
    label: "Gráfico 4",
    description: "Cor 4 para gráficos e métricas",
    defaultLight: "oklch(0.7 0.15 160)",
    defaultDark: "oklch(0.7 0.15 160)",
  },
  {
    id: "chart5",
    label: "Gráfico 5",
    description: "Cor 5 para gráficos e métricas",
    defaultLight: "oklch(0.8 0.12 150)",
    defaultDark: "oklch(0.8 0.12 150)",
  },
  {
    id: "sidebar",
    label: "Fundo da Sidebar",
    description: "Fundo da barra lateral do sistema",
    defaultLight: "oklch(0.98 0.01 150)",
    defaultDark: "oklch(0.14 0.02 150)",
  },
  {
    id: "sidebarForeground",
    label: "Texto da Sidebar",
    description: "Texto na barra lateral",
    defaultLight: "oklch(0.15 0.02 150)",
    defaultDark: "oklch(0.98 0.01 150)",
  },
  {
    id: "sidebarPrimary",
    label: "Cor Primária Sidebar",
    description: "Destaque principal na barra lateral",
    defaultLight: "oklch(0.5 0.22 150)",
    defaultDark: "oklch(0.65 0.22 150)",
  },
  {
    id: "sidebarPrimaryForeground",
    label: "Texto Primário Sidebar",
    description: "Texto de destaque na barra lateral",
    defaultLight: "oklch(0.98 0 0)",
    defaultDark: "oklch(0.15 0.02 150)",
  },
  {
    id: "sidebarAccent",
    label: "Destaque da Sidebar",
    description: "Item focado na barra lateral",
    defaultLight: "oklch(0.96 0.02 150)",
    defaultDark: "oklch(0.22 0.04 150)",
  },
  {
    id: "sidebarAccentForeground",
    label: "Texto Destaque Sidebar",
    description: "Texto do item focado na barra lateral",
    defaultLight: "oklch(0.2 0.05 150)",
    defaultDark: "oklch(0.98 0.01 150)",
  },
  {
    id: "sidebarBorder",
    label: "Borda da Sidebar",
    description: "Separador da barra lateral",
    defaultLight: "oklch(0.92 0.02 150)",
    defaultDark: "oklch(0.2 0.03 150)",
  },
  {
    id: "sidebarRing",
    label: "Foco da Sidebar",
    description: "Contorno ao focar na barra lateral",
    defaultLight: "oklch(0.5 0.22 150)",
    defaultDark: "oklch(0.65 0.22 150)",
  },
];

export function ThemeEditor({ initialTheme }: ThemeEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { company } = useCompany();

  const [theme, setTheme] = useState<CompanyTheme>(() => {
    return initialTheme || company?.theme || {};
  });

  const [mainTab, setMainTab] = useState<"presets" | "customize">("presets");
  const [activeTab, setActiveTab] = useState<
    "light" | "dark" | "style" | "presets"
  >("presets");
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");

  // Altera a cor de uma propriedade específica (ex: light.primary)
  const handleColorChange = (
    mode: "light" | "dark",
    field: keyof ThemeColorPalette,
    value: string,
  ) => {
    setTheme((prev) => ({
      ...prev,
      [mode]: {
        ...(prev[mode] || {}),
        [field]: value,
      },
    }));
  };

  const handleRadiusChange = (radius: string) => {
    setTheme((prev) => ({
      ...prev,
      radius,
    }));
  };

  const applyPreset = (presetTheme: CompanyTheme) => {
    setTheme(presetTheme);
    toast.success(
      "Preset aplicado no preview! Clique em 'Salvar Alterações' para salvar.",
    );
  };

  const handleReset = () => {
    setTheme({});
    toast.info("Cores restauradas para o padrão do site.");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateCompanyTheme(theme);
      if (res.success) {
        toast.success("Tema da empresa salvo com sucesso!");
      } else {
        toast.error(res.message || "Erro ao salvar as configurações do tema.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão ao salvar o tema.");
    } finally {
      setIsSaving(false);
    }
  };

  // Computa as variáveis CSS escopadas para o componente de Live Preview
  const getPreviewStyles = () => {
    const mode =
      activeTab === "dark" || previewMode === "dark" ? "dark" : "light";
    const palette = theme[mode] || {};

    const previewStyles: Record<string, string> = {};

    THEME_VARIABLES.forEach((v) => {
      const val =
        palette[v.id as keyof ThemeColorPalette] ||
        (mode === "light" ? v.defaultLight : v.defaultDark);

      const varName =
        "--" + v.id.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      previewStyles[varName] = val as string;
    });

    const radius = theme.radius || "0.75rem";
    previewStyles["--radius"] = radius;

    // Map base properties for the preview container
    previewStyles["background"] = previewStyles["--background"];
    previewStyles["color"] = previewStyles["--foreground"];
    previewStyles["borderColor"] = previewStyles["--border"];
    previewStyles["borderRadius"] = previewStyles["--radius"];

    return previewStyles as React.CSSProperties;
  };

  const previewStyles = getPreviewStyles();
  const currentMode =
    activeTab === "dark" || previewMode === "dark" ? "dark" : "light";

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Palette className="w-8 h-8 text-primary shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Personalização da Aparência
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Altere as cores e estilos da sua loja com pré-visualização
            instantânea.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="cursor-pointer px-4 py-2.5 text-sm font-semibold border border-border rounded-xl hover:bg-muted transition-all flex items-center space-x-2 disabled:opacity-50 active:scale-95 shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
            <span>Restaurar Padrão</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="cursor-pointer px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center space-x-2 disabled:opacity-50 active:scale-95"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "Salvando..." : "Salvar Alterações"}</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Controles à esquerda (7 colunas), Preview à direita (5 colunas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Painel de Abas e Formulário de Edição */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navegação de Abas Principais */}
          <div className="flex bg-muted/60 p-1.5 rounded-xl gap-1.5 border">
            <button
              type="button"
              onClick={() => {
                setMainTab("presets");
                setActiveTab("presets");
              }}
              className={cn(
                "cursor-pointer flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all",
                mainTab === "presets"
                  ? "bg-card text-foreground shadow-sm border"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50",
              )}
            >
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>Presets</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMainTab("customize");
                setActiveTab("light");
                setPreviewMode("light");
              }}
              className={cn(
                "cursor-pointer flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all",
                mainTab === "customize"
                  ? "bg-card text-foreground shadow-sm border"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50",
              )}
            >
              <Layout className="w-4 h-4 text-secondary-foreground shrink-0" />
              <span>Personalizar</span>
            </button>
          </div>

          {/* Navegação de Abas Secundárias (Personalizar) */}
          {mainTab === "customize" && (
            <div className="flex bg-muted/60 p-1.5 rounded-xl gap-1.5 border">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("light");
                  setPreviewMode("light");
                }}
                className={cn(
                  "cursor-pointer flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all",
                  activeTab === "light"
                    ? "bg-card text-foreground shadow-sm border"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50",
                )}
              >
                <Sun className="w-4 h-4 text-secondary-foreground shrink-0" />
                <span>Modo Claro</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("dark");
                  setPreviewMode("dark");
                }}
                className={cn(
                  "cursor-pointer flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all",
                  activeTab === "dark"
                    ? "bg-card text-foreground shadow-sm border"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50",
                )}
              >
                <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Modo Escuro</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("style")}
                className={cn(
                  "cursor-pointer flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all",
                  activeTab === "style"
                    ? "bg-card text-foreground shadow-sm border"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50",
                )}
              >
                <Layout className="w-4 h-4 text-primary shrink-0" />
                <span>Bordas</span>
              </button>
            </div>
          )}

          {/* Conteúdo: Modo Claro / Modo Escuro */}
          {(activeTab === "light" || activeTab === "dark") && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-2">
                  {activeTab === "light" ? (
                    <Sun className="w-5 h-5 text-secondary-foreground" />
                  ) : (
                    <Moon className="w-5 h-5 text-indigo-400" />
                  )}
                  <h3 className="font-bold text-base">
                    Cores do{" "}
                    {activeTab === "light" ? "Modo Claro" : "Modo Escuro"}
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  Altere os valores em HEX ou clique no quadrado de cor
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-1">
                {THEME_VARIABLES.map((v) => (
                  <ColorInputGroup
                    key={v.id}
                    label={v.label}
                    description={v.description}
                    value={
                      (theme[activeTab] as Record<string, string>)?.[v.id] || ""
                    }
                    defaultValue={
                      activeTab === "light" ? v.defaultLight : v.defaultDark
                    }
                    onChange={(val) =>
                      handleColorChange(
                        activeTab,
                        v.id as keyof ThemeColorPalette,
                        val,
                      )
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Conteúdo: Bordas & Estilos */}
          {activeTab === "style" && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-bold text-base flex items-center space-x-2">
                  <Layout className="w-5 h-5 text-primary" />
                  <span>Arredondamento de Bordas</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Defina a curvatura dos cantos dos elementos e botões da sua
                  loja.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Sutil (4px)", value: "0.25rem" },
                  { label: "Médio (8px)", value: "0.5rem" },
                  { label: "Moderno (12px)", value: "0.75rem" },
                  { label: "Arredondado (16px)", value: "1rem" },
                ].map((item) => {
                  const isSelected = (theme.radius || "0.75rem") === item.value;
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => handleRadiusChange(item.value)}
                      className={cn(
                        "cursor-pointer p-4 border rounded-xl text-center flex flex-col items-center justify-center space-y-3 transition-all active:scale-95",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary"
                          : "hover:bg-muted border-border",
                      )}
                    >
                      <div
                        className="w-12 h-8 border-2 border-primary bg-muted/60 shadow-inner"
                        style={{ borderRadius: item.value }}
                      />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Conteúdo: Presets Prontos */}
          {activeTab === "presets" && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-bold text-base flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>Paletas de Cores Pré-definidas</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Selecione um tema com 1 clique para aplicar ao preview.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className="border rounded-xl p-4 space-y-4 hover:border-primary transition-all bg-background flex flex-col justify-between shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-6 h-6 rounded-full border shadow-inner shrink-0"
                          style={{ backgroundColor: preset.previewColor }}
                        />
                        <h4 className="font-bold text-sm text-foreground">
                          {preset.name}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => applyPreset(preset.theme)}
                      className="cursor-pointer w-full py-2 px-3 text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 rounded-lg transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Aplicar Preset</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Painel de Live Preview à Direita */}
        <div className="lg:col-span-5 space-y-4 sticky top-24 z-10 self-start">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center space-x-2 text-foreground">
              <Layers className="w-4 h-4 text-primary" />
              <span>
                Preview da Loja (
                {currentMode === "dark" ? "Modo Escuro" : "Modo Claro"})
              </span>
            </h3>

            {/* Alternador de Modo de Preview */}
            <div className="flex bg-muted p-1 rounded-lg border">
              <button
                type="button"
                onClick={() => setPreviewMode("light")}
                className={cn(
                  "cursor-pointer p-1.5 rounded-md text-xs transition-all",
                  currentMode === "light"
                    ? "bg-card text-foreground shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
                title="Visualizar em Modo Claro"
              >
                <Sun className="w-3.5 h-3.5 text-secondary-foreground" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("dark")}
                className={cn(
                  "cursor-pointer p-1.5 rounded-md text-xs transition-all",
                  currentMode === "dark"
                    ? "bg-card text-foreground shadow-sm font-bold"
                    : "text-muted-foreground hover:text-foreground",
                )}
                title="Visualizar em Modo Escuro"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              </button>
            </div>
          </div>

          {/* Container do Preview com as Variáveis Escopadas via Inline Style */}
          <div
            style={previewStyles}
            className="border rounded-2xl p-6 shadow-xl space-y-6 sticky top-6 transition-all duration-200"
          >
            {/* Header Simulado */}
            <div className="border-b pb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag
                  className="w-5 h-5"
                  style={{ color: "var(--primary)" }}
                />
                <span className="font-extrabold text-base tracking-tight">
                  {company?.name || "Sua Loja"}
                </span>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-lg font-medium border"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--card)",
                }}
              >
                Menu
              </span>
            </div>

            {/* Banner Hero Simulado */}
            <div
              className="border p-4 space-y-3 shadow-sm transition-all"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "var(--radius)",
              }}
            >
              <span
                className="text-[11px] font-bold uppercase tracking-wider block"
                style={{ color: "var(--primary)" }}
              >
                Lançamento Exclusivo
              </span>
              <h4 className="font-extrabold text-base">
                Pacotes Especiais Tibia Coins
              </h4>
              <p className="text-xs opacity-75 leading-relaxed">
                Entrega automática e segura 24/7 com suporte dedicado.
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                    borderRadius: "var(--radius)",
                  }}
                  className="px-4 py-2 text-xs font-bold shadow-sm transition-transform active:scale-95"
                >
                  Comprar Agora
                </button>

                <button
                  type="button"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--secondary)",
                    color: "var(--secondary-foreground)",
                    borderRadius: "var(--radius)",
                  }}
                  className="px-4 py-2 text-xs font-bold border shadow-sm transition-transform active:scale-95"
                >
                  Saiba Mais
                </button>
              </div>
            </div>

            {/* Card de Produto Simulado */}
            <div
              className="border p-4 space-y-3 shadow-sm transition-all"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "var(--radius)",
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-bold text-sm">
                    Master Sorcerer Level 650+
                  </h5>
                  <p className="text-xs opacity-75">Servidor: Antica</p>
                </div>
                <span
                  className="text-xs font-extrabold px-2.5 py-1 border"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--primary)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                >
                  R$ 1.250,00
                </span>
              </div>

              <div
                className="pt-2 flex items-center justify-between text-xs opacity-75 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <span>Magic Level 125</span>
                <span>Loyalty 40%</span>
              </div>
            </div>

            <div
              className="p-3 rounded-xl text-xs flex items-center space-x-2 border opacity-80"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--card)",
              }}
            >
              <Info
                className="w-4 h-4 shrink-0"
                style={{ color: "var(--primary)" }}
              />
              <span>
                O preview acima reage instantaneamente a cada alteração de cor
                ou preset selecionado.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ColorInputGroupProps {
  label: string;
  description: string;
  value: string;
  defaultValue: string;
  onChange: (value: string) => void;
}

function ColorInputGroup({
  label,
  description,
  value,
  defaultValue,
  onChange,
}: ColorInputGroupProps) {
  const currentValue = value || defaultValue;

  // Garante que o input nativo <input type="color"> receba um HEX válido (#xxxxxx) se possível
  const getPickerHex = (val: string) => {
    if (val && val.startsWith("#") && (val.length === 4 || val.length === 7)) {
      return val;
    }
    return "#10b981"; // Fallback visual
  };

  return (
    <div className="space-y-2 p-3.5 border rounded-xl bg-background shadow-sm hover:border-primary/50 transition-all">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-foreground">{label}</label>
        <div
          className="w-5 h-5 rounded-full border shadow-inner shrink-0"
          style={{ backgroundColor: currentValue }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground leading-tight">
        {description}
      </p>

      <div className="flex items-center space-x-2 pt-1">
        <input
          type="color"
          value={getPickerHex(currentValue)}
          onChange={(e) => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg border cursor-pointer p-0.5 bg-transparent shrink-0"
        />
        <input
          type="text"
          value={value}
          placeholder={defaultValue}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 w-full px-3 py-1.5 text-xs border rounded-lg bg-card text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
    </div>
  );
}
