"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollableTabsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftBtn(scrollLeft > 2);
    // Margem de erro de 2px para arredondamentos do navegador
    setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    // Recheca o scroll se o conteúdo mudar de tamanho
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth / 2; // Rola meia tela por clique
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/tabs-wrapper w-full flex items-center">
      {showLeftBtn && (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer hidden md:flex absolute left-2 z-10 rounded-full bg-background/95 backdrop-blur-sm shadow-md h-8 w-8 opacity-0 group-hover/tabs-wrapper:opacity-100 transition-opacity border-border"
          onClick={() => scroll("left")}
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative px-0"
      >
        {children}
      </div>

      {showRightBtn && (
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer hidden md:flex absolute right-2 z-10 rounded-full bg-background/95 backdrop-blur-sm shadow-md h-8 w-8 opacity-0 group-hover/tabs-wrapper:opacity-100 transition-opacity border-border"
          onClick={() => scroll("right")}
          aria-label="Próximo"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
