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
import { createProduct, editProduct } from "@/app/actions/product";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";

import { formatCurrency } from "@/lib/formatters";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  categories: any[];
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  categories,
}: ProductFormModalProps) {
  const [isPending, startTransition] = useTransition();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [metadataEntries, setMetadataEntries] = useState<
    { key: string; value: string }[]
  >([]);
  const [specialMetadata, setSpecialMetadata] = useState({
    level: "",
    loyalty: "",
    server: "",
    pvp: "",
    priceTC: "",
    pricePromotinalTC: "",
  });
  const [accountMetadata, setAccountMetadata] = useState({
    loyalty: "",
    pontos: "",
    endereco: "",
    cartaRk: "",
    priceTC: "",
    pricePromotionalTC: "",
  });
  const [prices, setPrices] = useState<{ index: number; min: number; max: number; price: number; pricePromotional: number }[]>([]);
  const [formData, setFormData] = useState<{
    type: string;
    categoryIds: string[];
    name: string;
    description: string;
    price: string;
    promotionalPrice: string;
    amount: string;
    multiples: string;
    costPrice: string;
    supplierName: string;
    isFixed: boolean;
    featured: boolean;
  }>({
    type: "CHARACTER",
    categoryIds: [],
    name: "",
    description: "",
    price: "",
    promotionalPrice: "",
    amount: "1",
    multiples: "1",
    costPrice: "",
    supplierName: "",
    isFixed: false,
    featured: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (product) {
        let parsedMetadata: { key: string; value: string }[] = [];
        let parsedSpecial = {
          level: "",
          loyalty: "",
          server: "",
          pvp: "",
          priceTC: "",
          pricePromotinalTC: "",
        };
        let parsedAccount = {
          loyalty: "",
          pontos: "",
          endereco: "",
          cartaRk: "",
          priceTC: "",
          pricePromotionalTC: "",
        };
        let parsedPrices: any[] = [];
        
        if (product.metadata) {
          try {
            const parsed =
              typeof product.metadata === "string"
                ? JSON.parse(product.metadata)
                : product.metadata;
            Object.entries(parsed).forEach(([key, value]) => {
              if (product.type === "TIBIA_COINS" && key === "prices" && Array.isArray(value)) {
                parsedPrices = value;
              } else if (product.type === "ACCOUNT" && Object.keys(parsedAccount).includes(key)) {
                parsedAccount[key as keyof typeof parsedAccount] = String(value);
              } else if (product.type === "CHARACTER" && Object.keys(parsedSpecial).includes(key)) {
                parsedSpecial[key as keyof typeof parsedSpecial] = String(value);
              } else {
                parsedMetadata.push({ key, value: String(value) });
              }
            });
          } catch (e) {}
        }
        setMetadataEntries(parsedMetadata);
        setSpecialMetadata(parsedSpecial);
        setAccountMetadata(parsedAccount);
        setPrices(parsedPrices);

        setFormData({
          type: product.type || "CHARACTER",
          categoryIds: product.Categories
            ? product.Categories.map((c: any) => c.id)
            : [],
          name: product.name || "",
          description: product.description || "",
          price: product.price ? formatCurrency(product.price) : "",
          promotionalPrice: product.promotionalPrice
            ? formatCurrency(product.promotionalPrice)
            : "",
          amount: product.amount?.toString() || "1",
          multiples:
            product.multiples?.toString() ||
            (product.type === "TIBIA_COINS" ? "25" : "1"),
          costPrice: product.costPrice ? formatCurrency(product.costPrice) : "",
          supplierName: product.supplierName || "",
          isFixed: product.isFixed || false,
          featured: product.featured || false,
        });
      } else {
        setMetadataEntries([]);
        setSpecialMetadata({
          level: "",
          loyalty: "",
          server: "",
          pvp: "",
          priceTC: "",
          pricePromotinalTC: "",
        });
        setAccountMetadata({
          loyalty: "",
          pontos: "",
          endereco: "",
          cartaRk: "",
          priceTC: "",
          pricePromotionalTC: "",
        });
        setPrices([]);
        setFormData({
          type: "CHARACTER",
          categoryIds: [],
          name: "",
          description: "",
          price: "",
          promotionalPrice: "",
          amount: "1",
          multiples: "1",
          costPrice: "",
          supplierName: "",
          isFixed: false,
          featured: false,
        });
      }
    }
  }, [isOpen, product, categories]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value,
        multiples: value === "TIBIA_COINS" ? "25" : "1",
      }));
    } else if (
      name === "price" ||
      name === "promotionalPrice" ||
      name === "costPrice"
    ) {
      setFormData((prev) => ({ ...prev, [name]: formatCurrency(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "categoryIds") {
        data.append(key, JSON.stringify(value));
      } else if (
        key === "price" ||
        key === "promotionalPrice" ||
        key === "costPrice"
      ) {
        if (value) {
          const numericValue = value.toString().replace(/\D/g, "");
          data.append(key, numericValue);
        }
      } else {
        data.append(key, value.toString());
      }
    });

    const metadataObj = metadataEntries.reduce(
      (acc, curr) => {
        if (curr.key) acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, any>,
    );

    if (formData.type === "CHARACTER") {
      Object.entries(specialMetadata).forEach(([key, value]) => {
        if (value.trim()) {
          metadataObj[key] = value.trim();
        }
      });
    } else if (formData.type === "ACCOUNT") {
      Object.entries(accountMetadata).forEach(([key, value]) => {
        if (value.trim()) {
          metadataObj[key] = value.trim();
        }
      });
    } else if (formData.type === "TIBIA_COINS") {
      if (prices.length > 0) {
        metadataObj.prices = prices;
      }
    }

    if (Object.keys(metadataObj).length > 0) {
      data.append("metadata", JSON.stringify(metadataObj));
    }

    startTransition(async () => {
      let result;
      if (product) {
        result = await editProduct(product.id, data);
      } else {
        result = await createProduct(data);
      }

      if (result.success) {
        toast.success(
          result.message || (product ? "Produto editado." : "Produto criado."),
        );
        onClose();
      } else {
        toast.error(result.message || "Ocorreu um erro.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${formData.type === 'TIBIA_COINS' ? 'sm:max-w-[900px]' : 'sm:max-w-[700px]'} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Produto</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                disabled={!!product}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                required
              >
                <option value="CHARACTER">Personagem</option>
                <option value="ACCOUNT">Conta</option>
                <option value="TIBIA_COINS">Tibia Coins</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Categorias</Label>
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer text-left"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <span className="truncate block flex-1 text-left mr-2">
                    {formData.categoryIds.length > 0
                      ? categories
                          .filter((cat) =>
                            formData.categoryIds.includes(cat.id),
                          )
                          .map((cat) => cat.name)
                          .join(", ")
                      : "Selecione as categorias..."}
                  </span>
                  {isCategoryOpen ? (
                    <ChevronUp className="h-4 w-4 opacity-50" />
                  ) : (
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
                {isCategoryOpen && (
                  <div className="absolute z-10 mt-1 max-h-[150px] w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md p-2 space-y-2">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`category-${cat.id}`}
                          className="w-4 h-4 cursor-pointer"
                          checked={formData.categoryIds.includes(cat.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              categoryIds: checked
                                ? [...prev.categoryIds, cat.id]
                                : prev.categoryIds.filter(
                                    (id) => id !== cat.id,
                                  ),
                            }));
                          }}
                        />
                        <Label
                          htmlFor={`category-${cat.id}`}
                          className="font-normal cursor-pointer text-sm w-full"
                        >
                          {cat.name}
                        </Label>
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <span className="text-sm text-muted-foreground block p-2">
                        Nenhuma categoria encontrada.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Preço de Venda{" "}
                <span className="text-muted-foreground font-normal text-xs ml-1">
                  (cada {formData.multiples} {formData.type})
                </span>
              </Label>
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
              <Label htmlFor="promotionalPrice">
                Preço Promocional{" "}
                <span className="text-muted-foreground font-normal text-xs ml-1">
                  (cada {formData.multiples} {formData.type})
                </span>
              </Label>
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
              <Label htmlFor="amount">Quantidade</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="1"
                value={formData.amount}
                onChange={handleChange}
                disabled={!!product}
                required
              />
            </div>

            {!product && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">
                    Preço de Custo (Total do lote)
                  </Label>
                  <Input
                    id="costPrice"
                    name="costPrice"
                    type="text"
                    placeholder="R$ 0,00"
                    value={formData.costPrice}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplierName">Fornecedor (Opcional)</Label>
                  <Input
                    id="supplierName"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {formData.type === "CHARACTER" && (
              <div className="col-span-2 grid grid-cols-2 gap-4 border p-4 rounded-md mt-2">
                <h4 className="col-span-2 font-medium text-sm">Atributos do Personagem</h4>
                <div className="space-y-2">
                  <Label htmlFor="char-level">Level</Label>
                  <Input
                    id="char-level"
                    type="number"
                    value={specialMetadata.level}
                    onChange={(e) => setSpecialMetadata(prev => ({...prev, level: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="char-loyalty">Loyalty</Label>
                  <Input
                    id="char-loyalty"
                    type="number"
                    value={specialMetadata.loyalty}
                    onChange={(e) => setSpecialMetadata(prev => ({...prev, loyalty: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="char-server">Servidor</Label>
                  <Input
                    id="char-server"
                    value={specialMetadata.server}
                    onChange={(e) => setSpecialMetadata(prev => ({...prev, server: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="char-pvp">Tipo de PvP</Label>
                  <Input
                    id="char-pvp"
                    value={specialMetadata.pvp}
                    onChange={(e) => setSpecialMetadata(prev => ({...prev, pvp: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="char-priceTC">Preço em TC</Label>
                  <Input
                    id="char-priceTC"
                    type="number"
                    value={specialMetadata.priceTC}
                    onChange={(e) => setSpecialMetadata(prev => ({...prev, priceTC: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="char-pricePromotinalTC">Preço Promocional em TC</Label>
                  <Input
                    id="char-pricePromotinalTC"
                    type="number"
                    value={specialMetadata.pricePromotinalTC}
                    onChange={(e) => setSpecialMetadata(prev => ({...prev, pricePromotinalTC: e.target.value}))}
                  />
                </div>
              </div>
            )}

            {formData.type === "ACCOUNT" && (
              <div className="col-span-2 grid grid-cols-2 gap-4 border p-4 rounded-md mt-2">
                <h4 className="col-span-2 font-medium text-sm">Atributos da Conta</h4>
                <div className="space-y-2">
                  <Label htmlFor="acc-loyalty">Nível de Loyalty</Label>
                  <Input
                    id="acc-loyalty"
                    value={accountMetadata.loyalty}
                    onChange={(e) => setAccountMetadata(prev => ({...prev, loyalty: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acc-pontos">Pontos</Label>
                  <Input
                    id="acc-pontos"
                    type="number"
                    value={accountMetadata.pontos}
                    onChange={(e) => setAccountMetadata(prev => ({...prev, pontos: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acc-endereco">Endereço</Label>
                  <Input
                    id="acc-endereco"
                    value={accountMetadata.endereco}
                    onChange={(e) => setAccountMetadata(prev => ({...prev, endereco: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acc-rk">Carta RK</Label>
                  <Input
                    id="acc-rk"
                    value={accountMetadata.cartaRk}
                    onChange={(e) => setAccountMetadata(prev => ({...prev, cartaRk: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acc-priceTC">Preço em TC</Label>
                  <Input
                    id="acc-priceTC"
                    type="number"
                    value={accountMetadata.priceTC}
                    onChange={(e) => setAccountMetadata(prev => ({...prev, priceTC: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acc-pricePromotinalTC">Preço Promocional em TC</Label>
                  <Input
                    id="acc-pricePromotinalTC"
                    type="number"
                    value={accountMetadata.pricePromotionalTC}
                    onChange={(e) => setAccountMetadata(prev => ({...prev, pricePromotionalTC: e.target.value}))}
                  />
                </div>
              </div>
            )}

            {formData.type === "TIBIA_COINS" && (
              <div className="col-span-2 border p-4 rounded-md mt-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">Faixas de Preço</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPrices([...prices, { index: prices.length, min: 0, max: 0, price: 0, pricePromotional: 0 }])}
                  >
                    + Adicionar Faixa
                  </Button>
                </div>
                {prices.map((p, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Mínimo (Qtd)</Label>
                      <Input
                        type="number"
                        value={p.min || ""}
                        onChange={(e) => {
                          const newPrices = [...prices];
                          newPrices[idx].min = Number(e.target.value);
                          setPrices(newPrices);
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Máximo (Qtd)</Label>
                      <Input
                        type="number"
                        value={p.max || ""}
                        onChange={(e) => {
                          const newPrices = [...prices];
                          newPrices[idx].max = Number(e.target.value);
                          setPrices(newPrices);
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Preço Unit.</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={p.price || ""}
                        onChange={(e) => {
                          const newPrices = [...prices];
                          newPrices[idx].price = Number(e.target.value);
                          setPrices(newPrices);
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Preço Prom.</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={p.pricePromotional || ""}
                        onChange={(e) => {
                          const newPrices = [...prices];
                          newPrices[idx].pricePromotional = Number(e.target.value);
                          setPrices(newPrices);
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-5 text-destructive"
                      onClick={() => {
                        const newPrices = [...prices];
                        newPrices.splice(idx, 1);
                        setPrices(newPrices.map((item, i) => ({ ...item, index: i })));
                      }}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 col-span-2 flex gap-4">
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="isFixed"
                  name="isFixed"
                  checked={formData.isFixed}
                  onChange={handleChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label htmlFor="isFixed" className="font-normal cursor-pointer">
                  Fixo
                </Label>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label
                  htmlFor="featured"
                  className="font-normal cursor-pointer"
                >
                  Destaque
                </Label>
              </div>
            </div>

            <div className="space-y-2 col-span-2 mt-4 border-t pt-4 border-border/50">
              <div className="flex items-center justify-between">
                <Label>Metadados Adicionais</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setMetadataEntries([
                      ...metadataEntries,
                      { key: "", value: "" },
                    ])
                  }
                >
                  + Adicionar
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {metadataEntries.map((entry, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Chave (ex: server)"
                      value={entry.key}
                      onChange={(e) => {
                        const newEntries = [...metadataEntries];
                        newEntries[index].key = e.target.value;
                        setMetadataEntries(newEntries);
                      }}
                    />
                    <Input
                      placeholder="Valor"
                      value={entry.value}
                      onChange={(e) => {
                        const newEntries = [...metadataEntries];
                        newEntries[index].value = e.target.value;
                        setMetadataEntries(newEntries);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newEntries = [...metadataEntries];
                        newEntries.splice(index, 1);
                        setMetadataEntries(newEntries);
                      }}
                    >
                      X
                    </Button>
                  </div>
                ))}
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
