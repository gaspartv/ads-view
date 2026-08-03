"use client";

import { useTransition } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, PowerOff, CheckCircle2 } from "lucide-react";
import { toggleProductTibiaCoinsStatus } from "@/app/actions/product-tibia-coins";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TibiaCoinsCardProps {
  product: any;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
}

export function TibiaCoinsCard({ product, isSelected, onClick, onEdit }: TibiaCoinsCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      try {
        const isActive = !product.disabledAt;
        const res = await toggleProductTibiaCoinsStatus(product.id, isActive);
        if (res?.success) {
          toast.success(`Tibia Coins ${isActive ? "desabilitado" : "habilitado"} com sucesso!`);
        }
      } catch (error: any) {
        toast.error(error.message || "Erro ao alterar status.");
      }
    });
  };

  const isActive = !product.disabledAt;
  const isCompra = product.type !== "BUY";

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden",
        isSelected ? "border-primary shadow-md ring-1 ring-primary" : "border-border",
        isCompra && !isSelected ? "bg-gradient-to-br from-primary/10 via-background to-background border-primary/40 shadow-sm" : "",
        isCompra && isSelected ? "bg-primary/10" : ""
      )}
      onClick={onClick}
    >
      {isCompra && (
        <div className="absolute top-0 right-0 w-2 h-full bg-primary/80" />
      )}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={cn("text-xl font-bold", isCompra && "text-primary")}>
          {product.type === "BUY" ? "Venda de Tibia Coins" : "Compra de Tibia Coins"}
        </CardTitle>
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Ativo" : "Desabilitado"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mt-2">
          <div className={`flex justify-between text-sm ${product.type !== "BUY" ? "invisible" : ""}`}>
            <span className="text-muted-foreground">Estoque Disponível:</span>
            <span className="font-medium">{product.amount} TC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">SEO Title:</span>
            <span className="font-medium truncate max-w-[200px]">{product.seoTitle || "N/A"}</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
            {product.description || "Nenhuma descrição fornecida."}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-4 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Edit2 className="w-4 h-4 mr-1" />
          Editar
        </Button>
        <Button 
          variant={isActive ? "destructive" : "default"} 
          size="sm" 
          onClick={handleToggleStatus}
          disabled={isPending}
        >
          {isActive ? (
            <>
              <PowerOff className="w-4 h-4 mr-1" /> Desabilitar
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-1" /> Habilitar
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
