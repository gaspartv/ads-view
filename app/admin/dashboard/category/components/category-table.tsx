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
} from "lucide-react";
import { CategoryFormModal } from "./category-form-modal";
import { ImageUploadModal } from "./image-upload-modal";
import { deleteCategory, toggleCategoryStatus } from "@/app/actions/category";
import { toast } from "sonner";

interface CategoryTableProps {
  categories: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function CategoryTable({ categories, pagination }: CategoryTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const currentOrderBy = searchParams.get("orderBy") || "createdAt";
  const currentOrderType = searchParams.get("orderType") || "desc";
  const currentLimit = searchParams.get("limit") || "10";

  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // Mantém a categoria selecionada atualizada após revalidatePath
  useEffect(() => {
    if (selectedCategory) {
      const updatedCategory = categories.find((c) => c.id === selectedCategory.id);
      if (updatedCategory) {
        setSelectedCategory(updatedCategory);
      }
    }
  }, [categories]);

  // Controle de busca com pequeno atraso para não engasgar a URL a cada letra digitada
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    // Evita disparo na montagem se o valor for igual ao da URL
    if (searchTerm === currentSearch) return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // Reseta para pág 1 em nova busca
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

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleImage = (category: any) => {
    setSelectedCategory(category);
    setIsImageOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta categoria?")) return;

    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success(result.message || "Removido com sucesso!");
      } else {
        toast.error(result.message || "Erro ao remover.");
      }
    });
  };

  const handleToggleStatus = (id: string, disabledAt: any) => {
    startTransition(async () => {
      const result = await toggleCategoryStatus(
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
          Gestão de Categorias
        </h2>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative flex-1 sm:w-64"
          >
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar categoria..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          <Button onClick={handleCreate} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Nova Categoria</span>
            <span className="inline sm:hidden">Nova</span>
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
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
              <TableHead
                className="w-[220px] cursor-pointer hover:bg-muted/50 transition-colors group"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Nome {renderSortIcon("name")}
                </div>
              </TableHead>
              <TableHead className="w-auto">Descrição</TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.Images && category.Images.length > 0 ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={category.Images[0].url}
                        alt={category.name}
                        className="w-10 h-10 rounded-md object-cover border bg-muted mx-auto"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md border bg-muted flex items-center justify-center mx-auto">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {category.disabledAt ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Desabilitada
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Ativa
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {category.name}
                  </TableCell>
                  <TableCell>{category.description || "-"}</TableCell>
                  <TableCell className="text-right">
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
                            onClick={() => handleEdit(category)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleImage(category)}
                          >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Imagens
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleStatus(
                                category.id,
                                category.disabledAt,
                              )
                            }
                          >
                            {category.disabledAt ? (
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
                            onClick={() => handleDelete(category.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação e Limitador */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Itens por página:</span>
          <select
            className="h-8 rounded-md border border-input bg-transparent px-2 py-1 text-sm outline-none ring-offset-background focus:ring-1 focus:ring-ring"
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

      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        category={selectedCategory}
      />
      <ImageUploadModal
        isOpen={isImageOpen}
        onClose={() => setIsImageOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}
