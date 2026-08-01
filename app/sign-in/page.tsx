import { SignInForm } from "./SignInForm";
import { Suspense } from "react";

export const metadata = {
  title: "Login",
  description: "Faça login para acessar sua conta.",
};

export default function SignInPage() {
  return (
    <div className="cursor-default flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground">
          Acesse sua conta
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="text-center text-muted-foreground py-10">
              Carregando formulário...
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
