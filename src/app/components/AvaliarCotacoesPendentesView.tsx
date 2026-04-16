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
  responsavel: string;
  etapa: string;
  dataAtualizacao: string;
  nomeOportunidade: string;
  produtoServico: string;
  quantidade: number;
  unidade: string;
  valorEstimado: number;
  prazoDesejado: string;
  origemOportunidade: string;
  observacoesComerciais: string;
  necessidadeCliente: string;
  statusAprovacao: CotacaoApprovalStatus;
  observacaoAprovacao: string;
  custoProduto: number;
  custoLogistico: number;
  descontoAplicado: number;
  impostosEstimados: number;
  precoFinalSugerido: number;
  precoMinimoReferencia: number;
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

function buildCotacaoDetalhada(cotacao: CotacaoBase): CotacaoDetalhada {
  const quantidade = 6 + (cotacao.id % 7);
  const valorEstimado = cotacao.valor;
  const precoFinalSugerido = Math.round(valorEstimado / quantidade);
  const custoProduto = Math.round(precoFinalSugerido * 0.36);
  const custoLogistico = Math.round(precoFinalSugerido * 0.05);
  const descontoAplicado = cotacao.id % 2 === 0 ? 5 : 3;
  const impostosEstimados = 12;
  const precoMinimoReferencia = 2600;
  const approvalMeta = getCotacaoApprovalMeta(cotacao.statusAprovacao);

  return {
    id: cotacao.id,
    codigo: cotacao.codigo,
    cliente: cotacao.cliente,
    responsavel: cotacao.responsavel,
    etapa: cotacao.etapa,
    dataAtualizacao: cotacao.dataAtualizacao,
    nomeOportunidade: `Cotação comercial ${cotacao.codigo}`,
    produtoServico: produtosReais[(cotacao.id - 1) % produtosReais.length],
    quantidade,
    unidade: "Unidade",
    valorEstimado,
    prazoDesejado: cotacao.dataAtualizacao,
    origemOportunidade: "Canal comercial",
    observacoesComerciais:
      "Cotação gerada com base no histórico de relacionamento e condições comerciais vigentes.",
    necessidadeCliente:
      "Atender à demanda com previsibilidade de custo, prazo e suporte comercial contínuo.",
    statusAprovacao: cotacao.statusAprovacao,
    observacaoAprovacao: cotacao.observacaoAprovacao,
    custoProduto,
    custoLogistico,
    descontoAplicado,
    impostosEstimados,
    precoFinalSugerido,
    precoMinimoReferencia,
  };
}

