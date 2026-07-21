"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStockBatch } from "@/app/actions/product-tibia-coins";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatters";

interface TibiaCoinsStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  tibiaCoins: any[];
}

export function TibiaCoinsStockModal({ isOpen, onClose, tibiaCoins }: TibiaCoinsStockModalProps) {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    initialAmount: "",
    costPrice: "",
    supplierName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "costPrice") {
      setFormData((prev) => ({ ...prev, [name]: formatCurrency(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const buyProduct = tibiaCoins.find((tc) => tc.type === "BUY");
        if (!buyProduct) throw new Error("Produto não encontrado.");

        if (!formData.initialAmount || !formData.costPrice) {
          throw new Error("Preencha todos os campos obrigatórios.");
        }

        const costPrice = Number(formData.costPrice.replace(/\D/g, ""));
        const initialAmount = Number(formData.initialAmount);

        if (isNaN(initialAmount) || initialAmount <= 0) {
          throw new Error("Quantidade inicial inválida.");
        }

        const data = {
          productTibiaCoinsId: buyProduct.id,
          initialAmount,
          costPrice,
          supplierName: formData.supplierName,
        };

        const res = await createStockBatch(data);
        if (res?.success) {
          toast.success("Estoque adicionado com sucesso!");
          onClose();
        }
      } catch (error: any) {
        toast.error(error.message || "Erro ao adicionar estoque.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Tibia Coins (Estoque)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Quantidade (TC) *</Label>
            <Input
              name="initialAmount"
              type="number"
              placeholder="Ex: 250"
              value={formData.initialAmount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Preço de Custo (Total) *</Label>
            <Input
              name="costPrice"
              placeholder="R$ 0,00"
              value={formData.costPrice}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Fornecedor (Opcional)</Label>
            <Input
              name="supplierName"
              placeholder="Nome do fornecedor"
              value={formData.supplierName}
              onChange={handleChange}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
