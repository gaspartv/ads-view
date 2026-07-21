"use client";

import { useState, useTransition, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { editProductTibiaCoins } from "@/app/actions/product-tibia-coins";
import { toast } from "sonner";

interface TibiaCoinsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export function TibiaCoinsEditModal({ isOpen, onClose, product }: TibiaCoinsEditModalProps) {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    description: "",
    seoTitle: "",
    seoDescription: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        description: product.description || "",
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await editProductTibiaCoins(product.id, formData);
        if (res?.success) {
          toast.success("Produto atualizado com sucesso!");
          onClose();
        }
      } catch (error: any) {
        toast.error(error.message || "Erro ao atualizar produto.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Editar {product?.type === "BUY" ? "Venda" : "Compra"} de Tibia Coins
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              name="description"
              placeholder="Descrição do produto"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>SEO Title</Label>
            <Input
              name="seoTitle"
              placeholder="Ex: Comprar Tibia Coins Barato"
              value={formData.seoTitle}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>SEO Description</Label>
            <Textarea
              name="seoDescription"
              placeholder="Meta descrição para SEO..."
              value={formData.seoDescription}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
