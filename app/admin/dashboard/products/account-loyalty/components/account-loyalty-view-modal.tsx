"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatCurrency, formatGameValue } from "@/lib/formatters";

interface AccountLoyaltyViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountLoyalty?: any;
}

export function AccountLoyaltyViewModal({
  isOpen,
  onClose,
  accountLoyalty,
}: AccountLoyaltyViewModalProps) {
  if (!accountLoyalty) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Visualizar Conta com Loyalty</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Título</h3>
            <p className="text-base font-semibold">{accountLoyalty.title}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Descrição</h3>
            <p className="text-sm whitespace-pre-wrap">{accountLoyalty.description || "Nenhuma descrição informada."}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Pontos</h3>
              <p className="text-sm">{accountLoyalty.points} pts</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Porcentagem</h3>
              <p className="text-sm">{accountLoyalty.percentage}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Preço</h3>
              <p className="text-sm">
                {accountLoyalty.price ? formatCurrency(accountLoyalty.price) : "-"}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Preço Promocional</h3>
              <p className="text-sm text-green-600">
                {accountLoyalty.promotionalPrice ? formatCurrency(accountLoyalty.promotionalPrice) : "-"}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Preço TC</h3>
              <p className="text-sm">{accountLoyalty.priceTibiaCoins ? formatGameValue(accountLoyalty.priceTibiaCoins) : "-"}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Preço Promocional TC</h3>
              <p className="text-sm text-green-600">{accountLoyalty.promotionalPriceTibiaCoins ? formatGameValue(accountLoyalty.promotionalPriceTibiaCoins) : "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Possui Recovery Key</h3>
              <p className="text-sm">{accountLoyalty.hasRecoveryKey ? "Sim" : "Não"}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Safe Address</h3>
              <p className="text-sm">{accountLoyalty.safeAddress ? "Sim" : "Não"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
