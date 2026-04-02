import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Save } from "lucide-react";

interface RealizarContatoViewProps {
  clientId: number | null;
  onBackToClients: () => void;
  onSaveAndCreateOpportunity: () => void;
}

interface ClienteContato {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  vendedor: string;
  status: string;
  ultimoContato: string;
  observacoes: string;
}

const clientesMock: ClienteContato[] = [
  {
    id: 1,
    nome: "Organic Grade A Coffee Beans",
    email: "contact@coffeebeans.com",
    telefone: "(11) 98765-1024",
    vendedor: "Julianaa",
    status: "Ativo",
    ultimoContato: "2 dias atras",
    observacoes: "Cliente com interesse recorrente e boa aderencia ao produto.",
  },
  {
    id: 2,
    nome: "Looking for Eletric Panels",
    email: "inquiry@panels.com",
    telefone: "(21) 99876-4432",
    vendedor: "Gorete",
    status: "Venda passiva",
    ultimoContato: "5 dias atras",
    observacoes: "Aguardando validacao interna para avancar no processo.",
  },
  {
    id: 3,
    nome: "Solar Panels",
    email: "info@solar.com",
    telefone: "(31) 97654-8890",
    vendedor: "Keila",
    status: "Inativo",
    ultimoContato: "30 dias atras",
    observacoes: "Contato pausado. Necessita reativacao com nova abordagem.",
  },
];

export function RealizarContatoView({
  clientId,
  onBackToClients,
  onSaveAndCreateOpportunity,
}: RealizarContatoViewProps) {
  const [tipoContato, setTipoContato] = useState("ligacao");
  const [dataContato, setDataContato] = useState("");
  const [horaContato, setHoraContato] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [assunto, setAssunto] = useState("");
  const [resultadoContato, setResultadoContato] = useState("");
  const [proximoPasso, setProximoPasso] = useState("");
  const [demonstrouPotencial, setDemonstrouPotencial] =
    useState(false);
  const [saveFeedback, setSaveFeedback] = useState("");

  const selectedCliente = useMemo(() => {
    return clientesMock.find((cliente) => cliente.id === clientId);
  }, [clientId]);

  const handleSave = () => {
    setSaveFeedback("Contato salvo com sucesso.");
  };

  if (!selectedCliente) {
    return (
      <div className="h-full bg-white p-6 flex flex-col">
        <button
          onClick={onBackToClients}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para clientes
        </button>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Cliente nao encontrado.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 overflow-auto">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <ChevronRight className="w-4 h-4" />
              <span>Clientes</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Realizar contato</span>
            </div>
            <h1 className="text-2xl text-slate-900">
              {selectedCliente.nome}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Vendedor: {selectedCliente.vendedor} | Status: {selectedCliente.status} | Ultimo contato: {selectedCliente.ultimoContato}
            </p>
          </div>
          <button
            onClick={onBackToClients}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
        <aside className="rounded-xl border border-slate-200 bg-white p-5 h-fit">
          <h2 className="text-sm text-slate-500 mb-4">Informacoes do cliente</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs text-slate-500">Nome</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.nome}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Email</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Telefone</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.telefone}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Vendedor</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.vendedor}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Status</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.status}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Ultimo contato</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.ultimoContato}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Observacoes resumidas</dt>
              <dd className="text-sm text-slate-700 mt-1">{selectedCliente.observacoes}</dd>
            </div>
          </dl>
        </aside>

        <main className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Registro do contato</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">Tipo de contato</label>
              <select
                value={tipoContato}
                onChange={(event) => setTipoContato(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="ligacao">Ligacao</option>
                <option value="email">Email</option>
                <option value="reuniao">Reuniao</option>
                <option value="visita">Visita</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Responsavel</label>
              <input
                type="text"
                value={responsavel}
                onChange={(event) => setResponsavel(event.target.value)}
                placeholder="Nome do responsavel"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Data do contato</label>
              <input
                type="date"
                value={dataContato}
                onChange={(event) => setDataContato(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Hora do contato</label>
              <input
                type="time"
                value={horaContato}
                onChange={(event) => setHoraContato(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">Assunto</label>
              <input
                type="text"
                value={assunto}
                onChange={(event) => setAssunto(event.target.value)}
                placeholder="Resumo do assunto tratado"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">Resultado do contato</label>
              <textarea
                rows={4}
                value={resultadoContato}
                onChange={(event) => setResultadoContato(event.target.value)}
                placeholder="Descreva o resultado da interacao"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">Proximo passo</label>
              <textarea
                rows={3}
                value={proximoPasso}
                onChange={(event) => setProximoPasso(event.target.value)}
                placeholder="Informe o proximo passo planejado"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          <label className="mt-4 inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={demonstrouPotencial}
              onChange={(event) =>
                setDemonstrouPotencial(event.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
            />
            Cliente demonstrou potencial?
          </label>

          {saveFeedback && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-2">
              {saveFeedback}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar contato
            </button>
            <button
              onClick={onSaveAndCreateOpportunity}
              className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              Salvar e criar oportunidade
            </button>
            <button
              onClick={onBackToClients}
              className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
