import { useEffect, useMemo, useState } from "react";
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
  responsavel: string;
}

interface ProdutoCotacaoSelecionado {
  id: number;
  clientId: number;
  nome: string;
  consumo: string;
}

interface ProdutoCotacaoState {
  tipoCotacao: "COTACAO" | "PREVIA";
  codigo: string;
  icmsProduto: number;
  embalagem: string;
  entregaPrevista: string;
  quantidade: number;
  preco: number;
  observacao: string;
  aprovado: boolean;
  usarPlanoMisturas: boolean;
  volumeMistura: number;
  precoPorTonelada: number;
  fretePorTonelada: number;
  icms: number;
  pis: number;
  cofins: number;
  materiaisMistura: MaterialMistura[];
}

interface MaterialMistura {
  id: number;
  nome: string;
  percentual: number;
  custoUnitario: number;
}

interface CustosProdutoPorCodigo {
  precoPadrao: number;
  precoMeta: number;
  precoMinimo: number;
  custoReposicao: number;
  custoMedio: number;
  custoMaiorLote: number;
  custoSimulado: number;
}

const cotacoesMock: CotacaoResumo[] = [
  {
    id: 1,
    cliente: "KOMATSU DO BRASIL LTDA",
    oportunidade: "Renovação anual 2026",
    responsavel: "Everton",
  },
  {
    id: 2,
    cliente: "Looking for Electric Panels",
    oportunidade: "Projeto eficiência elétrica",
    responsavel: "Gorete",
  },
  {
    id: 3,
    cliente: "Solar Panels",
    oportunidade: "Implantação em fases",
    responsavel: "Keila",
  },
];

const produtosSelecionadosMock: ProdutoCotacaoSelecionado[] = [
  { id: 101, clientId: 1, nome: produtosReais[16], consumo: "0,300 ton - Esporádico" },
  { id: 102, clientId: 1, nome: produtosReais[17], consumo: "0,200 ton - Esporádico" },
  { id: 201, clientId: 2, nome: produtosReais[3], consumo: "0,450 ton - Mensal" },
  { id: 202, clientId: 2, nome: produtosReais[4], consumo: "0,200 ton - Mensal" },
  { id: 301, clientId: 3, nome: produtosReais[7], consumo: "0,200 ton - Esporádico" },
  { id: 302, clientId: 3, nome: produtosReais[8], consumo: "0,100 ton - Esporádico" },
  { id: 303, clientId: 3, nome: produtosReais[10], consumo: "0,150 ton - Esporádico" },
];

const codigosProdutoMock = [
  "TOT-201",
  "TOT-202",
  "TOT-203",
  "LIG-104",
  "LIG-105",
  "NCK-310",
  "SIL-440",
];

const custosProdutoPorCodigoMock: Record<string, CustosProdutoPorCodigo> = {
  "TOT-201": {
    precoPadrao: 1340,
    precoMeta: 1340,
    precoMinimo: 1190,
    custoReposicao: 720,
    custoMedio: 690,
    custoMaiorLote: 660,
    custoSimulado: 680,
  },
  "TOT-202": {
    precoPadrao: 1470,
    precoMeta: 1470,
    precoMinimo: 1310,
    custoReposicao: 810,
    custoMedio: 775,
    custoMaiorLote: 740,
    custoSimulado: 760,
  },
  "TOT-203": {
    precoPadrao: 1210,
    precoMeta: 1210,
    precoMinimo: 1060,
    custoReposicao: 640,
    custoMedio: 615,
    custoMaiorLote: 590,
    custoSimulado: 605,
  },
  "LIG-104": {
    precoPadrao: 1740,
    precoMeta: 1740,
    precoMinimo: 1540,
    custoReposicao: 980,
    custoMedio: 950,
    custoMaiorLote: 920,
    custoSimulado: 940,
  },
  "LIG-105": {
    precoPadrao: 1830,
    precoMeta: 1830,
    precoMinimo: 1640,
    custoReposicao: 1040,
    custoMedio: 1005,
    custoMaiorLote: 970,
    custoSimulado: 995,
  },
  "NCK-310": {
    precoPadrao: 1040,
    precoMeta: 1040,
    precoMinimo: 910,
    custoReposicao: 560,
    custoMedio: 535,
    custoMaiorLote: 510,
    custoSimulado: 525,
  },
  "SIL-440": {
    precoPadrao: 1600,
    precoMeta: 1600,
    precoMinimo: 1410,
    custoReposicao: 890,
    custoMedio: 860,
    custoMaiorLote: 835,
    custoSimulado: 850,
  },
};

