import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getCompanyInfo } from "./actions/company";
import { getModules } from "./actions/info";
import { CompanyProvider } from "@/contexts/company-context";
import { ModulesProvider } from "@/contexts/modules-context";
import { CompanyUnavailable } from "@/components/company-unavailable";
import { generateThemeCss } from "@/lib/theme";

import { ThemeInjector } from "@/components/theme-injector";
import { FaviconInjector } from "@/components/favicon-injector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const companyRes = await getCompanyInfo();
  const companyData = companyRes?.success ? companyRes.data : null;

  if (companyData) {
    const faviconUrl = companyData.favicon || "/favicon.ico";
    const companyName = companyData.name || "Tibia-Info";
    const companyDescription = companyData.description || "";

    return {
      title: companyName,
      description: companyDescription,
      icons: {
        icon: faviconUrl,
      },
    };
  }

  return {
    title: "Tibia-Info",
    description: "",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const companyRes = await getCompanyInfo();
  const companyData = companyRes?.success ? companyRes.data : null;

  if (!companyData) {
    return (
      <html
        lang="pt-BR"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CompanyUnavailable />
          </ThemeProvider>
        </body>
      </html>
    );
  }

  const modulesRes = await getModules();
  const modulesData = modulesRes?.success ? modulesRes.data : null;
  const themeCss = generateThemeCss(companyData.theme);

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeInjector themeCss={themeCss} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CompanyProvider initialData={companyData}>
            <ModulesProvider initialData={modulesData}>
              <FaviconInjector />
              <Navbar />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
              <Toaster richColors />
            </ModulesProvider>
          </CompanyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
