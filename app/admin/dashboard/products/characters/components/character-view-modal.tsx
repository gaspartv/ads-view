"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatGameValue, formatDate } from "@/lib/formatters";

interface CharacterViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: any;
}

export function CharacterViewModal({ isOpen, onClose, character }: CharacterViewModalProps) {
  if (!character) return null;



  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            Detalhes do Personagem
            {character.isFeatured && (
              <Badge variant="outline" className="bg-secondary text-secondary-foreground border-secondary">
                Destaque
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {character.Images && character.Images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={character.Images[0].url}
                alt={character.title}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border bg-muted shrink-0"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg border bg-muted flex items-center justify-center shrink-0">
                <span className="text-muted-foreground text-xs">Sem Imagem</span>
              </div>
            )}
            <div className="space-y-1.5 flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate" title={character.title}>
                {character.title}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Código: <span className="font-mono bg-muted px-1.5 rounded text-xs">{character.code}</span>
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant={character.disabledAt ? "destructive" : "default"}>
                  {character.disabledAt ? "Inativo" : "Ativo"}
                </Badge>
                <Badge variant="secondary">Lvl {character.level} {character.vocation} ({character.gender === 'FEMALE' ? 'F' : 'M'})</Badge>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {character.World?.name}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Preço BRL</span>
              <p className="text-base font-medium">{formatCurrency(character.price || 0)}</p>
            </div>
            {character.promotionalPrice && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase">Promo BRL</span>
                <p className="text-base font-medium text-primary">
                  {formatCurrency(character.promotionalPrice)}
                </p>
              </div>
            )}
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Preço TC</span>
              <p className="text-base font-medium">{character.priceTibiaCoins ? formatGameValue(character.priceTibiaCoins) : "-"}</p>
            </div>
            {character.promotionalPriceTibiaCoins && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase">Promo TC</span>
                <p className="text-base font-medium text-secondary-foreground">
                  {formatGameValue(character.promotionalPriceTibiaCoins)}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 border-t pt-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Magic Level</span>
              <p className="text-sm">{character.magicLevel || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Fist</span>
              <p className="text-sm">{character.fistFighting || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Sword</span>
              <p className="text-sm">{character.swordFighting || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Axe</span>
              <p className="text-sm">{character.axeFighting || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Club</span>
              <p className="text-sm">{character.clubFighting || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Distance</span>
              <p className="text-sm">{character.distanceFighting || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Shielding</span>
              <p className="text-sm">{character.shielding || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Fishing</span>
              <p className="text-sm">{character.fishing || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Loyalty</span>
              <p className="text-sm">{character.loyalty || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Pontos de Charm</span>
              <p className="text-sm">{character.charmPoints || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Expansão de Charm</span>
              <p className="text-sm">{character.charmExpansion ? "Sim" : "Não"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Valor do Inventário</span>
              <p className="text-sm">{character.inventoryValue ? formatGameValue(character.inventoryValue) : "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t pt-4">
             <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Transferível</span>
              <p className="text-sm">{character.transferable ? "Sim" : "Não"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">RK (Recovery Key)</span>
              <p className="text-sm">{character.hasRecoveryKey ? "Sim" : "Não"}</p>
            </div>
             <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">Safe Address</span>
              <p className="text-sm">{character.safeAddress ? "Sim" : "Não"}</p>
            </div>
          </div>

          {character.Charms && character.Charms.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <span className="text-sm font-medium">Charms</span>
              <div className="flex flex-wrap gap-1.5">
                {character.Charms.map((c: any) => (
                  <Badge key={c.id} variant="secondary" className="font-normal">
                    {c.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {character.Mounts && character.Mounts.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <span className="text-sm font-medium">Mounts</span>
              <div className="flex flex-wrap gap-1.5">
                {character.Mounts.map((m: any) => (
                  <Badge key={m.id} variant="secondary" className="font-normal">
                    {m.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {character.Outfits && character.Outfits.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <span className="text-sm font-medium">Outfits</span>
              <div className="flex flex-wrap gap-1.5">
                {character.Outfits.map((o: any) => (
                  <Badge key={o.outfitId} variant="secondary" className="font-normal">
                    {o.Outfit?.name} ({o.nivel?.replace('_', ' ')})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">SEO Title</span>
              <p className="text-sm">{character.seoTitle || "-"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium uppercase">SEO Description</span>
              <p className="text-sm">{character.seoDescription || "-"}</p>
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-4 text-xs text-muted-foreground">
            <span>Criado em: {formatDate(character.createdAt)}</span>
            {character.updatedAt && (
              <span>Atualizado em: {formatDate(character.updatedAt)}</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
