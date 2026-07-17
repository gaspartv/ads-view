"use client";

import { useCompany } from "@/contexts/company-context";
import { WhatsAppNegotiateButton } from "@/components/whatsapp-negotiate-button";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function formatPhoneNumber(phone: string) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 13) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }
  if (cleaned.length === 12) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function ContactClient() {
  const { company } = useCompany();

  return (
    <div className="cursor-default container mx-auto py-12 px-4 flex justify-center min-h-[70vh] items-center">
      <Card className="max-w-3xl w-full border-border/50 bg-card/40 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center pb-8 border-b border-border/30">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <MessageCircle className="w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Fale Conosco</CardTitle>
          <CardDescription className="text-base mt-2">
            Tem alguma dúvida, precisa de suporte ou quer negociar? Entre em
            contato conosco.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 text-foreground/90">
                Informações
              </h3>

              {company?.name && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Sede</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {company.name}
                    </p>
                  </div>
                </div>
              )}

              {company?.whatsappNumber && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">WhatsApp</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPhoneNumber(company.whatsappNumber)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    Horário de Atendimento
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Domingo, 08:00 às 18:00
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Segunda, 08:00 às 00:00
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Terça, 08:00 às 00:00
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quarta, 08:00 às 00:00
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quinta, 08:00 às 00:00
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sexta, 08:00 às 18:00
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sábado, 18:00 às 00:00
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-6 bg-muted/30 p-8 rounded-2xl border border-border/50">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground/90">
                  Contato Rápido
                </h3>
                <p className="text-sm text-muted-foreground">
                  A maneira mais rápida de falar com nossa equipe é através do
                  WhatsApp.
                </p>
              </div>
              <WhatsAppNegotiateButton
                message="Olá! Vim da página de contato e gostaria de tirar algumas dúvidas."
                text="Falar no WhatsApp"
                size="lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
