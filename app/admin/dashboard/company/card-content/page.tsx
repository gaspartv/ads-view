import { getCardContent } from "./actions";
import CardContentClient from "./components/card-content-client";

export const metadata = {
  title: "Editar Conteúdo dos Cards",
};

export default async function CardContentPage() {
  const currentConfig = await getCardContent();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Conteúdo dos Cards
        </h2>
      </div>
      <p className="text-muted-foreground">
        Selecione e ordene os atributos que devem aparecer nos cards dos
        personagens.
      </p>

      <CardContentClient initialConfig={currentConfig} />
    </div>
  );
}
