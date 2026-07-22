import { AlertTriangle, Mail } from "lucide-react";

export function CompanyUnavailable() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Empresa indisponível
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Não foi possível identificar a empresa associada a este endereço.
            <br />
            Verifique o endereço ou entre em contato com o administrador.
          </p>
        </div>

        <div className="pt-2">
          <a
            href="mailto:suporte@exemplo.com"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contatar administrador
          </a>
        </div>

        <p className="text-xs text-muted-foreground/60">
          Se você é o administrador, verifique se o domínio está cadastrado
          corretamente no painel.
        </p>
      </div>
    </div>
  );
}
