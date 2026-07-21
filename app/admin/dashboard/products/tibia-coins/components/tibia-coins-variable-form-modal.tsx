"use client";

import { useState, useEffect, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatters";
import { createProductTibiaCoinsVariable, updateProductTibiaCoinsVariable } from "@/app/actions/product-tibia-coins";

interface VariableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  variable?: any;
}

export function TibiaCoinsVariableFormModal({ isOpen, onClose, variable }: VariableFormModalProps) {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    description: "",
    min: "",
    max: "",
    price: "",
    promotionalPrice: "",
    url: "",
  });

  useEffect(() => {
    if (variable && isOpen) {
      setFormData({
        description: variable.description || "",
        min: variable.min?.toString() || "",
        max: variable.max?.toString() || "",
        price: variable.price ? formatCurrency(variable.price) : "",
        promotionalPrice: variable.promotionalPrice ? formatCurrency(variable.promotionalPrice) : "",
        url: variable.url || "",
      });
    } else if (isOpen) {
      setFormData({
        description: "",
        min: "",
        max: "",
        price: "",
        promotionalPrice: "",
        url: "",
      });
    }
  }, [variable, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "price" || name === "promotionalPrice") {
      setFormData((prev) => ({ ...prev, [name]: formatCurrency(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const rawPrice = Number(formData.price.replace(/\D/g, ""));
        const rawPromotional = formData.promotionalPrice ? Number(formData.promotionalPrice.replace(/\D/g, "")) : undefined;

        if (isNaN(rawPrice) || rawPrice <= 0) {
          throw new Error("Preço inválido.");
        }

        const payload = {
          description: formData.description || undefined,
          min: formData.min ? Number(formData.min) : undefined,
          max: formData.max ? Number(formData.max) : undefined,
          price: rawPrice,
          promotionalPrice: rawPromotional,
          url: formData.url || undefined,
        };

        let res;
        if (variable) {
          res = await updateProductTibiaCoinsVariable(variable.id, payload);
        } else {
          res = await createProductTibiaCoinsVariable(payload);
        }

        if (res?.success) {
          toast.success(`Variável ${variable ? "atualizada" : "criada"} com sucesso!`);
          onClose();
        }
      } catch (error: any) {
        toast.error(error.message || "Erro ao salvar variável.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{variable ? "Editar Variável" : "Adicionar Variável"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Pacote especial"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mínimo (TC)</Label>
              <Input type="number" name="min" value={formData.min} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Máximo (TC)</Label>
              <Input type="number" name="max" value={formData.max} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preço *</Label>
              <Input name="price" value={formData.price} onChange={handleChange} placeholder="R$ 0,00" required />
            </div>
            <div className="space-y-2">
              <Label>Preço Promocional</Label>
              <Input name="promotionalPrice" value={formData.promotionalPrice} onChange={handleChange} placeholder="R$ 0,00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>URL (Checkout / etc)</Label>
            <Input type="url" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isPending}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
