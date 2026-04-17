import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Mail, Send } from "lucide-react";
import {
  cotacoesMock,
  type CotacaoAtualizacaoLocal,
} from "./ListaCotacoesView";
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

interface CotacaoCompletaViewProps {
  cotacaoId: number | null;
  onBackToCotacoes: () => void;
  cotacaoAtualizacao?: CotacaoAtualizacaoLocal;
  onMarcarComoPerdida?: (
    cotacaoId: number,
    payload: { motivoPerda: string; dataEncerramento: string },
  ) => void;
  onGerarPedido?: () => void;
}

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
  motivoPerda?: string;
  dataEncerramento?: string;
  numeroPedido?: string;
  dataPedido?: string;
  ocGerada?: boolean;
}

type TipoInteracaoFollowUp =
  | "ligacao"
  | "email"
  | "whatsapp"
  | "reuniao"
  | "observacao_interna";

interface InteracaoFollowUp {
  id: number;
  tipo: TipoInteracaoFollowUp;
  data: string;
  responsavel: string;
  resumo: string;
  proximoPasso: string;
  criadaEm: string;
}

type AbaDetalhesCotacao = "principal" | "followup";

type MotivoPerdaCotacao =
  | "Preço"
  | "Concorrência"
  | "Prazo"
  | "Cliente desistiu"
  | "Sem retorno"
  | "Produto fora do escopo"
  | "Outro";

const motivosPerdaMock: MotivoPerdaCotacao[] = [
  "Preço",
  "Concorrência",
  "Prazo",
  "Cliente desistiu",
  "Sem retorno",
  "Produto fora do escopo",
  "Outro",
];

const produtosReais = [
  "Níquel  Placas",
  "Níquel Catodos",
  "Níquel Full Plate Plating",
  "Coque Metalúrgico Leve",
  "Grafite",
  "Carbeto de Silício",
  "Silício Metálico (SiMe), Rebarba, 10-60mm",
  "Cálcio Silício (CaSi)",
  "Zinco",
  "Tungstênio Metálico",
  "Ferro Molibidênio 0,55 <325 Mesh",
  "Sucata de Alumínio",
  "Silício Metálico (SiMe)",
  "Silício Metálico Contaminado",
  "Resíduo Amido",
  "Pentóxido de Vanádio",
  "Níquel Rounds",
  "Níquel",
  "Níquel Full Plate",
  "Nucleante  2-10mm",
  "Nucleante  0,5-3,36mm",
  "Molibdenita",
  "Mn Eletrolítico Nitrogenado",
  "Magnésio Metálico",
  "Manganês (Mn)",
  "Inoculante CZ",
  "Inoculante C1BB",
  "Inoculante C1",
  "Grafite  Granulado",
  "Ferro Vanadio",
  "Ferro Vanádio",
  "Ferro Tungstênio",
  "Ferro Titânio",
  "Ferro Silício Zircônio",
  "Ferro Silício Cálcio Alumínio Manganês",
  "Ferro Silício Cálcio Alumínio Estrôncio",
  "Ferro Silício Cálcio Alumínio Bearing",
  "Ferro Silício Cálcio Alumínio Bário",
  "Ferro Silício (FeSi)",
  "Ferro Silico Manganês (FeSiMn)",
  "Ferro Molibdênio",
  "Ferro Manganês (FeMn) M/C",
  "Ferro Manganês (FeMn) B/C",
  "Ferro Manganês (FeMn) A/C",
  "Ferro Fósforo (FeP)",
  "Ferro Cromo (FeCr) B/C Inox",
  "Ferro Cromo (FeCr) B/C",
  "Ferro Cromo (FeCr) A/C",
  "Ferro Boro",
  "FeSiMg CW 13",
  "FeSiMg - Liga 4",
  "FeSiMg - Liga 1",
  "FeSiCaAlBaMn",
  "Escória FeSi",
  "Escória de Ferro",
  "Escória de Silício",
  "Enxofre",
  "Enxofre Seco",
  "Cálcio Silício Manganês",
  "Cálcio Silício (CaSi)  10-60 mm",
  "Cromo Metálico",
  "Cobre Vergalhao Picotado",
  "Concentrado de Cerium",
  "Cobre Vergalhão",
  "Cobalto",
  "Briquete de Lama",
  "Chapelim",
];

function toCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function toDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

function toDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}



function getTodayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

function getTipoInteracaoLabel(tipo: TipoInteracaoFollowUp) {
  switch (tipo) {
    case "ligacao":
      return "Ligação";
    case "email":
      return "E-mail";
    case "whatsapp":
      return "WhatsApp";
    case "reuniao":
      return "Reunião";
    case "observacao_interna":
      return "Observação interna";
    default:
      return tipo;
  }
}

function buildEmailCotacao(cotacao: CotacaoDetalhada) {
  return {
    assunto: `Cotação ${cotacao.codigo} - ${cotacao.cliente}`,
    corpo: [
      "Olá,",
      "",
      `Segue a cotação no status atual: ${cotacao.etapa}.`,
      "",
      `Código: ${cotacao.codigo}`,
      `Cliente: ${cotacao.cliente}`,
      `Responsável: ${cotacao.responsavel}`,
      `Produto / serviço: ${cotacao.produtoServico}`,
      `Quantidade: ${cotacao.quantidade} ${cotacao.unidade}`,
      `Valor estimado: ${toCurrency(cotacao.valorEstimado)}`,
      `Preço final sugerido: ${toCurrency(cotacao.precoFinalSugerido)}`,
      `Prazo desejado: ${toDate(cotacao.prazoDesejado)}`,
      "",
      "Se precisar de ajustes, posso revisar as condições e reenviar uma nova versão.",
      "",
      "Atenciosamente,",
      cotacao.responsavel,
    ].join("\n"),
  };
}

function buildCotacaoDetalhada(
  cotacaoId: number,
  cotacaoAtualizacao?: CotacaoAtualizacaoLocal,
): CotacaoDetalhada | null {
  const base = cotacoesMock.find((item) => item.id === cotacaoId);
  if (!base) {
    return null;
  }

  const quantidade = 6 + (base.id % 7);
  const valorEstimado = base.valor;
  const precoFinalSugerido = Math.round(valorEstimado / quantidade);
  const custoProduto = Math.round(precoFinalSugerido * 0.36);
  const custoLogistico = Math.round(precoFinalSugerido * 0.05);
  const descontoAplicado = base.id % 2 === 0 ? 5 : 3;
  const impostosEstimados = 12;
  const precoMinimoReferencia = 2600;
  const approvalMeta = getCotacaoApprovalMeta(base.statusAprovacao);

  return {
    id: base.id,
    codigo: base.codigo,
    cliente: base.cliente,
    responsavel: base.responsavel,
    etapa: cotacaoAtualizacao?.etapa ?? base.etapa,
    dataAtualizacao: cotacaoAtualizacao?.dataEncerramento
      ? cotacaoAtualizacao.dataEncerramento.slice(0, 10)
      : base.dataAtualizacao,
    nomeOportunidade: `Cotação comercial ${base.codigo}`,
    produtoServico: produtosReais[(base.id - 1) % produtosReais.length],
    quantidade,
    unidade: "Unidade",
    valorEstimado,
    prazoDesejado: base.dataAtualizacao,
    origemOportunidade: "Canal comercial",
    observacoesComerciais:
      "Cotação gerada com base no histórico de relacionamento e condições comerciais vigentes.",
    necessidadeCliente:
      "Atender à demanda com previsibilidade de custo, prazo e suporte comercial contínuo.",
    statusAprovacao: base.statusAprovacao,
    observacaoAprovacao: base.observacaoAprovacao,
    custoProduto,
    custoLogistico,
    descontoAplicado,
    impostosEstimados,
    precoFinalSugerido,
    precoMinimoReferencia,
    motivoPerda: cotacaoAtualizacao?.motivoPerda,
    dataEncerramento: cotacaoAtualizacao?.dataEncerramento,
    numeroPedido: cotacaoAtualizacao?.numeroPedido,
    dataPedido: cotacaoAtualizacao?.dataPedido,
    ocGerada: cotacaoAtualizacao?.ocGerada,
  };
}

