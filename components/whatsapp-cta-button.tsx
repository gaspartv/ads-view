"use client";

import Link from "next/link";
import { useCompany } from "@/contexts/company-context";

const MESSAGE = "Olá! Vim pelo site e gostaria de mais informações.";

export function WhatsappCtaButton() {
  const { company } = useCompany();

  const whatsapp = company?.whatsappNumber;
  const href = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(MESSAGE)}`
    : "/contact";

  return (
    <Link
      href={href}
      target={whatsapp ? "_blank" : undefined}
      rel={whatsapp ? "noopener noreferrer" : undefined}
      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/30 px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-primary/5 active:scale-95 transition-all"
    >
      Falar no WhatsApp
    </Link>
  );
}
