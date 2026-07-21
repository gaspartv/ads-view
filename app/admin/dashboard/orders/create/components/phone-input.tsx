"use client";

import { useState, useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// ─── Lista de países (comunidades Tibia + principais) ───────────────────────

interface Country {
  code: string;
  ddi: string;
  flag: string;
  name: string;
  /** Máscara do número local. # = dígito */
  mask: string;
  /** Total de dígitos do número local */
  digitCount: number;
}

export const PHONE_COUNTRIES: Country[] = [
  // América do Sul – maior base Tibia
  { code: "BR", ddi: "55",  flag: "🇧🇷", name: "Brasil",          mask: "(##) # ####-####", digitCount: 11 },
  { code: "AR", ddi: "54",  flag: "🇦🇷", name: "Argentina",       mask: "(##) ####-####",   digitCount: 10 },
  { code: "CL", ddi: "56",  flag: "🇨🇱", name: "Chile",           mask: "(#) ####-####",    digitCount:  9 },
  { code: "CO", ddi: "57",  flag: "🇨🇴", name: "Colômbia",        mask: "### ###-####",     digitCount: 10 },
  { code: "VE", ddi: "58",  flag: "🇻🇪", name: "Venezuela",       mask: "###-###-####",     digitCount: 10 },
  { code: "PE", ddi: "51",  flag: "🇵🇪", name: "Peru",            mask: "### ###-###",      digitCount:  9 },
  { code: "EC", ddi: "593", flag: "🇪🇨", name: "Equador",         mask: "## ###-####",      digitCount:  9 },
  { code: "BO", ddi: "591", flag: "🇧🇴", name: "Bolívia",         mask: "# ###-####",       digitCount:  8 },
  { code: "PY", ddi: "595", flag: "🇵🇾", name: "Paraguai",        mask: "### ###-###",      digitCount:  9 },
  { code: "UY", ddi: "598", flag: "🇺🇾", name: "Uruguai",         mask: "## ###-####",      digitCount:  9 },
  { code: "PA", ddi: "507", flag: "🇵🇦", name: "Panamá",          mask: "####-####",        digitCount:  8 },
  { code: "CR", ddi: "506", flag: "🇨🇷", name: "Costa Rica",      mask: "####-####",        digitCount:  8 },
  { code: "GT", ddi: "502", flag: "🇬🇹", name: "Guatemala",       mask: "####-####",        digitCount:  8 },
  { code: "HN", ddi: "504", flag: "🇭🇳", name: "Honduras",        mask: "####-####",        digitCount:  8 },
  { code: "SV", ddi: "503", flag: "🇸🇻", name: "El Salvador",     mask: "####-####",        digitCount:  8 },
  { code: "CU", ddi: "53",  flag: "🇨🇺", name: "Cuba",            mask: "# ###-####",       digitCount:  8 },
  // América do Norte
  { code: "US", ddi: "1",   flag: "🇺🇸", name: "EUA",             mask: "(###) ###-####",   digitCount: 10 },
  { code: "MX", ddi: "52",  flag: "🇲🇽", name: "México",          mask: "(##) ####-####",   digitCount: 10 },
  // Europa – berço do Tibia
  { code: "DE", ddi: "49",  flag: "🇩🇪", name: "Alemanha",        mask: "#### ########",    digitCount: 11 },
  { code: "PL", ddi: "48",  flag: "🇵🇱", name: "Polônia",         mask: "### ### ###",      digitCount:  9 },
  { code: "SE", ddi: "46",  flag: "🇸🇪", name: "Suécia",          mask: "##-### ## ##",     digitCount:  9 },
  { code: "PT", ddi: "351", flag: "🇵🇹", name: "Portugal",        mask: "## ### ####",      digitCount:  9 },
  { code: "ES", ddi: "34",  flag: "🇪🇸", name: "Espanha",         mask: "### ## ## ##",     digitCount:  9 },
  // Outros
  { code: "RU", ddi: "7",   flag: "🇷🇺", name: "Rússia",          mask: "(###) ###-##-##",  digitCount: 10 },
  { code: "DO", ddi: "1",   flag: "🇩🇴", name: "Rep. Dominicana", mask: "(###) ###-####",   digitCount: 10 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Aplica a máscara ao string de dígitos. # = placeholder de dígito */
function applyMask(digits: string, mask: string): string {
  let di = 0;
  let result = "";
  for (const char of mask) {
    if (di >= digits.length) break;
    if (char === "#") {
      result += digits[di++];
    } else {
      result += char;
    }
  }
  return result;
}

/** Extrai apenas os dígitos de uma string */
function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Formata um número raw (DDI + local) para exibição com bandeira e máscara.
 * Ex: "5511999999999" → "🇧🇷 +55 (11) 9 9999-9999"
 */
export function formatPhoneDisplay(raw: string): string {
  if (!raw) return raw;
  const digits = onlyDigits(raw);
  const country =
    PHONE_COUNTRIES.find((c) => digits.startsWith(c.ddi) && c.code !== "DO") ??
    PHONE_COUNTRIES[0];
  const localDigits = digits.slice(
    country.ddi.length,
    country.ddi.length + country.digitCount
  );
  const masked = applyMask(localDigits, country.mask);
  return `${country.flag} +${country.ddi} ${masked}`;
}

// ─── Componente ─────────────────────────────────────────────────────────────

interface PhoneInputProps {
  /** Valor controlado: número raw completo (DDI + número local), ex: "5511999999999" */
  value: string;
  /** Chamado com o número raw completo sempre que o valor muda */
  onChange: (raw: string) => void;
  id?: string;
  /** DDI padrão para inicializar (ex: "55"). Default: Brasil */
  defaultDdi?: string;
  /** Classe extra para o wrapper div */
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  id,
  defaultDdi = "55",
  className,
}: PhoneInputProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;

  const detectCountry = (raw: string): Country =>
    PHONE_COUNTRIES.find((c) => raw.startsWith(c.ddi) && c.code !== "DO") ??
    PHONE_COUNTRIES.find((c) => c.ddi === defaultDdi) ??
    PHONE_COUNTRIES[0];

  const [selectedCountry, setSelectedCountry] = useState<Country>(() =>
    detectCountry(value)
  );

  // Número local atual (sem DDI, apenas dígitos)
  const localDigits = value.startsWith(selectedCountry.ddi)
    ? onlyDigits(value.slice(selectedCountry.ddi.length))
    : onlyDigits(value);

  const displayValue = applyMask(localDigits, selectedCountry.mask);

  const handleCountryChange = (code: string | null) => {
    if (!code) return;
    const country =
      PHONE_COUNTRIES.find((c) => c.code === code) ?? PHONE_COUNTRIES[0];
    setSelectedCountry(country);
    onChange(country.ddi + localDigits.slice(0, country.digitCount));
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = onlyDigits(e.target.value).slice(
      0,
      selectedCountry.digitCount
    );
    onChange(selectedCountry.ddi + digits);
  };

  return (
    <div className={`flex gap-2${className ? ` ${className}` : ""}`} aria-labelledby={inputId}>
      {/* Select de país */}
      <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[130px] shrink-0">
          <SelectValue>
            <span className="flex items-center gap-1.5">
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="text-sm text-muted-foreground">
                +{selectedCountry.ddi}
              </span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {PHONE_COUNTRIES.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <span className="text-base">{country.flag}</span>
                <span className="text-sm">{country.name}</span>
                <span className="text-xs text-muted-foreground ml-auto pl-2">
                  +{country.ddi}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Input do número local */}
      <Input
        id={inputId}
        inputMode="numeric"
        placeholder={selectedCountry.mask.replace(/#/g, "0")}
        value={displayValue}
        onChange={handleLocalChange}
        className="flex-1"
        autoComplete="tel"
        aria-label="Número de telefone"
      />
    </div>
  );
}
