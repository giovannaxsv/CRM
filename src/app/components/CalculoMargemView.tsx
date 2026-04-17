import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Save } from "lucide-react";
import { produtosReais } from "../../imports/produtosReais";

interface CalculoMargemViewProps {
  clientId: number | null;
  onBackToCotacao: () => void;
  onGoToListaCotacoes: () => void;
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

interface MaterialMistura {
  id: number;
  nome: string;
  percentual: number;
  custoUnitario: number;
}

const cotacoesMock: CotacaoResumo[] = [
  {
    id: 1,
    cliente: "KOMATSU DO BRASIL LTDA",
    oportunidade: "Renovação anual 2026",
    produto: produtosReais[18],
    responsavel: "Everton",
    contatoPrincipal: "Tatiane",
    quantidade: 12,
    valorBase: 2500,
    prazo: "2026-06-15",
    observacoes: "Cliente prioriza estabilidade e entrega mensal.",
  },
  {
    id: 2,
    cliente: "Looking for Electric Panels",
    oportunidade: "Projeto eficiência elétrica",
    produto: produtosReais[19],
    responsavel: "Gorete",
    contatoPrincipal: "Fernanda",
    quantidade: 8,
    valorBase: 1800,
    prazo: "2026-05-30",
    observacoes: "Negociação sensível a preço final e prazo.",
  },
  {
    id: 3,
    cliente: "Solar Panels",
    oportunidade: "Implantação em fases",
    produto: produtosReais[20],
    responsavel: "Keila",
    contatoPrincipal: "Fabiana",
    quantidade: 6,
    valorBase: 3200,
    prazo: "2026-07-10",
    observacoes: "Cliente deseja piloto com ampliação futura.",
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
  onGoToListaCotacoes,
}: CalculoMargemViewProps) {
  const selected = useMemo(() => {
    return cotacoesMock.find((item) => item.id === clientId);
  }, [clientId]);

  const [custoProduto, setCustoProduto] = useState(900);
  const [custoLogistico, setCustoLogistico] = useState(120);
  const [descontoAplicado, setDescontoAplicado] = useState(5);
  const [impostosEstimados, setImpostosEstimados] = useState(12);
  const [precoFinalSugerido, setPrecoFinalSugerido] = useState(2500);
  const [usarPlanoMisturas, setUsarPlanoMisturas] = useState(false);
  const [volumeMistura, setVolumeMistura] = useState(12);
  const [precoPorTonelada, setPrecoPorTonelada] = useState(2500);
  const [fretePorTonelada, setFretePorTonelada] = useState(120);
  const [icms, setIcms] = useState(12);
  const [pis, setPis] = useState(1.65);
  const [cofins, setCofins] = useState(7.6);
  const [materiaisMistura, setMateriaisMistura] = useState<
    MaterialMistura[]
  >([
    {
      id: 1,
      nome: produtosReais[21],
      percentual: 50,
      custoUnitario: 850,
    },
    {
      id: 2,
      nome: produtosReais[22],
      percentual: 30,
      custoUnitario: 980,
    },
    {
      id: 3,
      nome: produtosReais[23],
      percentual: 20,
      custoUnitario: 1200,
    },
  ]);
  const [feedback, setFeedback] = useState("");

  if (!selected) {
    return (
      <div className="h-full bg-white p-6 flex flex-col">
        <button
          onClick={onBackToCotacao}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para cotação
        </button>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Cotação não encontrada.
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

  const precoMinimoReferencia = 2600;
  const diferencaPrecoMinimo = precoFinalSugerido - precoMinimoReferencia;
  const dentroDaPoliticaPreco = precoFinalSugerido >= precoMinimoReferencia;

  const dentroDaRegra = dentroDaPoliticaPreco && margemPercentual >= 20;

  const percentualTotalMistura = materiaisMistura.reduce(
    (accumulator, material) => accumulator + material.percentual,
    0,
  );

  const custoMisturaPorTonelada = materiaisMistura.reduce(
    (accumulator, material) =>
      accumulator +
      (material.percentual / 100) * material.custoUnitario,
    0,
  );

  const aliquotaTotalImpostosMistura = icms + pis + cofins;
  const receitaBrutaMistura = precoPorTonelada * volumeMistura;
  const impostosSobreReceitaMistura =
    (receitaBrutaMistura * aliquotaTotalImpostosMistura) / 100;
  const receitaLiquidaMistura =
    receitaBrutaMistura - impostosSobreReceitaMistura;
  const custoTotalMistura =
    (custoMisturaPorTonelada + fretePorTonelada) * volumeMistura;
  const lucroBrutoMistura = receitaLiquidaMistura - custoTotalMistura;
  const margemMisturaPercentual =
    receitaLiquidaMistura > 0
      ? (lucroBrutoMistura / receitaLiquidaMistura) * 100
      : 0;

  const statusText = !dentroDaPoliticaPreco
    ? "Abaixo do preço mínimo"
    : dentroDaRegra
      ? "Dentro da regra"
      : "Fora da regra";
  const statusClass = !dentroDaPoliticaPreco
    ? "bg-amber-100 text-amber-700 border-amber-200"
    : dentroDaRegra
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : "bg-amber-100 text-amber-700 border-amber-200";
  const mensagemAnalise = !dentroDaPoliticaPreco
    ? "Cotação deverá seguir para aprovação."
    : dentroDaRegra
      ? "Cotação pode seguir para aprovação automática"
      : "Cotação deve ser enviada para aprovação do gestor";

  const statusPrecoText = dentroDaPoliticaPreco
    ? "Dentro da política"
    : "Abaixo do preço mínimo";
  const statusPrecoClass = dentroDaPoliticaPreco
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : "bg-amber-100 text-amber-700 border-amber-200";
  const mensagemPreco = dentroDaPoliticaPreco
    ? "Preço final dentro do limite mínimo definido para a cotação."
    : "Cotação deverá seguir para aprovação.";

  const handleUpdateMaterialMistura = (
    materialId: number,
    field: "percentual" | "custoUnitario",
    value: number,
  ) => {
    setMateriaisMistura((previousState) =>
      previousState.map((material) => {
        if (material.id !== materialId) {
          return material;
        }

        return {
          ...material,
          [field]: value,
        };
      }),
    );
  };

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
              <span>Cotação</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Cálculo de preço e margem</span>
            </div>
            <h1 className="text-2xl text-slate-900">
              Cálculo de preço e margem
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Cliente: {selected.cliente} | Oportunidade: {selected.oportunidade} | Produto: {selected.produto} | Responsável: {selected.responsavel}
            </p>
          </div>
          <button
            onClick={onBackToCotacao}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para cotação
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Dados da cotação</h2>
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
            <div>
              <p className="text-slate-500">Preço mínimo de referência</p>
              <p className="text-slate-900 mt-1">{toCurrency(precoMinimoReferencia)}</p>
            </div>
            <div>
              <p className="text-slate-500">Diferença para o mínimo</p>
              <p className={`mt-1 ${diferencaPrecoMinimo >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
                {toCurrency(diferencaPrecoMinimo)}
              </p>
            </div>
            <div className="md:col-span-2 xl:col-span-5">
              <p className="text-slate-500">Observações</p>
              <p className="text-slate-900 mt-1">{selected.observacoes}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base text-slate-900">
                Cálculo do plano de misturas
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Etapa opcional para simular receita, custo, lucro e margem da mistura.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={usarPlanoMisturas}
                onChange={(event) =>
                  setUsarPlanoMisturas(event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
              />
              Realizar plano de misturas
            </label>
          </div>

          {!usarPlanoMisturas ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Esta etapa é opcional. Ative o plano de misturas para visualizar e calcular os resultados.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Volume (toneladas)</label>
                  <input
                    type="number"
                    value={volumeMistura}
                    onChange={(event) =>
                      setVolumeMistura(Number(event.target.value || 0))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Preço por tonelada</label>
                  <input
                    type="number"
                    value={precoPorTonelada}
                    onChange={(event) =>
                      setPrecoPorTonelada(Number(event.target.value || 0))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Frete por tonelada</label>
                  <input
                    type="number"
                    value={fretePorTonelada}
                    onChange={(event) =>
                      setFretePorTonelada(Number(event.target.value || 0))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Alíquota total de impostos</label>
                  <input
                    type="text"
                    value={`${aliquotaTotalImpostosMistura.toFixed(2)}%`}
                    readOnly
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">ICMS (%)</label>
                  <input
                    type="number"
                    value={icms}
                    onChange={(event) =>
                      setIcms(Number(event.target.value || 0))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">PIS (%)</label>
                  <input
                    type="number"
                    value={pis}
                    onChange={(event) =>
                      setPis(Number(event.target.value || 0))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-2">COFINS (%)</label>
                  <input
                    type="number"
                    value={cofins}
                    onChange={(event) =>
                      setCofins(Number(event.target.value || 0))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm text-slate-900 mb-3">Composição da mistura</h3>
                <div className="space-y-3">
                  {materiaisMistura.map((material) => (
                    <div
                      key={material.id}
                      className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px] gap-3"
                    >
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Material</label>
                        <input
                          type="text"
                          value={material.nome}
                          readOnly
                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Percentual (%)</label>
                        <input
                          type="number"
                          value={material.percentual}
                          onChange={(event) =>
                            handleUpdateMaterialMistura(
                              material.id,
                              "percentual",
                              Number(event.target.value || 0),
                            )
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-2">Custo unitário</label>
                        <input
                          type="number"
                          value={material.custoUnitario}
                          onChange={(event) =>
                            handleUpdateMaterialMistura(
                              material.id,
                              "custoUnitario",
                              Number(event.target.value || 0),
                            )
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p
                  className={`text-xs mt-3 ${
                    percentualTotalMistura === 100
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}
                >
                  Percentual total da mistura: {percentualTotalMistura.toFixed(2)}%
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                  <p className="text-slate-500">Receita bruta</p>
                  <p className="text-slate-900 mt-1">{toCurrency(receitaBrutaMistura)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                  <p className="text-slate-500">Impostos sobre receita</p>
                  <p className="text-slate-900 mt-1">{toCurrency(impostosSobreReceitaMistura)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                  <p className="text-slate-500">Receita líquida</p>
                  <p className="text-slate-900 mt-1">{toCurrency(receitaLiquidaMistura)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                  <p className="text-slate-500">Custo da mistura (por tonelada)</p>
                  <p className="text-slate-900 mt-1">{toCurrency(custoMisturaPorTonelada)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                  <p className="text-slate-500">Custo total</p>
                  <p className="text-slate-900 mt-1">{toCurrency(custoTotalMistura)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                  <p className="text-slate-500">Lucro bruto</p>
                  <p className="text-slate-900 mt-1">{toCurrency(lucroBrutoMistura)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                  <p className="text-slate-500">Margem</p>
                  <p className="text-slate-900 mt-1">{margemMisturaPercentual.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Cálculo comercial</h2>
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
              <label className="block text-sm text-slate-700 mb-2">Custo logístico</label>
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
              <label className="block text-sm text-slate-700 mb-2">Preço final sugerido</label>
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
          <h2 className="text-base text-slate-900 mb-4">Resultado da análise</h2>
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Validação de preço mínimo</p>
                <p className="text-slate-900 mt-1">Preço final calculado: {toCurrency(precoFinalSugerido)}</p>
                <p className="text-slate-900 mt-1">Preço mínimo de referência: {toCurrency(precoMinimoReferencia)}</p>
                <p className={`mt-1 text-sm ${diferencaPrecoMinimo >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
                  Diferença: {toCurrency(diferencaPrecoMinimo)}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${statusPrecoClass}`}
              >
                {statusPrecoText}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{mensagemPreco}</p>
          </div>
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
            onClick={onGoToListaCotacoes}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Salvar cálculo
          </button>
          <button
            onClick={onGoToListaCotacoes}
            className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
          >
            Salvar e finalizar cotação
          </button>
        </div>
      </div>
    </div>
  );
}