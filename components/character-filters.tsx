"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CharacterFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialData: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      initialData[key] = value;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(initialData);
  }, [searchParams]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value && value !== "none") params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setFormData({});
    router.push(pathname);
  };

  return (
    <div className="w-full space-y-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-start border p-2 rounded-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Vocação
          </label>
          <Select
            value={formData.vocation || ""}
            onValueChange={(val) => handleChange("vocation", val || "")}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Qualquer</SelectItem>
              <SelectItem value="KNIGHT">Knight</SelectItem>
              <SelectItem value="PALADIN">Paladin</SelectItem>
              <SelectItem value="SORCERER">Sorcerer</SelectItem>
              <SelectItem value="DRUID">Druid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Level
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={formData.minLevel || ""}
              onChange={(e) => handleChange("minLevel", e.target.value)}
              className="bg-background"
            />
            <span className="text-muted-foreground text-xs">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={formData.maxLevel || ""}
              onChange={(e) => handleChange("maxLevel", e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Battleye
          </label>
          <Select
            value={formData.battleye || ""}
            onValueChange={(val) => handleChange("battleye", val || "")}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Qualquer</SelectItem>
              <SelectItem value="YELLOW">Yellow</SelectItem>
              <SelectItem value="GREEN">Green</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            PvP Type
          </label>
          <Select
            value={formData.pvpType || ""}
            onValueChange={(val) => handleChange("pvpType", val || "")}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Qualquer</SelectItem>
              <SelectItem value="OPEN_PVP">Open PvP</SelectItem>
              <SelectItem value="OPTIONAL_PVP">Optional PvP</SelectItem>
              <SelectItem value="HARDCORE_PVP">Hardcore PvP</SelectItem>
              <SelectItem value="RETRO_OPEN_PVP">Retro Open PvP</SelectItem>
              <SelectItem value="RETRO_HARDCORE_PVP">
                Retro Hardcore PvP
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-transparent select-none pointer-events-none">
            &nbsp;
          </label>
          <Button className="w-full" onClick={handleApply}>
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