export function AvaliarCotacoesPendentesView({
  onBackToMain,
}: AvaliarCotacoesPendentesViewProps) {
  const [selectedCotacaoId, setSelectedCotacaoId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [acaoSelecionada, setAcaoSelecionada] = useState<AcaoAvaliacao | null>(null);
  const [comentarioGestor, setComentarioGestor] = useState("");
  const [justificativaReprovacao, setJustificativaReprovacao] = useState("");
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

  const comentarioValido = comentarioGestor.trim().length > 0;
  const justificativaValida = justificativaReprovacao.trim().length > 0;
  const canConfirmDecision =
    acaoSelecionada === "aprovar" ||
    (acaoSelecionada === "solicitar_ajuste" && comentarioValido) ||
    (acaoSelecionada === "reprovar" && justificativaValida);

  const handleOpenCotacao = (cotacao: CotacaoBase) => {
    setSelectedCotacaoId(cotacao.id);
    setAcaoSelecionada(null);
    setComentarioGestor("");
    setJustificativaReprovacao("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCotacaoId(null);
    setAcaoSelecionada(null);
    setComentarioGestor("");
    setJustificativaReprovacao("");
  };

  const handleConfirmDecision = () => {
    if (!selectedCotacao) {
      return;
    }

    if (acaoSelecionada === "solicitar_ajuste" && !comentarioValido) {
      return;
    }

    if (acaoSelecionada === "reprovar" && !justificativaValida) {
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
      novaObservacao = comentarioGestor.trim();
    }

    if (acaoSelecionada === "reprovar") {
      novoStatus = "reprovado";
      novaEtapa = "PERDIDA";
      novaObservacao = justificativaReprovacao.trim();
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

  const impostoValor = cotacaoDetalhada
    ? (cotacaoDetalhada.precoFinalSugerido * cotacaoDetalhada.impostosEstimados) / 100
    : 0;
  const descontoValor = cotacaoDetalhada
    ? (cotacaoDetalhada.precoFinalSugerido * cotacaoDetalhada.descontoAplicado) / 100
    : 0;
  const custoTotal = cotacaoDetalhada
    ? cotacaoDetalhada.custoProduto + cotacaoDetalhada.custoLogistico + impostoValor
    : 0;
  const margemValor = cotacaoDetalhada
    ? cotacaoDetalhada.precoFinalSugerido - custoTotal - descontoValor
    : 0;
  const margemPercentual = cotacaoDetalhada
    ? cotacaoDetalhada.precoFinalSugerido > 0
      ? (margemValor / cotacaoDetalhada.precoFinalSugerido) * 100
      : 0
    : 0;
  const diferencaPrecoMinimo = cotacaoDetalhada
    ? cotacaoDetalhada.precoFinalSugerido - cotacaoDetalhada.precoMinimoReferencia
    : 0;
  const dentroDaPoliticaPreco = cotacaoDetalhada
    ? cotacaoDetalhada.precoFinalSugerido >= cotacaoDetalhada.precoMinimoReferencia
    : false;
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da cotação para avaliação</DialogTitle>
            <DialogDescription>
              Revise o formulário e os cálculos da cotação selecionada e finalize com o parecer.
            </DialogDescription>
          </DialogHeader>

          {cotacaoDetalhada && (
            <div className="space-y-5">
              <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Status atual</p>
                    <h3 className="text-sm text-slate-900 mt-1">
                      {getCotacaoApprovalMeta(cotacaoDetalhada.statusAprovacao).label}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${getCotacaoApprovalMeta(cotacaoDetalhada.statusAprovacao).className}`}
                  >
                    {getCotacaoApprovalMeta(cotacaoDetalhada.statusAprovacao).label}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {getCotacaoApprovalMeta(cotacaoDetalhada.statusAprovacao).context}
                </p>
                <p className="mt-2 text-sm text-slate-600">{cotacaoDetalhada.observacaoAprovacao}</p>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="text-sm text-slate-900 mb-3">Formulário da cotação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Código</p>
                    <p className="text-slate-900 mt-1">{cotacaoDetalhada.codigo}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Cliente</p>
                    <p className="text-slate-900 mt-1">{cotacaoDetalhada.cliente}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Nome da oportunidade</p>
                    <p className="text-slate-900 mt-1">{cotacaoDetalhada.nomeOportunidade}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Produto / serviço</p>
                    <p className="text-slate-900 mt-1">{cotacaoDetalhada.produtoServico}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Quantidade</p>
                    <p className="text-slate-900 mt-1">
                      {cotacaoDetalhada.quantidade} {cotacaoDetalhada.unidade}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Prazo desejado</p>
                    <p className="text-slate-900 mt-1">{toDate(cotacaoDetalhada.prazoDesejado)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Origem da oportunidade</p>
                    <p className="text-slate-900 mt-1">{cotacaoDetalhada.origemOportunidade}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Responsável</p>
                    <p className="text-slate-900 mt-1">{cotacaoDetalhada.responsavel}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-slate-500">Observações comerciais</p>
                    <p className="text-slate-900 mt-1">{cotacaoDetalhada.observacoesComerciais}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-slate-500">Necessidade do cliente</p>
                    <p className="text-slate-900 mt-1">{cotacaoDetalhada.necessidadeCliente}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="text-sm text-slate-900 mb-3">Cálculos comerciais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Valor estimado</p>
                    <p className="text-slate-900 mt-1">{toCurrency(cotacaoDetalhada.valorEstimado)}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Preço final sugerido</p>
                    <p className="text-slate-900 mt-1">{toCurrency(cotacaoDetalhada.precoFinalSugerido)}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Custo do produto</p>
                    <p className="text-slate-900 mt-1">{toCurrency(cotacaoDetalhada.custoProduto)}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Custo logístico</p>
                    <p className="text-slate-900 mt-1">{toCurrency(cotacaoDetalhada.custoLogistico)}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Impostos estimados</p>
                    <p className="text-slate-900 mt-1">{toCurrency(impostoValor)}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Desconto aplicado</p>
                    <p className="text-slate-900 mt-1">{toCurrency(descontoValor)}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Custo total</p>
                    <p className="text-slate-900 mt-1">{toCurrency(custoTotal)}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Margem estimada</p>
                    <p className="text-slate-900 mt-1">{toCurrency(margemValor)}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Percentual de margem</p>
                    <p className="text-slate-900 mt-1">{margemPercentual.toFixed(2)}%</p>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="text-sm text-slate-900 mb-3">Validação de preço mínimo</h3>
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-slate-500 text-sm">Resumo</p>
                    <p className="text-slate-900 mt-1">Preço final: {toCurrency(cotacaoDetalhada.precoFinalSugerido)}</p>
                    <p className="text-slate-900 mt-1">Preço mínimo: {toCurrency(cotacaoDetalhada.precoMinimoReferencia)}</p>
                    <p className={`text-sm mt-1 ${diferencaPrecoMinimo >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
                      Diferença: {toCurrency(diferencaPrecoMinimo)}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${dentroDaPoliticaPreco ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                    {dentroDaPoliticaPreco ? "Dentro da política" : "Abaixo do preço mínimo"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {dentroDaPoliticaPreco
                    ? "Cotação dentro da política de preço mínimo."
                    : "A cotação deverá seguir para aprovação."}
                </p>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
                <div>
                  <h3 className="text-sm text-slate-900 mb-2">Decisão do gestor</h3>
                  <p className="text-sm text-slate-500">
                    Escolha a ação que melhor representa o parecer sobre a cotação.
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
                    <p className="text-xs text-slate-500 mt-1">Retornar para edição com comentário obrigatório.</p>
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
                    <p className="text-xs text-slate-500 mt-1">Encerrar a cotação com justificativa obrigatória.</p>
                  </button>
                </div>

                {acaoSelecionada === "solicitar_ajuste" && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Comentário do gestor *
                    </label>
                    <textarea
                      rows={4}
                      value={comentarioGestor}
                      onChange={(event) => setComentarioGestor(event.target.value)}
                      placeholder="Explique o que precisa ser ajustado"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                )}

                {acaoSelecionada === "reprovar" && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Justificativa da reprovação *
                    </label>
                    <textarea
                      rows={4}
                      value={justificativaReprovacao}
                      onChange={(event) => setJustificativaReprovacao(event.target.value)}
                      placeholder="Registre o motivo da reprovação"
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
