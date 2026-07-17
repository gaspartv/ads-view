"use client";

import { useState, useTransition, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadCharacterImage, deleteCharacterImage, reorderCharacterImages } from "@/app/actions/product-character";
import { toast } from "sonner";

interface CharacterImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: any;
}

export function CharacterImageModal({ isOpen, onClose, character }: CharacterImageModalProps) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [localImages, setLocalImages] = useState<any[]>([]);

  useEffect(() => {
    if (character?.Images) {
      setLocalImages(character.Images);
    } else {
      setLocalImages([]);
    }
  }, [character?.Images]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Selecione um arquivo primeiro.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadCharacterImage(character.id, formData);
      if (result.success) {
        toast.success(result.message || "Imagem enviada com sucesso!");
        setFile(null);
      } else {
        toast.error(result.message || "Erro no upload.");
      }
    });
  };

  const handleDelete = async (imageId: string) => {
    if (character?.Images && character.Images.length <= 1) {
      toast.error("O personagem precisa ter pelo menos 1 imagem.");
      return;
    }

    startTransition(async () => {
      const result = await deleteCharacterImage(character.id, imageId);
      if (result.success) {
        toast.success(result.message || "Imagem removida com sucesso!");
      } else {
        toast.error(result.message || "Erro ao remover imagem.");
      }
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("draggedIndex", index.toString());
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    const draggedIndexStr = e.dataTransfer.getData("draggedIndex");
    if (!draggedIndexStr) return;
    
    const draggedIndex = parseInt(draggedIndexStr, 10);
    if (draggedIndex === dropIndex) return;

    const newImages = [...localImages];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    setLocalImages(newImages);

    const imageIds = newImages.map((img) => img.id);
    startTransition(async () => {
      const result = await reorderCharacterImages(character.id, imageIds);
      if (result.success) {
        toast.success(result.message || "Ordem atualizada com sucesso!");
      } else {
        toast.error(result.message || "Erro ao reordenar.");
        setLocalImages(character.Images || []);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Imagens - {character?.title}</DialogTitle>
        </DialogHeader>

        {localImages.length > 0 && (
          <div className="py-2 space-y-2">
            <Label>Imagens atuais (Arraste para reordenar)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {localImages.map((img: any, index: number) => (
                <div 
                  key={img.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, index)}
                  className="relative group rounded-md overflow-hidden border cursor-move aspect-square"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="Personagem" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDelete(img.id)}
                      disabled={isPending}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="image">Nova Imagem</Label>
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
              Fechar
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
