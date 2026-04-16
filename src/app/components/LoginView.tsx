import { ArrowRight, Building2, Briefcase, CalendarPlus } from "lucide-react";

interface LoginViewProps {
  onEntrarVendedores: () => void;
  onEntrarDiretoria: () => void;
  onEntrarAgendarVisita: () => void;
}

export function LoginView({
  onEntrarVendedores,
  onEntrarDiretoria,
  onEntrarAgendarVisita,
}: LoginViewProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 px-6 py-10 md:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-24 h-80 w-80 rounded-full bg-cyan-200/70 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-sky-200/70 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.95),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(56,189,248,0.18),transparent_35%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl rounded-3xl border border-white/80 bg-white/95 p-8 shadow-2xl shadow-slate-300/70 backdrop-blur md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Portal Comercial
            </span>
            <p className="mt-4 text-base font-medium text-slate-700">Bem-vindo(a).</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Novo CRM
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-600 md:text-base">
              Selecione um modulo para acessar rapidamente as principais ações do CRM.
            </p>
          </div>

          <img
            src="https://i.imgur.com/DdNjr9C.png"
            alt="Logo Cometa"
            className="h-14 w-auto self-start object-contain opacity-90 md:h-20"
          />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <button
            onClick={onEntrarVendedores}
            className="group cursor-pointer rounded-2xl border-2 border-blue-300 bg-gradient-to-b from-blue-50 to-white p-6 text-left shadow-md transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-100/80"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Briefcase className="h-6 w-6" />
              </div>
              
            </div>
            <div className="mb-5 flex items-center justify-end">
              <ArrowRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Vendas</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Gerenciar clientes, atividades e vendas.
            </p>
            <div className="mt-5 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-blue-700">
              Acessar modulo
            </div>
          </button>

          <button
            onClick={onEntrarDiretoria}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 text-left shadow-sm transition-all duration-300 hover:scale-105 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/70"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Building2 className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Diretoria</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Acompanhar indicadores e decisoes estrategicas.
            </p>
            <div className="mt-5 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-emerald-700">
              Acessar modulo
            </div>
          </button>
          <button
            onClick={onEntrarAgendarVisita}
            className="group cursor-pointer rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 text-left shadow-sm transition-all duration-300 hover:scale-105 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100/60"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <CalendarPlus className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-sky-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Agendamento de visitas</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Acesse o módulo de agendamento para organizar e acompanhar as visitas comerciais.
            </p>
            <div className="mt-5 inline-flex items-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors group-hover:bg-sky-700">
              Acessar modulo
            </div>
          </button>
        </div>
      </div>
    </div> 
  );
}
