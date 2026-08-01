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

export function ContactClient({ contactData }: { contactData?: any }) {
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

              {contactData?.Addresses && contactData.Addresses.length > 0 ? (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Sede</h4>
                    {contactData.Addresses.map((addr: any, idx: number) => {
                      const addressParts = [
                        addr.address,
                        addr.number,
                        addr.neighborhood ? `- ${addr.neighborhood}` : null,
                        addr.city,
                        addr.state ? `- ${addr.state}` : null,
                      ].filter(Boolean);

                      return (
                        <p
                          key={idx}
                          className="text-sm text-muted-foreground mt-1 leading-relaxed"
                        >
                          {addressParts.join(", ")}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ) : company?.name ? (
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
              ) : null}



              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">
                    Horário de Atendimento
                  </h4>
                  {[
                    { label: "Domingo", key: "Domingo" },
                    { label: "Segunda", key: "Segunda" },
                    { label: "Terça", key: "Terca" },
                    { label: "Quarta", key: "Quarta" },
                    { label: "Quinta", key: "Quinta" },
                    { label: "Sexta", key: "Sexta" },
                    { label: "Sábado", key: "Sabado" },
                  ].map(({ label, key }) => (
                    <p key={key} className="text-sm text-muted-foreground mt-1">
                      {label}, {contactData?.businessHours?.[key] || "Fechado"}
                    </p>
                  ))}
                </div>
              </div>

              {contactData?.socialNetworks?.data && contactData.socialNetworks.data.length > 0 && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Redes Sociais</h4>
                    <div className="mt-3 flex flex-col gap-3">
                      {contactData.socialNetworks.data.map((social: any, idx: number) => {
                        const href = social.url || social.link || "#";
                        const finalHref = href !== "#" && !href.startsWith("http") ? `https://${href}` : href;

                        return (
                          <a
                            key={idx}
                            href={finalHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-sm text-foreground/90 hover:text-primary transition-colors"
                          >
                            {social.image ? (
                              <img src={social.image} alt={social.name} className="w-6 h-6 object-contain rounded-sm" />
                            ) : null}
                            <span className="capitalize font-medium">{social.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-6 self-end h-fit w-full">
              {(contactData?.whatsappNumber || company?.whatsappNumber) && (
                <div className="flex items-start gap-4 p-8 rounded-2xl border border-border/50 bg-muted/30">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">WhatsApp</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPhoneNumber(contactData?.whatsappNumber || company?.whatsappNumber || "")}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col justify-center space-y-6 p-8 rounded-2xl border border-border/50 bg-muted/30">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground/90">
                    Contato Rápido
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A maneira mais rápida de falar com nossa equipe é através do WhatsApp.
                  </p>
                </div>
                <WhatsAppNegotiateButton
                  message="Olá! Vim da página de contato e gostaria de tirar algumas dúvidas."
                  text="Falar no WhatsApp"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
