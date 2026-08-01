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
  Eye,
} from "lucide-react";
import {
  deleteAccountLoyalty,
  toggleAccountLoyaltyStatus,
} from "@/app/actions/product-account-loyalty";
import { toast } from "sonner";
import { formatGameValue } from "@/lib/formatters";
import { AccountLoyaltyFormModal } from "./account-loyalty-form-modal";
import { AccountLoyaltyViewModal } from "./account-loyalty-view-modal";

interface AccountLoyaltyTableProps {
  accountLoyalties: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function AccountLoyaltyTable({
  accountLoyalties,
  pagination,
}: AccountLoyaltyTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const currentOrderBy = searchParams.get("orderBy") || "createdAt";
  const currentOrderType = searchParams.get("orderType") || "desc";
  const currentLimit = searchParams.get("limit") || "10";
  const currentStatus = searchParams.get("status") || "";

  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedAccountLoyalty, setSelectedAccountLoyalty] =
    useState<any>(null);

  useEffect(() => {
    if (selectedAccountLoyalty) {
      const updatedItem = accountLoyalties.find(
        (p) => p.id === selectedAccountLoyalty.id,
      );
      if (updatedItem) {
        setSelectedAccountLoyalty(updatedItem);
      }
    }
  }, [accountLoyalties]);

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
    params.delete("search");
    params.set("page", "1");
    setSearchTerm("");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleCreate = () => {
    setSelectedAccountLoyalty(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedAccountLoyalty(item);
    setIsFormOpen(true);
  };

  const handleView = (item: any) => {
    setSelectedAccountLoyalty(item);
    setIsViewOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta conta loyalty?")) return;

    startTransition(async () => {
      const result = await deleteAccountLoyalty(id);
      if (result.success) {
        toast.success(result.message || "Removido com sucesso!");
      } else {
        toast.error(result.message || "Erro ao remover.");
      }
    });
  };

  const handleToggleStatus = (id: string, disabledAt: any) => {
    startTransition(async () => {
      const result = await toggleAccountLoyaltyStatus(
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
          Gestão de Contas com Loyalty
        </h2>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button onClick={handleCreate} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Nova Conta</span>
            <span className="inline sm:hidden">Nova</span>
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
            placeholder="Buscar conta..."
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

        {(currentStatus || currentSearch) && (
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
              <TableHead
                className="w-[120px] cursor-pointer hover:bg-muted/50 transition-colors group"
                onClick={() => handleSort("disabledAt")}
              >
                <div className="flex items-center">
                  Status {renderSortIcon("disabledAt")}
                </div>
              </TableHead>
              <TableHead
                className="w-[220px] cursor-pointer hover:bg-muted/50 transition-colors group"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  Título {renderSortIcon("title")}
                </div>
              </TableHead>
              <TableHead className="w-auto text-center">Pontos / %</TableHead>
              <TableHead className="w-auto">Preço BRL</TableHead>
              <TableHead className="w-auto">Promo BRL</TableHead>
              <TableHead className="w-auto">Preço TC</TableHead>
              <TableHead className="w-auto">Promo TC</TableHead>
              <TableHead className="w-[110px] text-center">Endereço Seguro</TableHead>
              <TableHead className="w-[100px] text-center">Carta de RK</TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountLoyalties.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-6 text-muted-foreground"
                >
                  Nenhuma conta loyalty encontrada.
                </TableCell>
              </TableRow>
            ) : (
              accountLoyalties.map((item) => {
                let tooltipText = item.description || "";

                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleView(item)}
                  >
                    <TableCell>
                      {item.disabledAt ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive dark:bg-destructive/20">
                          Desabilitado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                          Ativo
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{item.title}</span>
                          {tooltipText && (
                            <span title={tooltipText.trim()}>
                              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {item.code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {item.points} pts
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.percentage}% bônus
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format((item.price || 0) / 100)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.promotionalPrice ? (
                        <span className="text-primary">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.promotionalPrice / 100)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span>
                        {item.priceTibiaCoins ? formatGameValue(item.priceTibiaCoins) + " TC" : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.promotionalPriceTibiaCoins ? (
                        <span className="text-primary">
                          {formatGameValue(item.promotionalPriceTibiaCoins)} TC
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.safeAddress ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                          Sim
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive dark:bg-destructive/20">
                          Não
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.hasRecoveryKey ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                          Sim
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive dark:bg-destructive/20">
                          Não
                        </span>
                      )}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                              onClick={() => handleView(item)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleEdit(item)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() =>
                                handleToggleStatus(item.id, item.disabledAt)
                              }
                            >
                              {item.disabledAt ? (
                                <>
                                  <Power className="mr-2 h-4 w-4 text-primary" />{" "}
                                  Habilitar
                                </>
                              ) : (
                                <>
                                  <PowerOff className="mr-2 h-4 w-4 text-secondary-foreground" />{" "}
                                  Desabilitar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(item.id)}
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

      <AccountLoyaltyFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        accountLoyalty={selectedAccountLoyalty}
      />

      <AccountLoyaltyViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        accountLoyalty={selectedAccountLoyalty}
      />
    </div>
  );
}
