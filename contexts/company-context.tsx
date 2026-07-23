"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { CompanyTheme } from "@/lib/theme";

// Adapte a interface de acordo com o retorno da sua API
export interface CompanyInfo {
  id?: string;
  name?: string;
  code?: string;
  logo?: string;
  favicon?: string;
  banner?: string;
  slogan?: string;
  theme?: CompanyTheme | null;
  [key: string]: any;
}

interface CompanyContextType {
  company: CompanyInfo | null;
  isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

interface CompanyProviderProps {
  children: ReactNode;
  initialData: CompanyInfo | null;
}

export function CompanyProvider({ children, initialData }: CompanyProviderProps) {
  return (
    <CompanyContext.Provider value={{ company: initialData, isLoading: false }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany deve ser usado dentro de um CompanyProvider");
  }
  return context;
}
