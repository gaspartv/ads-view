"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Smartphone, Loader2, Link as LinkIcon } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface ShareCardModalProps {
  title: string;
  imageUrl?: string | null;
  price: number;
  promotionalPrice?: number | null;
  priceTC?: number | null;
  urlPath: string;
  trigger?: React.ReactNode;
  attributes?: { label: string; value: string | number }[];
}

export function ShareCardModal({
  title,
  imageUrl,
  price,
  promotionalPrice,
  priceTC,
  urlPath,
  trigger,
  attributes = []
}: ShareCardModalProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [fullUrl, setFullUrl] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setFullUrl(`${window.location.origin}${urlPath}`);
    const checkIsMobile = () => {
      return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
    };
    setIsMobile(checkIsMobile());
  }, [urlPath]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const currentPrice = promotionalPrice || price;

  const [cachedDataUrl, setCachedDataUrl] = useState<string | null>(null);

  const getCardImage = async (): Promise<string | null> => {
    if (cachedDataUrl) return cachedDataUrl;
    if (!cardRef.current) return null;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 1 });
      setCachedDataUrl(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    const dataUrl = await getCardImage();
    if (!dataUrl) {
      toast.error("Erro ao gerar a imagem de compartilhamento.");
      return;
    }
    
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `share-${title}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title,
          text: `Confira: ${title}\n${fullUrl}`,
        });
      } else {
        toast.info("Compartilhamento nativo de imagem não suportado. Baixe a imagem e compartilhe manualmente!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao compartilhar a imagem.");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copiado para a área de transferência!");
    } catch (error) {
      toast.error("Não foi possível copiar o link.");
    }
  };

  const handleDownload = async () => {
    const dataUrl = await getCardImage();
    if (!dataUrl) {
      toast.error("Erro ao gerar a imagem.");
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = `share-${title}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Imagem baixada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao baixar a imagem.");
    }
  };

  const handleCopy = async () => {
    const dataUrl = await getCardImage();
    if (!dataUrl) {
      toast.error("Erro ao gerar a imagem.");
      return;
    }

    try {
      const blob = await (await fetch(dataUrl)).blob();
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      toast.success("Imagem copiada para a área de transferência!");
    } catch (error) {
      console.error(error);
      try {
        await navigator.clipboard.writeText(fullUrl);
        toast.success("Link copiado para a área de transferência!");
      } catch (fallbackError) {
        toast.error("Não foi possível copiar a imagem nem o link.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        className={trigger ? "" : "hover:text-foreground transition-colors cursor-pointer text-muted-foreground flex items-center justify-center"}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        {trigger ? trigger : <Share2 className="w-5 h-5" />}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Compartilhar</DialogTitle>
          <DialogDescription>
            Gere uma imagem otimizada para Stories ou Status.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          {isMobile ? (
            <Button variant="default" className="w-full justify-start gap-2" onClick={handleShare} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
              Compartilhar no Celular
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Input 
                value={fullUrl} 
                readOnly 
                className="flex-1 bg-muted cursor-default font-medium text-muted-foreground"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <Button variant="default" onClick={handleCopyLink} className="gap-2 shrink-0">
                <LinkIcon className="w-4 h-4" />
                Copiar Link
              </Button>
            </div>
          )}
          
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleDownload} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Baixar Imagem
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleCopy} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
            Copiar Imagem
          </Button>
        </div>

        {/* Hidden 9:16 Container (always Dark for brand consistency) */}
        <div className="fixed left-[-9999px] top-[-9999px] dark">
          <div 
            ref={cardRef} 
            className="w-[1080px] h-[1920px] flex flex-col items-center p-16 relative overflow-hidden font-sans bg-zinc-950 text-zinc-50"
            style={{ 
              background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)' 
            }}
          >
            {/* Elementos decorativos de fundo */}
            <div className="absolute top-[-20%] right-[-20%] w-[1000px] h-[1000px] rounded-full bg-primary/20 blur-[200px] mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-amber-500/10 blur-[200px] mix-blend-screen" />
            
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
              
              {imageUrl ? (
                <div className="w-[560px] h-[560px] mb-12 bg-zinc-900/80 rounded-[64px] flex items-center justify-center p-12 overflow-hidden shadow-2xl border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={title} crossOrigin="anonymous" className="w-full h-full object-contain scale-[1.2]" />
                </div>
              ) : (
                <div className="w-[560px] h-[560px] mb-12 bg-zinc-900/80 rounded-[64px] flex items-center justify-center p-12 border border-white/10 shadow-2xl">
                  <span className="text-5xl text-zinc-500 font-medium">Sem imagem</span>
                </div>
              )}

              <h1 className="text-[80px] font-extrabold text-primary text-center mb-12 leading-tight line-clamp-2 w-full drop-shadow-lg">
                {title}
              </h1>

              {attributes.length > 0 && (
                <div className="w-full grid grid-cols-2 gap-x-12 gap-y-10 mb-auto bg-white/5 rounded-[48px] p-12 border border-white/10 shadow-inner">
                  {attributes.slice(0, 6).map((attr, idx) => (
                    <div key={idx} className="flex flex-col border-b border-white/10 pb-4">
                      <span className="text-3xl text-zinc-400 mb-2">{attr.label}</span>
                      <span className="text-[44px] font-bold text-zinc-50 truncate">{attr.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-6 w-full mt-16">
                <div className="flex justify-between items-center bg-zinc-900/90 rounded-[40px] p-12 border border-primary/40 shadow-2xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-primary"></div>
                  <span className="text-[40px] font-medium text-zinc-400">Valor R$</span>
                  <div className="flex flex-col items-end">
                    {promotionalPrice && (
                      <span className="text-3xl text-zinc-500 line-through mb-1">
                        {formatCurrency(price)}
                      </span>
                    )}
                    <span className="text-[80px] font-black text-primary leading-none">
                      {formatCurrency(currentPrice)}
                    </span>
                  </div>
                </div>
                
                {priceTC && (
                  <div className="flex justify-between items-center bg-zinc-900/90 rounded-[40px] p-12 border border-amber-500/40 shadow-2xl relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-amber-500"></div>
                    <span className="text-[40px] font-medium text-zinc-400">Valor em TC</span>
                    <span className="text-[72px] font-black text-amber-500 leading-none">
                      {priceTC}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
