"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
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
    description: "Preço justo e entrega rápida...",
    image: process.env.NEXT_PUBLIC_API_URL + "/uploads/system/tibia-coins.png",
  },
  {
    id: "characters",
    name: "Personagens",
    description: "Compre aqui seu novo personagem...",
    image: process.env.NEXT_PUBLIC_API_URL + "/uploads/system/characters.png",
  },
  {
    id: "account-loyalty",
    name: "Contas com Loyalty",
    description: "Contas com até 50% de loyalty...",
    image: process.env.NEXT_PUBLIC_API_URL + "/uploads/system/acc-loyalty.png",
  },
];

export function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftBtn(scrollLeft > 0);
      // Small buffer (1px) for rounding errors
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Scroll by the width of approximately one item + gap (e.g. 300px)
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full group py-4">
      {/* Scroll Buttons */}
      {showLeftBtn && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      {showRightBtn && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar justify-center md:justify-start max-w-max mx-auto px-1"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products/${category.id}`}
            className="group/card relative flex flex-col overflow-hidden rounded-2xl border-2 bg-card/80 backdrop-blur-md text-card-foreground shadow-sm hover:shadow-md transition-all snap-center shrink-0 w-[240px] md:w-[280px]"
          >
            <div className="aspect-square w-full overflow-hidden bg-transparent flex items-center justify-center p-4">
              <img
                src={category.image}
                alt={category.name}
                className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover/card:scale-105"
              />
            </div>
            <div className="p-4 text-center border-t">
              <h3 className="text-lg font-bold group-hover/card:text-primary transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {category.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
