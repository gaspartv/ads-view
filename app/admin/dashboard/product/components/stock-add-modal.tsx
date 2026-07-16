"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addStockBatch } from "@/app/actions/stock-batch";

interface StockAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export function StockAddModal({ isOpen, onClose, product }: StockAddModalProps) {
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [supplierName, setSupplierName] = useState("");

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("Informe uma quantidade válida.");
      return;
    }

    if (!costPrice) {
      toast.error("Informe o preço de custo.");
      return;
    }

    const numericCostPrice = Number(costPrice.replace(/\D/g, ""));
    if (numericCostPrice < 0) {
      toast.error("Preço de custo inválido.");
      return;
    }

    startTransition(async () => {
      const result = await addStockBatch({
        amount: Number(amount),
        costPrice: numericCostPrice,
        supplierName: supplierName.trim() || undefined,
        productId: product.id,
      });

      if (result.success) {
        toast.success(result.message);
        setAmount("");
        setCostPrice("");
        setSupplierName("");
        onClose();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setCostPrice("");
      return;
    }
    
    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value) / 100);
    
    setCostPrice(formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Repor Estoque</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Adicionando lote para: <strong className="text-foreground">{product.name}</strong>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Quantidade</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              placeholder="Ex: 100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="costPrice">Preço de Custo (Total do Lote)</Label>
            <Input
              id="costPrice"
              type="text"
              placeholder="R$ 0,00"
              value={costPrice}
              onChange={handlePriceChange}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplierName">Nome do Fornecedor (Opcional)</Label>
            <Input
              id="supplierName"
              type="text"
              placeholder="Ex: João Silva"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              disabled={isPending}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
