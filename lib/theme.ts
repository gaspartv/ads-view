export interface ThemeColorPalette {
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  popover?: string;
  popoverForeground?: string;
  primary?: string;
  primaryForeground?: string;
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

  if (theme.light && typeof theme.light === "object") {
    for (const [key, value] of Object.entries(theme.light)) {
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
    for (const [key, value] of Object.entries(theme.dark)) {
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
