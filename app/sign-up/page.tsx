import { SignUpForm } from "./SignUpForm";

export const metadata = {
  title: "Cadastro | Meu App",
  description: "Crie sua conta para começar a usar nossos serviços.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Rápido, fácil e seguro.
        </p>
      </div>

      <SignUpForm />
    </div>
  );
}
