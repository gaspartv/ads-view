import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Share2, Video, Globe2, Eye, CircleDollarSign } from "lucide-react";

interface ProductCharacterCardProps {
  character: any;
}

export function ProductCharacterCard({ character }: ProductCharacterCardProps) {
  const imageUrl =
    character.pictureUrl && character.pictureUrl !== "/uploads/system/no-image.jpg"
      ? character.pictureUrl
      : character.Images && character.Images.length > 0
        ? character.Images[0].url
        : null;

  const isSoldOut = character.disabledAt !== null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const formatGameValue = (value: number) => {
    if (!value) return "0";
    if (value >= 1000000) {
      return (
        (value / 1000000)
          .toFixed(value % 1000000 === 0 ? 0 : 1)
          .replace(/\.0$/, "") + "kk"
      );
    }
    if (value >= 1000) {
      return (
        (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1).replace(/\.0$/, "") +
        "k"
      );
    }
    return value.toString();
  };

  const level = character.level;
  const loyalty = character.loyalty;
  const server = character.World?.name;
  const pvp = character.World?.pvpType
    ? character.World.pvpType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase())
    : null;
  const priceTC = character.priceTibiaCoins;

  return (
    <Card
      className={`group relative overflow-hidden rounded-xl border border-primary/50 shadow-sm bg-background hover:border-primary transition-all duration-300 flex flex-col p-4 ${
        character.isFeatured ? "ring-1 ring-amber-500/50" : ""
      }`}
    >
      <Link
        href={`/products/characters/${character.slug}`}
        className="flex-1 flex flex-col gap-5"
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-[72px] h-[72px] rounded-xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center p-2 relative overflow-hidden flex-shrink-0 border border-border/50">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={character.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-[10px] text-muted-foreground text-center">
                  Sem img
                </div>
              )}
              {isSoldOut && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-destructive rotate-[-15deg]">
                    Indisponível
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col pt-1">
              <h3 className="text-[15px] font-medium text-primary leading-tight line-clamp-1 mb-1">
                {character.title}
              </h3>
              {level && (
                <span className="text-[13px] text-muted-foreground">
                  Lvl {level}{" "}
                  {character.vocation ? `• ${character.vocation}` : ""}
                </span>
              )}
              {loyalty && (
                <span className="text-[13px] text-muted-foreground mt-0.5">
                  Loyalty - {loyalty}%
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-4 mt-auto pt-2">
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              Server
            </span>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/system/worlds/locations/${character.World.location.toLowerCase()}.gif`}
              alt={character.World.location}
              className="w-4 h-3 object-contain"
            />
            <span className="text-sm font-medium text-foreground truncate">
              {server || "-"}
            </span>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              PvP
            </span>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/system/worlds/pvp-type/${character.World.battleye.toLowerCase()}.gif`}
              alt={character.World.battleye}
              className="w-4 h-4 object-contain"
            />
            <span className="text-sm font-medium text-foreground truncate">
              {pvp || "-"}
            </span>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              Valor R$
            </span>
            <div className="flex flex-col w-full overflow-hidden">
              {character.promotionalPrice ? (
                <>
                  <span className="text-[12px] text-muted-foreground line-through leading-none">
                    {formatCurrency(character.price)}
                  </span>
                  <span className="text-[15px] font-bold text-primary leading-none mt-1 truncate">
                    {formatCurrency(character.promotionalPrice)}
                  </span>
                </>
              ) : (
                <span className="text-[15px] font-bold text-primary truncate">
                  {formatCurrency(character.price)}
                </span>
              )}
            </div>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              Valor TC
            </span>
            <CircleDollarSign className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex flex-col w-full overflow-hidden">
              {character.promotionalPriceTibiaCoins ? (
                <>
                  <span className="text-[12px] text-muted-foreground line-through leading-none">
                    {formatGameValue(priceTC)}
                  </span>
                  <span className="text-[15px] font-bold text-foreground leading-none mt-1 truncate">
                    {formatGameValue(character.promotionalPriceTibiaCoins)}
                  </span>
                </>
              ) : (
                <span className="text-[15px] font-bold text-foreground truncate">
                  {formatGameValue(priceTC)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
