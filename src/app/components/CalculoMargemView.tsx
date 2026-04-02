import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Save } from "lucide-react";

interface CalculoMargemViewProps {
  clientId: number | null;
  onBackToCotacao: () => void;
}

interface CotacaoResumo {
  id: number;
  cliente: string;
  oportunidade: string;
  produto: string;
  responsavel: string;
  contatoPrincipal: string;
  quantidade: number;
  valorBase: number;
  prazo: string;
  observacoes: string;
}

const cotacoesMock: CotacaoResumo[] = [
  {
    id: 1,
    cliente: "Organic Grade A Coffee Beans",
    oportunidade: "Renovacao anual 2026",
    produto: "Plano Premium de Abastecimento",
    responsavel: "Julianaa",
    contatoPrincipal: "Marina Costa",
    quantidade: 12,
    valorBase: 2500,
    prazo: "2026-06-15",
    observacoes: "Cliente prioriza estabilidade e entrega mensal.",
  },
  {
    id: 2,
    cliente: "Looking for Eletric Panels",
    oportunidade: "Projeto eficiencia eletrica",
    produto: "Pacote Servico Energy Plus",
    responsavel: "Gorete",
    contatoPrincipal: "Ricardo Lima",
    quantidade: 8,
    valorBase: 1800,
    prazo: "2026-05-30",
    observacoes: "Negociacao sensivel a preco final e prazo.",
  },
  {
    id: 3,
    cliente: "Solar Panels",
    oportunidade: "Implantacao em fases",
    produto: "Consultoria + Kit Modular",
    responsavel: "Keila",
    contatoPrincipal: "Camila Rocha",
    quantidade: 6,
    valorBase: 3200,
    prazo: "2026-07-10",
    observacoes: "Cliente deseja piloto com ampliacao futura.",
  },
];

const toCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export function CalculoMargemView({
  clientId,
  onBackToCotacao,
}: CalculoMargemViewProps) {
  const selected = useMemo(() => {
    return cotacoesMock.find((item) => item.id === clientId);
  }, [clientId]);

  const [custoProduto, setCustoProduto] = useState(900);
  const [custoLogistico, setCustoLogistico] = useState(120);
  const [descontoAplicado, setDescontoAplicado] = useState(5);
  const [impostosEstimados, setImpostosEstimados] = useState(12);
  const [precoFinalSugerido, setPrecoFinalSugerido] = useState(2500);
  const [feedback, setFeedback] = useState("");

  if (!selected) {
    return (
      <div className="h-full bg-white p-6 flex flex-col">
        <button
          onClick={onBackToCotacao}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para cotacao
        </button>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Cotacao nao encontrada.
        </div>
      </div>
    );
  }

  const valorBaseTotal = selected.quantidade * selected.valorBase;
  const impostoValor = (precoFinalSugerido * impostosEstimados) / 100;
  const descontoValor = (precoFinalSugerido * descontoAplicado) / 100;
  const custoTotal = custoProduto + custoLogistico + impostoValor;
  const margemValor = precoFinalSugerido - custoTotal - descontoValor;
  const margemPercentual =
    precoFinalSugerido > 0
      ? (margemValor / precoFinalSugerido) * 100
      : 0;

  const dentroDaRegra = margemPercentual >= 20;

  const statusText = dentroDaRegra
    ? "Dentro da regra"
    : "Fora da regra";
  const statusClass = dentroDaRegra
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : "bg-amber-100 text-amber-700 border-amber-200";
  const mensagemAnalise = dentroDaRegra
    ? "Cotacao pode seguir para aprovacao automatica"
    : "Cotacao deve ser enviada para aprovacao do gestor";

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
              <span>Cotacao</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Calculo de preco e margem</span>
            </div>
            <h1 className="text-2xl text-slate-900">
              Calculo de preco e margem
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Cliente: {selected.cliente} | Oportunidade: {selected.oportunidade} | Produto: {selected.produto} | Responsavel: {selected.responsavel}
            </p>
          </div>
          <button
            onClick={onBackToCotacao}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para cotacao
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Dados da cotacao</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Produto</p>
              <p className="text-slate-900 mt-1">{selected.produto}</p>
            </div>
            <div>
              <p className="text-slate-500">Quantidade</p>
              <p className="text-slate-900 mt-1">{selected.quantidade}</p>
            </div>
            <div>
              <p className="text-slate-500">Valor base</p>
              <p className="text-slate-900 mt-1">{toCurrency(selected.valorBase)}</p>
            </div>
            <div>
              <p className="text-slate-500">Prazo</p>
              <p className="text-slate-900 mt-1">{selected.prazo}</p>
            </div>
            <div>
              <p className="text-slate-500">Valor base total</p>
              <p className="text-slate-900 mt-1">{toCurrency(valorBaseTotal)}</p>
            </div>
            <div className="md:col-span-2 xl:col-span-5">
              <p className="text-slate-500">Observacoes</p>
              <p className="text-slate-900 mt-1">{selected.observacoes}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Calculo comercial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">Custo do produto</label>
              <input
                type="number"
                value={custoProduto}
                onChange={(event) =>
                  setCustoProduto(Number(event.target.value || 0))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Custo logistico</label>
              <input
                type="number"
                value={custoLogistico}
                onChange={(event) =>
                  setCustoLogistico(Number(event.target.value || 0))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Desconto aplicado (%)</label>
              <input
                type="number"
                value={descontoAplicado}
                onChange={(event) =>
                  setDescontoAplicado(Number(event.target.value || 0))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Impostos estimados (%)</label>
              <input
                type="number"
                value={impostosEstimados}
                onChange={(event) =>
                  setImpostosEstimados(Number(event.target.value || 0))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Preco final sugerido</label>
              <input
                type="number"
                value={precoFinalSugerido}
                onChange={(event) =>
                  setPrecoFinalSugerido(Number(event.target.value || 0))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Margem estimada</label>
              <input
                type="text"
                value={toCurrency(margemValor)}
                readOnly
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 mb-2">Percentual de margem</label>
              <input
                type="text"
                value={`${margemPercentual.toFixed(2)}%`}
                readOnly
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-700"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Resultado da analise</h2>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${statusClass}`}
            >
              {statusText}
            </span>
            <p className="text-sm text-slate-600">{mensagemAnalise}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
              <p className="text-slate-500">Custo total</p>
              <p className="text-slate-900 mt-1">{toCurrency(custoTotal)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
              <p className="text-slate-500">Desconto aplicado</p>
              <p className="text-slate-900 mt-1">{toCurrency(descontoValor)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
              <p className="text-slate-500">Impostos estimados</p>
              <p className="text-slate-900 mt-1">{toCurrency(impostoValor)}</p>
            </div>
          </div>
        </section>

        {feedback && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-2">
            {feedback}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setFeedback("Calculo salvo com sucesso.")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Salvar calculo
          </button>
          <button
            onClick={() =>
              setFeedback("Calculo enviado para aprovacao do gestor.")
            }
            className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
          >
            Enviar para aprovacao
          </button>
          <button
            onClick={() =>
              setFeedback("Cotacao aprovada automaticamente.")
            }
            disabled={!dentroDaRegra}
            className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Aprovacao automatica
          </button>
          <button
            onClick={onBackToCotacao}
            className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
          >
            Voltar para cotacao
          </button>
        </div>
      </div>
    </div>
  );
}
