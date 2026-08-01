"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Tag,
  Building2,
  Globe,
  Calendar,
  Mail,
  Phone,
  FileText,
  AlignLeft,
  Search,
  Info,
  Edit2,
  Save,
  Loader2,
  X,
} from "lucide-react";
import { updateCompanyInfo } from "@/app/actions/company";

function formatCnpj(cnpj: string | null | undefined) {
  if (!cnpj) return "";
  const cleaned = cnpj.replace(/\D/g, "");
  if (cleaned.length !== 14) return cnpj;
  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}

function formatWhatsApp(phone: string | null | undefined) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }
  return phone;
}

export function CompanyBasicInfoForm({ company }: { company: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: company.code || "",
    name: company.name || "",
    site: company.site || "",
    cnpj: company.cnpj || "",
    email: company.email || "",
    whatsappNumber: company.whatsappNumber || "",
    slogan: company.slogan || "",
    description: company.description || "",
    seoTitle: company.seoTitle || "",
    seoDescription: company.seoDescription || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const performSave = async () => {
    setIsLoading(true);
    let payload = { ...formData };
    let didChangeSubdomain = false;
    let newDomainOrigin = "";

    if (payload.code !== company.code) {
      const siteStr = payload.site.toLowerCase();
      if (siteStr.includes(".tibia-info.com")) {
        const hasProtocol = siteStr.startsWith("http");
        try {
          const urlObj = new URL(hasProtocol ? siteStr : `http://${siteStr}`);
          if (urlObj.hostname.endsWith(".tibia-info.com")) {
            const protocol = urlObj.protocol + "//";
            const newHost = `${payload.code}.tibia-info.com`;
            payload.site = hasProtocol ? `${protocol}${newHost}` : newHost;
            didChangeSubdomain = true;
            newDomainOrigin = `${protocol}${newHost}`;
          }
        } catch (e) {
          console.error("Erro ao fazer parse da URL", e);
        }
      }
    }

    const res = await updateCompanyInfo(payload);
    setIsLoading(false);

    if (res.success) {
      toast.success("Dados da empresa atualizados com sucesso!");
      setIsEditing(false);
      setIsAlertOpen(false);

      if (didChangeSubdomain && newDomainOrigin) {
        window.location.href = `${newDomainOrigin}/admin/dashboard/company`;
      }
    } else {
      toast.error(res.message || "Erro ao atualizar dados.");
    }
  };

  const handleToggleEdit = async () => {
    if (isEditing) {
      if (formData.code !== company.code) {
        setIsAlertOpen(true);
        return;
      }
      await performSave();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      code: company.code || "",
      name: company.name || "",
      site: company.site || "",
      cnpj: company.cnpj || "",
      email: company.email || "",
      whatsappNumber: company.whatsappNumber || "",
      slogan: company.slogan || "",
      description: company.description || "",
      seoTitle: company.seoTitle || "",
      seoDescription: company.seoDescription || "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditing && (
            <Button
              onClick={handleCancel}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="cursor-pointer"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          )}
          <Button
            onClick={handleToggleEdit}
            disabled={isLoading}
            variant={isEditing ? "default" : "outline"}
            size="lg"
            className="cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isEditing ? (
              <Save className="w-4 h-4 mr-2" />
            ) : (
              <Edit2 className="w-4 h-4 mr-2" />
            )}
            {isEditing ? "Salvar" : "Editar"}
          </Button>
        </div>
      </div>

      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atenção: Alteração de Subdomínio</DialogTitle>
            <DialogDescription>
              Você está prestes a alterar o código (subdomínio) da empresa. Isso
              fará com que o endereço atual do site mude imediatamente. Seus
              usuários e clientes que acessarem pelo link antigo perderão o
              acesso. Tem certeza que deseja continuar com a alteração?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAlertOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={performSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Confirmar Alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium uppercase flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-primary" /> Código (Subdomínio)
            <span title="Identificador único usado no acesso à plataforma.">
              <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground/60 cursor-help" />
            </span>
          </span>
          <Input
            disabled={!isEditing}
            name="code"
            value={isEditing ? formData.code : company.code}
            onChange={handleChange}
            className="bg-muted/50 font-medium disabled:opacity-75"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium uppercase flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-primary" /> Nome da empresa
            <span title="Nome fantasia da empresa.">
              <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground/60 cursor-help" />
            </span>
          </span>
          <Input
            disabled={!isEditing}
            name="name"
            value={isEditing ? formData.name : company.name}
            onChange={handleChange}
            className="bg-muted/50 font-medium disabled:opacity-75"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium uppercase flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-primary" /> Site
            <span title="Site da empresa.">
              <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground/60 cursor-help" />
            </span>
          </span>
          <Input
            disabled={!isEditing}
            name="site"
            value={isEditing ? formData.site : company.site}
            onChange={handleChange}
            className="bg-muted/50 font-medium disabled:opacity-75"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium uppercase flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" /> Data de Criação
            <span title="Data em que a empresa foi cadastrada no sistema.">
              <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground/60 cursor-help" />
            </span>
          </span>
          <Input
            disabled
            value={
              company.createdAt
                ? new Date(company.createdAt).toLocaleDateString("pt-BR")
                : "Não informado"
            }
            className="bg-muted/50 font-medium disabled:opacity-75"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium uppercase flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-primary" /> CNPJ
            <span title="Cadastro Nacional da Pessoa Jurídica da empresa.">
              <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground/60 cursor-help" />
            </span>
          </span>
          <Input
            disabled={!isEditing}
            name="cnpj"
            value={
              isEditing
                ? formData.cnpj
                : formatCnpj(company.cnpj) || "Não informado"
            }
            onChange={handleChange}
            className="bg-muted/50 font-medium disabled:opacity-75"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium uppercase flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-primary" /> E-mail
            <span title="Endereço de e-mail principal para contato e notificações.">
              <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground/60 cursor-help" />
            </span>
          </span>
          <Input
            disabled={!isEditing}
            name="email"
            value={isEditing ? formData.email : company.email}
            onChange={handleChange}
            className="bg-muted/50 font-medium disabled:opacity-75"
          />
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground font-medium uppercase flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-primary" /> WhatsApp
            <span title="Número de WhatsApp para atendimento ao cliente.">
              <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground/60 cursor-help" />
            </span>
          </span>
          <Input
            disabled={!isEditing}
            name="whatsappNumber"
            value={
              isEditing
                ? formData.whatsappNumber
                : formatWhatsApp(company.whatsappNumber) || "Não informado"
            }
            onChange={handleChange}
            className="bg-muted/50 font-medium disabled:opacity-75"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <span className="text-xs text-muted-foreground font-medium uppercase flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" /> Slogan
            <span title="Frase curta de impacto usada pela marca.">
              <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground/60 cursor-help" />
            </span>
          </span>
          <Input
            disabled={!isEditing}
            name="slogan"
            value={
              isEditing ? formData.slogan : company.slogan || "Não informado"
            }
            onChange={handleChange}
            className="bg-muted/50 font-medium disabled:opacity-75"
          />
        </div>
        <div className="space-y-1 md:col-span-4 lg:col-span-4">
          <span className="text-xs text-muted-foreground font-medium uppercase flex items-center gap-2 mb-2">
            <AlignLeft className="w-4 h-4 text-primary" /> Descrição
            <span title="Detalhes e informações gerais sobre a empresa.">
              <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground/60 cursor-help" />
            </span>
          </span>
          <Textarea
            disabled={!isEditing}
            name="description"
            value={
              isEditing
                ? formData.description
                : company.description || "Não informado"
            }
            onChange={handleChange}
            className="bg-muted/50 font-medium resize-none disabled:opacity-75"
            rows={3}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <span className="text-xs text-muted-foreground font-medium uppercase flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-primary" /> SEO Title
            <span title="Título otimizado para motores de busca (Google, Bing).">
              <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground/60 cursor-help" />
            </span>
          </span>
          <Input
            disabled={!isEditing}
            name="seoTitle"
            value={
              isEditing
                ? formData.seoTitle
                : company.seoTitle || "Não informado"
            }
            onChange={handleChange}
            className="bg-muted/50 font-medium disabled:opacity-75"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <span className="text-xs text-muted-foreground font-medium uppercase flex items-center gap-2 mb-2">
            <Search className="w-4 h-4 text-primary" /> SEO Description
            <span title="Descrição otimizada para motores de busca.">
              <Info className="w-3.5 h-3.5 ml-1 text-muted-foreground/60 cursor-help" />
            </span>
          </span>
          <Textarea
            disabled={!isEditing}
            name="seoDescription"
            value={
              isEditing
                ? formData.seoDescription
                : company.seoDescription || "Não informado"
            }
            onChange={handleChange}
            className="bg-muted/50 font-medium resize-none disabled:opacity-75"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