const materiaisMisturaBase: MaterialMistura[] = [
  {
    id: 1,
    nome: produtosReais[11],
    percentual: 50,
    custoUnitario: 850,
  },
  {
    id: 2,
    nome: produtosReais[12],
    percentual: 30,
    custoUnitario: 980,
  },
  {
    id: 3,
    nome: produtosReais[13],
    percentual: 20,
    custoUnitario: 1200,
  },
];

const buildInitialCotacaoPorProduto = (
  produtos: ProdutoCotacaoSelecionado[],
): Record<number, ProdutoCotacaoState> => {
  return produtos.reduce<Record<number, ProdutoCotacaoState>>((accumulator, produto) => {
    accumulator[produto.id] = {
      tipoCotacao: "COTACAO",
      codigo: "",
      icmsProduto: 12,
      embalagem: "",
      entregaPrevista: "",
      quantidade: 1,
      preco: 0,
      observacao: "",
      aprovado: false,
      usarPlanoMisturas: false,
      volumeMistura: 12,
      precoPorTonelada: 2500,
      fretePorTonelada: 120,
      icms: 12,
      pis: 1.65,
      cofins: 7.6,
      materiaisMistura: materiaisMisturaBase.map((material) => ({ ...material })),
    };

    return accumulator;
  }, {});
};

const toCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const calculateMargem = (receitaLiquida: number, custoTotal: number) => {
  if (receitaLiquida <= 0) {
    return 0;
  }

  return ((receitaLiquida - custoTotal) / receitaLiquida) * 100;
};

