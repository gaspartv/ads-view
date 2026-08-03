"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger as RadixSheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";

type World = { id: string; name: string };

export function CharacterFilters({ worlds }: { worlds: World[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const initialData: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      initialData[key] = value;
    });
    setFormData(initialData);
  }, [searchParams]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleApply();
    } else {
      setOpen(true);
    }
  };

  const handleClear = () => {
    setFormData({});
    router.push(pathname);
    setOpen(false);
  };

  const createRange = (label: string, minKey: string, maxKey: string) => (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={formData[minKey] || ""}
          onChange={(e) => handleChange(minKey, e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max"
          value={formData[maxKey] || ""}
          onChange={(e) => handleChange(maxKey, e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <RadixSheetTrigger render={<Button variant="outline" className="flex items-center gap-2" />}>
        <Filter className="w-4 h-4" />
        Filtros
      </RadixSheetTrigger>
      
      {/* Removido o overflow-y-auto do content se quisermos rolar internamente, mas como a queixa foi duas barras, 
          vamos deixar o SheetContent sem gerenciar rolagem forçada com overflow-y-auto e colocar a rolagem no div interno. 
          Na verdade, é melhor colocar o overflow-y-auto apenas no interior, ou apenas no SheetContent. Vamos deixar no SheetContent e tirar do interno. */}
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto flex flex-col">
        <SheetHeader>
          <div className="flex justify-between items-center pr-8">
            <SheetTitle>Filtros</SheetTitle>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Limpar
            </Button>
          </div>
          <SheetDescription>
            Refine sua busca por personagens.
          </SheetDescription>
        </SheetHeader>
        
        {/* Usamos flex-1 para preencher o espaço, mas sem overflow e max-h para não gerar a segunda barra. 
            Como o SheetContent acima tem overflow-y-auto, a rolagem vai ocorrer nele. */}
        <div className="w-full flex flex-col gap-4 mt-4 pb-8">
          
          {createRange("Preço (R$)", "minPrice", "maxPrice")}
          {createRange("Preço (Tibia Coins)", "minPriceTibiaCoins", "maxPriceTibiaCoins")}

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-medium">Vocação</label>
            <Select value={formData.vocation || ""} onValueChange={(val) => handleChange("vocation", val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Qualquer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                <SelectItem value="KNIGHT">Knight</SelectItem>
                <SelectItem value="PALADIN">Paladin</SelectItem>
                <SelectItem value="SORCERER">Sorcerer</SelectItem>
                <SelectItem value="DRUID">Druid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {createRange("Level", "minLevel", "maxLevel")}

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-medium">Gênero</label>
            <Select value={formData.gender || ""} onValueChange={(val) => handleChange("gender", val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Qualquer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Masculino</SelectItem>
                <SelectItem value="FEMALE">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {createRange("Loyalty", "minLoyalty", "maxLoyalty")}

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-medium">Servidor (World)</label>
            <Select value={formData.worldId || ""} onValueChange={(val) => handleChange("worldId", val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Qualquer" />
              </SelectTrigger>
              <SelectContent>
                {worlds.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {createRange("Magic Level", "minMagicLevel", "maxMagicLevel")}
          {createRange("Fist Fighting", "minFistFighting", "maxFistFighting")}
          {createRange("Sword Fighting", "minSwordFighting", "maxSwordFighting")}
          {createRange("Axe Fighting", "minAxeFighting", "maxAxeFighting")}
          {createRange("Club Fighting", "minClubFighting", "maxClubFighting")}
          {createRange("Distance Fighting", "minDistanceFighting", "maxDistanceFighting")}
          {createRange("Shielding", "minShielding", "maxShielding")}
          {createRange("Fishing", "minFishing", "maxFishing")}
          {createRange("Charm Points", "minCharmPoints", "maxCharmPoints")}

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-medium">Charm Expansion</label>
            <Select value={formData.charmExpansion || ""} onValueChange={(val) => handleChange("charmExpansion", val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Qualquer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-medium">Transferível</label>
            <Select value={formData.transferable || ""} onValueChange={(val) => handleChange("transferable", val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Qualquer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-medium">Recovery Key</label>
            <Select value={formData.hasRecoveryKey || ""} onValueChange={(val) => handleChange("hasRecoveryKey", val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Qualquer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-medium">Endereço Seguro</label>
            <Select value={formData.safeAddress || ""} onValueChange={(val) => handleChange("safeAddress", val || "")}>
              <SelectTrigger>
                <SelectValue placeholder="Qualquer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button className="w-full mt-2" onClick={handleApply}>
            Aplicar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
