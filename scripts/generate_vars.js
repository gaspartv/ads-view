const fs = require('fs');

const lightVars = `
  --background: oklch(0.99 0.005 150);
  --foreground: oklch(0.15 0.02 150);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0.02 150);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0.02 150);
  --primary: oklch(0.5 0.22 150);
  --primary-outline: oklch(0.5 0.22 150);
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.96 0.02 150);
  --secondary-foreground: oklch(0.2 0.05 150);
  --muted: oklch(0.96 0.02 150);
  --muted-foreground: oklch(0.55 0.02 150);
  --accent: oklch(0.96 0.03 150);
  --accent-foreground: oklch(0.2 0.05 150);
  --destructive: oklch(0.6 0.2 25);
  --destructive-foreground: oklch(0.98 0 0);
  --border: oklch(0.92 0.02 150);
  --input: oklch(0.92 0.02 150);
  --ring: oklch(0.5 0.22 150);
  --chart-1: oklch(0.6 0.18 155);
  --chart-2: oklch(0.6 0.15 130);
  --chart-3: oklch(0.5 0.12 170);
  --chart-4: oklch(0.7 0.15 160);
  --chart-5: oklch(0.8 0.12 150);
  --sidebar: oklch(0.98 0.01 150);
  --sidebar-foreground: oklch(0.15 0.02 150);
  --sidebar-primary: oklch(0.5 0.22 150);
  --sidebar-primary-foreground: oklch(0.98 0 0);
  --sidebar-accent: oklch(0.96 0.02 150);
  --sidebar-accent-foreground: oklch(0.2 0.05 150);
  --sidebar-border: oklch(0.92 0.02 150);
  --sidebar-ring: oklch(0.5 0.22 150);
`;

const darkVars = `
  --background: oklch(0.12 0.02 150);
  --foreground: oklch(0.98 0.01 150);
  --card: oklch(0.14 0.02 150);
  --card-foreground: oklch(0.98 0.01 150);
  --popover: oklch(0.14 0.02 150);
  --popover-foreground: oklch(0.98 0.01 150);
  --primary: oklch(0.65 0.22 150);
  --primary-outline: oklch(0.65 0.22 150);
  --primary-foreground: oklch(0.15 0.02 150);
  --secondary: oklch(0.2 0.03 150);
  --secondary-foreground: oklch(0.98 0.01 150);
  --muted: oklch(0.2 0.03 150);
  --muted-foreground: oklch(0.7 0.02 150);
  --accent: oklch(0.22 0.04 150);
  --accent-foreground: oklch(0.98 0.01 150);
  --destructive: oklch(0.6 0.2 25);
  --destructive-foreground: oklch(0.98 0 0);
  --border: oklch(0.2 0.03 150);
  --input: oklch(0.2 0.03 150);
  --ring: oklch(0.65 0.22 150);
  --chart-1: oklch(0.65 0.22 155);
  --chart-2: oklch(0.5 0.15 130);
  --chart-3: oklch(0.6 0.15 170);
  --chart-4: oklch(0.7 0.15 160);
  --chart-5: oklch(0.8 0.12 150);
  --sidebar: oklch(0.14 0.02 150);
  --sidebar-foreground: oklch(0.98 0.01 150);
  --sidebar-primary: oklch(0.65 0.22 150);
  --sidebar-primary-foreground: oklch(0.15 0.02 150);
  --sidebar-accent: oklch(0.22 0.04 150);
  --sidebar-accent-foreground: oklch(0.98 0.01 150);
  --sidebar-border: oklch(0.2 0.03 150);
  --sidebar-ring: oklch(0.65 0.22 150);
`;

function parse(str) {
  const lines = str.trim().split('\n');
  const res = {};
  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length === 2) {
      const key = parts[0].trim().replace('--', '');
      const val = parts[1].trim().replace(';', '');
      // to camelCase
      const camelKey = key.replace(/-([a-z0-9])/g, g => g[1].toUpperCase());
      res[camelKey] = val;
    }
  }
  return res;
}

const lightParsed = parse(lightVars);
const darkParsed = parse(darkVars);

const labels = {
  background: ["Fundo da Página", "Cor de fundo geral do site"],
  foreground: ["Texto Principal", "Cor dos títulos e textos corporativos"],
  card: ["Fundo de Cards", "Cor dos blocos de produto e containers"],
  cardForeground: ["Texto do Card", "Texto dentro de cards"],
  popover: ["Fundo Popover", "Menus suspensos e tooltips"],
  popoverForeground: ["Texto Popover", "Texto em menus suspensos"],
  primary: ["Cor Primária", "Botões de ação principal, destaques e links"],
  primaryForeground: ["Texto da Cor Primária", "Cor do texto nos botões primários"],
  primaryOutline: ["Cor de Contorno (Outline)", "Cor da borda e texto de botões secundários"],
  secondary: ["Cor Secundária", "Fundo de botões secundários"],
  secondaryForeground: ["Texto Secundário", "Texto em botões secundários"],
  muted: ["Mudo (Muted)", "Fundo de elementos inativos"],
  mutedForeground: ["Texto Mudo", "Textos discretos e placeholders"],
  accent: ["Destaque (Accent)", "Elementos e botões de destaque leve"],
  accentForeground: ["Texto Destaque", "Texto sobre o fundo de destaque"],
  destructive: ["Cor Destrutiva", "Botões de excluir ou erros"],
  destructiveForeground: ["Texto Destrutivo", "Texto sobre botões destrutivos"],
  border: ["Bordas", "Linhas divisórias e contornos de caixas"],
  input: ["Bordas de Input", "Bordas de campos de texto e seleções"],
  ring: ["Anel de Foco (Ring)", "Cor do contorno ao focar em um campo"],
  chart1: ["Gráfico 1", "Cor 1 para gráficos e métricas"],
  chart2: ["Gráfico 2", "Cor 2 para gráficos e métricas"],
  chart3: ["Gráfico 3", "Cor 3 para gráficos e métricas"],
  chart4: ["Gráfico 4", "Cor 4 para gráficos e métricas"],
  chart5: ["Gráfico 5", "Cor 5 para gráficos e métricas"],
  sidebar: ["Fundo da Sidebar", "Fundo da barra lateral do sistema"],
  sidebarForeground: ["Texto da Sidebar", "Texto na barra lateral"],
  sidebarPrimary: ["Cor Primária Sidebar", "Destaque principal na barra lateral"],
  sidebarPrimaryForeground: ["Texto Primário Sidebar", "Texto de destaque na barra lateral"],
  sidebarAccent: ["Destaque da Sidebar", "Item focado na barra lateral"],
  sidebarAccentForeground: ["Texto Destaque Sidebar", "Texto do item focado na barra lateral"],
  sidebarBorder: ["Borda da Sidebar", "Separador da barra lateral"],
  sidebarRing: ["Foco da Sidebar", "Contorno ao focar na barra lateral"],
};

const result = [];
for (const key of Object.keys(lightParsed)) {
  result.push({
    id: key,
    label: labels[key]?.[0] || key,
    description: labels[key]?.[1] || "",
    defaultLight: lightParsed[key],
    defaultDark: darkParsed[key],
  });
}

const path = require('path');
fs.writeFileSync(path.join(__dirname, '..', 'THEME_VARS_ARRAY.json'), JSON.stringify(result, null, 2));
