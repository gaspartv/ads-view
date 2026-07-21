"use client";

import { useState } from "react";
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
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

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
        {tibiaCoins.map((product) => (
          <TibiaCoinsCard
            key={product.id}
            product={product}
            isSelected={selectedProduct?.id === product.id}
            onClick={() => setSelectedProduct(product)}
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
