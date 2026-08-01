"use client";

import { useActionState } from "react";
import { signUpAction } from "../actions/auth";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full transition-all duration-200"
    >
      {pending ? "Criando conta..." : "Criar conta"}
    </Button>
  );
}

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, null);

  return (
    <Card className="shadow-xl border-border/50 bg-card/80 backdrop-blur-xl">
      <CardContent className="pt-8 px-8">
        <form className="space-y-5" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground/80">
              Nome
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="bg-background/50 focus:bg-background transition-colors focus-visible:border-primary focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground/80">
              Sobrenome <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              className="bg-background/50 focus:bg-background transition-colors focus-visible:border-primary focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80">
              E-mail
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="bg-background/50 focus:bg-background transition-colors focus-visible:border-primary focus-visible:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/80">
              Senha
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="bg-background/50 focus:bg-background transition-colors focus-visible:border-primary focus-visible:ring-primary/50"
            />
          </div>

          {state && (
            <div
              className={`p-3 rounded-md text-sm font-medium animate-in fade-in slide-in-from-top-1 ${
                state.success ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
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
        Já possui uma conta?{" "}
        <Link href="/sign-in" className="ml-1 font-medium text-primary hover:underline transition-colors">
          Faça login
        </Link>
      </CardFooter>
    </Card>
  );
}
