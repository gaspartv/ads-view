"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@teispace/next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-[4.5rem] rounded-full bg-muted/30 animate-pulse border border-border/50" />
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative flex h-9 w-[4.5rem] cursor-pointer items-center rounded-full border border-border/50 bg-muted/40 p-1 shadow-inner transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 overflow-hidden"
      aria-label="Alternar tema"
    >
      {/* Background track glow effect */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300 ease-in-out",
          isDark ? "bg-indigo-500/10" : "bg-amber-500/10",
        )}
      />

      {/* Track icons (Background) */}
      <div className="relative flex w-full justify-between px-2.5 z-0">
        <Sun className="h-3.5 w-3.5 text-amber-500/40 transition-colors duration-300 ease-in-out group-hover:text-amber-500/60" />
        <Moon className="h-3.5 w-3.5 text-indigo-500/40 transition-colors duration-300 ease-in-out group-hover:text-indigo-500/60" />
      </div>

      {/* Sliding thumb */}
      <div
        className={cn(
          "absolute left-1 flex h-7 w-7 items-center justify-center rounded-full bg-background shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-1 ring-border/20 transition-all duration-300 ease-in-out z-10",
          isDark ? "translate-x-[2.25rem]" : "translate-x-0",
        )}
      >
        <Sun
          className={cn(
            "absolute h-3.5 w-3.5 text-amber-500 transition-all duration-300 ease-in-out",
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100",
          )}
        />
        <Moon
          className={cn(
            "absolute h-3.5 w-3.5 text-indigo-500 transition-all duration-300 ease-in-out",
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0",
          )}
        />
      </div>
    </button>
  );
}
