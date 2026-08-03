"use client";

import { useState, useEffect } from "react";
import { useCompany } from "@/contexts/company-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface TibiaCoinDynamicCardProps {
  product: any;
  type?: "BUY" | "SELL";
}

export function TibiaCoinDynamicCard({
  product,
  type = "BUY",
}: TibiaCoinDynamicCardProps) {
  const { company } = useCompany();
  const variables = product?.Variables || [];

  // Calcular limites absolutos de todas as variáveis
  const absoluteMin =
    variables.length > 0
      ? Math.min(...variables.map((v: any) => v.min || 0))
      : 0;
  const absoluteMax =
    variables.length > 0
      ? Math.max(...variables.map((v: any) => v.max || 50000))
      : 50000;

  const [coinsAmount, setCoinsAmount] = useState<number>(
    absoluteMin > 0 ? absoluteMin : 25,
  );
  const [activeVariable, setActiveVariable] = useState<any>(
    variables[0] || null,
  );

  const isSell = type === "SELL";

  // Encontrar a variável correta baseada na quantidade escolhida
  useEffect(() => {
    if (!variables.length) return;

    let matched = variables.find((v: any) => {
      const vMax = v.max || Infinity;
      return coinsAmount >= v.min && coinsAmount <= vMax;
    });

    // Se não encontrar uma correspondência exata, usa a última ou a primeira como fallback
    if (!matched) {
      if (coinsAmount > absoluteMax) matched = variables[variables.length - 1];
      else matched = variables[0];
    }

    setActiveVariable(matched);
  }, [coinsAmount, variables, absoluteMax]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCoinsAmount(val);
  };

  const handleAmountBlur = () => {
    let val = coinsAmount;

    // Arredondar para o múltiplo de 25 mais próximo
    val = Math.round(val / 25) * 25;

    // Respeitar os limites absolutos
    if (val < absoluteMin) val = absoluteMin;
    if (val > absoluteMax) val = absoluteMax;

    setCoinsAmount(val);
  };

  // Preço é por cada 250 TC baseado no activeVariable
  const totalPrice = activeVariable
    ? (coinsAmount / 250) * activeVariable.price
    : 0;

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

  if (!variables.length) {
    return (
      <Card className="p-6 border border-border/50 text-center flex flex-col items-center justify-center gap-4 w-full bg-card/50 h-full rounded-none rounded-b-xl">
        <CircleDollarSign className="w-12 h-12 text-muted-foreground/50" />
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-bold text-foreground">
            {isSell ? "Venda" : "Compra"} indisponível
          </h4>
          <p className="text-muted-foreground text-sm">
            Para {isSell ? "vender" : "comprar"} Tibia Coins no momento, entre
            em contato diretamente pelo WhatsApp.
          </p>
        </div>
        <Button
          className="w-full mt-2 h-12 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-800 flex gap-2 font-bold cursor-pointer text-base transition-all"
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
          Chamar no WhatsApp
        </Button>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "cursor-default group relative overflow-hidden rounded-none rounded-b-xl border transition-all duration-300 flex flex-col p-6 w-full h-full",
        !isSell
          ? "border-primary shadow-lg shadow-primary/20 bg-gradient-to-br from-primary/10 via-background to-background ring-1 ring-primary/50"
          : "border-border shadow-sm bg-background ring-1 ring-border/50",
      )}
    >
      {!isSell && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
      )}
      <div className="flex gap-4 items-center mb-6 z-10 relative">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
          {activeVariable?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeVariable.url}
              alt={product?.name || "Tibia Coins"}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <CircleDollarSign className="w-8 h-8 text-amber-500" />
          )}
        </div>

        <div className="flex flex-col">
          <h4 className={cn("text-2xl font-bold leading-tight")}>
            {isSell ? "Vender" : "Comprar"} Tibia Coins
          </h4>
          <span className="text-sm">
            Entre {absoluteMin} e {absoluteMax} TC
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6 py-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="coins-input" className="text-sm font-medium">
            Quantidade (Múltiplos de 25)
          </label>
          <input
            id="coins-input"
            type="number"
            min={absoluteMin}
            max={absoluteMax}
            step={25}
            value={coinsAmount}
            onChange={handleAmountChange}
            onBlur={handleAmountBlur}
            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>{absoluteMin} TC</span>
            <span>{absoluteMax} TC</span>
          </div>
          <input
            type="range"
            min={absoluteMin}
            max={absoluteMax}
            step={25}
            value={coinsAmount}
            onChange={handleAmountChange}
            className="w-full accent-primary cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border border-border/50">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">
              Cotação Atual
            </span>
            <span className="text-sm font-medium text-primary">
              {formatCurrency(activeVariable?.price || 0)} / 250 TC
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground mb-1">
              Valor Total
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border/50">
        <Button
          className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-800 flex gap-2 font-bold cursor-pointer text-base transition-all"
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
    </Card>
  );
}
