"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Image as ImageIcon,
  Plus,
  Power,
  PowerOff,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Info,
  Pin,
  PackagePlus,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductFormModal } from "./product-form-modal";
import { ImageUploadModal } from "./image-upload-modal";
import { ProductViewModal } from "./product-view-modal";
import { StockAddModal } from "./stock-add-modal";
import { deleteProduct, toggleProductStatus } from "@/app/actions/product";
import { toast } from "sonner";

interface ProductTableProps {
  products: any[];
  categories: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function ProductTable({ products, categories, pagination }: ProductTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const currentOrderBy = searchParams.get("orderBy") || "createdAt";
  const currentOrderType = searchParams.get("orderType") || "desc";
  const currentLimit = searchParams.get("limit") || "10";
  const currentStatus = searchParams.get("status") || "";
  const currentType = searchParams.get("type") || "";
  const currentFeatured = searchParams.get("featured") || "";
  const currentCategoryId = searchParams.get("categoryId") || "";

  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Mantém o produto selecionado atualizado após revalidatePath
  useEffect(() => {
    if (selectedProduct) {
      const updatedProduct = products.find((p) => p.id === selectedProduct.id);
      if (updatedProduct) {
        setSelectedProduct(updatedProduct);
      }
    }
  }, [products]);

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    if (searchTerm === currentSearch) return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentSearch, pathname, router, searchParams]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSort = (column: string) => {
    const params = new URLSearchParams(searchParams);
    if (currentOrderBy === column) {
      params.set("orderType", currentOrderType === "asc" ? "desc" : "asc");
    } else {
      params.set("orderBy", column);
      params.set("orderType", "asc");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const renderSortIcon = (column: string) => {
    if (currentOrderBy !== column)
      return (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" />
      );
    return currentOrderType === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />
    );
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", e.target.value);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("status");
    params.delete("type");
    params.delete("featured");
    params.delete("categoryId");
    params.delete("search");
    params.set("page", "1");
    setSearchTerm("");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleImage = (product: any) => {
    setSelectedProduct(product);
    setIsImageOpen(true);
  };

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setIsViewOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;

    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success(result.message || "Removido com sucesso!");
      } else {
        toast.error(result.message || "Erro ao remover.");
      }
    });
  };

  const handleToggleStatus = (id: string, disabledAt: any) => {
    startTransition(async () => {
      const result = await toggleProductStatus(
        id,
        disabledAt ? "enable" : "disable",
      );
      if (result.success) {
        toast.success(result.message || "Status alterado!");
      } else {
        toast.error(result.message || "Erro ao alterar status.");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Gestão de Produtos
        </h2>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button onClick={handleCreate} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Novo Produto</span>
            <span className="inline sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 w-full">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative flex-1 w-full sm:w-auto min-w-[200px]"
        >
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar produto..."
            className="pl-8 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <select
          className="h-9 rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          value={currentStatus}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">Status: Todos</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
        
        <select
          className="h-9 rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          value={currentType}
          onChange={(e) => handleFilterChange("type", e.target.value)}
        >
          <option value="">Tipo: Todos</option>
          <option value="TIBIA_COINS">Tibia Coins</option>
          <option value="CHARACTER">Character</option>
          <option value="ACCOUNT">Account</option>
        </select>

        <select
          className="h-9 rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          value={currentFeatured}
          onChange={(e) => handleFilterChange("featured", e.target.value)}
        >
          <option value="">Destaque: Todos</option>
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>

        <select
          className="h-9 rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring cursor-pointer max-w-[200px]"
          value={currentCategoryId}
          onChange={(e) => handleFilterChange("categoryId", e.target.value)}
        >
          <option value="">Categoria: Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {(currentStatus || currentType || currentFeatured || currentCategoryId || currentSearch) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 px-2 text-muted-foreground"
            onClick={clearFilters}
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">Imagem</TableHead>
              <TableHead
                className="w-[120px] cursor-pointer hover:bg-muted/50 transition-colors group"
                onClick={() => handleSort("disabledAt")}
              >
                <div className="flex items-center">
                  Status {renderSortIcon("disabledAt")}
                </div>
              </TableHead>
              <TableHead className="w-auto">Tipo</TableHead>
              <TableHead
                className="w-[220px] cursor-pointer hover:bg-muted/50 transition-colors group"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Nome (slug) {renderSortIcon("name")}
                </div>
              </TableHead>
              <TableHead className="w-auto">Preço (Promocional)</TableHead>
              <TableHead className="w-auto text-center">Estoque</TableHead>
              <TableHead className="w-auto">Categorias</TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => {
                let tooltipText = product.description || "";
                if (product.metadata) {
                  let metaObj = product.metadata;
                  if (typeof product.metadata === "string") {
                    try {
                      metaObj = JSON.parse(product.metadata);
                    } catch (e) {
                      metaObj = {};
                    }
                  }
                  if (metaObj && typeof metaObj === "object" && Object.keys(metaObj).length > 0) {
                    if (tooltipText) tooltipText += "\n\n";
                    for (const [k, v] of Object.entries(metaObj)) {
                      tooltipText += `${k}: ${v}\n`;
                    }
                  }
                }

                return (
                  <TableRow 
                    key={product.id}
                    className={`cursor-pointer transition-colors ${product.featured ? "bg-amber-500/5 dark:bg-amber-500/10 shadow-[inset_4px_0_0_0_rgba(251,191,36,0.5)]" : ""}`}
                    onClick={() => handleView(product)}
                  >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div 
                      className="cursor-pointer flex flex-col items-center justify-center gap-1 group/img"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImage(product);
                      }}
                    >
                      {product.Images && product.Images.length > 0 ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={product.Images[0].url}
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover border bg-muted group-hover/img:opacity-80 transition-opacity"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md border bg-muted flex items-center justify-center group-hover/img:opacity-80 transition-opacity">
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-[10px] font-mono text-muted-foreground">{product.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.disabledAt ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Desabilitado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Ativo
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        {product.isFixed && <Pin className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                        <span className="truncate">{product.name}</span>
                        {tooltipText && (
                          <span title={tooltipText.trim()}>
                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help shrink-0" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">({product.slug})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format((product.price || 0) / 100)}
                      </span>
                      {product.promotionalPrice ? (
                        <span className="text-xs text-green-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(product.promotionalPrice / 100)}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{product.amount}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {product.Categories?.map((cat: any) => (
                        <span key={cat.id} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" className="h-8 w-8 p-0" />
                        }
                      >
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleView(product)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleImage(product)}
                          >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Gerenciar Imagens
                          </DropdownMenuItem>
                          {product.type === "TIBIA_COINS" && (
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsStockModalOpen(true);
                              }}
                            >
                              <PackagePlus className="mr-2 h-4 w-4 text-amber-500" />
                              Repor estoque
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              handleToggleStatus(
                                product.id,
                                product.disabledAt,
                              )
                            }
                          >
                            {product.disabledAt ? (
                              <>
                                <Power className="mr-2 h-4 w-4 text-green-500" />{" "}
                                Habilitar
                              </>
                            ) : (
                              <>
                                <PowerOff className="mr-2 h-4 w-4 text-orange-500" />{" "}
                                Desabilitar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product.id)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação e Limitador */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Itens por página:</span>
          <select
            className="h-8 rounded-md border border-input bg-transparent px-2 py-1 text-sm outline-none ring-offset-background focus:ring-1 focus:ring-ring cursor-pointer"
            value={currentLimit}
            onChange={handleLimitChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              Página {pagination.page} de {pagination.totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                <span className="hidden sm:inline">Próxima</span>
                <ChevronRight className="w-4 h-4 sm:ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={selectedProduct}
        categories={categories}
      />

      <ImageUploadModal
        isOpen={isImageOpen}
        onClose={() => {
          setIsImageOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      <StockAddModal
        isOpen={isStockModalOpen}
        onClose={() => {
          setIsStockModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      <ProductViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
