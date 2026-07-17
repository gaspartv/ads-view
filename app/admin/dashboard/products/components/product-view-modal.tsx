"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export function ProductViewModal({ isOpen, onClose, product }: ProductViewModalProps) {
  if (!product) return null;

  let metadataObj: any = {};
  if (product.metadata) {
    if (typeof product.metadata === "string") {
      try {
        metadataObj = JSON.parse(product.metadata);
      } catch (e) {
        metadataObj = {};
      }
    } else if (typeof product.metadata === "object") {
      metadataObj = product.metadata;
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Detalhes do Produto
            {product.featured && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200">
                Destaque
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {product.Images && product.Images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.Images[0].url}
                alt={product.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border bg-muted shrink-0"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg border bg-muted flex items-center justify-center shrink-0">
                <span className="text-muted-foreground text-xs">Sem Imagem</span>
              </div>
            )}
            <div className="space-y-1.5 flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate" title={product.name}>
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Código: <span className="font-mono bg-muted px-1.5 rounded text-xs">{product.code}</span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant={product.disabledAt ? "destructive" : "default"}>
                  {product.disabledAt ? "Inativo" : "Ativo"}
                </Badge>
                <Badge variant="secondary">{product.type}</Badge>
                {product.isFixed && (
                  <Badge variant="outline" className="text-blue-500 border-blue-200">
                    Fixo
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Preço</span>
              <p className="text-base font-medium">{formatCurrency(product.price || 0)}</p>
            </div>
            {product.promotionalPrice && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase">Preço Promocional</span>
                <p className="text-base font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(product.promotionalPrice)}
                </p>
              </div>
            )}
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Estoque</span>
              <p className="text-base font-medium">{product.amount}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Múltiplos</span>
              <p className="text-base font-medium">{product.multiples}</p>
            </div>
          </div>

          {product.Categories && product.Categories.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <span className="text-sm font-medium">Categorias</span>
              <div className="flex flex-wrap gap-1.5">
                {product.Categories.map((c: any) => (
                  <Badge key={c.id} variant="secondary" className="font-normal">
                    {c.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {product.description && (
            <div className="space-y-2 border-t pt-4">
              <span className="text-sm font-medium">Descrição</span>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {Object.keys(metadataObj).length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <span className="text-sm font-medium">Metadados</span>
              <div className="bg-muted/50 rounded-md p-3 text-sm space-y-1">
                {Object.entries(metadataObj).map(([key, val]) => (
                  <div key={key} className="flex gap-2">
                    <span className="font-medium min-w-[120px]">{key}:</span>
                    <span className="text-muted-foreground break-words">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">SEO Title</span>
              <p className="text-sm">{product.seoTitle || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">SEO Description</span>
              <p className="text-sm">{product.seoDescription || "-"}</p>
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-4 text-xs text-muted-foreground">
            <span>Criado em: {formatDate(product.createdAt)}</span>
            {product.updatedAt && (
              <span>Atualizado em: {formatDate(product.updatedAt)}</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
