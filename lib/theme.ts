export interface ThemeColorPalette {
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  popover?: string;
  popoverForeground?: string;
  primary?: string;
  primaryForeground?: string;
  primaryOutline?: string;
  secondary?: string;
  secondaryForeground?: string;
  muted?: string;
  mutedForeground?: string;
  accent?: string;
  accentForeground?: string;
  destructive?: string;
  destructiveForeground?: string;
  border?: string;
  input?: string;
  ring?: string;
  sidebar?: string;
  sidebarForeground?: string;
  sidebarPrimary?: string;
  sidebarPrimaryForeground?: string;
  sidebarAccent?: string;
  sidebarAccentForeground?: string;
  sidebarBorder?: string;
  sidebarRing?: string;
  [key: string]: string | undefined;
}

export interface CompanyTheme {
  light?: ThemeColorPalette;
  dark?: ThemeColorPalette;
  radius?: string;
  [key: string]: any;
}

/**
 * Converte chave camelCase ou kebab-case para o nome da variável CSS (ex: primaryForeground -> --primary-foreground)
 */
function formatCssVarName(key: string): string {
  if (key.startsWith("--")) return key;
  const kebab = key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return `--${kebab}`;
}

/**
 * Gera a string CSS inline com seletores :root e .dark sobrescrevendo as variáveis padrão do globals.css.
 * Se theme for nulo ou omisso em alguma cor, o CSS utilizará o fallback padrão do globals.css.
 */
export function generateThemeCss(theme?: CompanyTheme | null): string {
  if (!theme || typeof theme !== "object") return "";

  const cssRules: string[] = [];

  const rootVars: string[] = [];

  if (theme.radius && typeof theme.radius === "string") {
    rootVars.push(`  --radius: ${theme.radius};`);
  }

  function fillMissingColors(palette: ThemeColorPalette): ThemeColorPalette {
    const p = { ...palette };
    if (!p.muted && p.secondary) p.muted = p.secondary;
    if (!p.mutedForeground && p.secondaryForeground) p.mutedForeground = p.secondaryForeground;
    if (!p.border && p.secondary) p.border = p.secondary;
    if (!p.input && p.border) p.input = p.border;
    if (!p.ring && p.primary) p.ring = p.primary;
    if (!p.popover && p.card) p.popover = p.card;
    if (!p.popoverForeground && p.cardForeground) p.popoverForeground = p.cardForeground;
    
    if (!p.sidebar && p.background) p.sidebar = p.background;
    if (!p.sidebarForeground && p.foreground) p.sidebarForeground = p.foreground;
    if (!p.sidebarBorder && p.border) p.sidebarBorder = p.border;
    if (!p.sidebarRing && p.ring) p.sidebarRing = p.ring;
    if (!p.sidebarPrimary && p.primary) p.sidebarPrimary = p.primary;
    if (!p.sidebarPrimaryForeground && p.primaryForeground) p.sidebarPrimaryForeground = p.primaryForeground;
    if (!p.sidebarAccent && p.secondary) p.sidebarAccent = p.secondary;
    if (!p.sidebarAccentForeground && p.secondaryForeground) p.sidebarAccentForeground = p.secondaryForeground;
    
    return p;
  }

  if (theme.light && typeof theme.light === "object") {
    const lightPalette = fillMissingColors(theme.light);
    for (const [key, value] of Object.entries(lightPalette)) {
      if (value && typeof value === "string") {
        const varName = formatCssVarName(key);
        rootVars.push(`  ${varName}: ${value};`);
      }
    }
  }

  if (rootVars.length > 0) {
    cssRules.push(`:root {\n${rootVars.join("\n")}\n}`);
  }

  if (theme.dark && typeof theme.dark === "object") {
    const darkVars: string[] = [];
    const darkPalette = fillMissingColors(theme.dark);
    for (const [key, value] of Object.entries(darkPalette)) {
      if (value && typeof value === "string") {
        const varName = formatCssVarName(key);
        darkVars.push(`  ${varName}: ${value};`);
      }
    }
    if (darkVars.length > 0) {
      cssRules.push(`.dark {\n${darkVars.join("\n")}\n}`);
    }
  }

  return cssRules.join("\n");
}