function buildInteracoesMock(cotacao: CotacaoDetalhada): InteracaoFollowUp[] {
  if (cotacao.id !== 1) {
    return [];
  }

  return [
    {
      id: 1001,
      tipo: "ligacao",
      data: "2026-04-03",
      responsavel: "Everton",
      resumo:
        "Primeiro contato para confirmar recebimento da proposta e validar prioridade de decisao.",
      proximoPasso: "Enviar e-mail com resumo das condicoes discutidas.",
      criadaEm: "2026-04-03T10:15:00",
    },
    {
      id: 1002,
      tipo: "email",
      data: "2026-04-04",
      responsavel: "Everton",
      resumo:
        "E-mail enviado com condicoes comerciais e detalhamento de prazo de entrega.",
      proximoPasso: "Retomar por WhatsApp em 48 horas para alinhamento final.",
      criadaEm: "2026-04-04T14:35:00",
    },
    {
      id: 1003,
      tipo: "whatsapp",
      data: "2026-04-06",
      responsavel: "Everton",
      resumo:
        "Cliente sinalizou interesse, mas solicitou revisao de prazo para fechamento interno.",
      proximoPasso: "Agendar reuniao curta para decisao comercial.",
      criadaEm: "2026-04-06T09:20:00",
    },
  ];
}

