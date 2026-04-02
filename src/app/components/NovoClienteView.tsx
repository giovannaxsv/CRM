import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Save,
  UserPlus,
} from "lucide-react";

interface NovoClienteViewProps {
  onBackToClients: () => void;
}

export function NovoClienteView({
  onBackToClients,
}: NovoClienteViewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Cliente salvo com sucesso.");
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium">Clientes</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">Novo Cliente</span>
          </div>
          <button
            onClick={onBackToClients}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        <div>
          <h1 className="text-2xl text-gray-900 mb-1">Cadastrar Novo Cliente</h1>
          <p className="text-sm text-gray-500">
            Esta página é acessada somente pelo botão Novo Cliente.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl space-y-6">
          <section className="border border-gray-200 rounded-xl p-5">
            <h2 className="text-base text-gray-900 mb-4">Dados basicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  placeholder="Digite o nome do cliente"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Tipo de cliente</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                  <option value="empresa">Empresa</option>
                  <option value="pessoa">Pessoa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Status inicial</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                  <option value="ativo">Ativo</option>
                  <option value="lead">Lead</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Segmento</label>
                <input
                  type="text"
                  placeholder="Ex: Industria, SaaS, Varejo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Origem do cliente</label>
                <input
                  type="text"
                  placeholder="Ex: Indicacao, Site, Evento"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          <section className="border border-gray-200 rounded-xl p-5">
            <h2 className="text-base text-gray-900 mb-4">Contato</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Telefone</label>
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          <section className="border border-gray-200 rounded-xl p-5">
            <h2 className="text-base text-gray-900 mb-4">Informacoes comerciais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Vendedor Responsavel</label>
                <input
                  type="text"
                  placeholder="Nome do vendedor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Canal prioritario</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                  <option value="email">Email</option>
                  <option value="telefone">Telefone</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
            </div>
          </section>

          <section className="border border-gray-200 rounded-xl p-5">
            <h2 className="text-base text-gray-900 mb-4">Observacoes</h2>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Observacoes gerais</label>
              <textarea
                rows={5}
                placeholder="Adicione observacoes relevantes sobre o cliente"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </section>

          {saveMessage && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              {saveMessage}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                isSaving
                  ? "bg-slate-400 text-white cursor-not-allowed"
                  : "bg-slate-800 text-white hover:bg-slate-700 shadow-sm hover:shadow"
              }`}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Salvando..." : "Salvar Cliente"}
            </button>
            <button
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              Salvar e adicionar contato
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
