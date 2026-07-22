"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { useModules } from "@/contexts/modules-context";

interface SubItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  children?: SubItem[];
  moduleCode?: string;
}

const navItems: NavItem[] = [
  { name: "Início", href: "/" },
  {
    name: "Tibia Coins",
    moduleCode: "MD-001",
    children: [
      { name: "Comprar Tibia Coins", href: "/products/tibia-coins/buy" },
      { name: "Vender Tibia Coins", href: "/products/tibia-coins/sell" },
    ],
  },
  { name: "Personagens", href: "/products/characters", moduleCode: "MD-003" },
  {
    name: "Conta com Loyalty",
    href: "/products/account-loyalty",
    moduleCode: "MD-002",
  },
  { name: "Contato", href: "/contact" },
];

function DesktopDropdown({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isActive = item.children?.some((c) => pathname.startsWith(c.href));

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
          isActive ? "text-primary font-semibold" : "text-muted-foreground"
        }`}
      >
        {item.name}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 rounded-xl border bg-popover shadow-lg overflow-hidden transition-all duration-200 origin-top ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {item.children!.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            onClick={() => setOpen(false)}
            className={`block px-4 py-3 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
              pathname.startsWith(child.href)
                ? "bg-primary/10 text-primary"
                : "text-popover-foreground"
            }`}
          >
            {child.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileSubMenu({
  item,
  pathname,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isActive = item.children?.some((c) => pathname.startsWith(c.href));

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
        }`}
      >
        {item.name}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-40" : "max-h-0"
        }`}
      >
        {item.children!.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            onClick={onClose}
            className={`block pl-8 pr-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              pathname.startsWith(child.href)
                ? "text-primary"
                : "text-muted-foreground active:bg-muted"
            }`}
          >
            {child.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { modules } = useModules();

  const isAdminRoute = pathname.startsWith("/admin");

  // Determine active modules from API response
  const activeModules =
    modules?.CompanyModules?.map((cm: any) => cm?.Module?.code) || [];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.moduleCode) return true;
    return activeModules.includes(item.moduleCode);
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground group-hover:bg-primary/90 transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">
              Thygas<span className="text-primary">Coins</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isAdminRoute && (
            <nav className="hidden md:flex items-center gap-6">
              {filteredNavItems.map((item) =>
                item.children ? (
                  <DesktopDropdown
                    key={item.name}
                    item={item}
                    pathname={pathname}
                  />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === item.href
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ),
              )}
            </nav>
          )}

          {/* Mobile Hamburger Button */}
          {!isAdminRoute && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {!isAdminRoute && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-[32rem] border-t bg-background"
              : "max-h-0"
          }`}
        >
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {filteredNavItems.map((item) =>
              item.children ? (
                <MobileSubMenu
                  key={item.name}
                  item={item}
                  pathname={pathname}
                  onClose={() => setIsMobileMenuOpen(false)}
                />
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground active:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
