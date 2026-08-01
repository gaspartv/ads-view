import { SignUpForm } from "./SignUpForm";

export const metadata = {
  title: "Cadastro | Meu App",
  description: "Crie sua conta para começar a usar nossos serviços.",
};

export default function SignUpPage() {
  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Rápido, fácil e seguro.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