export function CotacaoCompletaView({
  cotacaoId,
  onBackToCotacoes,
  cotacaoAtualizacao,
  onMarcarComoPerdida,
  onGerarPedido,
}: CotacaoCompletaViewProps) {
  const cotacao = cotacaoId
    ? buildCotacaoDetalhada(cotacaoId, cotacaoAtualizacao)
    : null;
  const [emailOpen, setEmailOpen] = useState(false);
  const [destinatarioEmail, setDestinatarioEmail] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [perdaOpen, setPerdaOpen] = useState(false);
  const [motivoPerda, setMotivoPerda] = useState<MotivoPerdaCotacao | "">("");
  const [motivoPerdaOutro, setMotivoPerdaOutro] = useState("");
  const [feedbackPerda, setFeedbackPerda] = useState("");
  const [abaAtiva, setAbaAtiva] = useState<AbaDetalhesCotacao>("principal");
  const [tipoInteracao, setTipoInteracao] =
    useState<TipoInteracaoFollowUp>("ligacao");
  const [dataInteracao, setDataInteracao] = useState(getTodayInputDate());
  const [responsavelInteracao, setResponsavelInteracao] = useState("Everton");
  const [resumoInteracao, setResumoInteracao] = useState("");
  const [proximoPassoInteracao, setProximoPassoInteracao] = useState("");
  const [clienteRespondeu, setClienteRespondeu] = useState<"sim" | "nao">("sim");
  const [encerradoSemRetorno, setEncerradoSemRetorno] = useState(false);
  const [feedbackFollowUp, setFeedbackFollowUp] = useState("");
  const [interacoes, setInteracoes] = useState<InteracaoFollowUp[]>(
    cotacao ? buildInteracoesMock(cotacao) : [],
  );

  if (!cotacao) {
    return (
      <div className="h-full bg-white p-6 flex flex-col">
        <button
          onClick={onBackToCotacoes}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para cotações
        </button>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Cotação não encontrada.
        </div>
      </div>
    );
  }

  const impostoValor =
    (cotacao.precoFinalSugerido * cotacao.impostosEstimados) / 100;
  const descontoValor =
    (cotacao.precoFinalSugerido * cotacao.descontoAplicado) / 100;
  const custoTotal =
    cotacao.custoProduto + cotacao.custoLogistico + impostoValor;
  const margemValor =
    cotacao.precoFinalSugerido - custoTotal - descontoValor;
  const margemPercentual =
    cotacao.precoFinalSugerido > 0
      ? (margemValor / cotacao.precoFinalSugerido) * 100
      : 0;
  const diferencaPrecoMinimo =
    cotacao.precoFinalSugerido - cotacao.precoMinimoReferencia;
  const dentroDaPoliticaPreco =
    cotacao.precoFinalSugerido >= cotacao.precoMinimoReferencia;
  const approvalMeta = getCotacaoApprovalMeta(cotacao.statusAprovacao);

  const statusAprovacao = margemPercentual >= 20;
  const templateEmail = useMemo(() => {
    if (!cotacao) {
      return { assunto: "", corpo: "" };
    }

    return buildEmailCotacao(cotacao);
  }, [cotacao]);

  const handleAbrirEmail = () => {
    setDestinatarioEmail("");
    setFeedbackEmail("");
    setEmailOpen(true);
  };

  const handleEnviarEmail = () => {
    if (!destinatarioEmail.trim()) {
      setFeedbackEmail("Informe o destinatário para enviar a cotação.");
      return;
    }

    setFeedbackEmail(`E-mail preparado para envio para ${destinatarioEmail}.`);
    setEmailOpen(false);
  };

  const handleAbrirPerda = () => {
    setMotivoPerda("");
    setMotivoPerdaOutro("");
    setFeedbackPerda("");
    setPerdaOpen(true);
  };

  const handleConfirmarPerda = () => {
    if (!motivoPerda) {
      setFeedbackPerda("Selecione o motivo da perda.");
      return;
    }

    if (motivoPerda === "Outro" && !motivoPerdaOutro.trim()) {
      setFeedbackPerda("Descreva o motivo complementar da perda.");
      return;
    }

    if (!cotacao || !onMarcarComoPerdida) {
      return;
    }

    const motivoFinal =
      motivoPerda === "Outro" ? motivoPerdaOutro.trim() : motivoPerda;

    onMarcarComoPerdida(cotacao.id, {
      motivoPerda: motivoFinal,
      dataEncerramento: new Date().toISOString(),
    });

    setPerdaOpen(false);
  };

  const handleRegistrarInteracao = () => {
    if (!resumoInteracao.trim()) {
      setFeedbackFollowUp("Preencha o resumo da interação antes de registrar.");
      return;
    }

    if (!responsavelInteracao.trim()) {
      setFeedbackFollowUp("Informe o responsável pela interação.");
      return;
    }

    if (!dataInteracao) {
      setFeedbackFollowUp("Informe a data da interação.");
      return;
    }

    const novaInteracao: InteracaoFollowUp = {
      id: Date.now(),
      tipo: tipoInteracao,
      data: dataInteracao,
      responsavel: responsavelInteracao.trim(),
      resumo: resumoInteracao.trim(),
      proximoPasso: proximoPassoInteracao.trim(),
      criadaEm: new Date().toISOString(),
    };

    setInteracoes((prev) => [novaInteracao, ...prev]);
    setResumoInteracao("");
    setProximoPassoInteracao("");
    setFeedbackFollowUp("Interação registrada no acompanhamento.");
  };

  const handleEncerrarSemRetorno = () => {
    setEncerradoSemRetorno(true);
    setFeedbackFollowUp("Acompanhamento marcado como encerrado sem retorno.");
  };

  const cotacaoPerdida = cotacao.etapa === "PERDIDA";
  const pedidoFechado = cotacao.etapa === "PEDIDO FECHADO";

  useEffect(() => {
    if (!cotacao) {
      return;
    }

    setInteracoes(buildInteracoesMock(cotacao));
    setClienteRespondeu("sim");
    setEncerradoSemRetorno(false);
    setFeedbackFollowUp("");
  }, [cotacao?.id]);

  return (
    <div className="h-full bg-slate-50 overflow-auto">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <ChevronRight className="w-4 h-4" />
              <span>Cotações</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Cotação completa</span>
            </div>
            <h1 className="text-2xl text-slate-900">Detalhes completos da cotação</h1>
            <p className="text-sm text-slate-500 mt-1">
              Código: {cotacao.codigo} | Cliente: {cotacao.cliente} | Responsável: {cotacao.responsavel}
            </p>
          </div>
          <button
            onClick={onBackToCotacoes}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para cotações
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => setAbaAtiva("principal")}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                abaAtiva === "principal"
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
              }`}
            >
              Visão principal
            </button>
            <button
              onClick={() => setAbaAtiva("followup")}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                abaAtiva === "followup"
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
              }`}
            >
              Follow-up comercial
            </button>
          </div>
        </section>

        {abaAtiva === "principal" && (
          <>
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Status atual</p>
                <h2 className="text-base text-slate-900 mt-1">
                  {cotacaoPerdida
                    ? "Perdida"
                    : pedidoFechado
                      ? "Pedido fechado"
                      : approvalMeta.label}
                </h2>
              </div>
              {cotacaoPerdida ? (
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs border-rose-300 bg-rose-50 text-rose-700">
                  PERDIDA
                </span>
              ) : pedidoFechado ? (
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs border-emerald-300 bg-emerald-50 text-emerald-700">
                  PEDIDO FECHADO
                </span>
              ) : (
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${approvalMeta.className}`}
                >
                  {approvalMeta.label}
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-600">
              {cotacaoPerdida
                ? "Cotação encerrada como perdida no acompanhamento comercial."
                : pedidoFechado
                  ? "Cotação convertida em pedido e registrada no sistema."
                : cotacao.observacaoAprovacao}
            </p>

            {cotacaoPerdida && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2">
                  <p className="text-xs text-rose-700">Motivo da perda</p>
                  <p className="text-sm text-rose-900 mt-1">{cotacao.motivoPerda ?? "Não informado"}</p>
                </div>
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2">
                  <p className="text-xs text-rose-700">Data do encerramento</p>
                  <p className="text-sm text-rose-900 mt-1">
                    {cotacao.dataEncerramento ? toDateTime(cotacao.dataEncerramento) : "Não informada"}
                  </p>
                </div>
              </div>
            )}

            {pedidoFechado && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <p className="text-xs text-emerald-700">Número do pedido</p>
                  <p className="text-sm text-emerald-900 mt-1">{cotacao.numeroPedido}</p>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <p className="text-xs text-emerald-700">Data de geração</p>
                  <p className="text-sm text-emerald-900 mt-1">
                    {cotacao.dataPedido ? toDateTime(cotacao.dataPedido) : "Não informada"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <h2 className="text-base text-slate-900 mb-4">Formulário da cotação</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           
            <div>
              <p className="text-sm text-slate-600">Produto / serviço</p>
              <p className="text-sm text-slate-900 mt-1">{cotacao.produtoServico}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Quantidade</p>
              <p className="text-sm text-slate-900 mt-1">{cotacao.quantidade}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Unidade</p>
              <p className="text-sm text-slate-900 mt-1">{cotacao.unidade}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Valor estimado</p>
              <p className="text-sm text-slate-900 mt-1">{toCurrency(cotacao.valorEstimado)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Prazo desejado</p>
              <p className="text-sm text-slate-900 mt-1">{toDate(cotacao.prazoDesejado)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Origem da oportunidade</p>
              <p className="text-sm text-slate-900 mt-1">{cotacao.origemOportunidade}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Responsável</p>
              <p className="text-sm text-slate-900 mt-1">{cotacao.responsavel}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-slate-600">Observações comerciais</p>
              <p className="text-sm text-slate-900 mt-1">{cotacao.observacoesComerciais}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-slate-600">Necessidade do cliente</p>
              <p className="text-sm text-slate-900 mt-1">{cotacao.necessidadeCliente}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Cálculo comercial</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Custo do produto</p>
              <p className="text-slate-900 mt-1">{toCurrency(cotacao.custoProduto)}</p>
            </div>
            <div>
              <p className="text-slate-600">Custo logístico</p>
              <p className="text-slate-900 mt-1">{toCurrency(cotacao.custoLogistico)}</p>
            </div>
            <div>
              <p className="text-slate-600">Desconto aplicado (%)</p>
              <p className="text-slate-900 mt-1">{cotacao.descontoAplicado}%</p>
            </div>
            <div>
              <p className="text-slate-600">Impostos estimados (%)</p>
              <p className="text-slate-900 mt-1">{cotacao.impostosEstimados}%</p>
            </div>
            <div>
              <p className="text-slate-600">Preço final sugerido</p>
              <p className="text-slate-900 mt-1">{toCurrency(cotacao.precoFinalSugerido)}</p>
            </div>
            <div>
              <p className="text-slate-600">Margem estimada</p>
              <p className="text-slate-900 mt-1">{toCurrency(margemValor)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base text-slate-900">Envio por e-mail</h2>
              <p className="text-sm text-slate-500 mt-1">
                Gere uma mensagem padronizada com os dados atuais da cotação.
              </p>
            </div>
            <button
              onClick={handleAbrirEmail}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Enviar cotação por e-mail
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base text-slate-900">Encerramento comercial</h2>
              <p className="text-sm text-slate-500 mt-1">
                Registre o motivo para encerrar a cotação como perdida.
              </p>
            </div>
            <button
              onClick={handleAbrirPerda}
              disabled={cotacaoPerdida || pedidoFechado}
              className="inline-flex items-center gap-2 px-4 py-2 border border-rose-300 text-rose-700 text-sm rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Marcar como perdida
            </button>
          </div>
        </section>

        {!pedidoFechado && (
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base text-slate-900">Conversão em pedido</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Converta a cotação aprovada em pedido com acesso à geração de número e OC.
                </p>
              </div>
              <button
                onClick={onGerarPedido}
                disabled={cotacaoPerdida}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Gerar pedido
              </button>
            </div>
          </section>
        )}

        {pedidoFechado && (
          <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-base text-slate-900 mb-4">Resumo do pedido gerado</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border border-emerald-200 bg-white px-3 py-2">
                <p className="text-xs text-slate-500">Número do pedido</p>
                <p className="text-slate-900 mt-1 font-semibold">{cotacao.numeroPedido}</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-white px-3 py-2">
                <p className="text-xs text-slate-500">Data</p>
                <p className="text-slate-900 mt-1">
                  {cotacao.dataPedido ? toDateTime(cotacao.dataPedido) : "-"}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-white px-3 py-2">
                <p className="text-xs text-slate-500">Ordem de compra</p>
                <p className="text-slate-900 mt-1">
                  {cotacao.ocGerada ? "Gerada" : "-"}
                </p>
              </div>
            </div>
          </section>
        )}
          </>
        )}

        {abaAtiva === "followup" && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-base text-slate-900">Acompanhamento</h2>
              <p className="text-sm text-slate-500 mt-1">
                Registre interações comerciais após o envio da cotação.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              {encerradoSemRetorno ? "Status: Encerrado sem retorno" : "Status: Em acompanhamento"}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Tipo de interação</label>
                <select
                  value={tipoInteracao}
                  onChange={(event) => setTipoInteracao(event.target.value as TipoInteracaoFollowUp)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="ligacao">Ligação</option>
                  <option value="email">E-mail</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="reuniao">Reunião</option>
                  <option value="observacao_interna">Observação interna</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Data</label>
                <input
                  type="date"
                  value={dataInteracao}
                  onChange={(event) => setDataInteracao(event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Responsável</label>
                <input
                  type="text"
                  value={responsavelInteracao}
                  onChange={(event) => setResponsavelInteracao(event.target.value)}
                  placeholder="Nome do responsável"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Resumo / observação</label>
                <textarea
                  rows={3}
                  value={resumoInteracao}
                  onChange={(event) => setResumoInteracao(event.target.value)}
                  placeholder="Ex.: Cliente solicitou retorno com condição de pagamento alternativa."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-2">Próximo passo</label>
                <textarea
                  rows={3}
                  value={proximoPassoInteracao}
                  onChange={(event) => setProximoPassoInteracao(event.target.value)}
                  placeholder="Ex.: Nova ligação em 2 dias para validar decisão."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-700 mb-2">Cliente respondeu?</p>
                <div className="flex items-center gap-5 text-sm text-slate-700">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="cliente-respondeu"
                      checked={clienteRespondeu === "sim"}
                      onChange={() => {
                        setClienteRespondeu("sim");
                        setEncerradoSemRetorno(false);
                      }}
                      className="accent-slate-800"
                    />
                    Sim
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="cliente-respondeu"
                      checked={clienteRespondeu === "nao"}
                      onChange={() => setClienteRespondeu("nao")}
                      className="accent-slate-800"
                    />
                    Não
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {clienteRespondeu === "nao" && (
                  <button
                    onClick={handleEncerrarSemRetorno}
                    className="px-4 py-2 border border-amber-300 bg-amber-50 text-amber-800 text-sm rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    Encerrar sem retorno
                  </button>
                )}
                <button
                  onClick={handleRegistrarInteracao}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Registrar interação
                </button>
              </div>
            </div>

            {feedbackFollowUp && (
              <div className="rounded-lg border border-slate-200 bg-white text-sm text-slate-700 px-4 py-2">
                {feedbackFollowUp}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm text-slate-700">Linha do tempo de interações</h3>

            {interacoes.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500">
                Nenhuma interação registrada até o momento.
              </div>
            ) : (
              <div className="space-y-3">
                {interacoes.map((interacao) => (
                  <article
                    key={interacao.id}
                    className="relative rounded-lg border border-slate-200 bg-white px-4 py-3"
                  >
                    <span className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-slate-300" />
                    <div className="ml-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm text-slate-900">
                          {getTipoInteracaoLabel(interacao.tipo)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Registro: {toDateTime(interacao.criadaEm)}
                        </p>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Data da interação: {toDate(interacao.data)} | Responsável: {interacao.responsavel}
                      </p>
                      <p className="text-sm text-slate-700 mt-2">{interacao.resumo}</p>
                      {interacao.proximoPasso && (
                        <p className="text-sm text-slate-600 mt-2">
                          Próximo passo: {interacao.proximoPasso}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
        )}

        <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enviar cotação por e-mail</DialogTitle>
              <DialogDescription>
                O destinatário pode ser ajustado. Assunto e corpo são montados automaticamente com base no status atual da cotação.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Destinatário
                </label>
                <input
                  type="email"
                  value={destinatarioEmail}
                  onChange={(event) => setDestinatarioEmail(event.target.value)}
                  placeholder="destinatario@empresa.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  value={templateEmail.assunto}
                  readOnly
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Corpo do e-mail
                </label>
                <textarea
                  rows={12}
                  value={templateEmail.corpo}
                  readOnly
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-700 whitespace-pre-wrap"
                />
              </div>

              {feedbackEmail && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-2">
                  {feedbackEmail}
                </div>
              )}
            </div>

            <DialogFooter>
              <button
                onClick={() => setEmailOpen(false)}
                className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarEmail}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={perdaOpen} onOpenChange={setPerdaOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Marcar cotação como perdida</DialogTitle>
              <DialogDescription>
                Informe o motivo da perda para concluir o encerramento da cotação.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  Motivo da perda
                </label>
                <select
                  value={motivoPerda}
                  onChange={(event) => {
                    setMotivoPerda(event.target.value as MotivoPerdaCotacao);
                    setFeedbackPerda("");
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="">Selecione um motivo</option>
                  {motivosPerdaMock.map((motivo) => (
                    <option key={motivo} value={motivo}>
                      {motivo}
                    </option>
                  ))}
                </select>
              </div>

              {motivoPerda === "Outro" && (
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Detalhe do motivo
                  </label>
                  <textarea
                    rows={4}
                    value={motivoPerdaOutro}
                    onChange={(event) => {
                      setMotivoPerdaOutro(event.target.value);
                      setFeedbackPerda("");
                    }}
                    placeholder="Descreva o motivo da perda"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              )}

              {feedbackPerda && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-sm px-4 py-2">
                  {feedbackPerda}
                </div>
              )}
            </div>

            <DialogFooter>
              <button
                onClick={() => setPerdaOpen(false)}
                className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarPerda}
                className="px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 transition-colors"
              >
                Confirmar encerramento
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>
    </div>
  );
}
