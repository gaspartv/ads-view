"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createCharacter,
  editCharacter,
} from "@/app/actions/product-character";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, X, Plus, Image as ImageIcon } from "lucide-react";

import { formatCurrency } from "@/lib/formatters";

interface CharacterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  character?: any;
  worlds: any[];
  charms: any[];
  outfits: any[];
  mounts: any[];
}

export function CharacterFormModal({
  isOpen,
  onClose,
  character,
  worlds,
  charms,
  outfits: availableOutfits,
  mounts,
}: CharacterFormModalProps) {
  const [isPending, startTransition] = useTransition();

  // Dropdown states
  const [isCharmsOpen, setIsCharmsOpen] = useState(false);
  const [isMountsOpen, setIsMountsOpen] = useState(false);

  const charmsRef = useRef<HTMLDivElement>(null);
  const mountsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        charmsRef.current &&
        !charmsRef.current.contains(event.target as Node)
      ) {
        setIsCharmsOpen(false);
      }
      if (
        mountsRef.current &&
        !mountsRef.current.contains(event.target as Node)
      ) {
        setIsMountsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    seoTitle: "",
    seoDescription: "",
    isFeatured: false,
    price: "",
    promotionalPrice: "",
    priceTibiaCoins: "",
    promotionalPriceTibiaCoins: "",
    worldId: "",
    gender: "MALE",
    vocation: "KNIGHT",
    level: "",
    loyalty: "",
    magicLevel: "",
    fistFighting: "",
    swordFighting: "",
    axeFighting: "",
    clubFighting: "",
    distanceFighting: "",
    shielding: "",
    fishing: "",
    charmPoints: "",
    inventoryValue: "",
    charmExpansion: false,
    transferable: false,
    hasRecoveryKey: false,
    safeAddress: false,
  });

  const [charmsId, setCharmsId] = useState<string[]>([]);
  const [mountsId, setMountsId] = useState<string[]>([]);
  const [outfits, setOutfits] = useState<{ id: string; level: string }[]>([]);
  const [metadataEntries, setMetadataEntries] = useState<{key: string, value: string}[]>([]);
  const [selectedCoverIndex, setSelectedCoverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (character) {
        setFormData({
          title: character.title || "",
          description: character.description || "",
          seoTitle: character.seoTitle || "",
          seoDescription: character.seoDescription || "",
          isFeatured: character.isFeatured || false,
          price: character.price ? formatCurrency(character.price) : "",
          promotionalPrice: character.promotionalPrice
            ? formatCurrency(character.promotionalPrice)
            : "",
          priceTibiaCoins: character.priceTibiaCoins?.toString() || "",
          promotionalPriceTibiaCoins:
            character.promotionalPriceTibiaCoins?.toString() || "",
          worldId: character.worldId || "",
          gender: character.gender || "MALE",
          vocation: character.vocation || "KNIGHT",
          level: character.level?.toString() || "",
          loyalty: character.loyalty?.toString() || "",
          magicLevel: character.magicLevel?.toString() || "",
          fistFighting: character.fistFighting?.toString() || "",
          swordFighting: character.swordFighting?.toString() || "",
          axeFighting: character.axeFighting?.toString() || "",
          clubFighting: character.clubFighting?.toString() || "",
          distanceFighting: character.distanceFighting?.toString() || "",
          shielding: character.shielding?.toString() || "",
          fishing: character.fishing?.toString() || "",
          charmPoints: character.charmPoints?.toString() || "",
          inventoryValue: character.inventoryValue?.toString() || "",
          charmExpansion: character.charmExpansion || false,
          transferable: character.transferable || false,
          hasRecoveryKey: character.hasRecoveryKey || false,
          safeAddress: character.safeAddress || false,
        });
        setCharmsId(character.Charms?.map((c: any) => c.id) || []);
        setMountsId(character.Mounts?.map((m: any) => m.id) || []);
        const mappedOutfits = character.Outfits?.map((o: any) => ({
          id: o.outfitId,
          level: o.nivel,
        })) || [];
        setOutfits(mappedOutfits);

        // Pré-selecionar o outfit marcado como capa (pictureUrl != default)
        if (character.pictureUrl && character.pictureUrl !== "/uploads/system/no-image.jpg" && character.Outfits?.length) {
          // Encontrar pelo pictureOutfitId salvo ou pelo primeiro outfit como fallback
          const coverIdx = mappedOutfits.findIndex((o: any) => {
            // Tenta encontrar pelo match — se o backend guardou, tenta usar a mesma combinação
            return character._pictureOutfitId === o.id;
          });
          setSelectedCoverIndex(coverIdx >= 0 ? coverIdx : 0);
        } else {
          setSelectedCoverIndex(null);
        }

        if (character.metadata && typeof character.metadata === 'object') {
          setMetadataEntries(Object.entries(character.metadata).map(([k, v]) => ({ key: k, value: String(v) })));
        } else {
          setMetadataEntries([]);
        }
      } else {
        setFormData({
          title: "",
          description: "",
          seoTitle: "",
          seoDescription: "",
          isFeatured: false,
          price: "",
          promotionalPrice: "",
          priceTibiaCoins: "",
          promotionalPriceTibiaCoins: "",
          worldId: "",
          gender: "MALE",
          vocation: "KNIGHT",
          level: "",
          loyalty: "",
          magicLevel: "",
          fistFighting: "",
          swordFighting: "",
          axeFighting: "",
          clubFighting: "",
          distanceFighting: "",
          shielding: "",
          fishing: "",
          charmPoints: "",
          inventoryValue: "",
          charmExpansion: false,
          transferable: false,
          hasRecoveryKey: false,
          safeAddress: false,
        });
        setCharmsId([]);
        setMountsId([]);
        setOutfits([]);
        setMetadataEntries([]);
        setSelectedCoverIndex(null);
      }
    }
  }, [isOpen, character]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev: any) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "price" || name === "promotionalPrice") {
      setFormData((prev: any) => ({ ...prev, [name]: formatCurrency(value) }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const addOutfit = () => {
    setOutfits([...outfits, { id: "", level: "OUTFIT" }]);
  };

  const updateOutfit = (index: number, key: string, value: string) => {
    const newOutfits = [...outfits];
    newOutfits[index] = { ...newOutfits[index], [key]: value };
    setOutfits(newOutfits);
  };

  const removeOutfit = (index: number) => {
    const newOutfits = [...outfits];
    newOutfits.splice(index, 1);
    setOutfits(newOutfits);
    // Ajustar selectedCoverIndex ao remover outfit
    if (selectedCoverIndex === index) {
      setSelectedCoverIndex(null);
    } else if (selectedCoverIndex !== null && selectedCoverIndex > index) {
      setSelectedCoverIndex(selectedCoverIndex - 1);
    }
  };

  const addMetadataEntry = () => {
    setMetadataEntries([...metadataEntries, { key: "", value: "" }]);
  };

  const updateMetadataEntry = (index: number, field: "key" | "value", val: string) => {
    const newEntries = [...metadataEntries];
    newEntries[index][field] = val;
    setMetadataEntries(newEntries);
  };

  const removeMetadataEntry = (index: number) => {
    const newEntries = [...metadataEntries];
    newEntries.splice(index, 1);
    setMetadataEntries(newEntries);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "price" || key === "promotionalPrice") {
        if (value) {
          const numericValue = String(value).replace(/\D/g, "");
          data.append(key, numericValue);
        }
      } else {
        data.append(key, String(value));
      }
    });

    data.append("charmsId", JSON.stringify(charmsId));
    data.append("mountsId", JSON.stringify(mountsId));
    data.append("outfits", JSON.stringify(outfits.filter((o) => o.id))); // apenas válidos

    // Enviar outfit selecionado como capa
    if (selectedCoverIndex !== null && outfits[selectedCoverIndex]?.id) {
      data.append("pictureOutfitId", outfits[selectedCoverIndex].id);
      data.append("pictureOutfitLevel", outfits[selectedCoverIndex].level);
    }

    const metadataObj = metadataEntries.reduce((acc, curr) => {
      if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    if (Object.keys(metadataObj).length > 0) {
      data.append("metadata", JSON.stringify(metadataObj));
    }

    startTransition(async () => {
      let result;
      if (character) {
        result = await editCharacter(character.id, data);
      } else {
        result = await createCharacter(data);
      }

      if (result.success) {
        toast.success(
          result.message ||
            (character ? "Personagem editado." : "Personagem criado."),
        );
        onClose();
      } else {
        toast.error(result.message || "Ocorreu um erro.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {character ? "Editar Personagem" : "Novo Personagem"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Informações Básicas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Input
                  id="seoDescription"
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Atributos do Personagem
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="worldId">Mundo</Label>
                <select
                  id="worldId"
                  name="worldId"
                  value={formData.worldId}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                  required
                >
                  <option value="">Selecione...</option>
                  {worlds.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="gender">Gênero</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                  required
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Feminino</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="vocation">Vocação</Label>
                <select
                  id="vocation"
                  name="vocation"
                  value={formData.vocation}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                  required
                >
                  <option value="KNIGHT">Knight</option>
                  <option value="PALADIN">Paladin</option>
                  <option value="SORCERER">Sorcerer</option>
                  <option value="DRUID">Druid</option>
                  <option value="NONE">None</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  name="level"
                  type="number"
                  value={formData.level}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loyalty">Loyalty</Label>
                <Input
                  id="loyalty"
                  name="loyalty"
                  type="number"
                  value={formData.loyalty}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="magicLevel">Magic Level</Label>
                <Input
                  id="magicLevel"
                  name="magicLevel"
                  type="text"
                  value={formData.magicLevel}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fistFighting">Fist Fighting</Label>
                <Input
                  id="fistFighting"
                  name="fistFighting"
                  type="text"
                  value={formData.fistFighting}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="swordFighting">Sword Fighting</Label>
                <Input
                  id="swordFighting"
                  name="swordFighting"
                  type="text"
                  value={formData.swordFighting}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="axeFighting">Axe Fighting</Label>
                <Input
                  id="axeFighting"
                  name="axeFighting"
                  type="text"
                  value={formData.axeFighting}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clubFighting">Club Fighting</Label>
                <Input
                  id="clubFighting"
                  name="clubFighting"
                  type="text"
                  value={formData.clubFighting}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="distanceFighting">Distance Fighting</Label>
                <Input
                  id="distanceFighting"
                  name="distanceFighting"
                  type="text"
                  value={formData.distanceFighting}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shielding">Shielding</Label>
                <Input
                  id="shielding"
                  name="shielding"
                  type="text"
                  value={formData.shielding}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fishing">Fishing</Label>
                <Input
                  id="fishing"
                  name="fishing"
                  type="text"
                  value={formData.fishing}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charmPoints">Pontos de Charm</Label>
                <Input
                  id="charmPoints"
                  name="charmPoints"
                  type="number"
                  value={formData.charmPoints}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="inventoryValue">
                  Valor do Inventário (In-game)
                </Label>
                <Input
                  id="inventoryValue"
                  name="inventoryValue"
                  type="number"
                  placeholder="Ex: 1000000"
                  value={formData.inventoryValue}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Preços</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço BRL</Label>
                <Input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="R$ 0,00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promotionalPrice">Preço Promocional BRL</Label>
                <Input
                  id="promotionalPrice"
                  name="promotionalPrice"
                  type="text"
                  placeholder="R$ 0,00"
                  value={formData.promotionalPrice}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceTibiaCoins">Preço Tibia Coins</Label>
                <Input
                  id="priceTibiaCoins"
                  name="priceTibiaCoins"
                  type="number"
                  value={formData.priceTibiaCoins}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promotionalPriceTibiaCoins">
                  Preço Promocional TC
                </Label>
                <Input
                  id="promotionalPriceTibiaCoins"
                  name="promotionalPriceTibiaCoins"
                  type="number"
                  value={formData.promotionalPriceTibiaCoins}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Configurações & Flags
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label
                  htmlFor="isFeatured"
                  className="font-normal cursor-pointer"
                >
                  Destaque
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="charmExpansion"
                  name="charmExpansion"
                  checked={formData.charmExpansion}
                  onChange={handleChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label
                  htmlFor="charmExpansion"
                  className="font-normal cursor-pointer"
                >
                  Expansão de Charm
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="transferable"
                  name="transferable"
                  checked={formData.transferable}
                  onChange={handleChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label
                  htmlFor="transferable"
                  className="font-normal cursor-pointer"
                >
                  Transferível
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasRecoveryKey"
                  name="hasRecoveryKey"
                  checked={formData.hasRecoveryKey}
                  onChange={handleChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label
                  htmlFor="hasRecoveryKey"
                  className="font-normal cursor-pointer"
                >
                  Possui Recovery Key
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="safeAddress"
                  name="safeAddress"
                  checked={formData.safeAddress}
                  onChange={handleChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label
                  htmlFor="safeAddress"
                  className="font-normal cursor-pointer"
                >
                  Safe Address
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Cosméticos & Extras
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Charms</Label>
                <div className="relative" ref={charmsRef}>
                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer text-left"
                    onClick={() => setIsCharmsOpen(!isCharmsOpen)}
                  >
                    <span className="truncate block flex-1 text-left mr-2">
                      {charmsId.length > 0
                        ? charms
                            .filter((c) => charmsId.includes(c.id))
                            .map((c) => c.name)
                            .join(", ")
                        : "Selecione..."}
                    </span>
                    {isCharmsOpen ? (
                      <ChevronUp className="h-4 w-4 opacity-50" />
                    ) : (
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    )}
                  </button>
                  {isCharmsOpen && (
                    <div className="absolute z-10 mt-1 max-h-[150px] w-full overflow-y-auto rounded-md border bg-popover shadow-md p-2 space-y-2">
                      {charms.map((c) => (
                        <div key={c.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`charm-${c.id}`}
                            className="w-4 h-4 cursor-pointer"
                            checked={charmsId.includes(c.id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setCharmsId((prev) =>
                                checked
                                  ? [...prev, c.id]
                                  : prev.filter((id) => id !== c.id),
                              );
                            }}
                          />
                          <Label
                            htmlFor={`charm-${c.id}`}
                            className="font-normal cursor-pointer text-sm w-full"
                          >
                            {c.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mounts</Label>
                <div className="relative" ref={mountsRef}>
                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer text-left"
                    onClick={() => setIsMountsOpen(!isMountsOpen)}
                  >
                    <span className="truncate block flex-1 text-left mr-2">
                      {mountsId.length > 0
                        ? mounts
                            .filter((m) => mountsId.includes(m.id))
                            .map((m) => m.name)
                            .join(", ")
                        : "Selecione..."}
                    </span>
                    {isMountsOpen ? (
                      <ChevronUp className="h-4 w-4 opacity-50" />
                    ) : (
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    )}
                  </button>
                  {isMountsOpen && (
                    <div className="absolute z-10 mt-1 max-h-[150px] w-full overflow-y-auto rounded-md border bg-popover shadow-md p-2 space-y-2">
                      {mounts.map((m) => (
                        <div key={m.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`mount-${m.id}`}
                            className="w-4 h-4 cursor-pointer"
                            checked={mountsId.includes(m.id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setMountsId((prev) =>
                                checked
                                  ? [...prev, m.id]
                                  : prev.filter((id) => id !== m.id),
                              );
                            }}
                          />
                          <Label
                            htmlFor={`mount-${m.id}`}
                            className="font-normal cursor-pointer text-sm w-full"
                          >
                            {m.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <div className="flex justify-between items-center">
                  <Label>Outfits</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOutfit}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Adicionar
                  </Button>
                </div>
                <div className="space-y-3">
                  {outfits.map((outfit, index) => (
                    <div
                      key={index}
                      className={`flex gap-2 items-center p-2 border rounded-md transition-colors ${
                        selectedCoverIndex === index
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        title={
                          selectedCoverIndex === index
                            ? "Foto de capa selecionada"
                            : "Usar como foto de capa"
                        }
                        className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-md border transition-colors cursor-pointer ${
                          selectedCoverIndex === index
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-input hover:border-primary hover:text-primary"
                        }`}
                        onClick={() =>
                          setSelectedCoverIndex(
                            selectedCoverIndex === index ? null : index,
                          )
                        }
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <div className="flex-1">
                        <select
                          value={outfit.id}
                          onChange={(e) =>
                            updateOutfit(index, "id", e.target.value)
                          }
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background cursor-pointer"
                          required
                        >
                          <option value="">Selecione o outfit...</option>
                          {availableOutfits.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-[120px]">
                        <select
                          value={outfit.level}
                          onChange={(e) =>
                            updateOutfit(index, "level", e.target.value)
                          }
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background cursor-pointer"
                        >
                          <option value="OUTFIT">Outfit (Base)</option>
                          <option value="ADDON_ONE">Addon 1</option>
                          <option value="ADDON_TWO">Addon 2</option>
                          <option value="FULL">Full</option>
                        </select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive h-9 px-2"
                        onClick={() => removeOutfit(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {selectedCoverIndex !== null && outfits[selectedCoverIndex]?.id && (
                    <p className="text-xs text-primary font-medium">
                      📷 Outfit selecionado como foto de capa: {availableOutfits.find((o) => o.id === outfits[selectedCoverIndex]?.id)?.name || ""}
                    </p>
                  )}
                  {outfits.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Nenhum outfit adicionado.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Extra</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Adicione informações extras de chave e valor.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMetadataEntry}
                >
                  <Plus className="w-3 h-3 mr-1" /> Nova Chave
                </Button>
              </div>
              <div className="space-y-3">
                {metadataEntries.map((entry, index) => (
                  <div key={index} className="flex gap-2 items-center p-2 border rounded-md">
                    <Input
                      placeholder="Chave (ex: info_secreta)"
                      value={entry.key}
                      onChange={(e) => updateMetadataEntry(index, "key", e.target.value)}
                      className="flex-1 h-9"
                    />
                    <Input
                      placeholder="Valor"
                      value={entry.value}
                      onChange={(e) => updateMetadataEntry(index, "value", e.target.value)}
                      className="flex-1 h-9"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive h-9 px-2"
                      onClick={() => removeMetadataEntry(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {metadataEntries.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Nenhum campo extra adicionado.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
