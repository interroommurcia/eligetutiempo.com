import LoginForm from "./LoginForm";

export const metadata = { title: "Acceso Backoffice — EligeTuTiempo" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">⌚</span>
          <h1 className="text-white font-bold text-2xl mt-3">
            elige<span className="text-amber-400">tu</span>tiempo
          </h1>
          <p className="text-stone-400 text-sm mt-1">Panel de administración</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
