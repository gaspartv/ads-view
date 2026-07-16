import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Share2, Video, Globe2, Eye, CircleDollarSign } from "lucide-react";

interface ProductCharacterCardProps {
  character: any;
}

export function ProductCharacterCard({ character }: ProductCharacterCardProps) {
  const imageUrl =
    character.Images && character.Images.length > 0
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
      return (value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1).replace(/\.0$/, '') + "kk";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1).replace(/\.0$/, '') + "k";
    }
    return value.toString();
  };

  const level = character.level;
  const loyalty = character.loyalty;
  const server = character.World?.name;
  const pvp = character.World?.pvpType ? character.World.pvpType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : null;
  const priceTC = character.priceTibiaCoins;

  return (
    <Card
      className={`group relative overflow-hidden rounded-xl border border-primary/50 shadow-sm bg-background hover:border-primary transition-all duration-300 flex flex-col p-4 ${
        character.isFeatured ? "ring-1 ring-amber-500/50" : ""
      }`}
    >
      <Link
        href={`/characters/${character.slug}`}
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
                  Lvl {level} {character.vocation ? `• ${character.vocation}` : ""} {character.gender ? `(${character.gender === 'FEMALE' ? 'F' : 'M'})` : ""}
                </span>
              )}
              {loyalty && (
                <span className="text-[13px] text-muted-foreground mt-0.5">
                  Loyalty - {loyalty}%
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2.5 text-muted-foreground pt-1">
            <Video className="w-5 h-5 hover:text-foreground transition-colors cursor-pointer" />
            <Share2 className="w-5 h-5 hover:text-foreground transition-colors cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-4 mt-auto pt-2">
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              Server
            </span>
            <Globe2 className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-foreground truncate">
              {server || "-"}
            </span>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              PvP
            </span>
            <Eye className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-foreground truncate">
              {pvp || "-"}
            </span>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              Valor R$
            </span>
            <span className="text-[15px] font-semibold text-green-500 truncate">
              {formatCurrency(character.promotionalPrice || character.price)}
            </span>
          </div>
          <div className="relative border border-primary/30 rounded-lg px-3 pt-3 pb-2.5 flex items-center gap-2">
            <span className="absolute -top-2 left-2.5 bg-background px-1 text-[10px] text-muted-foreground uppercase tracking-wider">
              Valor TC
            </span>
            <CircleDollarSign className="w-4 h-4 text-amber-500" />
            <span className="text-[15px] font-semibold text-foreground truncate">
              {priceTC ? `${priceTC} TC` : "-"}
            </span>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-4 gap-2 pt-3 text-xs border-t border-border/50 mt-1">
           {(character.magicLevel || 0) > 0 && <div className="text-center"><div className="font-semibold text-primary">{character.magicLevel}</div><div className="text-[10px] text-muted-foreground uppercase">ML</div></div>}
           {(character.swordFighting || 0) > 10 && <div className="text-center"><div className="font-semibold text-primary">{character.swordFighting}</div><div className="text-[10px] text-muted-foreground uppercase">Sword</div></div>}
           {(character.axeFighting || 0) > 10 && <div className="text-center"><div className="font-semibold text-primary">{character.axeFighting}</div><div className="text-[10px] text-muted-foreground uppercase">Axe</div></div>}
           {(character.clubFighting || 0) > 10 && <div className="text-center"><div className="font-semibold text-primary">{character.clubFighting}</div><div className="text-[10px] text-muted-foreground uppercase">Club</div></div>}
           {(character.distanceFighting || 0) > 10 && <div className="text-center"><div className="font-semibold text-primary">{character.distanceFighting}</div><div className="text-[10px] text-muted-foreground uppercase">Dist</div></div>}
           {(character.shielding || 0) > 10 && <div className="text-center"><div className="font-semibold text-primary">{character.shielding}</div><div className="text-[10px] text-muted-foreground uppercase">Shield</div></div>}
           {(character.fistFighting || 0) > 10 && <div className="text-center"><div className="font-semibold text-primary">{character.fistFighting}</div><div className="text-[10px] text-muted-foreground uppercase">Fist</div></div>}
        </div>

        {/* Charms & Inventory */}
        <div className="flex justify-between items-center pt-2 border-t border-border/50 text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground uppercase">Charm Points</span>
            <span className="font-semibold">{character.charmPoints || 0}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-muted-foreground uppercase">Inventário</span>
            <span className="font-semibold text-amber-600">{character.inventoryValue ? formatCurrency(character.inventoryValue) : "N/A"}</span>
          </div>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-1 pt-2">
          {character.transferable ? (
             <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-medium">Transferível</span>
          ) : (
             <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-medium">Ñ Transferível</span>
          )}
          {character.hasRecoveryKey && (
             <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-medium">Possui RK</span>
          )}
          {character.safeAddress && (
             <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-[10px] font-medium">Safe Address</span>
          )}
          {character.charmExpansion && (
             <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-medium">Charm Exp.</span>
          )}
        </div>

        {/* Arrays: Charms, Mounts, Outfits */}
        {(character.Charms?.length > 0 || character.Mounts?.length > 0 || character.Outfits?.length > 0) && (
          <div className="pt-2 border-t border-border/50 flex flex-col gap-1.5">
            {character.Charms?.length > 0 && (
              <div className="text-[10px] leading-tight text-muted-foreground line-clamp-2">
                <strong className="text-foreground">Charms: </strong>
                {character.Charms.map((c: any) => c.name).join(", ")}
              </div>
            )}
            {character.Mounts?.length > 0 && (
              <div className="text-[10px] leading-tight text-muted-foreground line-clamp-2">
                <strong className="text-foreground">Mounts: </strong>
                {character.Mounts.map((m: any) => m.name).join(", ")}
              </div>
            )}
            {character.Outfits?.length > 0 && (
              <div className="text-[10px] leading-tight text-muted-foreground line-clamp-2">
                <strong className="text-foreground">Outfits: </strong>
                {character.Outfits.map((o: any) => `${o.Outfit?.name} (${o.nivel?.replace('_', ' ')})`).join(", ")}
              </div>
            )}
          </div>
        )}
      </Link>
    </Card>
  );
}
