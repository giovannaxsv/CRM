import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ChevronRight, Save } from "lucide-react";
import { produtosReais } from "../../imports/produtosReais";
import { Switch } from "./ui/switch";

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

interface MaterialMistura {
  id: number;
  materialId: string;
  materialNome: string;
  percentual: number;
  custoPorTonelada: number;
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
  isPlanoMisturaAtivo: boolean;
  volumeMistura: number;
  precoPorTonelada: number;
  fretePorTonelada: number;
  icms: number;
  pis: number;
  cofins: number;
  materiaisMistura: MaterialMistura[];
}

interface PlanoMisturaResultado {
  percentualTotal: number;
  statusPercentual: "ok" | "incompleto" | "invalido";
  receitaBruta: number;
  impostosSobreReceita: number;
  receitaLiquida: number;
  custoMisturaPorTonelada: number;
  custoTotal: number;
  lucroBruto: number;
  margemPercentual: number;
  aliquotaTotal: number;
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
  { id: 1, cliente: "KOMATSU DO BRASIL LTDA", oportunidade: "Renovação anual 2026", responsavel: "Everton" },
  { id: 2, cliente: "Looking for Electric Panels", oportunidade: "Projeto eficiência elétrica", responsavel: "Gorete" },
  { id: 3, cliente: "Solar Panels", oportunidade: "Implantação em fases", responsavel: "Keila" },
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

const codigosProdutoMock = ["TOT-201", "TOT-202", "TOT-203", "LIG-104", "LIG-105", "NCK-310", "SIL-440"];

const custosProdutoPorCodigoMock: Record<string, CustosProdutoPorCodigo> = {
  "TOT-201": { precoPadrao: 1340, precoMeta: 1340, precoMinimo: 1190, custoReposicao: 720, custoMedio: 690, custoMaiorLote: 660, custoSimulado: 680 },
  "TOT-202": { precoPadrao: 1470, precoMeta: 1470, precoMinimo: 1310, custoReposicao: 810, custoMedio: 775, custoMaiorLote: 740, custoSimulado: 760 },
  "TOT-203": { precoPadrao: 1210, precoMeta: 1210, precoMinimo: 1060, custoReposicao: 640, custoMedio: 615, custoMaiorLote: 590, custoSimulado: 605 },
  "LIG-104": { precoPadrao: 1740, precoMeta: 1740, precoMinimo: 1540, custoReposicao: 980, custoMedio: 950, custoMaiorLote: 920, custoSimulado: 940 },
  "LIG-105": { precoPadrao: 1830, precoMeta: 1830, precoMinimo: 1640, custoReposicao: 1040, custoMedio: 1005, custoMaiorLote: 970, custoSimulado: 995 },
  "NCK-310": { precoPadrao: 1040, precoMeta: 1040, precoMinimo: 910, custoReposicao: 560, custoMedio: 535, custoMaiorLote: 510, custoSimulado: 525 },
  "SIL-440": { precoPadrao: 1600, precoMeta: 1600, precoMinimo: 1410, custoReposicao: 890, custoMedio: 860, custoMaiorLote: 835, custoSimulado: 850 },
};

const materiaisDisponiveisMock = produtosReais.slice(0, 12).map((nome, index) => ({
  id: `material-${index + 1}`,
  nome,
  custoPadrao: [850, 980, 1200, 720, 810, 660, 890, 950, 760, 840, 900, 1020][index],
}));

const materiaisMisturaBase: MaterialMistura[] = [
  { id: 1, materialId: materiaisDisponiveisMock[0]?.id ?? "material-1", materialNome: materiaisDisponiveisMock[0]?.nome ?? produtosReais[11], percentual: 50, custoPorTonelada: materiaisDisponiveisMock[0]?.custoPadrao ?? 850 },
  { id: 2, materialId: materiaisDisponiveisMock[1]?.id ?? "material-2", materialNome: materiaisDisponiveisMock[1]?.nome ?? produtosReais[12], percentual: 30, custoPorTonelada: materiaisDisponiveisMock[1]?.custoPadrao ?? 980 },
  { id: 3, materialId: materiaisDisponiveisMock[2]?.id ?? "material-3", materialNome: materiaisDisponiveisMock[2]?.nome ?? produtosReais[13], percentual: 20, custoPorTonelada: materiaisDisponiveisMock[2]?.custoPadrao ?? 1200 },
];

const criarNovoMaterialMistura = (): MaterialMistura => {
  const materialSelecionado = materiaisDisponiveisMock[0];

  return {
    id: Date.now(),
    materialId: materialSelecionado?.id ?? "",
    materialNome: materialSelecionado?.nome ?? "",
    percentual: 0,
    custoPorTonelada: materialSelecionado?.custoPadrao ?? 0,
  };
};

const calcularPlanoMistura = (form: ProdutoCotacaoState): PlanoMisturaResultado => {
  const percentualTotal = form.materiaisMistura.reduce((accumulator, material) => accumulator + material.percentual, 0);
  const custoMisturaPorTonelada = form.materiaisMistura.reduce(
    (accumulator, material) => accumulator + (material.percentual / 100) * material.custoPorTonelada,
    0,
  );
  const receitaBruta = form.volumeMistura * form.precoPorTonelada;
  const aliquotaTotal = form.icms + form.pis + form.cofins;
  const impostosSobreReceita = receitaBruta * (aliquotaTotal / 100);
  const receitaLiquida = receitaBruta - impostosSobreReceita;
  const custoTotal = (custoMisturaPorTonelada + form.fretePorTonelada) * form.volumeMistura;
  const lucroBruto = receitaLiquida - custoTotal;
  const margemPercentual = receitaLiquida > 0 ? (lucroBruto / receitaLiquida) * 100 : 0;
  const statusPercentual: PlanoMisturaResultado["statusPercentual"] = percentualTotal > 100 ? "invalido" : percentualTotal === 100 ? "ok" : "incompleto";

  return {
    percentualTotal,
    statusPercentual,
    receitaBruta,
    impostosSobreReceita,
    receitaLiquida,
    custoMisturaPorTonelada,
    custoTotal,
    lucroBruto,
    margemPercentual,
    aliquotaTotal,
  };
};

const buildInitialCotacaoPorProduto = (produtos: ProdutoCotacaoSelecionado[]): Record<number, ProdutoCotacaoState> => {
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
      isPlanoMisturaAtivo: false,
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

const toCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const calculateMargem = (receitaLiquida: number, custoTotal: number) => {
  if (receitaLiquida <= 0) {
    return 0;
  }

  return ((receitaLiquida - custoTotal) / receitaLiquida) * 100;
};

export function CalculoMargemView({ clientId, onBackToCotacao, onGoToListaCotacoes }: CalculoMargemViewProps) {
  const selected = useMemo(() => cotacoesMock.find((item) => item.id === clientId), [clientId]);
  const produtosSelecionados = useMemo(() => produtosSelecionadosMock.filter((item) => item.clientId === clientId), [clientId]);

  const [cotacaoPorProduto, setCotacaoPorProduto] = useState<Record<number, ProdutoCotacaoState>>(() => buildInitialCotacaoPorProduto(produtosSelecionados));
  const [produtoExpandidoPorId, setProdutoExpandidoPorId] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setCotacaoPorProduto(buildInitialCotacaoPorProduto(produtosSelecionados));
    setProdutoExpandidoPorId(
      produtosSelecionados.reduce<Record<number, boolean>>((accumulator, produto) => {
        accumulator[produto.id] = true;
        return accumulator;
      }, {}),
    );
  }, [produtosSelecionados]);

