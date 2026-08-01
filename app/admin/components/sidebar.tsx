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
  ChevronDown,
  ChevronUp,
  Banknote,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useModules } from "@/contexts/modules-context";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // Menu mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Menu desktop recolhido
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const { modules } = useModules();

  const activeModules =
    modules?.CompanyModules?.map((cm: any) => cm?.Module?.code) || [];

  const rawLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    {
      name: "Produtos",
      href: "/admin/dashboard/products",
      icon: Layers,
      subItems: [
        {
          name: "Personagens",
          href: "/admin/dashboard/products/characters",
          moduleCode: "MD-003",
        },
        {
          name: "Contas com loyalty",
          href: "/admin/dashboard/products/account-loyalty",
          moduleCode: "MD-002",
        },
        {
          name: "Tibia Coins",
          href: "/admin/dashboard/products/tibia-coins",
          moduleCode: "MD-001",
        },
      ],
    },
    {
      name: "Relatórios",
      href: "/admin/dashboard/reports",
      icon: Package,
      moduleCode: "MD-004",
    },
    {
      name: "Vendas",
      href: "/admin/dashboard/orders",
      icon: Banknote,
      moduleCode: "MD-005",
    },
    {
      name: "Empresa",
      href: "/admin/dashboard/company",
      icon: Palette,
      subItems: [
        {
          name: "Aparência",
          href: "/admin/dashboard/company/theme",
          moduleCode: null,
        },
      ],
    },
  ];

  const links = rawLinks
    .map((link) => {
      if (link.subItems) {
        return {
          ...link,
          subItems: link.subItems.filter(
            (sub) => !sub.moduleCode || activeModules.includes(sub.moduleCode),
          ),
        };
      }
      return link;
    })
    .filter((link) => {
      if (
        (link as any).moduleCode &&
        !activeModules.includes((link as any).moduleCode)
      ) {
        return false;
      }
      if (link.subItems && link.subItems.length === 0) {
        return false;
      }
      return true;
    });

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
          "cursor-default fixed inset-y-0 left-0 z-40 lg:z-auto bg-card/95 backdrop-blur-md border-r flex flex-col transition-[transform,width,box-shadow] duration-300 ease-in-out lg:static lg:h-screen lg:shrink-0",
          isOpen
            ? "translate-x-0 shadow-2xl pointer-events-auto"
            : "-translate-x-full lg:translate-x-0 pointer-events-none lg:pointer-events-auto",
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
            className="cursor-pointer absolute -right-3 top-1/2 -translate-y-1/2 bg-card border shadow-sm rounded-full p-1 hidden lg:flex items-center justify-center hover:bg-muted transition-colors z-50 text-muted-foreground hover:text-foreground"
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
            const hasSubItems = !!link.subItems && link.subItems.length > 0;
            const isOpenMenu = !!openMenus[link.href];
            // Verifica se o pathname começa com o href do link (para manter ativo nas subpáginas)
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin/dashboard" &&
                pathname.startsWith(link.href));

            return (
              <div key={link.href} className="flex flex-col space-y-1">
                <div
                  className={cn(
                    "flex items-center rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
                    isCollapsed ? "justify-center" : "",
                  )}
                >
                  <Link
                    href={link.href}
                    onClick={() => {
                      if (!hasSubItems) {
                        setIsOpen(false);
                      } else if (isCollapsed) {
                        setIsCollapsed(false);
                        setOpenMenus((prev) => ({
                          ...prev,
                          [link.href]: true,
                        }));
                      }
                    }}
                    title={isCollapsed ? link.name : undefined}
                    className={cn(
                      "flex-1 flex items-center",
                      isCollapsed
                        ? "p-3 justify-center"
                        : "space-x-3 px-3 py-2.5",
                      hasSubItems && !isCollapsed ? "rounded-r-none" : "",
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
                    {!isCollapsed && (
                      <span className="truncate flex-1">{link.name}</span>
                    )}
                  </Link>

                  {hasSubItems && !isCollapsed && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenus((prev) => ({
                          ...prev,
                          [link.href]: !prev[link.href],
                        }));
                      }}
                      className={cn(
                        "cursor-pointer p-2.5 shrink-0 rounded-r-lg transition-colors flex items-center justify-center",
                        isActive
                          ? "hover:bg-primary/20"
                          : "hover:bg-black/5 dark:hover:bg-white/5",
                      )}
                      aria-label={
                        isOpenMenu ? "Recolher menu" : "Expandir menu"
                      }
                    >
                      {isOpenMenu ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {hasSubItems && isOpenMenu && !isCollapsed && (
                  <div className="flex flex-col pl-9 space-y-1 mt-1">
                    {link.subItems?.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "px-3 py-2 rounded-md text-sm transition-colors",
                            isSubActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                          )}
                        >
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
