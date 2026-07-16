"use client";

import { useActionState } from "react";
import { signInAction } from "../actions/auth";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full transition-all duration-200"
    >
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export function SignInForm() {
  const [state, formAction] = useActionState(signInAction, null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  return (
    <Card className="shadow-xl border-border/50 bg-card/80 backdrop-blur-xl">
      <CardContent className="pt-8 px-8">
        <form className="space-y-5" action={formAction}>
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              required
              className="bg-background/50 focus:bg-background transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/80">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              className="bg-background/50 focus:bg-background transition-colors"
            />
          </div>

          {state && (
            <div
              className={`p-3 rounded-md text-sm font-medium animate-in fade-in slide-in-from-top-1 ${
                state.success ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-destructive/15 text-destructive"
              }`}
            >
              {state.message}
            </div>
          )}

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-border/50 py-4 text-sm text-muted-foreground bg-muted/20">
        Ainda não possui conta?{" "}
        <Link href="/sign-up" className="ml-1 font-medium text-primary hover:underline transition-colors">
          Cadastre-se
        </Link>
      </CardFooter>
    </Card>
  );
}
