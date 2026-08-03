"use client";

import { useState, useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, PowerOff, CheckCircle2, Trash2, Plus, ImageIcon } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { toast } from "sonner";
import { toggleProductTibiaCoinsVariableStatus, deleteProductTibiaCoinsVariable } from "@/app/actions/product-tibia-coins";
import { TibiaCoinsVariableFormModal } from "./tibia-coins-variable-form-modal";
import { TibiaCoinsVariableImageModal } from "./tibia-coins-variable-image-modal";

interface TibiaCoinsVariablesTableProps {
  product: any;
  variables: any[];
}

export function TibiaCoinsVariablesTable({ product, variables }: TibiaCoinsVariablesTableProps) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editingVariable, setEditingVariable] = useState<any>(null);

  const handleOpenModal = (variable?: any) => {
    setEditingVariable(variable || null);
    setIsModalOpen(true);
  };

  const handleOpenImageModal = (variable: any) => {
    setEditingVariable(variable);
    setIsImageModalOpen(true);
  };

  const handleToggleStatus = (variable: any) => {
    startTransition(async () => {
      try {
        const isActive = !variable.disabledAt;
        const res = await toggleProductTibiaCoinsVariableStatus(variable.id, isActive);
        if (res?.success) {
          toast.success(`Variável ${isActive ? "desabilitada" : "habilitada"} com sucesso!`);
        }
      } catch (error: any) {
        toast.error(error.message || "Erro ao alterar status da variável.");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta variável?")) return;
    
    startTransition(async () => {
      try {
        const res = await deleteProductTibiaCoinsVariable(id);
        if (res?.success) {
          toast.success("Variável excluída com sucesso!");
        }
      } catch (error: any) {
        toast.error(error.message || "Erro ao excluir variável.");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Variáveis - {product.type === "BUY" ? "Venda" : "Compra"}
        </h3>
        <Button size="sm" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Variável
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Mínimo (TC)</TableHead>
              <TableHead>Máximo (TC)</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Preço Promocional</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  Nenhuma variável encontrada para este produto.
                </TableCell>
              </TableRow>
            ) : (
              variables.map((variable) => {
                const isActive = !variable.disabledAt;

                return (
                  <TableRow key={variable.id}>
                    <TableCell className="font-medium max-w-[200px] truncate" title={variable.description}>
                      {variable.description || "-"}
                    </TableCell>
                    <TableCell>{variable.min ?? "-"}</TableCell>
                    <TableCell>{variable.max ?? "-"}</TableCell>
                    <TableCell>{variable.price ? formatCurrency(variable.price) : "-"}</TableCell>
                    <TableCell className="text-primary">
                      {variable.promotionalPrice ? formatCurrency(variable.promotionalPrice) : "-"}
                    </TableCell>
                    <TableCell>
                      {isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive dark:bg-destructive/20">
                          Desabilitado
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(variable)} title="Editar">
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenImageModal(variable)} title="Imagem">
                        <ImageIcon className="w-4 h-4 text-primary" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleStatus(variable)}
                        disabled={isPending}
                      >
                        {isActive ? (
                          <PowerOff className="w-4 h-4 text-destructive" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(variable.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <TibiaCoinsVariableFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        variable={editingVariable}
        productTibiaCoinsId={product.id}
      />

      <TibiaCoinsVariableImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        variable={editingVariable}
      />
    </div>
  );
}
