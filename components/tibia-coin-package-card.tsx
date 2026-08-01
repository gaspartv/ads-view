"use client";

import { useState } from "react";
import Link from "next/link";
import { useCompany } from "@/contexts/company-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleDollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TibiaCoinPackageCardProps {
  variable: any;
  product: any;
  type?: string;
}

export function TibiaCoinPackageCard({
  variable,
  product,
  type = "BUY",
}: TibiaCoinPackageCardProps) {
  const { company } = useCompany();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coinsAmount, setCoinsAmount] = useState<number>(variable.min);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const isSell = type === "SELL";
  const maxCoins = variable.max !== null ? variable.max : 50000;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCoinsAmount(val);
  };

  const handleAmountBlur = () => {
    let val = coinsAmount;

    // Arredondar para o múltiplo de 25 mais próximo
    val = Math.round(val / 25) * 25;

    // Respeitar os limites
    if (val < variable.min) val = variable.min;
    if (val > maxCoins) val = maxCoins;

    setCoinsAmount(val);
  };

  // Preço é por cada 250 TC
  const totalPrice = (coinsAmount / 250) * variable.price;

  const handleWhatsApp = () => {
    if (!company?.whatsappNumber) return;

    const actionText = isSell ? "vender" : "comprar";
    const message = encodeURIComponent(
      `Olá, gostaria de ${actionText} ${coinsAmount} Tibia Coins pelo valor de ${formatCurrency(totalPrice)}.`,
    );
    window.open(
      `https://wa.me/${company.whatsappNumber}?text=${message}`,
      "_blank",
    );
  };

  return (
    <>
      <Card className="cursor-default group relative overflow-hidden rounded-xl border border-primary/50 shadow-sm bg-background hover:border-primary transition-all duration-300 flex flex-col p-4">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
            {variable.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={variable.url}
                alt={product?.name || "Tibia Coins"}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <CircleDollarSign className="w-8 h-8 text-amber-500" />
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-primary mb-1">
              {variable.max
                ? `${variable.min} a ${variable.max} Tibia Coins`
                : `A partir de ${variable.min} Tibia Coins`}
            </span>
            <h4 className="text-lg font-medium text-zinc-300 leading-tight">
              {variable.description}
            </h4>
          </div>
        </div>

        <div className="mt-auto border-t border-border/50 pt-4 flex justify-end items-center">
          <span className="text-2xl font-bold text-primary text-right">
            {formatCurrency(variable.price)}
            <span className="text-xs text-muted-foreground block text-right mt-0.5">
              {" "}
              cada 250 TC
            </span>
          </span>
        </div>

        <div className="border-t border-border/50 pt-4">
          <Button
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 font-semibold cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <CircleDollarSign className="w-4 h-4" />
            {isSell ? "Vender agora" : "Comprar agora"}
          </Button>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isSell ? "Vender" : "Comprar"} Tibia Coins</DialogTitle>
            <DialogDescription>
              Selecione a quantidade desejada. O valor será calculado automaticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="coins-input" className="text-sm font-medium">
                Quantidade (Múltiplos de 25)
              </label>
              <input
                id="coins-input"
                type="number"
                min={variable.min}
                max={maxCoins}
                step={25}
                value={coinsAmount}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{variable.min} TC</span>
                <span>{maxCoins} TC</span>
              </div>
              <input
                type="range"
                min={variable.min}
                max={maxCoins}
                step={25}
                value={coinsAmount}
                onChange={handleAmountChange}
                className="w-full accent-primary"
              />
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg border border-border/50">
              <span className="text-sm text-muted-foreground mb-1">Valor Total</span>
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-800 flex gap-2 font-bold cursor-pointer text-base"
              onClick={handleWhatsApp}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Finalizar pelo WhatsApp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
