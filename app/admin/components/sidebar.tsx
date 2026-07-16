"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Layers,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // Menu mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Menu desktop recolhido
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const links = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Categorias", href: "/admin/dashboard/category", icon: Layers },
    { name: "Produtos", href: "/admin/dashboard/product", icon: Package },
    { name: "Relatórios", href: "/admin/dashboard/reports", icon: Package },
  ];

  return (
    <>
      {/* Botão Sanduíche Mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-card border rounded-md shadow-md lg:hidden hover:bg-muted transition-colors"
        aria-label="Abrir menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-foreground" />
        )}
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-card/95 backdrop-blur-md border-r flex flex-col transition-all duration-300 ease-in-out lg:static lg:h-screen lg:shrink-0",
          isOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        <div
          className={cn(
            "p-6 border-b flex items-center h-[72px] relative",
            isCollapsed ? "justify-center px-0" : "",
          )}
        >
          {!isCollapsed ? (
            <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 truncate">
              Admin Panel
            </h2>
          ) : (
            <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              A
            </h2>
          )}

          {/* Botão de Recolher/Expandir (Visível apenas em telas grandes) */}
          <button
            onClick={toggleCollapse}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-card border shadow-sm rounded-full p-1 hidden lg:flex items-center justify-center hover:bg-muted transition-colors z-50 text-muted-foreground hover:text-foreground"
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            // Verifica se o pathname começa com o href do link (para manter ativo nas subpáginas)
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin/dashboard" &&
                pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? link.name : undefined}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-200 group",
                  isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-2.5",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary/70",
                  )}
                />
                {!isCollapsed && <span className="truncate">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Link
            href="/"
            title={isCollapsed ? "Sair" : undefined}
            className={cn(
              "flex items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group",
              isCollapsed ? "justify-center p-3" : "space-x-3 px-3 py-2.5",
            )}
          >
            <LogOut className="w-5 h-5 shrink-0 transition-colors group-hover:text-destructive" />
            {!isCollapsed && <span className="truncate">Sair</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
