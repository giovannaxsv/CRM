import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  ChevronRight,
  Save,
} from "lucide-react";

interface CotacaoViewProps {
  clientId: number | null;
  onBackToContato: () => void;
  onBackToClients: () => void;
  onOpenCalculoMargem: () => void;
}

interface ClienteCotacao {
  id: number;
  nome: string;
  contatoPrincipal: string;
  vendedorResponsavel: string;
  origemOportunidade: string;
  observacoesIniciais: string;
  necessidadeIdentificada: string;
}

const clientesMock: ClienteCotacao[] = [
  {
    id: 1,
    nome: "Organic Grade A Coffee Beans",
    contatoPrincipal: "Marina Costa",
    vendedorResponsavel: "Julianaa",
    origemOportunidade: "Inbound - Site",
    observacoesIniciais:
      "Cliente pediu proposta com recorrencia mensal e suporte tecnico.",
    necessidadeIdentificada:
      "Automatizar abastecimento com previsibilidade de custo e entrega.",
  },
  {
    id: 2,
    nome: "Looking for Eletric Panels",
    contatoPrincipal: "Ricardo Lima",
    vendedorResponsavel: "Gorete",
    origemOportunidade: "Indicacao",
    observacoesIniciais:
      "Solicitou comparativo entre pacotes com foco em reducao de custo.",
    necessidadeIdentificada:
      "Estabilidade operacional e menor custo de manutencao anual.",
  },
  {
    id: 3,
    nome: "Solar Panels",
    contatoPrincipal: "Camila Rocha",
    vendedorResponsavel: "Keila",
    origemOportunidade: "Evento",
    observacoesIniciais:
      "Interesse em proposta modular para implantacao em fases.",
    necessidadeIdentificada:
      "Comecar com piloto e escalar para todas as unidades.",
  },
];

const interacoesIniciais = [
  "Contato realizado",
  "Necessidade levantada",
  "Cliente interessado em proposta",
];

export function CotacaoView({
  clientId,
  onBackToContato,
  onBackToClients,
  onOpenCalculoMargem,
}: CotacaoViewProps) {
  const [nomeOportunidade, setNomeOportunidade] = useState("");
  const [produtoServico, setProdutoServico] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("un");
  const [valorEstimado, setValorEstimado] = useState("");
  const [prazoDesejado, setPrazoDesejado] = useState("");
  const [observacoesComerciais, setObservacoesComerciais] =
    useState("");
  const [necessidadeCliente, setNecessidadeCliente] =
    useState("");
  const [origemOportunidade, setOrigemOportunidade] =
    useState("");
  const [responsavel, setResponsavel] = useState("");
  const [feedback, setFeedback] = useState("");

  const selectedCliente = useMemo(() => {
    return clientesMock.find((cliente) => cliente.id === clientId);
  }, [clientId]);

  const handleSalvarCotacao = () => {
    setFeedback("Cotacao salva com sucesso.");
  };

  const handleSalvarEAvancar = () => {
    setFeedback(
      "Cotacao salva. Proximo passo: calculo de preco e margem.",
    );
    onOpenCalculoMargem();
  };

  if (!selectedCliente) {
    return (
      <div className="h-full bg-white p-6 flex flex-col">
        <button
          onClick={onBackToContato}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para contato
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
              <span>Realizar contato</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Cotacao</span>
            </div>
            <h1 className="text-2xl text-slate-900">Cotacao</h1>
            <p className="text-sm text-slate-500 mt-1">
              Cliente: {selectedCliente.nome} | Contato principal: {selectedCliente.contatoPrincipal} | Responsavel: {selectedCliente.vendedorResponsavel} | Etapa atual: Cotacao
            </p>
          </div>
          <button
            onClick={onBackToContato}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">
            Resumo do cliente e da oportunidade
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Nome do cliente</p>
              <p className="text-slate-900 mt-1">{selectedCliente.nome}</p>
            </div>
            <div>
              <p className="text-slate-500">Contato principal</p>
              <p className="text-slate-900 mt-1">{selectedCliente.contatoPrincipal}</p>
            </div>
            <div>
              <p className="text-slate-500">Vendedor responsavel</p>
              <p className="text-slate-900 mt-1">{selectedCliente.vendedorResponsavel}</p>
            </div>
            <div>
              <p className="text-slate-500">Origem da oportunidade</p>
              <p className="text-slate-900 mt-1">{selectedCliente.origemOportunidade}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-500">Observacoes iniciais</p>
              <p className="text-slate-900 mt-1">{selectedCliente.observacoesIniciais}</p>
            </div>
            <div className="md:col-span-2 xl:col-span-3">
              <p className="text-slate-500">Necessidade identificada</p>
              <p className="text-slate-900 mt-1">{selectedCliente.necessidadeIdentificada}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Formulario da cotacao</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">Nome da oportunidade</label>
              <input
                type="text"
                value={nomeOportunidade}
                onChange={(event) => setNomeOportunidade(event.target.value)}
                placeholder="Ex: Renovacao anual"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Produto / servico</label>
              <input
                type="text"
                value={produtoServico}
                onChange={(event) => setProdutoServico(event.target.value)}
                placeholder="Nome do produto ou servico"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Quantidade</label>
              <input
                type="number"
                value={quantidade}
                onChange={(event) => setQuantidade(event.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Unidade</label>
              <select
                value={unidade}
                onChange={(event) => setUnidade(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="un">Unidade</option>
                <option value="hora">Hora</option>
                <option value="mes">Mes</option>
                <option value="pacote">Pacote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Valor estimado</label>
              <input
                type="text"
                value={valorEstimado}
                onChange={(event) => setValorEstimado(event.target.value)}
                placeholder="R$ 0,00"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Prazo desejado</label>
              <input
                type="date"
                value={prazoDesejado}
                onChange={(event) => setPrazoDesejado(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Origem da oportunidade</label>
              <input
                type="text"
                value={origemOportunidade}
                onChange={(event) => setOrigemOportunidade(event.target.value)}
                placeholder="Ex: Indicacao, Evento, Site"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
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
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">Observacoes comerciais</label>
              <textarea
                rows={3}
                value={observacoesComerciais}
                onChange={(event) => setObservacoesComerciais(event.target.value)}
                placeholder="Contexto comercial desta cotacao"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">Necessidade do cliente</label>
              <textarea
                rows={4}
                value={necessidadeCliente}
                onChange={(event) => setNecessidadeCliente(event.target.value)}
                placeholder="Descreva a necessidade em detalhes"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          {feedback && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-2">
              {feedback}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSalvarCotacao}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar cotacao
            </button>
            <button
              onClick={handleSalvarEAvancar}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Salvar e avancar para calculo de preco e margem
            </button>
            <button
              onClick={onBackToContato}
              className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              Voltar
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Interacoes iniciais</h2>
          <div className="space-y-4">
            {interacoesIniciais.map((item, index) => (
              <div key={item} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 mt-1" />
                  {index < interacoesIniciais.length - 1 && (
                    <span className="w-px flex-1 bg-slate-200 mt-2" />
                  )}
                </div>
                <p className="text-sm text-slate-900">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={onBackToClients}
            className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Voltar para clientes
          </button>
        </div>
      </div>
    </div>
  );
}
