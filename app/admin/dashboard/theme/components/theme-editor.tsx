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
        primary: "#10b981",
        primaryForeground: "#ffffff",
        background: "#f9fafb",
        foreground: "#111827",
        card: "#ffffff",
        cardForeground: "#111827",
        secondary: "#f3f4f6",
        secondaryForeground: "#1f2937",
        accent: "#ecfdf5",
        border: "#e5e7eb",
      },
      dark: {
        primary: "#10b981",
        primaryForeground: "#064e3b",
        background: "#0f172a",
        foreground: "#f8fafc",
        card: "#1e293b",
        cardForeground: "#f8fafc",
        secondary: "#334155",
        secondaryForeground: "#f8fafc",
        accent: "#064e3b",
        border: "#334155",
      },
      radius: "0.75rem",
    },
  },
  {
    id: "ocean",
    name: "Azul Oceano",
    description: "Elegante, seguro e profissional.",
    previewColor: "#2563eb",
    theme: {
      light: {
        primary: "#2563eb",
        primaryForeground: "#ffffff",
        background: "#f8fafc",
        foreground: "#0f172a",
        card: "#ffffff",
        cardForeground: "#0f172a",
        secondary: "#f1f5f9",
        secondaryForeground: "#1e293b",
        accent: "#eff6ff",
        border: "#e2e8f0",
      },
      dark: {
        primary: "#3b82f6",
        primaryForeground: "#1e3a8a",
        background: "#0b1329",
        foreground: "#f8fafc",
        card: "#172554",
        cardForeground: "#f8fafc",
        secondary: "#1e293b",
        secondaryForeground: "#f8fafc",
        accent: "#1e3a8a",
        border: "#1e293b",
      },
      radius: "0.5rem",
    },
  },
  {
    id: "cyberpunk",
    name: "Roxo Cyberpunk",
    description: "Futurista, vibrante e ideal para jogos/gaming.",
    previewColor: "#9333ea",
    theme: {
      light: {
        primary: "#9333ea",
        primaryForeground: "#ffffff",
        background: "#faf5ff",
        foreground: "#3b0764",
        card: "#ffffff",
        cardForeground: "#3b0764",
        secondary: "#f3e8ff",
        secondaryForeground: "#581c87",
        accent: "#faf5ff",
        border: "#e9d5ff",
      },
      dark: {
        primary: "#a855f7",
        primaryForeground: "#3b0764",
        background: "#180a29",
        foreground: "#faf5ff",
        card: "#2e1065",
        cardForeground: "#faf5ff",
        secondary: "#3b0764",
        secondaryForeground: "#faf5ff",
        accent: "#581c87",
        border: "#4c1d95",
      },
      radius: "0.75rem",
    },
  },
  {
    id: "amber",
    name: "Âmbar Dourado",
    description: "Quente, dinâmico e marcante.",
    previewColor: "#d97706",
    theme: {
      light: {
        primary: "#d97706",
        primaryForeground: "#ffffff",
        background: "#fffbeb",
        foreground: "#78350f",
        card: "#ffffff",
        cardForeground: "#78350f",
        secondary: "#fef3c7",
        secondaryForeground: "#92400e",
        accent: "#fffbeb",
        border: "#fde68a",
      },
      dark: {
        primary: "#f59e0b",
        primaryForeground: "#78350f",
        background: "#1c1917",
        foreground: "#fef3c7",
        card: "#292524",
        cardForeground: "#fef3c7",
        secondary: "#44403c",
        secondaryForeground: "#fef3c7",
        accent: "#78350f",
        border: "#44403c",
      },
      radius: "0.5rem",
    },
  },
];

