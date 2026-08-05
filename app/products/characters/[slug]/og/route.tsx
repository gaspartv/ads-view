import { ImageResponse } from "next/og";
import { getCharacterPublic } from "@/app/actions/product-character";
import { getCompanyInfo } from "@/app/actions/company";

export const alt = "Preview do Personagem";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
};

const FIELD_LABELS: Record<string, string> = {
  gender: "Gênero",
  magicLevel: "Magic Level",
  fistFighting: "Fist Fighting",
  swordFighting: "Sword Fighting",
  axeFighting: "Axe Fighting",
  clubFighting: "Club Fighting",
  distanceFighting: "Distance Fighting",
  shielding: "Shielding",
  fishing: "Fishing",
  charmPoints: "Charm Points",
  charmExpansion: "Charm Expansion",
  inventoryValue: "Valor do Inventário",
  transferable: "Transferível",
  transferAvailableAt: "Liberação de Transferência",
  premiumEndsAt: "Fim da Premium",
  hasRecoveryKey: "Recovery Key",
  safeAddress: "Endereço Seguro",
  Charms: "Charms",
  Outfits: "Outfits",
  Mounts: "Montarias",
};

const FIXED_FIELDS = [
  "level",
  "vocation",
  "loyalty",
  "worldId",
  "price",
  "promotionalPrice",
  "priceTibiaCoins",
  "promotionalPriceTibiaCoins",
];

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

const getFieldValue = (character: any, id: string) => {
  switch (id) {
    case "gender":
      return character.gender === 1
        ? "Masculino"
        : character.gender === 0
          ? "Feminino"
          : character.gender || "-";
    case "magicLevel":
      return character.magicLevel || 0;
    case "fistFighting":
      return character.fistFighting || 0;
    case "swordFighting":
      return character.swordFighting || 0;
    case "axeFighting":
      return character.axeFighting || 0;
    case "clubFighting":
      return character.clubFighting || 0;
    case "distanceFighting":
      return character.distanceFighting || 0;
    case "shielding":
      return character.shielding || 0;
    case "fishing":
      return character.fishing || 0;
    case "charmPoints":
      return character.charmPoints || 0;
    case "charmExpansion":
      return character.charmExpansion ? "Sim" : "Não";
    case "inventoryValue":
      return character.inventoryValue
        ? formatGameValue(character.inventoryValue)
        : "0";
    case "transferable":
      return character.transferable ? "Sim" : "Não";
    case "transferAvailableAt":
      return character.transferAvailableAt
        ? new Date(character.transferAvailableAt).toLocaleDateString("pt-BR")
        : "-";
    case "premiumEndsAt":
      return character.premiumEndsAt
        ? new Date(character.premiumEndsAt).toLocaleDateString("pt-BR")
        : "-";
    case "hasRecoveryKey":
      return character.hasRecoveryKey ? "Sim" : "Não";
    case "safeAddress":
      return character.safeAddress ? "Sim" : "Não";
    case "Charms":
      return character.Charms?.length || character.charmsId?.length || 0;
    case "Outfits":
      return character.Outfits?.length || character.outfits?.length || 0;
    case "Mounts":
      return character.Mounts?.length || character.mountsId?.length || 0;
    default:
      return undefined;
  }
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const resolvedParams = await params;
  const response = await getCharacterPublic(resolvedParams.slug);
  const character = response?.success ? response.data : null;

  if (!character) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontSize: 48,
        }}
      >
        Personagem não encontrado
      </div>,
      { ...size },
    );
  }

  const companyResponse = await getCompanyInfo();
  const company = companyResponse?.success ? companyResponse.data : null;
  const cardContent = company?.cardContent || [];

  const dynamicFieldsToRender = cardContent.filter(
    (id: string) => !FIXED_FIELDS.includes(id) && FIELD_LABELS[id],
  );

  const attributes = dynamicFieldsToRender.slice(0, 3).map((id: string) => {
    const val = getFieldValue(character, id);
    return {
      label: FIELD_LABELS[id],
      value: val !== undefined ? val : "-",
    };
  });

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        color: "#fafafa",
        padding: "60px",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "70%" }}>
          <h1
            style={{
              fontSize: 64,
              fontWeight: "bold",
              margin: 0,
              marginBottom: 20,
              lineHeight: 1.1,
            }}
          >
            {character.title}
          </h1>
          <div style={{ display: "flex", fontSize: 32, color: "#a1a1aa" }}>
            <span style={{ marginRight: 20 }}>
              Level: {character.level || "-"}
            </span>
            <span style={{ marginRight: 20 }}>•</span>
            <span style={{ marginRight: 20 }}>
              Server: {character.World?.name || "-"}
            </span>
            <span style={{ marginRight: 20 }}>•</span>
            <span>
              PvP:{" "}
              {character.World?.pvpType
                ? character.World.pvpType
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l: string) => l.toUpperCase())
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {attributes.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.02)",
            borderRadius: "24px",
            padding: "30px",
            marginTop: "auto",
            marginBottom: "20px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {attributes.map((attr: any, idx: number) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                width: "30%",
              }}
            >
              <span
                style={{ fontSize: 24, color: "#a1a1aa", marginBottom: "4px" }}
              >
                {attr.label}
              </span>
              <span
                style={{ fontSize: 32, fontWeight: "bold", color: "#fafafa" }}
              >
                {attr.value}
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          width: "100%",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(255,255,255,0.05)",
            padding: "30px",
            borderRadius: "24px",
            flex: 1,
          }}
        >
          <span style={{ fontSize: 32, color: "#a1a1aa", marginBottom: 10 }}>
            Valor
          </span>
          <span style={{ fontSize: 72, fontWeight: "bold", color: "#f59e0b" }}>
            {formatCurrency(character.promotionalPrice || character.price)}
          </span>
        </div>
        {character.priceTibiaCoins ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgba(255,255,255,0.05)",
              padding: "30px",
              borderRadius: "24px",
              flex: 1,
            }}
          >
            <span style={{ fontSize: 32, color: "#a1a1aa", marginBottom: 10 }}>
              Valor em TC
            </span>
            <span
              style={{ fontSize: 72, fontWeight: "bold", color: "#f59e0b" }}
            >
              {formatGameValue(
                character.promotionalPriceTibiaCoins ||
                  character.priceTibiaCoins,
              )}
            </span>
          </div>
        ) : null}
      </div>
    </div>,
    { ...size },
  );
}