  const planosMisturaPorProduto = useMemo(() => {
    return produtosSelecionados.reduce<Record<number, PlanoMisturaResultado>>((accumulator, produto) => {
      const form = cotacaoPorProduto[produto.id];

      if (form?.isPlanoMisturaAtivo) {
        accumulator[produto.id] = calcularPlanoMistura(form);
      }

      return accumulator;
    }, {});
  }, [cotacaoPorProduto, produtosSelecionados]);

  const handleUpdateProdutoCotacao = (produtoId: number, nextState: Partial<ProdutoCotacaoState>) => {
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
    field: "materialNome" | "percentual" | "custoPorTonelada",
    value: number | string,
  ) => {
    setCotacaoPorProduto((previousState) => ({
      ...previousState,
      [produtoId]: {
        ...previousState[produtoId],
        materiaisMistura: previousState[produtoId].materiaisMistura.map((material) => {
          if (material.id !== materialId) {
            return material;
          }

          if (field === "materialNome") {
            const nomeSelecionado = String(value);
            const materialSelecionado = materiaisDisponiveisMock.find((item) => item.nome === nomeSelecionado);

            return {
              ...material,
              materialId: materialSelecionado?.id ?? nomeSelecionado,
              materialNome: nomeSelecionado,
              custoPorTonelada: materialSelecionado?.custoPadrao ?? material.custoPorTonelada,
            };
          }

          return {
            ...material,
            [field]: Number(value),
          };
        }),
      },
    }));
  };

