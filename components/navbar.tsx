"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");

  const navItems = [
    { name: "Início", href: "/" },
    { name: "Tibia Coins", href: "/products/tibia-coins" },
    { name: "Personagens", href: "/products/characters" },
    { name: "Conta com Loyalty", href: "/products/account-loyalty" },
    { name: "Contato", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2 rounded-xl text-primary-foreground group-hover:bg-primary/90 transition-colors">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">
                Thygas<span className="text-primary">Coins</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isAdminRoute && (
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {!isAdminRoute && isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
