"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TibiaCoinsTabsProps {
  buyCard: React.ReactNode;
  sellCard: React.ReactNode;
  hasBuy: boolean;
  hasSell: boolean;
}

export function TibiaCoinsTabs({
  buyCard,
  sellCard,
  hasBuy,
  hasSell,
}: TibiaCoinsTabsProps) {
  // O tipo BUY significa que o cliente COMPRA da loja.
  // O tipo SELL significa que o cliente VENDE para a loja.
  const [activeTab, setActiveTab] = useState<"BUY" | "SELL">(
    hasBuy ? "BUY" : "SELL",
  );

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto mb-4">
      <div className="flex bg-muted/80 rounded-t-lg w-full">
        <button
          className={cn(
            "cursor-pointer flex-1 py-2.5 px-4 rounded-none rounded-tl-lg text-sm font-semibold transition-all",
            activeTab === "BUY"
              ? "bg-background text-primary shadow-sm border border-primary/20 ring-1 ring-primary/50"
              : "text-muted-foreground hover:text-foreground",
            !hasBuy && "opacity-50 cursor-not-allowed",
          )}
          onClick={() => hasBuy && setActiveTab("BUY")}
          disabled={!hasBuy}
        >
          Comprar
        </button>
        <button
          className={cn(
            "cursor-pointer flex-1 py-2.5 px-4 rounded-none rounded-tr-lg text-sm font-semibold transition-all",
            activeTab === "SELL"
              ? "bg-background text-foreground shadow-sm border border-border ring-1 ring-border/50"
              : "text-muted-foreground hover:text-foreground",
            !hasSell && "opacity-50 cursor-not-allowed",
          )}
          onClick={() => hasSell && setActiveTab("SELL")}
          disabled={!hasSell}
        >
          Vender
        </button>
      </div>

      <div className="w-full flex justify-center">
        {activeTab === "BUY" ? buyCard : sellCard}
      </div>
    </div>
  );
}
