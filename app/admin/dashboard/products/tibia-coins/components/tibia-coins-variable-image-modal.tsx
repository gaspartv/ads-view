"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadProductTibiaCoinsVariableImage } from "@/app/actions/product-tibia-coins";
import { toast } from "sonner";
import Image from "next/image";

interface VariableImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  variable: any;
}

export function TibiaCoinsVariableImageModal({ isOpen, onClose, variable }: VariableImageModalProps) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Selecione um arquivo primeiro.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadProductTibiaCoinsVariableImage(variable.id, formData);
      if (result.success) {
        toast.success(result.message || "Imagem enviada com sucesso!");
        setFile(null);
        onClose();
      } else {
        toast.error(result.message || "Erro no upload.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Imagem - {variable?.description || "Variável"}</DialogTitle>
        </DialogHeader>

        {variable?.url && (
          <div className="py-2 space-y-2 flex flex-col items-center">
            <Label className="self-start">Imagem atual</Label>
            <div className="relative w-32 h-32 rounded-md overflow-hidden border">
              <img 
                src={variable.url.startsWith("http") ? variable.url : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || ""}${variable.url}`} 
                alt="Variável" 
                className="object-cover w-full h-full" 
              />
            </div>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="image">Nova Imagem (Substituir)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !file}>
              {isPending ? "Enviando..." : "Enviar Imagem"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
