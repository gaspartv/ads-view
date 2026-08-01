"use client";

import { useRef, useState } from "react";
import { Upload, ImageIcon, Loader2, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface CompanyImageUploadProps {
  label: string;
  description?: string;
  currentUrl: string | null | undefined;
  onUpload: (formData: FormData) => Promise<{
    success: boolean;
    message?: string;
    url?: string;
  }>;
  accept?: string;
  /** "square" para logo/favicon, "wide" para banner */
  variant?: "square" | "wide";
  fieldName: string;
  /** Limite de tamanho em bytes para exibição amigável */
  maxSizeLabel: string;
  /** Oculta o header interno (label + maxSize) — use quando o card pai já tem título */
  hideLabel?: boolean;
}

export function CompanyImageUpload({
  label,
  description,
  currentUrl,
  onUpload,
  accept = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/x-icon",
  variant = "square",
  fieldName,
  maxSizeLabel,
  hideLabel = false,
}: CompanyImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setIsModalOpen(true);

    // Reset o input para permitir reselecionar o mesmo arquivo
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await onUpload(formData);
    setIsLoading(false);

    if (res.success) {
      toast.success(res.message || `${label} atualizado com sucesso!`);
      setIsModalOpen(false);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } else {
      toast.error(res.message || `Erro ao fazer upload do ${label}.`);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const isWide = variant === "wide";

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="space-y-2">
        {!hideLabel && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium uppercase">
              {label}
            </span>
            {description && (
              <span className="text-xs text-muted-foreground/60">
                — {description}
              </span>
            )}
            <span className="text-xs text-muted-foreground/50 ml-auto">
              máx. {maxSizeLabel}
            </span>
          </div>
        )}

        {/* Preview Container */}
        <div
          className={`group relative overflow-hidden border border-border/60 bg-muted/30 rounded-xl transition-all duration-200 hover:border-primary/40 hover:bg-muted/50 ${
            isWide ? "w-full h-36" : "w-32 h-32"
          }`}
        >
          {currentUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUrl}
                alt={label}
                className={`w-full h-full ${isWide ? "object-cover" : "object-contain p-3"}`}
              />
              {/* Overlay de hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-1.5 text-white"
                  aria-label={`Alterar ${label}`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium drop-shadow">
                    Alterar
                  </span>
                </button>
              </div>
            </>
          ) : (
            /* Placeholder — sem imagem */
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              aria-label={`Fazer upload do ${label}`}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border/60 group-hover:border-primary/40 transition-colors">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">Upload</span>
            </button>
          )}
        </div>

        {/* Botão secundário visível abaixo do preview quando há imagem */}
        {currentUrl && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Alterar {label.toLowerCase()}
          </button>
        )}
      </div>

      {/* Modal de confirmação */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload de {label}
            </DialogTitle>
            <DialogDescription>
              Revise a imagem abaixo antes de confirmar o envio.
            </DialogDescription>
          </DialogHeader>

          {/* Preview da imagem selecionada */}
          {previewUrl && (
            <div
              className={`w-full overflow-hidden rounded-lg border border-border/60 bg-muted/20 mx-auto ${
                isWide ? "h-44" : "h-48 max-w-48"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className={`w-full h-full ${isWide ? "object-cover" : "object-contain p-4"}`}
              />
            </div>
          )}

          {/* Detalhes do arquivo */}
          {selectedFile && (
            <div className="text-xs text-muted-foreground space-y-0.5 bg-muted/30 rounded-lg px-3 py-2">
              <p>
                <span className="font-medium text-foreground">Arquivo:</span>{" "}
                {selectedFile.name}
              </p>
              <p>
                <span className="font-medium text-foreground">Tamanho:</span>{" "}
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
              <p>
                <span className="font-medium text-foreground">Tipo:</span>{" "}
                {selectedFile.type}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmUpload}
              disabled={isLoading}
              className="flex items-center gap-1.5"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {isLoading ? "Enviando..." : "Confirmar Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
