"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAccountLoyalty, editAccountLoyalty } from "@/app/actions/product-account-loyalty";
import { toast } from "sonner";

import { formatCurrency } from "@/lib/formatters";

interface AccountLoyaltyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountLoyalty?: any;
}

export function AccountLoyaltyFormModal({
  isOpen,
  onClose,
  accountLoyalty,
}: AccountLoyaltyFormModalProps) {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    points: "",
    percentage: "",
    price: "",
    promotionalPrice: "",
    priceTibiaCoins: "",
    promotionalPriceTibiaCoins: "",
    hasRecoveryKey: false,
    safeAddress: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (accountLoyalty) {
        setFormData({
          title: accountLoyalty.title || "",
          description: accountLoyalty.description || "",
          points: accountLoyalty.points?.toString() || "",
          percentage: accountLoyalty.percentage?.toString() || "",
          price: accountLoyalty.price ? formatCurrency(accountLoyalty.price) : "",
          promotionalPrice: accountLoyalty.promotionalPrice ? formatCurrency(accountLoyalty.promotionalPrice) : "",
          priceTibiaCoins: accountLoyalty.priceTibiaCoins?.toString() || "",
          promotionalPriceTibiaCoins: accountLoyalty.promotionalPriceTibiaCoins?.toString() || "",
          hasRecoveryKey: accountLoyalty.hasRecoveryKey || false,
          safeAddress: accountLoyalty.safeAddress || false,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          points: "",
          percentage: "",
          price: "",
          promotionalPrice: "",
          priceTibiaCoins: "",
          promotionalPriceTibiaCoins: "",
          hasRecoveryKey: false,
          safeAddress: false,
        });
      }
    }
  }, [isOpen, accountLoyalty]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev: any) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (name === "price" || name === "promotionalPrice") {
      setFormData((prev: any) => ({ ...prev, [name]: formatCurrency(value) }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "price" || key === "promotionalPrice") {
        if (value) {
          const numericValue = String(value).replace(/\D/g, "");
          data.append(key, numericValue);
        }
      } else {
        data.append(key, String(value));
      }
    });

    startTransition(async () => {
      let result;
      if (accountLoyalty) {
        result = await editAccountLoyalty(accountLoyalty.id, data);
      } else {
        result = await createAccountLoyalty(data);
      }

      if (result.success) {
        toast.success(result.message || (accountLoyalty ? "Conta editada." : "Conta criada."));
        onClose();
      } else {
        toast.error(result.message || "Ocorreu um erro.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {accountLoyalty ? "Editar Conta" : "Nova Conta"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Detalhes de Loyalty</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points">Pontos</Label>
                <Input id="points" name="points" type="number" value={formData.points} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="percentage">Porcentagem (%)</Label>
                <Input id="percentage" name="percentage" type="number" value={formData.percentage} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Preços</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço BRL</Label>
                <Input id="price" name="price" type="text" placeholder="R$ 0,00" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promotionalPrice">Preço Promocional BRL</Label>
                <Input id="promotionalPrice" name="promotionalPrice" type="text" placeholder="R$ 0,00" value={formData.promotionalPrice} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceTibiaCoins">Preço Tibia Coins</Label>
                <Input id="priceTibiaCoins" name="priceTibiaCoins" type="number" value={formData.priceTibiaCoins} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promotionalPriceTibiaCoins">Preço Promocional TC</Label>
                <Input id="promotionalPriceTibiaCoins" name="promotionalPriceTibiaCoins" type="number" value={formData.promotionalPriceTibiaCoins} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Configurações & Flags</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="hasRecoveryKey" name="hasRecoveryKey" checked={formData.hasRecoveryKey} onChange={handleChange} className="w-4 h-4 cursor-pointer" />
                <Label htmlFor="hasRecoveryKey" className="font-normal cursor-pointer">Possui Recovery Key</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="safeAddress" name="safeAddress" checked={formData.safeAddress} onChange={handleChange} className="w-4 h-4 cursor-pointer" />
                <Label htmlFor="safeAddress" className="font-normal cursor-pointer">Safe Address</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
