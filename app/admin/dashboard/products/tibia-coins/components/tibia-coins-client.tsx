"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TibiaCoinsCard } from "./tibia-coins-card";
import { TibiaCoinsVariablesTable } from "./tibia-coins-variables-table";
import { TibiaCoinsStockModal } from "./tibia-coins-stock-modal";
import { TibiaCoinsEditModal } from "./tibia-coins-edit-modal";

interface TibiaCoinsClientProps {
  tibiaCoins: any[];
  variables: any[];
}

export function TibiaCoinsClient({ tibiaCoins, variables }: TibiaCoinsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  useEffect(() => {
    const id = searchParams.get("ptcid");
    if (id) {
      const product = tibiaCoins.find((p) => p.id === id);
      if (product) setSelectedProduct(product);
    }
  }, [searchParams, tibiaCoins]);

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    const params = new URLSearchParams(searchParams.toString());
    params.set("ptcid", product.id);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Gerenciar Tibia Coins</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie as moedas do jogo, tipos de compra e venda.
          </p>
        </div>
        <Button onClick={() => setIsStockModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Tibia Coins
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...tibiaCoins].sort((a, b) => {
          if (a.type === "SELL" && b.type === "BUY") return -1;
          if (a.type === "BUY" && b.type === "SELL") return 1;
          return 0;
        }).map((product) => (
          <TibiaCoinsCard
            key={product.id}
            product={product}
            isSelected={selectedProduct?.id === product.id}
            onClick={() => handleSelectProduct(product)}
            onEdit={() => setEditingProduct(product)}
          />
        ))}
      </div>

      {selectedProduct && (
        <div className="pt-6 border-t">
          <TibiaCoinsVariablesTable
            product={selectedProduct}
            variables={variables.filter((v) => v.productTibiaCoinsId === selectedProduct.id)}
          />
        </div>
      )}

      {isStockModalOpen && (
        <TibiaCoinsStockModal
          isOpen={isStockModalOpen}
          onClose={() => setIsStockModalOpen(false)}
          tibiaCoins={tibiaCoins}
        />
      )}

      {editingProduct && (
        <TibiaCoinsEditModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
        />
      )}
    </div>
  );
}
