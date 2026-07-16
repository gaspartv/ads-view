import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Share2, Video, Globe2, Eye, CircleDollarSign, Medal, MapPin, KeyRound, Star } from "lucide-react";

interface ProductCardProps {
  product: any;
}

function CharacterCard({ product, metadata, imageUrl, isSoldOut, formatCurrency }: any) {
  const level = metadata.level;
  const loyalty = metadata.loyalty;
  const server = metadata.server;
  const pvp = metadata.pvp;
  const priceTC = metadata.priceTC;

  return (
    <Card
      className={`group relative overflow-hidden rounded-xl border border-primary/50 shadow-sm bg-background hover:border-primary transition-all duration-300 flex flex-col p-4 ${product.featured ? "ring-1 ring-amber-500/50" : ""}`}
    >
      <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col gap-5">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-[72px] h-[72px] rounded-xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center p-2 relative overflow-hidden flex-shrink-0 border border-border/50">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <div className="text-[10px] text-muted-foreground text-center">Sem img</div>
              )}
              {isSoldOut && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-destructive rotate-[-15deg]">Esgotado</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col pt-1">
              <h3 className="text-[15px] font-medium text-primary leading-tight line-clamp-1 mb-1">
                {product.name}
              </h3>
              {level && <span className="text-[13px] text-muted-foreground">Level {level}</span>}
              {loyalty && <span className="text-[13px] text-muted-foreground mt-0.5">Loyalty - {loyalty}%</span>}
            </div>
          </div>
          <div className="flex gap-2.5 text-muted-foreground pt-1">
            <Video className="w-5 h-5 hover:text-foreground transition-colors cursor-pointer" />
            <Share2 className="w-5 h-5 hover:text-foreground transition-colors cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-4 mt-auto pt-2">
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">Server</span>
            <Globe2 className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-foreground truncate">{server || "-"}</span>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">PvP</span>
            <Eye className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-foreground truncate">{pvp || "-"}</span>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">Valor R$</span>
            <span className="text-[15px] font-semibold text-green-500 truncate">{formatCurrency(product.promotionalPrice || product.price)}</span>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">Valor TC</span>
            <CircleDollarSign className="w-4 h-4 text-amber-500" />
            <span className="text-[15px] font-semibold text-foreground truncate">{priceTC ? `${priceTC} TC` : "-"}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}

function AccountCard({ product, metadata, imageUrl, isSoldOut, formatCurrency }: any) {
  const loyalty = metadata.loyalty;
  const pontos = metadata.pontos;
  const endereco = metadata.endereco;
  const cartaRk = metadata.cartaRk;
  const priceTC = metadata.priceTC;

  return (
    <Card
      className={`group relative overflow-hidden rounded-xl border border-primary/50 shadow-sm bg-background hover:border-primary transition-all duration-300 flex flex-col p-4 ${product.featured ? "ring-1 ring-amber-500/50" : ""}`}
    >
      <Link href={`/product/${product.slug}`} className="flex-1 flex flex-col gap-5">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-[72px] h-[72px] rounded-xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center p-2 relative overflow-hidden flex-shrink-0 border border-border/50">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <div className="text-[10px] text-muted-foreground text-center">Sem img</div>
              )}
              {isSoldOut && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-destructive rotate-[-15deg]">Esgotado</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col pt-1">
              <h3 className="text-[15px] font-medium text-primary leading-tight line-clamp-1 mb-1">
                {product.name}
              </h3>
              {loyalty && <span className="text-[13px] text-muted-foreground">Loyalty Nível {loyalty}</span>}
              {pontos && <span className="text-[13px] text-muted-foreground mt-0.5">{pontos} Pontos</span>}
            </div>
          </div>
          <div className="flex gap-2.5 text-muted-foreground pt-1">
            <Share2 className="w-5 h-5 hover:text-foreground transition-colors cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-4 mt-auto pt-2">
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">Endereço</span>
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground truncate">{endereco || "-"}</span>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">Carta RK</span>
            <KeyRound className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground truncate">{cartaRk || "-"}</span>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">Valor R$</span>
            <span className="text-[15px] font-semibold text-green-500 truncate">{formatCurrency(product.promotionalPrice || product.price)}</span>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">Valor TC</span>
            <CircleDollarSign className="w-4 h-4 text-amber-500" />
            <span className="text-[15px] font-semibold text-foreground truncate">{priceTC ? `${priceTC} TC` : "-"}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}


export function ProductCard({ product }: ProductCardProps) {
  const imageUrl =
    product.Images && product.Images.length > 0 ? product.Images[0].url : null;

  const isSoldOut = product.amount <= 0;

  let metadata: any = {};
  if (product.metadata) {
    try {
      metadata = typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata;
    } catch (e) {}
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  if (product.type === "ACCOUNT") {
    return <AccountCard product={product} metadata={metadata} imageUrl={imageUrl} isSoldOut={isSoldOut} formatCurrency={formatCurrency} />;
  }


  return <CharacterCard product={product} metadata={metadata} imageUrl={imageUrl} isSoldOut={isSoldOut} formatCurrency={formatCurrency} />;
}
