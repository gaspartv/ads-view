"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string;
}

const categories: Category[] = [
  {
    id: "tibia-coins",
    name: "Tibia Coins",
    description: "Preço justo e entrega rápida",
    image: process.env.NEXT_PUBLIC_API_URL + "/uploads/system/tibia-coins.png",
  },
  {
    id: "characters",
    name: "Personagens",
    description: "Compre aqui seu novo personagem",
    image: process.env.NEXT_PUBLIC_API_URL + "/uploads/system/characters.png",
  },
  {
    id: "account-loyalty",
    name: "Contas com Loyalty",
    description: "Contas com até 50% de loyalty",
    image: process.env.NEXT_PUBLIC_API_URL + "/uploads/system/acc-loyalty.png",
  },
];

export function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftBtn(scrollLeft > 2);
    setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 2);

    // Detect active index for dots
    const itemWidth = el.scrollWidth / categories.length;
    setActiveIndex(Math.round(scrollLeft / itemWidth));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = el.scrollWidth / categories.length;
    el.scrollBy({ left: direction === "left" ? -itemWidth : itemWidth, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const itemWidth = el.scrollWidth / categories.length;
    el.scrollTo({ left: itemWidth * index, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      {/* Carousel wrapper com botões desktop */}
      <div className="relative group">
        {/* Botão esquerdo - apenas desktop */}
        {showLeftBtn && (
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/90 backdrop-blur-sm shadow-md h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {showRightBtn && (
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/90 backdrop-blur-sm shadow-md h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-1 pb-2 md:justify-center"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.id}`}
              className="group/card relative flex flex-col overflow-hidden rounded-2xl border-2 bg-card/80 backdrop-blur-md text-card-foreground shadow-sm hover:shadow-lg active:scale-[0.98] transition-all snap-center shrink-0 w-[calc(80vw-2rem)] max-w-[240px] sm:w-[220px] md:w-[260px]"
            >
              <div className="aspect-square w-full overflow-hidden bg-transparent flex items-center justify-center p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover/card:scale-105"
                />
              </div>
              <div className="p-4 text-center border-t">
                <h3 className="text-base font-bold group-hover/card:text-primary transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {category.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Dots de navegação — visíveis apenas em mobile */}
      <div className="flex items-center justify-center gap-2 mt-4 md:hidden" role="tablist" aria-label="Navegação por categorias">
        {categories.map((cat, index) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeIndex === index}
            aria-label={`Ir para ${cat.name}`}
            onClick={() => scrollToIndex(index)}
            className={`rounded-full transition-all duration-300 ${
              activeIndex === index
                ? "w-6 h-2 bg-primary"
                : "w-2 h-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
