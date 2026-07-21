"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  searchCustomerByWhatsapp,
  createCustomer,
} from "@/app/actions/customer";
import { createOrder } from "@/app/actions/orders";
import { Search, UserPlus, ShoppingCart, Trash, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatGameValue } from "@/lib/formatters";
import { getCharacters } from "@/app/actions/product-character";
import { getAccountLoyalties } from "@/app/actions/product-account-loyalty";
import { getProductTibiaCoins } from "@/app/actions/product-tibia-coins";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCompany } from "@/contexts/company-context";
import { PhoneInput, formatPhoneDisplay } from "./phone-input";

/** Extrai apenas os dígitos de uma string */
function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function CreateOrderForm() {
  const { company } = useCompany();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);

  // Step 1: Customer
  const [whatsapp, setWhatsapp] = useState("");
  const [customer, setCustomer] = useState<any>(null);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  // Número completo (DDI + local) gerenciado pelo PhoneInput
  const [modalPhone, setModalPhone] = useState("");

  // Step 2: Items
  const [items, setItems] = useState<any[]>([]);
  const [productType, setProductType] = useState("CHARACTER");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [overridePrice, setOverridePrice] = useState("");
  // Moeda do preço informado: BRL (centavos) ou TC (Tibia Coins, valor direto)
  const [priceCurrency, setPriceCurrency] = useState<"BRL" | "TC">("BRL");

  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  // Produto selecionado no passo 2 (objeto completo)
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Carrega produtos ao mudar o tipo
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setProductId("");
      try {
        if (productType === "CHARACTER") {
          const res = await getCharacters(1, 100);
          if (res.success && res.data?.data) {
            if (isMounted)
              setAvailableProducts(res.data.data.filter((p: any) => !p.soldAt));
          }
        } else if (productType === "ACCOUNT_LOYALTY") {
          const res = await getAccountLoyalties(1, 100);
          if (res.success && res.data?.data) {
            if (isMounted)
              setAvailableProducts(res.data.data.filter((p: any) => !p.soldAt));
          }
        } else if (productType === "TIBIA_COINS") {
          const res = await getProductTibiaCoins();
          // product-tibia-coins typically returns the array directly, or inside data
          const arr = Array.isArray(res) ? res : res?.data || [];
          if (isMounted)
            setAvailableProducts(arr.filter((p: any) => !p.disabledAt));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [productType]);

  // Limpa o produto selecionado ao mudar o tipo
  // (já tratado no useEffect acima via setProductId(""), mas precisamos limpar o objeto)
  useEffect(() => {
    setSelectedProduct(null);
    setOverridePrice("");
    setPriceCurrency("BRL");
  }, [productType]);

  // Step 3: Finance
  const [currency, setCurrency] = useState("BRL");
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [discount, setDiscount] = useState("");
  const [fee, setFee] = useState("");

  const handleSearchCustomer = async () => {
    if (!whatsapp) return;
    startTransition(async () => {
      const res = await searchCustomerByWhatsapp(whatsapp);
      setHasSearched(true);
      if (res.success && res.data?.length > 0) {
        setSearchResults(res.data);
        setCustomer(null);
        toast.success(`${res.data.length} cliente(s) encontrado(s).`);
      } else {
        setSearchResults([]);
        setCustomer(null);
        toast.info("Cliente não encontrado. Cadastre um novo cliente.");
      }
    });
  };

  const handleCreateCustomer = async () => {
    if (!newCustomerName) return;
    const rawNumber = onlyDigits(modalPhone);
    if (rawNumber.length < 10) {
      toast.error("Digite um número de telefone válido com DDI.");
      return;
    }
    startTransition(async () => {
      const res = await createCustomer(newCustomerName, rawNumber);
      if (res.success) {
        setCustomer(res.data);
        setIsModalOpen(false);
        setNewCustomerName("");
        setModalPhone("");
        toast.success("Cliente criado com sucesso!");
      } else {
        toast.error(res.message);
      }
    });
  };

  const openCreateModal = () => {
    // Pré-preenche com o número buscado (apenas dígitos, PhoneInput detecta DDI)
    setModalPhone(onlyDigits(whatsapp));
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    const parsedQty = parseInt(quantity, 10);

    if (productType === "TIBIA_COINS") {
      if (isNaN(parsedQty) || parsedQty <= 0 || parsedQty % 25 !== 0) {
        toast.error("A quantidade de Tibia Coins deve ser um múltiplo de 25.");
        return;
      }
    }

    // Monta label legível para exibição no carrinho
    let label = "";
    let displayPrice: number | undefined;
    if (selectedProduct) {
      if (productType === "CHARACTER") {
        label = `${selectedProduct.title} — Lvl ${selectedProduct.level} ${selectedProduct.vocation} (${selectedProduct.World?.name ?? ""})`;
        displayPrice = selectedProduct.price;
      } else if (productType === "ACCOUNT_LOYALTY") {
        label = `${selectedProduct.title} — ${selectedProduct.points} pontos`;
        displayPrice = selectedProduct.price;
      } else {
        label = selectedProduct.name || "Tibia Coins";
        displayPrice = selectedProduct.price;
      }
    }

    setItems([
      ...items,
      {
        productType,
        productId,
        quantity: parsedQty,
        label,
        displayPrice: overridePrice
          ? priceCurrency === "BRL"
            ? parseInt(overridePrice.replace(/\D/g, ""), 10)          // digits = centavos
            : parseInt(overridePrice, 10)                              // TC: valor direto
          : displayPrice,
        overridePrice: overridePrice
          ? priceCurrency === "BRL"
            ? parseInt(overridePrice.replace(/\D/g, ""), 10)          // já em centavos
            : parseInt(overridePrice, 10)                              // TC: valor direto
          : undefined,
        overrideCurrency: overridePrice ? priceCurrency : undefined,
      },
    ]);
    setProductId("");
    setSelectedProduct(null);
    setQuantity("1");
    setOverridePrice("");
    setPriceCurrency("BRL");
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!customer) return toast.error("Selecione um cliente");
    if (items.length === 0) return toast.error("Adicione ao menos um item");

    const payload = {
      customerId: customer.id,
      companyId: company!.id,
      currency,
      paymentMethod,
      items,
      discountAmount: discount ? parseInt(discount, 10) * 100 : undefined,
      feeAmount: fee ? parseInt(fee, 10) * 100 : undefined,
    };

    startTransition(async () => {
      const res = await createOrder(payload);
      if (res.success) {
        toast.success(res.message);
        router.push("/admin/dashboard/orders");
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Steps Indicator */}
      <div className="flex justify-between items-center mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 text-center py-2 border-b-2 ${step >= s ? "border-primary text-primary" : "border-muted text-muted-foreground"}`}
          >
            Passo {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
              <CardDescription>Busque o cliente pelo WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="WhatsApp (ex: 5511999999999)"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    setHasSearched(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchCustomer()}
                />
                <Button
                  className="cursor-pointer"
                  onClick={handleSearchCustomer}
                  disabled={isPending}
                >
                  <Search className="w-4 h-4 mr-2" /> Buscar
                </Button>
              </div>

              {/* Cliente selecionado */}
              {customer ? (
                <div className="p-4 bg-muted rounded-md border flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPhoneDisplay(customer.whatsappNumber)}
                    </p>
                  </div>
                  <Button
                    className="cursor-pointer"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setCustomer(null);
                      setHasSearched(false);
                      setSearchResults([]);
                    }}
                  >
                    Limpar
                  </Button>
                </div>
              ) : null}

              {/* Lista de resultados da busca */}
              {!customer && hasSearched && searchResults.length > 0 && (
                <div className="border rounded-md divide-y overflow-hidden">
                  {searchResults.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCustomer(c)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPhoneDisplay(c.whatsappNumber)}
                        </p>
                      </div>
                      <span className="text-xs text-primary font-medium">
                        Selecionar →
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Nenhum resultado */}
              {!customer && hasSearched && searchResults.length === 0 && (
                <div className="p-4 border rounded-md border-dashed">
                  <p className="text-sm text-muted-foreground">
                    Nenhum cliente encontrado para esse número.
                  </p>
                </div>
              )}

              {hasSearched && (
                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-9 cursor-pointer"
                    onClick={openCreateModal}
                  >
                    <UserPlus className="w-4 h-4 mr-2" /> Cadastrar Novo Cliente
                  </Button>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  className="cursor-pointer"
                  onClick={() => setStep(2)}
                  disabled={!customer}
                >
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Modal – Cadastrar Novo Cliente */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Preencha o nome do cliente. O número de WhatsApp já foi
                  preenchido automaticamente.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="new-customer-whatsapp">
                    WhatsApp{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      (DDI + DDD + número)
                    </span>
                  </Label>
                  <PhoneInput
                    id="new-customer-whatsapp"
                    value={modalPhone}
                    onChange={setModalPhone}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-customer-name">Nome completo</Label>
                  <Input
                    id="new-customer-name"
                    placeholder="Ex: João da Silva"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCreateCustomer()
                    }
                    autoFocus
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewCustomerName("");
                    setModalPhone("");
                  }}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateCustomer}
                  disabled={isPending || !newCustomerName}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isPending ? "Salvando..." : "Salvar Cliente"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Itens da Venda</CardTitle>
            <CardDescription>
              Selecione o tipo de produto e escolha o item para adicionar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">

            {/* Toggle de tipo de produto */}
            <div className="flex gap-2">
              {[
                { value: "CHARACTER", label: "Personagem" },
                { value: "TIBIA_COINS", label: "Tibia Coins" },
                { value: "ACCOUNT_LOYALTY", label: "Account Loyalty" },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setProductType(t.value)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium border transition-colors cursor-pointer ${
                    productType === t.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Lista de produtos como cards clicáveis */}
            {loadingProducts ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Carregando produtos...
              </div>
            ) : availableProducts.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border rounded-md border-dashed">
                Nenhum produto disponível.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                {availableProducts.map((p) => {
                  const isSelected = productId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setProductId(p.id);
                        setSelectedProduct(p);
                      }}
                      className={`w-full text-left rounded-md border px-4 py-3 transition-colors cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {productType === "CHARACTER" && (
                        <div className="flex items-center gap-3">
                          {/* Imagem */}
                          {p.Images?.[0]?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.Images[0].url}
                              alt={p.title}
                              className="w-12 h-12 rounded-md object-cover shrink-0 border bg-muted"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-md border bg-muted flex items-center justify-center shrink-0 text-xs text-muted-foreground">
                              IMG
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-sm truncate">{p.title}</p>
                              {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                Lvl {p.level} {p.vocation}
                              </Badge>
                              {p.World?.name && (
                                <Badge variant="outline" className="text-xs">
                                  {p.World.name}
                                </Badge>
                              )}
                              {p.gender && (
                                <Badge variant="outline" className="text-xs">
                                  {p.gender === "FEMALE" ? "F" : "M"}
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-3 mt-1.5 text-xs">
                              <span className="text-muted-foreground">
                                BRL:{" "}
                                <span className="text-foreground font-medium">
                                  {formatCurrency(p.price)}
                                </span>
                              </span>
                              {p.priceTibiaCoins > 0 && (
                                <span className="text-muted-foreground">
                                  TC:{" "}
                                  <span className="text-foreground font-medium">
                                    {formatGameValue(p.priceTibiaCoins)}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {productType === "ACCOUNT_LOYALTY" && (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{p.title}</p>
                              {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {p.points > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {formatGameValue(p.points)} pts
                                </Badge>
                              )}
                              {p.percentage > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {p.percentage}% loyalty
                                </Badge>
                              )}
                              {p.hasRecoveryKey && (
                                <Badge variant="outline" className="text-xs">RK</Badge>
                              )}
                              {p.safeAddress && (
                                <Badge variant="outline" className="text-xs">Safe Address</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-medium">{formatCurrency(p.price)}</p>
                            {p.promotionalPrice && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                Promo: {formatCurrency(p.promotionalPrice)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {productType === "TIBIA_COINS" && (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{p.name || "Tibia Coins"}</p>
                              {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Qtd mínima: múltiplos de 25
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-medium">{formatCurrency(p.price)}</p>
                            {p.promotionalPrice && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                Promo: {formatCurrency(p.promotionalPrice)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Campos extras após seleção */}
            {productId && (
              <div className="space-y-3 pt-1">
                {productType === "TIBIA_COINS" ? (
                  /* Tibia Coins: só quantidade */
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Qtd (Múltiplo de 25)"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddItem} disabled={!productId}>
                      Adicionar
                    </Button>
                  </div>
                ) : (
                  /* CHARACTER / ACCOUNT_LOYALTY: moeda + valor vendido */
                  <>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Forma de pagamento do produto
                      </p>
                      <div className="flex gap-2">
                        {([
                          { value: "BRL", label: "Real (R$)" },
                          { value: "TC",  label: "Tibia Coins" },
                        ] as const).map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setPriceCurrency(opt.value);
                              setOverridePrice("");
                            }}
                            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium border transition-colors cursor-pointer ${
                              priceCurrency === opt.value
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-foreground border-border hover:bg-muted"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type={priceCurrency === "BRL" ? "text" : "number"}
                        inputMode="numeric"
                        placeholder={
                          priceCurrency === "BRL"
                            ? "R$ 0,00"
                            : "Valor em TC (ex: 750)"
                        }
                        value={overridePrice}
                        onChange={(e) =>
                          priceCurrency === "BRL"
                            ? setOverridePrice(formatCurrency(e.target.value))
                            : setOverridePrice(e.target.value)
                        }
                        className="flex-1"
                      />
                      <Button onClick={handleAddItem} disabled={!productId}>
                        Adicionar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Carrinho de itens */}
            <div className="border rounded-md">
              {items.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  Nenhum item adicionado.
                </div>
              ) : (
                <div className="divide-y">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.label || item.productType}
                        </p>
                        <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                          {item.displayPrice && (
                            <span>{formatCurrency(item.displayPrice)}</span>
                          )}
                          {productType === "TIBIA_COINS" && item.quantity > 1 && (
                            <span>Qtd: {item.quantity}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button onClick={() => setStep(3)} disabled={items.length === 0}>
                Próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Pagamento & Fechamento</CardTitle>
            <CardDescription>Configure como a venda foi paga.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Moeda</Label>
                <select
                  className="w-full h-9 rounded-md border px-3 bg-background text-foreground"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="BRL">Real (R$)</option>
                  <option value="TIBIA_COINS">Tibia Coins (TC)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Método de Pagamento</Label>
                <select
                  className="w-full h-9 rounded-md border px-3 bg-background text-foreground"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="PIX">Pix</option>
                  <option value="STRIPE">Cartão (Stripe)</option>
                  <option value="MERCADO_PAGO">Mercado Pago</option>
                  <option value="MANUAL">Manual / Outro</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Desconto ({currency})</Label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Acréscimos / Taxas ({currency})</Label>
                <Input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Voltar
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? (
                  "Processando..."
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" /> Criar Venda
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
