import { getCompanyInfo } from "@/app/actions/company";
import { ThemeEditor } from "./components/theme-editor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciamento de Tema | Painel Admin",
  description: "Personalize as cores e aparência do site da sua empresa.",
};

export default async function ThemeAdminPage() {
  const res = await getCompanyInfo();
  const company = res?.success ? res.data : null;

  return (
    <div className="min-h-screen bg-background">
      <ThemeEditor initialTheme={company?.theme} />
    </div>
  );
}


