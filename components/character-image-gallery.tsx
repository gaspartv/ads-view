"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface CharacterImageGalleryProps {
  images: any[];
  title: string;
}

export function CharacterImageGallery({
  images,
  title,
}: CharacterImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-md relative aspect-[4/3] bg-muted flex items-center justify-center rounded-lg">
        <span className="text-muted-foreground">Sem imagem</span>
      </div>
    );
  }

  return (
    <>
      <Carousel className="w-full max-w-md mx-auto">
        <CarouselContent>
          {images.map((img: any, index: number) => (
            <CarouselItem key={img.id}>
              <div
                className="relative aspect-square md:aspect-[4/3] bg-black/5 rounded-lg overflow-hidden flex items-center justify-center p-2 cursor-pointer"
                onClick={() => {
                  setStartIndex(index);
                  setOpen(true);
                }}
              >
                <img
                  src={img.url}
                  alt={`${title} - Imagem ${index + 1}`}
                  className="object-contain max-h-full max-w-full rounded-md hover:scale-[1.02] transition-transform"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="cursor-pointer" />
        <CarouselNext className="cursor-pointer" />
      </Carousel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl bg-black/90 border-none shadow-none flex items-center justify-center p-6 sm:p-12">
          <DialogTitle className="sr-only">Galeria de Imagens</DialogTitle>
          {/* We must render a new Carousel instance with the clicked index as initial */}
          {open && (
            <Carousel
              className="w-full h-full max-h-[85vh] flex items-center justify-center"
              opts={{ startIndex }}
            >
              <CarouselContent>
                {images.map((img: any, index: number) => (
                  <CarouselItem key={`modal-${img.id}`}>
                    <div className="relative w-full h-[80vh] flex items-center justify-center">
                      <img
                        src={img.url}
                        alt={`${title} - Imagem ${index + 1}`}
                        className="object-contain max-h-full max-w-full rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="cursor-pointer left-2 sm:-left-12 bg-black/50 text-white border-none hover:bg-black/70" />
              <CarouselNext className="cursor-pointer right-2 sm:-right-12 bg-black/50 text-white border-none hover:bg-black/70" />
            </Carousel>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
