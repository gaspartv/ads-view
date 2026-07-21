import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-6 mt-auto border-t bg-background">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © 2026, Desenvolvido por{" "}
        <Link 
          href="https://diegogaspar.dev.br" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-medium hover:underline text-primary"
        >
          Diego Gaspar
        </Link>.
      </div>
    </footer>
  );
}