export function ThemeEditor({ initialTheme }: ThemeEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { company } = useCompany();

  const [theme, setTheme] = useState<CompanyTheme>(() => {
    return initialTheme || company?.theme || {};
  });

  const [activeTab, setActiveTab] = useState<
    "light" | "dark" | "style" | "presets"
  >("light");
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
    console.log("REACT ONCLICK FIRED!");
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

    const defaultColors =
      mode === "light"
        ? {
            primary: "oklch(0.5 0.22 150)",
            primaryForeground: "oklch(0.98 0 0)",
            background: "oklch(0.99 0.005 150)",
            foreground: "oklch(0.15 0.02 150)",
            card: "oklch(1 0 0)",
            cardForeground: "oklch(0.15 0.02 150)",
            secondary: "oklch(0.96 0.02 150)",
            secondaryForeground: "oklch(0.2 0.05 150)",
            border: "oklch(0.92 0.02 150)",
          }
        : {
            primary: "oklch(0.65 0.22 150)",
            primaryForeground: "oklch(0.15 0.02 150)",
            background: "oklch(0.12 0.02 150)",
            foreground: "oklch(0.98 0.01 150)",
            card: "oklch(0.14 0.02 150)",
            cardForeground: "oklch(0.98 0.01 150)",
            secondary: "oklch(0.2 0.03 150)",
            secondaryForeground: "oklch(0.98 0.01 150)",
            border: "oklch(0.2 0.03 150)",
          };

    const primary = palette.primary || defaultColors.primary;
    const primaryForeground =
      palette.primaryForeground || defaultColors.primaryForeground;
    const background = palette.background || defaultColors.background;
    const foreground = palette.foreground || defaultColors.foreground;
    const card = palette.card || defaultColors.card;
    const cardForeground =
      palette.cardForeground || defaultColors.cardForeground;
    const secondary = palette.secondary || defaultColors.secondary;
    const secondaryForeground =
      palette.secondaryForeground || defaultColors.secondaryForeground;
    const border = palette.border || defaultColors.border;
    const radius = theme.radius || "0.75rem";

    return {
      background,
      color: foreground,
      borderColor: border,
      borderRadius: radius,
      "--primary": primary,
      "--primary-foreground": primaryForeground,
      "--background": background,
      "--foreground": foreground,
      "--card": card,
      "--card-foreground": cardForeground,
      "--secondary": secondary,
      "--secondary-foreground": secondaryForeground,
      "--border": border,
      "--radius": radius,
    } as React.CSSProperties;
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
          {/* Navegação de Abas */}
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
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
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

            <button
              type="button"
              onClick={() => setActiveTab("presets")}
              className={cn(
                "cursor-pointer flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all",
                activeTab === "presets"
                  ? "bg-card text-foreground shadow-sm border"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50",
              )}
            >
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Presets</span>
            </button>
          </div>

          {/* Conteúdo: Modo Claro / Modo Escuro */}
          {(activeTab === "light" || activeTab === "dark") && (
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-2">
                  {activeTab === "light" ? (
                    <Sun className="w-5 h-5 text-amber-500" />
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ColorInputGroup
                  label="Cor Primária"
                  description="Botões de ação principal, destaques e links"
                  value={theme[activeTab]?.primary || ""}
                  defaultValue={activeTab === "light" ? "#10b981" : "#10b981"}
                  onChange={(val) =>
                    handleColorChange(activeTab, "primary", val)
                  }
                />

                <ColorInputGroup
                  label="Texto da Cor Primária"
                  description="Cor do texto nos botões primários"
                  value={theme[activeTab]?.primaryForeground || ""}
                  defaultValue={activeTab === "light" ? "#ffffff" : "#064e3b"}
                  onChange={(val) =>
                    handleColorChange(activeTab, "primaryForeground", val)
                  }
                />

                <ColorInputGroup
                  label="Fundo da Página"
                  description="Cor de fundo geral do site"
                  value={theme[activeTab]?.background || ""}
                  defaultValue={activeTab === "light" ? "#f9fafb" : "#0f172a"}
                  onChange={(val) =>
                    handleColorChange(activeTab, "background", val)
                  }
                />

                <ColorInputGroup
                  label="Texto Principal"
                  description="Cor dos títulos e textos corporativos"
                  value={theme[activeTab]?.foreground || ""}
                  defaultValue={activeTab === "light" ? "#111827" : "#f8fafc"}
                  onChange={(val) =>
                    handleColorChange(activeTab, "foreground", val)
                  }
                />

                <ColorInputGroup
                  label="Fundo de Cards"
                  description="Cor dos blocos de produto e containers"
                  value={theme[activeTab]?.card || ""}
                  defaultValue={activeTab === "light" ? "#ffffff" : "#1e293b"}
                  onChange={(val) => handleColorChange(activeTab, "card", val)}
                />

                <ColorInputGroup
                  label="Bordas"
                  description="Linhas divisórias e contornos de caixas"
                  value={theme[activeTab]?.border || ""}
                  defaultValue={activeTab === "light" ? "#e5e7eb" : "#334155"}
                  onChange={(val) =>
                    handleColorChange(activeTab, "border", val)
                  }
                />
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
                  <Sparkles className="w-5 h-5 text-emerald-500" />
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
        <div className="lg:col-span-5 space-y-4">
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
                <Sun className="w-3.5 h-3.5 text-amber-500" />
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
          className="flex-1 px-3 py-1.5 text-xs border rounded-lg bg-card text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
    </div>
  );
}
