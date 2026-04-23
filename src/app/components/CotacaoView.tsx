import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  ChevronRight,
  Save,
} from "lucide-react";

interface CotacaoViewProps {
  clientId: number | null;
  onBackToSelecionarItens: () => void;
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

interface ProdutoSelecionadoCotacao {
  id: number;
  clientId: number;
  nome: string;
}

const clientesMock: ClienteCotacao[] = [
  {
    id: 1,
    nome: "KOMATSU DO BRASIL LTDA",
    contatoPrincipal: "Tatiane",
    vendedorResponsavel: "Everton",
    origemOportunidade: "Inbound - Site",
    observacoesIniciais:
      "Cliente pediu proposta com recorrência mensal e suporte técnico.",
    necessidadeIdentificada:
      "Automatizar abastecimento com previsibilidade de custo e entrega.",
  },
  {
    id: 2,
    nome: "Looking for Eletric Panels",
    contatoPrincipal: "Fernanda",
    vendedorResponsavel: "Gorete",
    origemOportunidade: "Indicação",
    observacoesIniciais:
      "Solicitou comparativo entre pacotes com foco em redução de custo.",
    necessidadeIdentificada:
      "Estabilidade operacional e menor custo de manutenção anual.",
  },
  {
    id: 3,
    nome: "Solar Panels",
    contatoPrincipal: "Fabiana",
    vendedorResponsavel: "Keila",
    origemOportunidade: "Evento",
    observacoesIniciais:
      "Interesse em proposta modular para implantação em fases.",
    necessidadeIdentificada:
      "Começar com piloto e escalar para todas as unidades.",
  },
];

const interacoesIniciais = [
  "Contato realizado",
  "Necessidade levantada",
  "Cliente interessado em proposta",
];

const produtosSelecionadosMock: ProdutoSelecionadoCotacao[] = [
  {
    id: 1,
    clientId: 1,
    nome: "Níquel Placas",
  },
  {
    id: 2,
    clientId: 1,
    nome: "Níquel Catodos",
  },
  {
    id: 3,
    clientId: 2,
    nome: "Coque Metalúrgico Leve",
  },
  {
    id: 4,
    clientId: 2,
    nome: "Grafite",
  },
  {
    id: 5,
    clientId: 3,
    nome: "Sucata de Alumínio",
  },
  {
    id: 6,
    clientId: 3,
    nome: "Silício Metálico (SiMe)",
  },
];

export function CotacaoView({
  clientId,
  onBackToSelecionarItens,
  onBackToClients,
  onOpenCalculoMargem,
}: CotacaoViewProps) {
  const [modalidadeFrete, setModalidadeFrete] = useState<"CIF" | "FOB">("CIF");
  const [valorFrete, setValorFrete] = useState("");
  const [condPagamento, setCondPagamento] = useState("");
  const [filialFaturamento, setFilialFaturamento] = useState("");
  const [dataRetorno, setDataRetorno] = useState("");
  const [feedback, setFeedback] = useState("");

  const selectedCliente = useMemo(() => {
    return clientesMock.find((cliente) => cliente.id === clientId);
  }, [clientId]);

  const produtosSelecionadosParaCotacao = useMemo(() => {
    return produtosSelecionadosMock.filter((item) => item.clientId === clientId);
  }, [clientId]);

  const handleSalvarCotacao = () => {
    setFeedback("Dados comerciais da cotação salvos com sucesso.");
  };

  const handleSalvarEAvancar = () => {
    setFeedback(
      "Cotação salva. Próximo passo: cálculo de preço e margem.",
    );
    onOpenCalculoMargem();
  };

  if (!selectedCliente) {
    return (
      <div className="h-full bg-white p-6 flex flex-col">
        <button
          onClick={onBackToSelecionarItens}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para seleção de itens
        </button>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Cliente não encontrado.
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
              <span>Seleção de itens</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Cotação</span>
            </div>
            <h1 className="text-2xl text-slate-900">Cotação</h1>
            <p className="text-sm text-slate-500 mt-1">
              Cliente: {selectedCliente.nome} | Contato principal: {selectedCliente.contatoPrincipal} | Responsável: {selectedCliente.vendedorResponsavel} | Etapa atual: Cotação
            </p>
          </div>
          <button
            onClick={onBackToSelecionarItens}
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
              <p className="text-slate-500">Vendedor responsável</p>
              <p className="text-slate-900 mt-1">{selectedCliente.vendedorResponsavel}</p>
            </div>
            <div>
              <p className="text-slate-500">Origem da oportunidade</p>
              <p className="text-slate-900 mt-1">{selectedCliente.origemOportunidade}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-500">Observações iniciais</p>
              <p className="text-slate-900 mt-1">{selectedCliente.observacoesIniciais}</p>
            </div>
            <div className="md:col-span-2 xl:col-span-3">
              <p className="text-slate-500">Necessidade identificada</p>
              <p className="text-slate-900 mt-1">{selectedCliente.necessidadeIdentificada}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-base text-slate-900">Dados da cotação</h2>

          <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4 items-start">
            <aside className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-sm text-slate-900">Produtos selecionados</h3>
                <span className="text-xs text-slate-500">{produtosSelecionadosParaCotacao.length}</span>
              </div>

              {produtosSelecionadosParaCotacao.length === 0 ? (
                <p className="text-sm text-slate-600">Nenhum produto selecionado para este cliente.</p>
              ) : (
                <ul className="max-h-72 overflow-auto space-y-1">
                  {produtosSelecionadosParaCotacao.map((item) => (
                    <li key={item.id} className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 leading-tight">
                      {item.nome}
                    </li>
                  ))}
                </ul>
              )}
            </aside>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
              <h3 className="text-sm text-slate-900 mb-3">Informações comerciais</h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end text-sm">
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-700 mb-1">Tipo de frete</label>
                <div className="h-10 rounded-lg border border-slate-300 bg-white px-3 flex items-center gap-4">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo-frete"
                      checked={modalidadeFrete === "CIF"}
                      onChange={() => setModalidadeFrete("CIF")}
                      className="h-3.5 w-3.5"
                    />
                    CIF
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tipo-frete"
                      checked={modalidadeFrete === "FOB"}
                      onChange={() => setModalidadeFrete("FOB")}
                      className="h-3.5 w-3.5"
                    />
                    FOB
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-slate-700 mb-1">Valor do frete</label>
                <input
                  type="text"
                  value={valorFrete}
                  onChange={(event) => setValorFrete(event.target.value)}
                  placeholder="Valor do frete"
                  className="w-full h-10 px-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs text-slate-700 mb-1">Cond. pagamento</label>
                <input
                  type="text"
                  value={condPagamento}
                  onChange={(event) => setCondPagamento(event.target.value)}
                  placeholder="Digite a condição"
                  className="w-full h-10 px-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs text-slate-700 mb-1">Filial de faturamento</label>
                <select
                  value={filialFaturamento}
                  onChange={(event) => setFilialFaturamento(event.target.value)}
                  className="w-full h-10 px-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="">Selecione a filial</option>
                  <option value="matriz">Matriz</option>
                  <option value="sul">Filial Sul</option>
                  <option value="sudeste">Filial Sudeste</option>
                  <option value="nordeste">Filial Nordeste</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs text-slate-700 mb-1">Data de retorno</label>
                <input
                  type="date"
                  value={dataRetorno}
                  onChange={(event) => setDataRetorno(event.target.value)}
                  className="w-full h-10 px-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>
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
              Salvar cotação
            </button>
            <button
              onClick={handleSalvarEAvancar}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Salvar e avançar para cálculo de preço e margem
            </button>
            <button
              onClick={onBackToSelecionarItens}
              className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              Voltar
            </button>
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
