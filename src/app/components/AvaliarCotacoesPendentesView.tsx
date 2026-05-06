import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cotacoesMock } from "./ListaCotacoesView";
import { produtosReais } from "../../imports/produtosReais";
import {
  getCotacaoApprovalMeta,
  type CotacaoApprovalStatus,
} from "./cotacaoApproval";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type AcaoAvaliacao = "aprovar" | "solicitar_ajuste" | "reprovar";

type CotacaoBase = (typeof cotacoesMock)[number];

interface CotacaoDetalhada {
  id: number;
  codigo: string;
  cliente: string;
  contatoPrincipal: string;
  responsavel: string;
  vendedorResponsavel: string;
  etapa: string;
  dataAtualizacao: string;
  nomeOportunidade: string;
  origemOportunidade: string;
  observacoesIniciais: string;
  necessidadeIdentificada: string;
  tipoFrete: "CIF" | "FOB";
  valorFrete: number;
  condicaoPagamento: string;
  filialFaturamento: string;
  dataRetorno: string;
  statusAprovacao: CotacaoApprovalStatus;
  observacaoAprovacao: string;
  produto: ProdutoCotacaoDetalhada;
}

interface MaterialMisturaDetalhada {
  material: string;
  percentual: number;
  custoPorTonelada: number;
}

interface ProdutoCotacaoDetalhada {
  id: number;
  nome: string;
  consumo: string;
  frequencia: string;
  statusAprovacao: "Dentro da política" | "Abaixo da política" | "Aguardando gestor";
  codigo: string;
  icms: number;
  embalagem: string;
  entregaPrevista: string;
  quantidade: number;
  precoInformado: number;
  precoMeta: number;
  precoMinimo: number;
  receitaBruta: number;
  anexo: string;
  observacao: string;
  custoReposicao: number;
  margemReposicao: number;
  custoMedio: number;
  margemMedio: number;
  custoMaiorLote: number;
  margemMaiorLote: number;
  custoSimulado: number;
  margemSimulada: number;
  receitaLiquidaAposIcms: number;
  planoMisturaAtivo: boolean;
  volumeToneladas: number;
  precoPorTonelada: number;
  fretePorTonelada: number;
  aliquotaTotal: number;
  icmsPercentual: number;
  pisPercentual: number;
  cofinsPercentual: number;
  composicaoMistura: MaterialMisturaDetalhada[];
  produtoAnalisado: string;
  contidoPercentual: number | null;
  receitaBrutaMistura: number | null;
  impostosSobreReceita: number | null;
  receitaLiquidaMistura: number | null;
  custoMisturaPorTonelada: number | null;
  custoTotalMistura: number | null;
  lucroBrutoMistura: number | null;
  margemMistura: number | null;
  diferencaPrecoMinimo: number;
  dentroDaPolitica: boolean;
}

interface AvaliarCotacoesPendentesViewProps {
  onBackToMain: () => void;
}

function toCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function toDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

