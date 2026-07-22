import { getCharacterPublic } from "@/app/actions/product-character";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CharacterImageGallery } from "@/components/character-image-gallery";
import {
  Shield,
  Swords,
  Coins,
  Key,
  Lock,
  CheckCircle2,
  XCircle,
  Info,
  Database,
} from "lucide-react";
import { WhatsAppNegotiateButton } from "@/components/whatsapp-negotiate-button";
import { formatCurrency, formatGameValue } from "@/lib/formatters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const response = await getCharacterPublic(resolvedParams.slug);
  const character = response?.success ? response.data : null;

  if (!character) return { title: "Personagem não encontrado" };

  return {
    title: character.seoTitle || `${character.title} - ThygasCoins`,
    description: character.seoDescription || character.description,
  };
}

export default async function CharacterPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const response = await getCharacterPublic(params.slug);
  const character = response?.success ? response.data : null;

  if (!character) {
    notFound();
  }

  const pvp = character.World?.pvpType
    ? character.World.pvpType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase())
    : "Normal";

  return (
    <div className="cursor-default w-full py-10 px-4 md:px-8 space-y-8">
      <nav className="flex items-center space-x-1.5 text-xs text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground transition-colors">
          Início
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/products"
          className="hover:text-foreground transition-colors"
        >
          Produtos
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href="/products/characters"
          className="hover:text-foreground transition-colors"
        >
          Personagens
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{character.title}</span>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda: Imagens e Info Geral */}
        <div className="lg:col-span-2 space-y-8">
          {/* Galeria de Imagens em Carrossel */}
          <Card className="overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center justify-center">
              <CharacterImageGallery
                images={character.Images}
                title={character.title}
              />
            </CardContent>
          </Card>
          {/* Extras (Outfits, Mounts, Charms) */}
          <div className="flex flex-col gap-6">
            {character.Outfits && character.Outfits.length > 0 && (
              <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Outfits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {character.Outfits.map((o: any) => (
                      <li
                        key={o.outfitId}
                        className="flex flex-col items-center gap-2 p-2 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors"
                        title={o.Outfit.type}
                      >
                        <div className="w-12 h-12 flex items-center justify-center shrink-0">
                          {o.Outfit?.imageUrl ? (
                            <img
                              src={o.Outfit.imageUrl}
                              alt={o.Outfit.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-[10px] text-muted-foreground">
                              S/Img
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <span className="text-xs font-medium leading-tight line-clamp-1">
                            {o.Outfit?.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground capitalize">
                            {o.nivel?.toLowerCase().replace("_", " ")}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {character.Mounts && character.Mounts.length > 0 && (
              <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Mounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {character.Mounts.map((m: any) => (
                      <li
                        key={m.id}
                        className="flex flex-col items-center gap-2 p-2 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors"
                        title={`Velocidade +${m.speed}`}
                      >
                        <div className="w-12 h-12 flex items-center justify-center shrink-0">
                          {m.image ? (
                            <img
                              src={m.image}
                              alt={m.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-[10px] text-muted-foreground">
                              S/Img
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-medium text-center leading-tight line-clamp-2">
                          {m.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {character.Charms && character.Charms.length > 0 && (
              <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Charms</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {character.Charms.map((c: any) => (
                      <li
                        key={c.id}
                        className="flex flex-col items-center gap-2 p-2 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors"
                        title={c.description}
                      >
                        <div className="w-12 h-12 flex items-center justify-center shrink-0">
                          {c.image ? (
                            <img
                              src={c.image}
                              alt={c.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-[10px] text-muted-foreground">
                              S/Img
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-medium text-center leading-tight line-clamp-2">
                          {c.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Coluna Direita: Preço e Status */}
        <div className="space-y-6">
          {/* Cabeçalho */}
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {character.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge
                variant="outline"
                className="text-primary border-primary/30"
              >
                Level {character.level}
              </Badge>
              <span>•</span>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/system/worlds/locations/${character.World.location.toLowerCase()}.gif`}
                alt={character.World.location}
                className="w-4 h-3 object-contain"
              />
              <span>{character.World.name}</span>
            </div>
            {character.description && (
              <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
                {character.description}
              </p>
            )}
          </div>

          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-xl shadow-primary/5">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Preço</div>
                <div className="flex flex-col">
                  {character.promotionalPrice ? (
                    <>
                      <div className="text-sm text-muted-foreground line-through leading-none">
                        {formatCurrency(character.price)}
                      </div>
                      <div className="text-2xl font-bold text-primary leading-none mt-1">
                        {formatCurrency(character.promotionalPrice)}
                      </div>
                    </>
                  ) : (
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(character.price)}
                    </div>
                  )}
                </div>
              </div>

              {character.priceTibiaCoins > 0 && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Tibia Coins
                  </div>
                  <div className="flex flex-col">
                    {character.promotionalPriceTibiaCoins ? (
                      <>
                        <div className="text-sm text-muted-foreground line-through leading-none">
                          {formatGameValue(character.priceTibiaCoins)} TC
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Coins className="w-5 h-5 text-amber-500" />
                          <span className="text-2xl font-bold text-amber-600 leading-none">
                            {formatGameValue(
                              character.promotionalPriceTibiaCoins,
                            )}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-amber-500" />
                        <span className="text-2xl font-bold text-amber-600">
                          {formatGameValue(character.priceTibiaCoins)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Botão de Compra */}
              <WhatsAppNegotiateButton
                message={`Olá, gostaria de negociar o personagem ${character.slug}`}
              />
            </CardContent>
          </Card>

          {/* Informações */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-4 h-4" />
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Vocação</span>
                <span className="font-medium capitalize">
                  {character.vocation?.toLowerCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Level</span>
                <span className="font-medium">{character.level}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gênero</span>
                <span className="font-medium">
                  {character.gender === "FEMALE" ? "Feminino" : "Masculino"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Loyalty</span>
                <span className="font-medium text-amber-600">
                  {character.loyalty || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Servidor</span>
                <span className="font-medium flex items-center gap-1.5">
                  {character.World?.name}
                  {character.World?.location && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/system/worlds/locations/${character.World.location.toLowerCase()}.gif`}
                      alt={character.World.location}
                      className="w-4 h-3 object-contain"
                    />
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Battleye</span>
                <span className="font-medium flex items-center gap-1.5">
                  <span className="capitalize">
                    {character.World?.battleye === "YELLOW"
                      ? "Amarelo"
                      : "Verde"}
                  </span>
                  {character.World?.battleye && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/system/worlds/pvp-type/${character.World.battleye.toLowerCase()}.gif`}
                      alt={character.World.battleye}
                      className="w-4 h-4 object-contain"
                    />
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">PvP</span>
                <span className="font-medium">{pvp}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Charm Points</span>
                <span className="font-medium text-amber-600">
                  {character.charmPoints || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Charm Expansion</span>
                <span className="font-medium">
                  {character.charmExpansion ? "Sim" : "Não"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Inventário</span>
                <span className="font-medium">
                  <span className="text-xs text-muted-foreground">
                    Aproximadamente:{" "}
                  </span>
                  {character.inventoryValue
                    ? formatGameValue(character.inventoryValue)
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Habilidades */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Swords className="w-5 h-5 text-primary" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm p-3 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors">
                  <span className="text-muted-foreground">Magic Level</span>
                  <span className="font-medium text-primary">
                    {character.magicLevel}
                  </span>
                </div>
                {character.axeFighting != null && character.axeFighting > 10 && (
                  <div className="flex items-center justify-between text-sm p-3 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors">
                    <span className="text-muted-foreground">Axe Fighting</span>
                    <span className="font-medium text-primary">
                      {character.axeFighting}
                    </span>
                  </div>
                )}
                {character.swordFighting != null && character.swordFighting > 10 && (
                  <div className="flex items-center justify-between text-sm p-3 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors">
                    <span className="text-muted-foreground">
                      Sword Fighting
                    </span>
                    <span className="font-medium text-primary">
                      {character.swordFighting}
                    </span>
                  </div>
                )}
                {character.clubFighting != null && character.clubFighting > 10 && (
                  <div className="flex items-center justify-between text-sm p-3 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors">
                    <span className="text-muted-foreground">Club Fighting</span>
                    <span className="font-medium text-primary">
                      {character.clubFighting}
                    </span>
                  </div>
                )}
                {character.distanceFighting != null && character.distanceFighting > 10 && (
                  <div className="flex items-center justify-between text-sm p-3 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors">
                    <span className="text-muted-foreground">
                      Distance Fighting
                    </span>
                    <span className="font-medium text-primary">
                      {character.distanceFighting}
                    </span>
                  </div>
                )}
                {character.fistFighting != null && character.fistFighting > 10 && (
                  <div className="flex items-center justify-between text-sm p-3 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors">
                    <span className="text-muted-foreground">Fist Fighting</span>
                    <span className="font-medium text-primary">
                      {character.fistFighting}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm p-3 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors">
                  <span className="text-muted-foreground">Shielding</span>
                  <span className="font-medium text-primary">
                    {character.shielding}
                  </span>
                </div>
                {character.fishing != null && character.fishing > 10 && (
                  <div className="flex items-center justify-between text-sm p-3 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors">
                    <span className="text-muted-foreground">Fishing</span>
                    <span className="font-medium text-primary">
                      {character.fishing}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Segurança da Conta */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Segurança & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transferível</span>
                <span className="font-medium flex items-center gap-1.5">
                  {character.transferable ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />{" "}
                      Sim
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-red-500" /> Não
                    </>
                  )}
                </span>
              </div>
              {character.transferAvailableAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Transfer Libera Em
                  </span>
                  <span className="font-medium">
                    {new Date(character.transferAvailableAt).toLocaleDateString(
                      "pt-BR",
                    )}
                  </span>
                </div>
              )}
              {character.premiumEndsAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Premium Até</span>
                  <span className="font-medium">
                    {new Date(character.premiumEndsAt).toLocaleDateString(
                      "pt-BR",
                    )}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Recovery Key</span>
                <span className="font-medium flex items-center gap-1.5">
                  {character.hasRecoveryKey ? (
                    <>
                      <Key className="w-3.5 h-3.5 text-blue-500" /> Sim
                    </>
                  ) : (
                    <span className="text-muted-foreground">Não possui</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Safe Address</span>
                <span className="font-medium flex items-center gap-1.5">
                  {character.safeAddress ? (
                    <>
                      <Shield className="w-3.5 h-3.5 text-purple-500" /> Sim
                    </>
                  ) : (
                    <span className="text-muted-foreground">Não</span>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Extra (Metadata) */}
          {character.metadata &&
            typeof character.metadata === "object" &&
            Object.keys(character.metadata).length > 0 && (
              <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Extra
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(
                      character.metadata as Record<string, any>,
                    ).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between text-sm p-3 border border-border/50 rounded-lg bg-black/5 hover:bg-black/10 transition-colors"
                      >
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="font-medium text-primary">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