  const handleAdicionarMaterialMistura = (produtoId: number) => {
    setCotacaoPorProduto((previousState) => ({
      ...previousState,
      [produtoId]: {
        ...previousState[produtoId],
        isPlanoMisturaAtivo: true,
        materiaisMistura: [...previousState[produtoId].materiaisMistura, criarNovoMaterialMistura()],
      },
    }));
  };

  const handleRemoverMaterialMistura = (produtoId: number, materialId: number) => {
    setCotacaoPorProduto((previousState) => ({
      ...previousState,
      [produtoId]: {
        ...previousState[produtoId],
        materiaisMistura: previousState[produtoId].materiaisMistura.filter((material) => material.id !== materialId),
      },
    }));
  };

  const handleSalvarCalculo = () => setFeedback("Cálculo salvo com sucesso.");

  const handleToggleProduto = (produtoId: number) => {
    setProdutoExpandidoPorId((previousState) => ({
      ...previousState,
      [produtoId]: !previousState[produtoId],
    }));
  };

  if (!selected) {
    return (
      <div className="h-full bg-white p-6 flex flex-col">
        <button onClick={onBackToCotacao} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          Voltar para cotação
        </button>
        <div className="flex-1 flex items-center justify-center text-slate-500">Cotação não encontrada.</div>
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
              <span>Cotação</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Cálculo de preço e margem</span>
            </div>
            <h1 className="text-2xl text-slate-900">Cálculo de preço e margem</h1>
            <p className="text-sm text-slate-500 mt-1">
              Cliente: {selected.cliente} | Oportunidade: {selected.oportunidade} | Responsável: {selected.responsavel} | Produtos selecionados: {produtosSelecionados.length}
            </p>
          </div>
          <button onClick={onBackToCotacao} className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para cotação
          </button>
        </div>
      </div>

      <div className="p-4 md:p-5 space-y-4">
        <section className="rounded-xl border border-slate-200 bg-white p-3 md:p-4 space-y-3">
          <h2 className="text-base text-slate-900">Cálculo comercial</h2>

          {produtosSelecionados.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Nenhum produto selecionado para cálculo nesta cotação.</div>
          ) : (
            <div className="space-y-2.5">
              {produtosSelecionados.map((produto) => {
                const form = cotacaoPorProduto[produto.id];

                if (!form) {
                  return null;
                }

                const custosFixosPorCodigo = custosProdutoPorCodigoMock[form.codigo] ?? {
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
                const planoMistura = planosMisturaPorProduto[produto.id];
                const statusAnalise = form.isPlanoMisturaAtivo ? "Plano ativo" : !form.codigo ? "Pendente" : aprovado ? "Dentro da regra" : "Abaixo do mínimo";
                const statusAnaliseClasses = form.isPlanoMisturaAtivo
                  ? "bg-sky-100 text-sky-800 border-sky-200"
                  : !form.codigo
                    ? "bg-slate-100 text-slate-700 border-slate-200"
                    : aprovado
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : "bg-amber-100 text-amber-800 border-amber-200";

                return (
                  <article key={produto.id} className="rounded-xl border border-slate-300 bg-white overflow-hidden">
                    <div className="bg-[#21386b] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm md:text-base truncate">
                          <span className="font-medium">{produto.nome}</span>
                          <span className="ml-2 text-slate-200">Consumo: {produto.consumo}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${statusAnaliseClasses}`}>{statusAnalise}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleProduto(produto.id)}
                          aria-expanded={produtoExpandidoPorId[produto.id] ?? true}
                          className="inline-flex items-center gap-1 rounded-md border border-white/40 bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/20"
                        >
                          <ArrowDown className={`h-3.5 w-3.5 transition-transform ${(produtoExpandidoPorId[produto.id] ?? true) ? "rotate-180" : "rotate-0"}`} />
                          {(produtoExpandidoPorId[produto.id] ?? true) ? "Recolher" : "Expandir"}
                        </button>
                      </div>
                    </div>

                    {(produtoExpandidoPorId[produto.id] ?? true) && (
                      <div className="p-4 space-y-4">
                        <section className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:p-4 space-y-3">
                          <h3 className="text-sm text-slate-900">Dados comerciais</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Código <span className="text-rose-600">*</span></label>
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
                                  <option key={codigo} value={codigo}>{codigo}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">ICMS</label>
                              <select value={form.icmsProduto} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { icmsProduto: Number(event.target.value) })} className="h-9 w-full px-2.5 text-sm border border-slate-300 rounded-md bg-white">
                                <option value={4}>4%</option>
                                <option value={7}>7%</option>
                                <option value={12}>12%</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Embalagem</label>
                              <select value={form.embalagem} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { embalagem: event.target.value })} className="h-9 w-full px-2.5 text-sm border border-slate-300 rounded-md bg-white">
                                <option value="">Selecione a embalagem</option>
                                <option value="balde">balde</option>
                                <option value="barras">barras</option>
                                <option value="big bag">big bag</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Entrega prevista</label>
                              <input type="date" value={form.entregaPrevista} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { entregaPrevista: event.target.value })} className="h-9 w-full px-2.5 text-sm border border-slate-300 rounded-md" />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Quantidade <span className="text-rose-600">*</span></label>
                              <input type="number" value={form.quantidade} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { quantidade: Number(event.target.value || 0) })} className="h-9 w-full px-2.5 text-sm border border-slate-300 rounded-md" />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Preço informado <span className="text-rose-600">*</span></label>
                              <input type="number" value={form.preco} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { preco: Number(event.target.value || 0) })} className="h-9 w-full px-2.5 text-sm border border-slate-300 rounded-md" />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Preço meta</label>
                              <input type="text" value={toCurrency(custosFixosPorCodigo.precoMeta)} readOnly className="h-9 w-full px-2.5 text-sm border border-slate-200 rounded-md bg-slate-50 text-slate-700" />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Preço mínimo</label>
                              <input type="text" value={toCurrency(custosFixosPorCodigo.precoMinimo)} readOnly className="h-9 w-full px-2.5 text-sm border border-slate-200 rounded-md bg-slate-50 text-slate-700" />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Receita bruta</label>
                              <input type="text" value={toCurrency(receitaBruta)} readOnly className="h-9 w-full px-2.5 text-sm border border-slate-200 rounded-md bg-slate-50 text-slate-700" />
                            </div>
                          </div>
                        </section>

                        {!form.isPlanoMisturaAtivo && (
                          <section className="rounded-lg border border-slate-200 bg-white p-3 md:p-4 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-sm text-slate-900">Resultado da análise</h3>
                              <p className="text-xs text-slate-500">Receita líquida após ICMS: {toCurrency(receitaLiquidaAposIcms)}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                              {[
                                { titulo: "Custo reposição", valor: custoReposicao, margem: margemReposicao },
                                { titulo: "Custo médio", valor: custoMedio, margem: margemMedia },
                                { titulo: "Custo maior lote", valor: custoMaiorLote, margem: margemMaiorLote },
                                { titulo: "Custo simulado", valor: custoSimulado, margem: margemSimulada },
                              ].map((item) => (
                                <div key={item.titulo} className={`rounded-lg border p-3 ${!form.codigo ? "border-slate-200 bg-slate-50" : aprovado ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs text-slate-600">{item.titulo}</p>
                                    <span className="text-[11px] font-medium text-slate-600">{!form.codigo ? "Pendente" : aprovado ? "Dentro da regra" : "Abaixo do mínimo"}</span>
                                  </div>
                                  <p className="text-sm text-slate-900 mt-2">{toCurrency(item.valor)}</p>
                                  <p className="text-xs text-slate-700 mt-1">Margem: {item.margem.toFixed(1)}%</p>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        <section className="rounded-lg border border-slate-200 bg-white p-3 md:p-4 space-y-3">
                          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-3">
                            <div className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-600 overflow-hidden min-h-[108px]">
                              <p className="text-slate-700 font-medium">Anexo</p>
                              <p className="truncate mt-1">Nenhum arquivo anexado</p>
                              <button type="button" className="mt-2 text-slate-800 underline hover:text-slate-900">Carregar arquivo</button>
                            </div>
                            <div>
                              <label className="block text-xs text-slate-700 mb-1">Observação</label>
                              <textarea rows={4} value={form.observacao} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { observacao: event.target.value })} placeholder="Observação" className="w-full px-2.5 py-2 text-sm border border-slate-300 rounded-md resize-none bg-white" />
                            </div>
                          </div>
                        </section>

                        <section className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:p-4 space-y-3">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-sm text-slate-900">Plano de misturas</h3>
                              <p className="text-xs text-slate-500 mt-0.5">Simulação individual opcional para este produto.</p>
                            </div>
                            <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5">
                              <Switch checked={form.isPlanoMisturaAtivo} onCheckedChange={(checked) => handleUpdateProdutoCotacao(produto.id, { isPlanoMisturaAtivo: Boolean(checked) })} aria-label="Ativar plano de misturas" />
                              <span className="text-sm text-slate-700">Ativar plano de misturas</span>
                            </div>
                          </div>

                          {!form.isPlanoMisturaAtivo ? (
                            <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                              Esta etapa é opcional. Ative para calcular receita, custo, lucro e margem deste produto.
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                                <div>
                                  <label className="block text-xs text-slate-700 mb-1.5">Volume (toneladas)</label>
                                  <input type="number" value={form.volumeMistura} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { volumeMistura: Number(event.target.value || 0) })} className="w-full h-9 px-2.5 border border-slate-300 rounded-md" />
                                </div>
                                <div>
                                  <label className="block text-xs text-slate-700 mb-1.5">Preço por tonelada</label>
                                  <input type="number" value={form.precoPorTonelada} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { precoPorTonelada: Number(event.target.value || 0) })} className="w-full h-9 px-2.5 border border-slate-300 rounded-md" />
                                </div>
                                <div>
                                  <label className="block text-xs text-slate-700 mb-1.5">Frete por tonelada</label>
                                  <input type="number" value={form.fretePorTonelada} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { fretePorTonelada: Number(event.target.value || 0) })} className="w-full h-9 px-2.5 border border-slate-300 rounded-md" />
                                </div>
                                <div>
                                  <label className="block text-xs text-slate-700 mb-1.5">Alíquota total</label>
                                  <input type="text" value={`${(planoMistura?.aliquotaTotal ?? (form.icms + form.pis + form.cofins)).toFixed(2)}%`} readOnly className="w-full h-9 px-2.5 border border-slate-200 bg-white rounded-md text-slate-700" />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-xs text-slate-700 mb-1.5">ICMS (%)</label>
                                  <input type="number" value={form.icms} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { icms: Number(event.target.value || 0) })} className="w-full h-9 px-2.5 border border-slate-300 rounded-md" />
                                </div>
                                <div>
                                  <label className="block text-xs text-slate-700 mb-1.5">PIS (%)</label>
                                  <input type="number" value={form.pis} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { pis: Number(event.target.value || 0) })} className="w-full h-9 px-2.5 border border-slate-300 rounded-md" />
                                </div>
                                <div>
                                  <label className="block text-xs text-slate-700 mb-1.5">COFINS (%)</label>
                                  <input type="number" value={form.cofins} onChange={(event) => handleUpdateProdutoCotacao(produto.id, { cofins: Number(event.target.value || 0) })} className="w-full h-9 px-2.5 border border-slate-300 rounded-md" />
                                </div>
                              </div>

                              <div className="rounded-md border border-slate-200 bg-white p-3 space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                  <h4 className="text-xs text-slate-900">Composição da mistura</h4>
                                  <button type="button" onClick={() => handleAdicionarMaterialMistura(produto.id)} className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50">
                                    + Adicionar material
                                  </button>
                                </div>

                                <div className="space-y-3">
                                  {form.materiaisMistura.map((material) => (
                                    <div key={material.id} className="grid grid-cols-1 md:grid-cols-[1fr_120px_140px_auto] gap-2 items-end">
                                      <div>
                                        <label className="block text-[11px] text-slate-500 mb-1">Material</label>
                                        <input
                                          list={`materiais-${produto.id}`}
                                          type="text"
                                          value={material.materialNome}
                                          onChange={(event) => handleUpdateMaterialMisturaPorProduto(produto.id, material.id, "materialNome", event.target.value)}
                                          className="h-8 w-full px-2.5 text-sm border border-slate-300 rounded-md bg-white"
                                          placeholder="Buscar material"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] text-slate-500 mb-1">Percentual (%)</label>
                                        <input type="number" value={material.percentual} onChange={(event) => handleUpdateMaterialMisturaPorProduto(produto.id, material.id, "percentual", Number(event.target.value || 0))} className="h-8 w-full px-2.5 text-sm border border-slate-300 rounded-md" />
                                      </div>
                                      <div>
                                        <label className="block text-[11px] text-slate-500 mb-1">Custo (R$/ton)</label>
                                        <input type="number" value={material.custoPorTonelada} onChange={(event) => handleUpdateMaterialMisturaPorProduto(produto.id, material.id, "custoPorTonelada", Number(event.target.value || 0))} className="h-8 w-full px-2.5 text-sm border border-slate-300 rounded-md" />
                                      </div>
                                      <button type="button" onClick={() => handleRemoverMaterialMistura(produto.id, material.id)} className="h-8 px-2.5 text-xs rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50">
                                        Remover
                                      </button>
                                    </div>
                                  ))}
                                </div>

                                <datalist id={`materiais-${produto.id}`}>
                                  {materiaisDisponiveisMock.map((material) => (
                                    <option key={material.id} value={material.nome} />
                                  ))}
                                </datalist>

                                <div className="rounded-md border border-sky-200 bg-sky-50 p-3 space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className="text-sm font-semibold text-slate-900">Produto analisado</h4>
                                  </div>
                                  {form.materiaisMistura[0] ? (
                                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-sky-100 bg-white px-3 py-2 text-xs text-slate-700">
                                      <p className="min-w-0 truncate text-base font-semibold text-slate-900">
                                        SILICIO
                                      </p>
                                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                        <span className="font-medium">
                                          CONTIDO: 
                                          {form.materiaisMistura[0].percentual.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 1,
                                            maximumFractionDigits: 1,
                                          })}%
                                        </span>
                                        <span className="font-medium">
                                          Custo {toCurrency(form.materiaisMistura[0].custoPorTonelada)}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="rounded-md border border-dashed border-sky-200 bg-white px-3 py-2 text-sm text-slate-500">
                                      Nenhum produto informado.
                                    </div>
                                  )}

                                </div>

                                <p className={`text-xs ${planoMistura?.statusPercentual === "ok" ? "text-emerald-700" : planoMistura?.statusPercentual === "invalido" ? "text-rose-700" : "text-amber-700"}`}>
                                  Percentual total da mistura: {planoMistura?.percentualTotal.toFixed(2) ?? "0.00"}%
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 text-xs">
                                {[
                                  { titulo: "Receita bruta", valor: planoMistura?.receitaBruta ?? 0 },
                                  { titulo: "Impostos sobre receita", valor: planoMistura?.impostosSobreReceita ?? 0 },
                                  { titulo: "Receita líquida", valor: planoMistura?.receitaLiquida ?? 0 },
                                  { titulo: "Custo da mistura (ton)", valor: planoMistura?.custoMisturaPorTonelada ?? 0 },
                                  { titulo: "Custo total", valor: planoMistura?.custoTotal ?? 0 },
                                  { titulo: "Lucro bruto", valor: planoMistura?.lucroBruto ?? 0 },
                                ].map((item) => (
                                  <div key={item.titulo} className="rounded-md border border-slate-200 p-2 bg-white">
                                    <p className="text-slate-500">{item.titulo}</p>
                                    <p className="text-slate-900 mt-0.5">{toCurrency(item.valor)}</p>
                                  </div>
                                ))}
                                <div className="rounded-md border border-slate-200 p-2 bg-white">
                                  <p className="text-slate-500">Margem</p>
                                  <p className="text-slate-900 mt-0.5">{(planoMistura?.margemPercentual ?? 0).toFixed(2)}%</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </section>
                      </div>
                    )}
                  </article>
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
          <button onClick={handleSalvarCalculo} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors">
            <Save className="w-4 h-4" />
            Salvar cálculo
          </button>
          <button onClick={onGoToListaCotacoes} className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors">
            Salvar e finalizar cotação
          </button>
        </div>
      </div>
    </div>
  );
}