function toPercent(value: number) {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

function toSignedCurrency(value: number) {
  const formatted = toCurrency(Math.abs(value));

  return value >= 0 ? formatted : `-${formatted}`;
}

const codigosProdutoMock = ["TOT-201", "TOT-202", "TOT-203", "LIG-104", "LIG-105", "NCK-310", "SIL-440"];

const custosProdutoPorCodigoMock: Record<string, { precoPadrao: number; precoMeta: number; precoMinimo: number; custoReposicao: number; custoMedio: number; custoMaiorLote: number; custoSimulado: number; }> = {
  "TOT-201": { precoPadrao: 1340, precoMeta: 1340, precoMinimo: 1190, custoReposicao: 720, custoMedio: 690, custoMaiorLote: 660, custoSimulado: 680 },
  "TOT-202": { precoPadrao: 1470, precoMeta: 1470, precoMinimo: 1310, custoReposicao: 810, custoMedio: 775, custoMaiorLote: 740, custoSimulado: 760 },
  "TOT-203": { precoPadrao: 1210, precoMeta: 1210, precoMinimo: 1060, custoReposicao: 640, custoMedio: 615, custoMaiorLote: 590, custoSimulado: 605 },
  "LIG-104": { precoPadrao: 1740, precoMeta: 1740, precoMinimo: 1540, custoReposicao: 980, custoMedio: 950, custoMaiorLote: 920, custoSimulado: 940 },
  "LIG-105": { precoPadrao: 1830, precoMeta: 1830, precoMinimo: 1640, custoReposicao: 1040, custoMedio: 1005, custoMaiorLote: 970, custoSimulado: 995 },
  "NCK-310": { precoPadrao: 1040, precoMeta: 1040, precoMinimo: 910, custoReposicao: 560, custoMedio: 535, custoMaiorLote: 510, custoSimulado: 525 },
  "SIL-440": { precoPadrao: 1600, precoMeta: 1600, precoMinimo: 1410, custoReposicao: 890, custoMedio: 860, custoMaiorLote: 835, custoSimulado: 850 },
};

const materiaisMisturaMock: MaterialMisturaDetalhada[] = [
  { material: produtosReais[0], percentual: 50, custoPorTonelada: 850 },
  { material: produtosReais[1], percentual: 30, custoPorTonelada: 980 },
  { material: produtosReais[2], percentual: 20, custoPorTonelada: 1200 },
];

const contatosPrincipaisMock = ["Marina Costa", "Bruno Almeida", "Carla Santos", "Rafael Nunes"];
const origensOportunidadeMock = ["Indicação", "Prospecção ativa", "Visita técnica", "Reativação comercial"];
const observacoesIniciaisMock = [
  "Cliente com histórico de compras recorrentes e sensível a prazo de entrega.",
  "Oportunidade aberta após visita técnica e alinhamento com engenharia.",
  "Houve solicitação de revisão de preço e análise de frete antes do envio final.",
  "Expectativa de ampliar volume a partir da homologação da nova linha.",
];
const necessidadesIdentificadasMock = [
  "Garantir previsibilidade de abastecimento com revisão da política de frete.",
  "Reduzir o custo total da operação mantendo o nível de serviço atual.",
  "Substituir fornecedor atual com maior competitividade e menor prazo de resposta.",
  "Ampliar a participação da Cometa em itens estratégicos do cliente.",
];
const condicoesPagamentoMock = ["28 dias", "30/60", "45 dias", "14/28/42 dias"];
const filiaisFaturamentoMock = ["Matriz", "Filial Sul", "Filial Sudeste", "Filial Nordeste"];
const entregasPrevistasMock = ["D+7", "D+10", "D+12", "D+15"];

function criarProdutoDetalhado(cotacao: CotacaoBase, indice: number): ProdutoCotacaoDetalhada {
  const codigo = codigosProdutoMock[(cotacao.id + indice) % codigosProdutoMock.length];
  const referencia = custosProdutoPorCodigoMock[codigo];
  const nome = produtosReais[(cotacao.id + indice + 4) % produtosReais.length];
  const quantidade = 6 + ((cotacao.id + indice) % 5);
  const precoInformado = referencia.precoPadrao + indice * 55 + cotacao.id * 20;
  const receitaBruta = quantidade * precoInformado;
  const precoMeta = referencia.precoMeta;
  const precoMinimo = referencia.precoMinimo;
  const receitaLiquidaAposIcms = receitaBruta * (1 - 0.12);
  const dentroDaPolitica = precoInformado >= precoMinimo;
  const statusAprovacao: ProdutoCotacaoDetalhada["statusAprovacao"] = dentroDaPolitica
    ? "Dentro da política"
    : "Abaixo da política";
  const planoMisturaAtivo = indice === 0;
  const volumeToneladas = 12 + indice * 4;
  const precoPorTonelada = precoMeta;
  const fretePorTonelada = indice === 0 ? 120 : 95;
  const icmsPercentual = 12;
  const pisPercentual = 1.65;
  const cofinsPercentual = 7.6;
  const aliquotaTotal = icmsPercentual + pisPercentual + cofinsPercentual;
  const margemReposicao = ((precoInformado - referencia.custoReposicao) / precoInformado) * 100;
  const margemMedio = ((precoInformado - referencia.custoMedio) / precoInformado) * 100;
  const margemMaiorLote = ((precoInformado - referencia.custoMaiorLote) / precoInformado) * 100;
  const margemSimulada = ((precoInformado - referencia.custoSimulado) / precoInformado) * 100;
  const diferencaPrecoMinimo = precoInformado - precoMinimo;
  const composicaoMistura = planoMisturaAtivo
    ? materiaisMisturaMock.map((material, materialIndex) => ({
        ...material,
        percentual: materialIndex === 0 ? 50 : materialIndex === 1 ? 30 : 20,
        custoPorTonelada: material.custoPorTonelada + indice * 25,
      }))
    : [];
  const custoMisturaPorTonelada = planoMisturaAtivo
    ? composicaoMistura.reduce(
        (acumulador, material) => acumulador + (material.percentual / 100) * material.custoPorTonelada,
        0,
      )
    : null;
  const receitaBrutaMistura = planoMisturaAtivo ? volumeToneladas * precoPorTonelada : null;
  const impostosSobreReceita = planoMisturaAtivo && receitaBrutaMistura
    ? receitaBrutaMistura * (aliquotaTotal / 100)
    : null;
  const receitaLiquidaMistura = planoMisturaAtivo && receitaBrutaMistura && impostosSobreReceita !== null
    ? receitaBrutaMistura - impostosSobreReceita
    : null;
  const custoTotalMistura = planoMisturaAtivo && custoMisturaPorTonelada !== null
    ? (custoMisturaPorTonelada + fretePorTonelada) * volumeToneladas
    : null;
  const lucroBrutoMistura = receitaLiquidaMistura !== null && custoTotalMistura !== null
    ? receitaLiquidaMistura - custoTotalMistura
    : null;
  const margemMistura = receitaLiquidaMistura !== null && lucroBrutoMistura !== null && receitaLiquidaMistura > 0
    ? (lucroBrutoMistura / receitaLiquidaMistura) * 100
    : null;

  return {
    id: cotacao.id * 10 + indice + 1,
    nome,
    consumo: `${(0.2 + indice * 0.15).toFixed(3)} ton - ${indice === 0 ? "Mensal" : "Sob demanda"}`,
    frequencia: indice === 0 ? "Mensal" : "Quinzenal",
    statusAprovacao,
    codigo,
    icms: icmsPercentual,
    embalagem: indice === 0 ? "Saco 25kg" : "Granel",
    entregaPrevista: entregasPrevistasMock[(cotacao.id + indice) % entregasPrevistasMock.length],
    quantidade,
    precoInformado,
    precoMeta,
    precoMinimo,
    receitaBruta,
    anexo: `anexo-${cotacao.codigo.toLowerCase()}-${indice + 1}.pdf`,
    observacao: indice === 0
      ? "Condição comercial principal avaliada pela gestão de margem."
      : "Linha complementar com necessidade de validação de prazo e frete.",
    custoReposicao: referencia.custoReposicao,
    margemReposicao,
    custoMedio: referencia.custoMedio,
    margemMedio,
    custoMaiorLote: referencia.custoMaiorLote,
    margemMaiorLote,
    custoSimulado: referencia.custoSimulado,
    margemSimulada,
    receitaLiquidaAposIcms,
    planoMisturaAtivo,
    volumeToneladas,
    precoPorTonelada,
    fretePorTonelada,
    aliquotaTotal,
    icmsPercentual,
    pisPercentual,
    cofinsPercentual,
    composicaoMistura,
    produtoAnalisado: planoMisturaAtivo ? "SILÍCIO" : "",
    contidoPercentual: planoMisturaAtivo ? 92 : null,
    receitaBrutaMistura,
    impostosSobreReceita,
    receitaLiquidaMistura,
    custoMisturaPorTonelada,
    custoTotalMistura,
    lucroBrutoMistura,
    margemMistura,
    diferencaPrecoMinimo,
    dentroDaPolitica,
  };
}

function buildProdutoDetalhado(cotacao: CotacaoBase) {
  return criarProdutoDetalhado(cotacao, 0);
}

function buildCotacaoDetalhada(cotacao: CotacaoBase): CotacaoDetalhada {
  return {
    id: cotacao.id,
    codigo: cotacao.codigo,
    cliente: cotacao.cliente,
    contatoPrincipal: contatosPrincipaisMock[(cotacao.id - 1) % contatosPrincipaisMock.length],
    responsavel: cotacao.responsavel,
    vendedorResponsavel: cotacao.responsavel,
    etapa: cotacao.etapa,
    dataAtualizacao: cotacao.dataAtualizacao,
    nomeOportunidade: `Cotação comercial ${cotacao.codigo}`,
    origemOportunidade: origensOportunidadeMock[(cotacao.id - 1) % origensOportunidadeMock.length],
    observacoesIniciais: observacoesIniciaisMock[(cotacao.id - 1) % observacoesIniciaisMock.length],
    necessidadeIdentificada: necessidadesIdentificadasMock[(cotacao.id - 1) % necessidadesIdentificadasMock.length],
    tipoFrete: cotacao.id % 2 === 0 ? "FOB" : "CIF",
    valorFrete: cotacao.id % 2 === 0 ? 860 : 540,
    condicaoPagamento: condicoesPagamentoMock[(cotacao.id - 1) % condicoesPagamentoMock.length],
    filialFaturamento: filiaisFaturamentoMock[(cotacao.id - 1) % filiaisFaturamentoMock.length],
    dataRetorno: new Date(new Date(`${cotacao.dataAtualizacao}T00:00:00`).getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
    statusAprovacao: cotacao.statusAprovacao,
    observacaoAprovacao: cotacao.observacaoAprovacao,
    produto: buildProdutoDetalhado(cotacao),
  };
}

export function AvaliarCotacoesPendentesView({
  onBackToMain,
}: AvaliarCotacoesPendentesViewProps) {
  const [selectedCotacaoId, setSelectedCotacaoId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [acaoSelecionada, setAcaoSelecionada] = useState<AcaoAvaliacao | null>(null);
  const [parecerGestor, setParecerGestor] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [feedback, setFeedback] = useState("");

  const cotacoesPendentes = useMemo(() => {
    return cotacoesMock.filter(
      (cotacao) => cotacao.statusAprovacao === "aguardando_aprovacao",
    );
  }, [refreshKey]);

  const selectedCotacao = useMemo(() => {
    if (!selectedCotacaoId) {
      return null;
    }

    return cotacoesMock.find((cotacao) => cotacao.id === selectedCotacaoId) ?? null;
  }, [refreshKey, selectedCotacaoId]);

  const cotacaoDetalhada = useMemo(() => {
    if (!selectedCotacao) {
      return null;
    }

    return buildCotacaoDetalhada(selectedCotacao);
  }, [selectedCotacao]);

  const comentarioValido = parecerGestor.trim().length > 0;
  const canConfirmDecision =
    acaoSelecionada === "aprovar" ||
    ((acaoSelecionada === "solicitar_ajuste" || acaoSelecionada === "reprovar") && comentarioValido);

  const handleOpenCotacao = (cotacao: CotacaoBase) => {
    setSelectedCotacaoId(cotacao.id);
    setAcaoSelecionada(null);
    setParecerGestor("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCotacaoId(null);
    setAcaoSelecionada(null);
    setParecerGestor("");
  };

  const handleConfirmDecision = () => {
    if (!selectedCotacao) {
      return;
    }

    if ((acaoSelecionada === "solicitar_ajuste" || acaoSelecionada === "reprovar") && !comentarioValido) {
      return;
    }

    const cotacaoAtual = cotacoesMock.find(
      (cotacao) => cotacao.id === selectedCotacao.id,
    );

    if (!cotacaoAtual || !acaoSelecionada) {
      return;
    }

    let novoStatus: CotacaoApprovalStatus = cotacaoAtual.statusAprovacao;
    let novaEtapa = cotacaoAtual.etapa;
    let novaObservacao = cotacaoAtual.observacaoAprovacao;

    if (acaoSelecionada === "aprovar") {
      novoStatus = "aprovado_manualmente";
      novaEtapa = "COTACAO APROVADA";
      novaObservacao = "Cotação aprovada manualmente após análise do gestor.";
    }

    if (acaoSelecionada === "solicitar_ajuste") {
      novoStatus = "em_edicao_ajuste_solicitado";
      novaEtapa = "AGUARDANDO REVISAO";
      novaObservacao = parecerGestor.trim();
    }

    if (acaoSelecionada === "reprovar") {
      novoStatus = "reprovado";
      novaEtapa = "PERDIDA";
      novaObservacao = parecerGestor.trim();
    }

    cotacaoAtual.statusAprovacao = novoStatus;
    cotacaoAtual.etapa = novaEtapa;
    cotacaoAtual.observacaoAprovacao = novaObservacao;

    setRefreshKey((previous) => previous + 1);
    setFeedback(
      `Cotação ${cotacaoAtual.codigo} atualizada para ${getCotacaoApprovalMeta(novoStatus).label.toLowerCase()}.`,
    );
    handleCloseModal();
  };

  const approvalMeta = cotacaoDetalhada
    ? getCotacaoApprovalMeta(cotacaoDetalhada.statusAprovacao)
    : null;

  return (
    <div className="h-full bg-slate-50 overflow-auto">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <ChevronRight className="w-4 h-4" />
              <span>Menu principal</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Avaliar cotações pendentes</span>
            </div>
            <h1 className="text-2xl text-slate-900">Avaliar cotações pendentes</h1>
            <p className="text-sm text-slate-500 mt-1">
              Selecione uma cotação pendente para revisar formulário, cálculos e registrar o parecer.
            </p>
          </div>
          <button
            onClick={onBackToMain}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao menu
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Cotações pendentes de aprovação</h2>

          {feedback && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-sm px-4 py-2">
              {feedback}
            </div>
          )}

          {cotacoesPendentes.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Não há cotações pendentes de aprovação no momento.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left px-4 py-3">Código</th>
                    <th className="text-left px-4 py-3">Cliente</th>
                    <th className="text-left px-4 py-3">Responsável</th>
                    <th className="text-left px-4 py-3">Valor</th>
                    <th className="text-left px-4 py-3">Atualização</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {cotacoesPendentes.map((cotacao) => {
                    const approvalMeta = getCotacaoApprovalMeta(cotacao.statusAprovacao);
                    return (
                      <tr key={cotacao.id} className="border-t border-slate-200">
                        <td className="px-4 py-3 text-slate-900">{cotacao.codigo}</td>
                        <td className="px-4 py-3 text-slate-900">{cotacao.cliente}</td>
                        <td className="px-4 py-3 text-slate-700">{cotacao.responsavel}</td>
                        <td className="px-4 py-3 text-slate-700">{toCurrency(cotacao.valor)}</td>
                        <td className="px-4 py-3 text-slate-700">{toDate(cotacao.dataAtualizacao)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${approvalMeta.className}`}
                          >
                            {approvalMeta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleOpenCotacao(cotacao)}
                            className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                          >
                            Avaliar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <Dialog open={modalOpen} onOpenChange={(open) => (open ? setModalOpen(true) : handleCloseModal())}>
        <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da cotação para avaliação</DialogTitle>
            <DialogDescription>
              Revise o resumo da oportunidade, os dados comerciais e a análise por produto antes de decidir.
            </DialogDescription>
          </DialogHeader>

          {cotacaoDetalhada && approvalMeta && (
            <div className="space-y-5">
              <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Status atual da cotação</p>
                    <h3 className="mt-1 text-sm font-medium text-slate-900">{cotacaoDetalhada.codigo}</h3>
                    <p className="text-xs text-slate-500 mt-1">{cotacaoDetalhada.nomeOportunidade}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${approvalMeta.className}`}>
                      {approvalMeta.label}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                      Atualizada em {toDate(cotacaoDetalhada.dataAtualizacao)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                    <h4 className="text-sm font-medium text-slate-900">Resumo do cliente e da oportunidade</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Nome do cliente</p>
                        <p className="mt-1 text-slate-900">{cotacaoDetalhada.cliente}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Contato principal</p>
                        <p className="mt-1 text-slate-900">{cotacaoDetalhada.contatoPrincipal}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Vendedor responsável</p>
                        <p className="mt-1 text-slate-900">{cotacaoDetalhada.vendedorResponsavel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Origem da oportunidade</p>
                        <p className="mt-1 text-slate-900">{cotacaoDetalhada.origemOportunidade}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-slate-500">Observações iniciais</p>
                        <p className="mt-1 text-slate-900">{cotacaoDetalhada.observacoesIniciais}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-slate-500">Necessidade identificada</p>
                        <p className="mt-1 text-slate-900">{cotacaoDetalhada.necessidadeIdentificada}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                    <h4 className="text-sm font-medium text-slate-900">Informações comerciais da cotação</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Tipo de frete</p>
                        <p className="mt-1 text-slate-900">{cotacaoDetalhada.tipoFrete}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Valor do frete</p>
                        <p className="mt-1 text-slate-900">{toCurrency(cotacaoDetalhada.valorFrete)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Condição de pagamento</p>
                        <p className="mt-1 text-slate-900">{cotacaoDetalhada.condicaoPagamento}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Filial de faturamento</p>
                        <p className="mt-1 text-slate-900">{cotacaoDetalhada.filialFaturamento}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Data de retorno</p>
                        <p className="mt-1 text-slate-900">{cotacaoDetalhada.dataRetorno}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Etapa</p>
                        <p className="mt-1 text-slate-900">{cotacaoDetalhada.etapa}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-medium text-slate-900">Produto cotado</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      A análise abaixo consolida todos os dados comerciais e de margem do único produto desta cotação.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                    1 produto
                  </span>
                </div>

                {(() => {
                  const produto = cotacaoDetalhada.produto;
                  const statusClasse = produto.dentroDaPolitica
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700";

                  return (
                    <details className="rounded-xl border border-slate-200 bg-white shadow-sm" open>
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-xl bg-slate-50 px-4 py-4 [&::-webkit-details-marker]:hidden">
                        <div>
                          <p className="text-xs text-slate-500">Cabeçalho do produto</p>
                          <h4 className="mt-1 text-sm font-medium text-slate-900">{produto.nome}</h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Consumo: {produto.consumo} | Frequência: {produto.frequencia}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${statusClasse}`}>
                            {produto.statusAprovacao}
                          </span>
                          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${statusClasse}`}>
                            {produto.dentroDaPolitica ? "Dentro da política" : "Abaixo da política"}
                          </span>
                        </div>
                      </summary>

                      <div className="space-y-4 p-4">
                        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <h5 className="text-sm font-medium text-slate-900 mb-3">Dados comerciais do produto</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
                            <div><p className="text-xs text-slate-500">Código</p><p className="mt-1 text-slate-900">{produto.codigo}</p></div>
                            <div><p className="text-xs text-slate-500">ICMS</p><p className="mt-1 text-slate-900">{toPercent(produto.icms)}</p></div>
                            <div><p className="text-xs text-slate-500">Embalagem</p><p className="mt-1 text-slate-900">{produto.embalagem}</p></div>
                            <div><p className="text-xs text-slate-500">Entrega prevista</p><p className="mt-1 text-slate-900">{produto.entregaPrevista}</p></div>
                            <div><p className="text-xs text-slate-500">Quantidade</p><p className="mt-1 text-slate-900">{produto.quantidade} ton</p></div>
                            <div><p className="text-xs text-slate-500">Preço informado</p><p className="mt-1 text-slate-900">{toCurrency(produto.precoInformado)}</p></div>
                            <div><p className="text-xs text-slate-500">Preço meta</p><p className="mt-1 text-slate-900">{toCurrency(produto.precoMeta)}</p></div>
                            <div><p className="text-xs text-slate-500">Preço mínimo</p><p className="mt-1 text-slate-900">{toCurrency(produto.precoMinimo)}</p></div>
                            <div><p className="text-xs text-slate-500">Receita bruta</p><p className="mt-1 text-slate-900">{toCurrency(produto.receitaBruta)}</p></div>
                            <div><p className="text-xs text-slate-500">Anexo</p><p className="mt-1 text-slate-900 break-all">{produto.anexo}</p></div>
                            <div className="md:col-span-2 xl:col-span-2"><p className="text-xs text-slate-500">Observação</p><p className="mt-1 text-slate-900">{produto.observacao}</p></div>
                          </div>
                        </section>

                        <section className="rounded-lg border border-slate-200 bg-white p-4">
                          <h5 className="text-sm font-medium text-slate-900 mb-3">Resultado da análise comercial</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><p className="text-xs text-slate-500">Custo reposição</p><p className="mt-1 text-slate-900">{toCurrency(produto.custoReposicao)}</p></div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><p className="text-xs text-slate-500">Margem reposição</p><p className="mt-1 text-slate-900">{toPercent(produto.margemReposicao)}</p></div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><p className="text-xs text-slate-500">Custo médio</p><p className="mt-1 text-slate-900">{toCurrency(produto.custoMedio)}</p></div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><p className="text-xs text-slate-500">Margem média</p><p className="mt-1 text-slate-900">{toPercent(produto.margemMedio)}</p></div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><p className="text-xs text-slate-500">Custo maior lote</p><p className="mt-1 text-slate-900">{toCurrency(produto.custoMaiorLote)}</p></div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><p className="text-xs text-slate-500">Margem maior lote</p><p className="mt-1 text-slate-900">{toPercent(produto.margemMaiorLote)}</p></div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><p className="text-xs text-slate-500">Custo simulado</p><p className="mt-1 text-slate-900">{toCurrency(produto.custoSimulado)}</p></div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><p className="text-xs text-slate-500">Margem simulada</p><p className="mt-1 text-slate-900">{toPercent(produto.margemSimulada)}</p></div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 xl:col-span-2"><p className="text-xs text-slate-500">Receita líquida após ICMS</p><p className="mt-1 text-slate-900">{toCurrency(produto.receitaLiquidaAposIcms)}</p></div>
                          </div>
                        </section>

                        <section className="rounded-lg border border-slate-200 bg-white p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <h5 className="text-sm font-medium text-slate-900">Plano de misturas</h5>
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${produto.planoMisturaAtivo ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                              {produto.planoMisturaAtivo ? "Sim" : "Não"}
                            </span>
                          </div>

                          {produto.planoMisturaAtivo ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 text-sm">
                                <div><p className="text-xs text-slate-500">Volume em toneladas</p><p className="mt-1 text-slate-900">{produto.volumeToneladas} ton</p></div>
                                <div><p className="text-xs text-slate-500">Preço por tonelada</p><p className="mt-1 text-slate-900">{toCurrency(produto.precoPorTonelada)}</p></div>
                                <div><p className="text-xs text-slate-500">Frete por tonelada</p><p className="mt-1 text-slate-900">{toCurrency(produto.fretePorTonelada)}</p></div>
                                <div><p className="text-xs text-slate-500">Alíquota total</p><p className="mt-1 text-slate-900">{toPercent(produto.aliquotaTotal)}</p></div>
                                <div><p className="text-xs text-slate-500">ICMS / PIS / COFINS</p><p className="mt-1 text-slate-900">{toPercent(produto.icmsPercentual)} | {toPercent(produto.pisPercentual)} | {toPercent(produto.cofinsPercentual)}</p></div>
                              </div>

                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <p className="text-xs text-slate-500">Produto analisado</p>
                                    <p className="mt-1 text-slate-900">{produto.produtoAnalisado || "-"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-500">CONTIDO (%)</p>
                                    <p className="mt-1 text-slate-900">{produto.contidoPercentual !== null ? toPercent(produto.contidoPercentual) : "-"}</p>
                                  </div>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                                  <table className="min-w-full text-sm">
                                    <thead className="bg-slate-100 text-slate-600">
                                      <tr>
                                        <th className="px-3 py-2 text-left font-medium">Material</th>
                                        <th className="px-3 py-2 text-left font-medium">Percentual (%)</th>
                                        <th className="px-3 py-2 text-left font-medium">Custo (R$/ton)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {produto.composicaoMistura.map((material) => (
                                        <tr key={material.material} className="border-t border-slate-200">
                                          <td className="px-3 py-2 text-slate-900">{material.material}</td>
                                          <td className="px-3 py-2 text-slate-700">{toPercent(material.percentual)}</td>
                                          <td className="px-3 py-2 text-slate-700">{toCurrency(material.custoPorTonelada)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 text-sm">
                                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2"><p className="text-xs text-slate-500">Receita bruta</p><p className="mt-1 text-slate-900">{produto.receitaBrutaMistura !== null ? toCurrency(produto.receitaBrutaMistura) : "-"}</p></div>
                                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2"><p className="text-xs text-slate-500">Impostos sobre receita</p><p className="mt-1 text-slate-900">{produto.impostosSobreReceita !== null ? toCurrency(produto.impostosSobreReceita) : "-"}</p></div>
                                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2"><p className="text-xs text-slate-500">Receita líquida</p><p className="mt-1 text-slate-900">{produto.receitaLiquidaMistura !== null ? toCurrency(produto.receitaLiquidaMistura) : "-"}</p></div>
                                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2"><p className="text-xs text-slate-500">Custo da mistura por tonelada</p><p className="mt-1 text-slate-900">{produto.custoMisturaPorTonelada !== null ? toCurrency(produto.custoMisturaPorTonelada) : "-"}</p></div>
                                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2"><p className="text-xs text-slate-500">Custo total</p><p className="mt-1 text-slate-900">{produto.custoTotalMistura !== null ? toCurrency(produto.custoTotalMistura) : "-"}</p></div>
                                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2"><p className="text-xs text-slate-500">Lucro bruto</p><p className="mt-1 text-slate-900">{produto.lucroBrutoMistura !== null ? toCurrency(produto.lucroBrutoMistura) : "-"}</p></div>
                                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2"><p className="text-xs text-slate-500">Margem</p><p className="mt-1 text-slate-900">{produto.margemMistura !== null ? toPercent(produto.margemMistura) : "-"}</p></div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-600">
                              Plano de misturas desativado para este produto. Mantida apenas a análise comercial.
                            </p>
                          )}
                        </section>

                        <section className="rounded-lg border border-slate-200 bg-white p-4">
                          <h5 className="text-sm font-medium text-slate-900 mb-3">Validação de preço mínimo</h5>
                          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
                              <div><p className="text-xs text-slate-500">Preço informado</p><p className="mt-1 text-slate-900">{toCurrency(produto.precoInformado)}</p></div>
                              <div><p className="text-xs text-slate-500">Preço mínimo</p><p className="mt-1 text-slate-900">{toCurrency(produto.precoMinimo)}</p></div>
                              <div><p className="text-xs text-slate-500">Diferença</p><p className={`mt-1 ${produto.diferencaPrecoMinimo >= 0 ? "text-emerald-700" : "text-amber-700"}`}>{toSignedCurrency(produto.diferencaPrecoMinimo)}</p></div>
                              <div><p className="text-xs text-slate-500">Status</p><p className="mt-1 text-slate-900">{produto.dentroDaPolitica ? "Dentro da política" : "Abaixo da política"}</p></div>
                            </div>
                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${produto.dentroDaPolitica ? "border-emerald-200 bg-emerald-100 text-emerald-700" : "border-amber-200 bg-amber-100 text-amber-700"}`}>
                              {produto.dentroDaPolitica ? "Aprovável pela política" : "Abaixo da política"}
                            </span>
                          </div>
                        </section>
                      </div>
                    </details>
                  );
                })()}
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                <div>
                  <h3 className="text-base font-medium text-slate-900">Decisão do gestor</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Aprovada, ajustada ou reprovada com base na leitura completa da cotação por produto.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setAcaoSelecionada("aprovar")}
                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                      acaoSelecionada === "aprovar"
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-sm text-slate-900">Aprovar</p>
                    <p className="text-xs text-slate-500 mt-1">Aprovação manual da cotação.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAcaoSelecionada("solicitar_ajuste")}
                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                      acaoSelecionada === "solicitar_ajuste"
                        ? "border-orange-300 bg-orange-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-sm text-slate-900">Solicitar ajuste</p>
                    <p className="text-xs text-slate-500 mt-1">Retorna para revisão com parecer obrigatório.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAcaoSelecionada("reprovar")}
                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                      acaoSelecionada === "reprovar"
                        ? "border-rose-300 bg-rose-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-sm text-slate-900">Reprovar</p>
                    <p className="text-xs text-slate-500 mt-1">Encerra a análise com parecer obrigatório.</p>
                  </button>
                </div>

                {(acaoSelecionada === "solicitar_ajuste" || acaoSelecionada === "reprovar") && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Parecer do gestor *</label>
                    <textarea
                      rows={4}
                      value={parecerGestor}
                      onChange={(event) => setParecerGestor(event.target.value)}
                      placeholder={
                        acaoSelecionada === "solicitar_ajuste"
                          ? "Explique o que precisa ser ajustado"
                          : "Registre o motivo da reprovação"
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                )}
              </section>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDecision}
              disabled={!canConfirmDecision}
              className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirmar decisão
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
