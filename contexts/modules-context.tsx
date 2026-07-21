"use client";

import React, { createContext, useContext, ReactNode } from "react";

export interface ModulesInfo {
  // O tipo exato vai depender do que a API retorna,
  // mas baseado no Prisma seria o objeto Company com CompanyModules incluídos
  [key: string]: any;
}

interface ModulesContextType {
  modules: ModulesInfo | null;
}

const ModulesContext = createContext<ModulesContextType | undefined>(undefined);

interface ModulesProviderProps {
  children: ReactNode;
  initialData: ModulesInfo | null;
}

export function ModulesProvider({ children, initialData }: ModulesProviderProps) {
  return (
    <ModulesContext.Provider value={{ modules: initialData }}>
      {children}
    </ModulesContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModulesContext);
  if (context === undefined) {
    throw new Error("useModules deve ser usado dentro de um ModulesProvider");
  }
  return context;
}