export function CalculoMargemView({
  clientId,
  onBackToCotacao,
  onGoToListaCotacoes,
}: CalculoMargemViewProps) {
  const selected = useMemo(() => {
    return cotacoesMock.find((item) => item.id === clientId);
  }, [clientId]);

  const produtosSelecionados = useMemo(() => {
    return produtosSelecionadosMock.filter((item) => item.clientId === clientId);
  }, [clientId]);

  const [cotacaoPorProduto, setCotacaoPorProduto] = useState<
    Record<number, ProdutoCotacaoState>
  >(() => buildInitialCotacaoPorProduto(produtosSelecionados));
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setCotacaoPorProduto(buildInitialCotacaoPorProduto(produtosSelecionados));
  }, [produtosSelecionados]);

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

  const handleUpdateProdutoCotacao = (
    produtoId: number,
    nextState: Partial<ProdutoCotacaoState>,
  ) => {
    setCotacaoPorProduto((previousState) => ({
      ...previousState,
      [produtoId]: {
        ...previousState[produtoId],
        ...nextState,
      },
    }));
  };

  const handleUpdateMaterialMisturaPorProduto = (
    produtoId: number,
    materialId: number,
    field: "percentual" | "custoUnitario",
    value: number,
  ) => {
    setCotacaoPorProduto((previousState) => ({
      ...previousState,
      [produtoId]: {
        ...previousState[produtoId],
        materiaisMistura: previousState[produtoId].materiaisMistura.map((material) => {
          if (material.id !== materialId) {
            return material;
          }

          return {
            ...material,
            [field]: value,
          };
        }),
      },
    }));
  };

  const handleSalvarCalculo = () => {
    setFeedback("Cálculo salvo com sucesso.");
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
              Cliente: {selected.cliente} | Oportunidade: {selected.oportunidade} | Responsável: {selected.responsavel} | Produtos selecionados: {produtosSelecionados.length}
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

      <div className="p-4 md:p-5 space-y-4">
        <section className="rounded-xl border border-slate-200 bg-white p-3 md:p-4 space-y-3">
          <h2 className="text-base text-slate-900">Cálculo comercial</h2>

          {produtosSelecionados.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Nenhum produto selecionado para cálculo nesta cotação.
            </div>
          ) : (
            <div className="space-y-2.5">
              {produtosSelecionados.map((produto) => {
                const form = cotacaoPorProduto[produto.id];

                if (!form) {
                  return null;
                }

                const custosFixosPorCodigo =
                  custosProdutoPorCodigoMock[form.codigo] ?? {
                    precoPadrao: 0,
                    precoMeta: 0,
                    precoMinimo: 0,
                    custoReposicao: 0,
                    custoMedio: 0,
                    custoMaiorLote: 0,
                    custoSimulado: 0,
                  };
                const quantidadeCalculada = Math.max(form.quantidade, 0);
                const receitaBruta = quantidadeCalculada * form.preco;
                const receitaLiquidaAposIcms = receitaBruta * (1 - form.icmsProduto / 100);

                const custoReposicao = custosFixosPorCodigo.custoReposicao * quantidadeCalculada;
                const custoMedio = custosFixosPorCodigo.custoMedio * quantidadeCalculada;
                const custoMaiorLote = custosFixosPorCodigo.custoMaiorLote * quantidadeCalculada;
                const custoSimulado = custosFixosPorCodigo.custoSimulado * quantidadeCalculada;

                const margemReposicao = calculateMargem(receitaLiquidaAposIcms, custoReposicao);
                const margemMedia = calculateMargem(receitaLiquidaAposIcms, custoMedio);
                const margemMaiorLote = calculateMargem(receitaLiquidaAposIcms, custoMaiorLote);
                const margemSimulada = calculateMargem(receitaLiquidaAposIcms, custoSimulado);
                const aprovado = form.preco >= custosFixosPorCodigo.precoMinimo;

                const percentualTotalMistura = form.materiaisMistura.reduce(
                  (accumulator, material) => accumulator + material.percentual,
                  0,
                );
                const custoMisturaPorTonelada = form.materiaisMistura.reduce(
                  (accumulator, material) =>
                    accumulator +
                    (material.percentual / 100) * material.custoUnitario,
                  0,
                );
                const aliquotaTotalImpostosMistura = form.icms + form.pis + form.cofins;
                const receitaBrutaMistura = form.precoPorTonelada * form.volumeMistura;
                const impostosSobreReceitaMistura =
                  (receitaBrutaMistura * aliquotaTotalImpostosMistura) / 100;
                const receitaLiquidaMistura =
                  receitaBrutaMistura - impostosSobreReceitaMistura;
                const custoTotalMistura =
                  (custoMisturaPorTonelada + form.fretePorTonelada) * form.volumeMistura;
                const lucroBrutoMistura = receitaLiquidaMistura - custoTotalMistura;
                const margemMisturaPercentual =
                  receitaLiquidaMistura > 0
                    ? (lucroBrutoMistura / receitaLiquidaMistura) * 100
                    : 0;

                return (
                  <div key={produto.id} className="rounded-lg border border-slate-300 bg-white overflow-hidden">
                    <div className="bg-[#21386b] text-white px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm">
                        <span className="font-medium">{produto.nome}</span>
                        <span className="ml-2 text-slate-200">Consumo: {produto.consumo}</span>
                      </p>
                      {form.codigo && (
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                            aprovado
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {aprovado ? "Aprovado" : "Pendente de aprovação"}
                        </span>
                      )}
                    </div>

                    <div className="p-3 grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-3">
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-9 gap-2">
                          <div>
                            <label className="block text-xs text-slate-700 mb-1">Código</label>
                            <select
                              value={form.codigo}
                              onChange={(event) => {
                                const codigoSelecionado = event.target.value;
                                const custosPorCodigo = custosProdutoPorCodigoMock[codigoSelecionado];

                                handleUpdateProdutoCotacao(produto.id, {
                                  codigo: codigoSelecionado,
                                  preco: custosPorCodigo?.precoMeta ?? 0,
                                });
                              }}
                              className="h-9 w-full px-2.5 text-sm border border-slate-300 rounded-md bg-white"
                            >
                              <option value="">Selecione o código</option>
                              {codigosProdutoMock.map((codigo) => (
                                <option key={codigo} value={codigo}>
                                  {codigo}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 mb-1">ICMS</label>
                            <select
                              value={form.icmsProduto}
                              onChange={(event) =>
                                handleUpdateProdutoCotacao(produto.id, {
                                  icmsProduto: Number(event.target.value),
                                })
                              }
                              className="h-9 w-full px-2.5 text-sm border border-slate-300 rounded-md bg-white"
                            >
                              <option value={4}>4%</option>
                              <option value={7}>7%</option>
                              <option value={12}>12%</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 mb-1">Embalagem</label>
                            <select
                              value={form.embalagem}
                              onChange={(event) =>
                                handleUpdateProdutoCotacao(produto.id, {
                                  embalagem: event.target.value,
                                })
                              }
                              className="h-9 w-full px-2.5 text-sm border border-slate-300 rounded-md bg-white"
                            >
                              <option value="">Selecione a embalagem</option>
                              <option value="balde">balde</option>
                              <option value="barras">barras</option>
                              <option value="big bag">big bag</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 mb-1">Entrega prevista</label>
                            <input
                              type="date"
                              value={form.entregaPrevista}
                              onChange={(event) =>
                                handleUpdateProdutoCotacao(produto.id, {
                                  entregaPrevista: event.target.value,
                                })
                              }
                              className="h-9 w-full px-2.5 text-sm border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 mb-1">Quantidade</label>
                            <input
                              type="number"
                              value={form.quantidade}
                              onChange={(event) =>
                                handleUpdateProdutoCotacao(produto.id, {
                                  quantidade: Number(event.target.value || 0),
                                })
                              }
                              className="h-9 w-full px-2.5 text-sm border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 mb-1">Preço</label>
                            <input
                              type="number"
                              value={form.preco}
                              onChange={(event) =>
                                handleUpdateProdutoCotacao(produto.id, {
                                  preco: Number(event.target.value || 0),
                                })
                              }
                              className="h-9 w-full px-2.5 text-sm border border-slate-300 rounded-md"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 mb-1">Preço meta</label>
                            <input
                              type="text"
                              value={toCurrency(custosFixosPorCodigo.precoMeta)}
                              readOnly
                              className="h-9 w-full px-2.5 text-sm border border-slate-200 rounded-md bg-slate-50 text-slate-700"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 mb-1">Preço mínimo</label>
                            <input
                              type="text"
                              value={toCurrency(custosFixosPorCodigo.precoMinimo)}
                              readOnly
                              className="h-9 w-full px-2.5 text-sm border border-slate-200 rounded-md bg-slate-50 text-slate-700"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-700 mb-1">Receita bruta</label>
                            <input
                              type="text"
                              value={toCurrency(receitaBruta)}
                              readOnly
                              className="h-9 w-full px-2.5 text-sm border border-slate-200 rounded-md bg-slate-50 text-slate-700"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr] gap-2">
                          <div className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs text-slate-600 overflow-hidden min-h-[104px]">
                            <p className="truncate">Nenhum arquivo anexado</p>
                            <button type="button" className="mt-2 text-slate-800 underline">
                              Carregar arquivo
                            </button>
                          </div>

                          <textarea
                            rows={4}
                            value={form.observacao}
                            onChange={(event) =>
                              handleUpdateProdutoCotacao(produto.id, {
                                observacao: event.target.value,
                              })
                            }
                            placeholder="Observação"
                            className="w-full px-2.5 py-2 text-sm border border-slate-300 rounded-md resize-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-[1fr_96px] gap-2 items-center">
                          <span className="text-orange-600">Custo reposição:</span>
                          <input
                            type="text"
                            value={toCurrency(custoReposicao)}
                            readOnly
                            className="h-8 px-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-700"
                          />
                        </div>
                        <div className="text-xs text-slate-700">Margem: {margemReposicao.toFixed(1)}%</div>

                        <div className="grid grid-cols-[1fr_96px] gap-2 items-center">
                          <span className="text-orange-600">Custo médio:</span>
                          <input
                            type="text"
                            value={toCurrency(custoMedio)}
                            readOnly
                            className="h-8 px-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-700"
                          />
                        </div>
                        <div className="text-xs text-slate-700">Margem: {margemMedia.toFixed(1)}%</div>

                        <div className="grid grid-cols-[1fr_96px] gap-2 items-center">
                          <span className="text-orange-600">Custo maior lote:</span>
                          <input
                            type="text"
                            value={toCurrency(custoMaiorLote)}
                            readOnly
                            className="h-8 px-2 text-sm border border-slate-200 bg-slate-50 rounded-md text-slate-700"
                          />
                        </div>
                        <div className="text-xs text-slate-700">Margem: {margemMaiorLote.toFixed(1)}%</div>

                        <div className="grid grid-cols-[1fr_96px] gap-2 items-center">
                          <span className="text-orange-600">Custo simulado:</span>
                          <input
                            type="text"
                            value={toCurrency(custoSimulado)}
                            readOnly
                            className="h-8 px-2 text-sm border border-amber-300 bg-amber-50 rounded-md text-slate-700"
                          />
                        </div>
                        <div className="text-xs text-slate-700">Margem: {margemSimulada.toFixed(1)}%</div>
                      </div>

                    </div>

                    <div className="px-3 pb-3">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-sm text-slate-900">Plano de misturas</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Simulação individual para este produto.
                            </p>
                          </div>
                          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              checked={form.usarPlanoMisturas}
                              onChange={(event) =>
                                handleUpdateProdutoCotacao(produto.id, {
                                  usarPlanoMisturas: event.target.checked,
                                })
                              }
                              className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                            />
                            Realizar plano de misturas
                          </label>
                        </div>

                        {!form.usarPlanoMisturas ? (
                          <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                            Esta etapa é opcional. Ative para calcular receita, custo, lucro e margem deste produto.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-xs text-slate-700 mb-1.5">Volume (toneladas)</label>
                                <input
                                  type="number"
                                  value={form.volumeMistura}
                                  onChange={(event) =>
                                    handleUpdateProdutoCotacao(produto.id, {
                                      volumeMistura: Number(event.target.value || 0),
                                    })
                                  }
                                  className="w-full h-9 px-2.5 border border-slate-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-slate-700 mb-1.5">Preço por tonelada</label>
                                <input
                                  type="number"
                                  value={form.precoPorTonelada}
                                  onChange={(event) =>
                                    handleUpdateProdutoCotacao(produto.id, {
                                      precoPorTonelada: Number(event.target.value || 0),
                                    })
                                  }
                                  className="w-full h-9 px-2.5 border border-slate-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-slate-700 mb-1.5">Frete por tonelada</label>
                                <input
                                  type="number"
                                  value={form.fretePorTonelada}
                                  onChange={(event) =>
                                    handleUpdateProdutoCotacao(produto.id, {
                                      fretePorTonelada: Number(event.target.value || 0),
                                    })
                                  }
                                  className="w-full h-9 px-2.5 border border-slate-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-slate-700 mb-1.5">Alíquota total</label>
                                <input
                                  type="text"
                                  value={`${aliquotaTotalImpostosMistura.toFixed(2)}%`}
                                  readOnly
                                  className="w-full h-9 px-2.5 border border-slate-200 bg-white rounded-md text-slate-700"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs text-slate-700 mb-1.5">ICMS (%)</label>
                                <input
                                  type="number"
                                  value={form.icms}
                                  onChange={(event) =>
                                    handleUpdateProdutoCotacao(produto.id, {
                                      icms: Number(event.target.value || 0),
                                    })
                                  }
                                  className="w-full h-9 px-2.5 border border-slate-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-slate-700 mb-1.5">PIS (%)</label>
                                <input
                                  type="number"
                                  value={form.pis}
                                  onChange={(event) =>
                                    handleUpdateProdutoCotacao(produto.id, {
                                      pis: Number(event.target.value || 0),
                                    })
                                  }
                                  className="w-full h-9 px-2.5 border border-slate-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-slate-700 mb-1.5">COFINS (%)</label>
                                <input
                                  type="number"
                                  value={form.cofins}
                                  onChange={(event) =>
                                    handleUpdateProdutoCotacao(produto.id, {
                                      cofins: Number(event.target.value || 0),
                                    })
                                  }
                                  className="w-full h-9 px-2.5 border border-slate-300 rounded-md"
                                />
                              </div>
                            </div>

                            <div className="rounded-md border border-slate-200 bg-white p-3">
                              <h4 className="text-xs text-slate-900 mb-2">Composição da mistura</h4>
                              <div className="space-y-2">
                                {form.materiaisMistura.map((material) => (
                                  <div
                                    key={material.id}
                                    className="grid grid-cols-1 md:grid-cols-[1fr_130px_140px] gap-2"
                                  >
                                    <input
                                      type="text"
                                      value={material.nome}
                                      readOnly
                                      className="h-8 px-2.5 text-sm border border-slate-200 rounded-md bg-slate-50"
                                    />
                                    <input
                                      type="number"
                                      value={material.percentual}
                                      onChange={(event) =>
                                        handleUpdateMaterialMisturaPorProduto(
                                          produto.id,
                                          material.id,
                                          "percentual",
                                          Number(event.target.value || 0),
                                        )
                                      }
                                      className="h-8 px-2.5 text-sm border border-slate-300 rounded-md"
                                    />
                                    <input
                                      type="number"
                                      value={material.custoUnitario}
                                      onChange={(event) =>
                                        handleUpdateMaterialMisturaPorProduto(
                                          produto.id,
                                          material.id,
                                          "custoUnitario",
                                          Number(event.target.value || 0),
                                        )
                                      }
                                      className="h-8 px-2.5 text-sm border border-slate-300 rounded-md"
                                    />
                                  </div>
                                ))}
                              </div>
                              <p
                                className={`text-xs mt-2 ${
                                  percentualTotalMistura === 100
                                    ? "text-emerald-700"
                                    : "text-amber-700"
                                }`}
                              >
                                Percentual total da mistura: {percentualTotalMistura.toFixed(2)}%
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 text-xs">
                              <div className="rounded-md border border-slate-200 p-2 bg-white">
                                <p className="text-slate-500">Receita bruta</p>
                                <p className="text-slate-900 mt-0.5">{toCurrency(receitaBrutaMistura)}</p>
                              </div>
                              <div className="rounded-md border border-slate-200 p-2 bg-white">
                                <p className="text-slate-500">Impostos sobre receita</p>
                                <p className="text-slate-900 mt-0.5">{toCurrency(impostosSobreReceitaMistura)}</p>
                              </div>
                              <div className="rounded-md border border-slate-200 p-2 bg-white">
                                <p className="text-slate-500">Receita líquida</p>
                                <p className="text-slate-900 mt-0.5">{toCurrency(receitaLiquidaMistura)}</p>
                              </div>
                              <div className="rounded-md border border-slate-200 p-2 bg-white">
                                <p className="text-slate-500">Custo da mistura (ton)</p>
                                <p className="text-slate-900 mt-0.5">{toCurrency(custoMisturaPorTonelada)}</p>
                              </div>
                              <div className="rounded-md border border-slate-200 p-2 bg-white">
                                <p className="text-slate-500">Custo total</p>
                                <p className="text-slate-900 mt-0.5">{toCurrency(custoTotalMistura)}</p>
                              </div>
                              <div className="rounded-md border border-slate-200 p-2 bg-white">
                                <p className="text-slate-500">Lucro bruto</p>
                                <p className="text-slate-900 mt-0.5">{toCurrency(lucroBrutoMistura)}</p>
                              </div>
                              <div className="rounded-md border border-slate-200 p-2 bg-white">
                                <p className="text-slate-500">Margem</p>
                                <p className="text-slate-900 mt-0.5">{margemMisturaPercentual.toFixed(2)}%</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {feedback && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-2">
            {feedback}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSalvarCalculo}
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