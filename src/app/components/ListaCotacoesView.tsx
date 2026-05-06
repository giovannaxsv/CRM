import { useMemo, useState } from "react";
import {
  X,
  ChevronRight,
  KanbanSquare,
  List,
  Search,
  FileText,
} from "lucide-react";
import {
  getCotacaoApprovalMeta,
  type CotacaoApprovalStatus,
} from "./cotacaoApproval";

export type EtapaCotacao =
  | "AGUARDANDO APROVACAO"
  | "AGUARDANDO REVISAO"
  | "COTACAO APROVADA"
  | "COTACAO ENVIADA AO CLIENTE"
  | "PEDIDO FECHADO"
  | "PERDIDA"
  | "POSTERGADO";

type ModoVisualizacao = "lista" | "kanban";
type FiltroRapido =
  | "todas"
  | "andamento"
  | "aguardando-aprovacao"
  | "aprovadas"
  | "pedidos"
  | "perdidas";

export interface CotacaoResumo {
  id: number;
  codigo: string;
  cliente: string;
  responsavel: string;
  valor: number;
  dataAtualizacao: string;
  etapa: EtapaCotacao;
  statusAprovacao: CotacaoApprovalStatus;
  observacaoAprovacao: string;
  motivoPerda?: string;
  dataEncerramento?: string;
  numeroPedido?: string;
  dataPedido?: string;
  ocGerada?: boolean;
}

export interface CotacaoAtualizacaoLocal {
  etapa?: EtapaCotacao;
  motivoPerda?: string;
  dataEncerramento?: string;
  numeroPedido?: string;
  dataPedido?: string;
  ocGerada?: boolean;
}

interface ListaCotacoesViewProps {
  onOpenCotacaoCompleta: (cotacaoId: number) => void;
  cotacaoAtualizacoes?: Record<number, CotacaoAtualizacaoLocal>;
  vendedorFiltro?: string | null;
}

const etapasCotacao: EtapaCotacao[] = [
  "AGUARDANDO APROVACAO",
  "AGUARDANDO REVISAO",
  "COTACAO APROVADA",
  "COTACAO ENVIADA AO CLIENTE",
  "PEDIDO FECHADO",
  "PERDIDA",
  "POSTERGADO",
];

export const cotacoesMock: CotacaoResumo[] = [
  {
    id: 1,
    codigo: "COT-2026-001",
    cliente: "FUNDICAO INDUSTRIAL LTDA",
    responsavel: "Everton",
    valor: 30000,
    dataAtualizacao: "2026-04-02",
    etapa: "AGUARDANDO APROVACAO",
    statusAprovacao: "aguardando_aprovacao",
    observacaoAprovacao: "Cotação aguardando o parecer do gestor.",
  },
  {
    id: 2,
    codigo: "COT-2026-002",
    cliente: "A FERROTEGRAO",
    responsavel: "Gorete",
    valor: 42900,
    dataAtualizacao: "2026-04-04",
    etapa: "AGUARDANDO REVISAO",
    statusAprovacao: "em_edicao_ajuste_solicitado",
    observacaoAprovacao: "Cotação retornada para ajuste.",
  },
  {
    id: 3,
    codigo: "COT-2026-003",
    cliente: "A FRIDBERG DO BRASIL INDUSTRI",
    responsavel: "Keila",
    valor: 16700,
    dataAtualizacao: "2026-04-01",
    etapa: "COTACAO APROVADA",
    statusAprovacao: "aprovado_automaticamente",
    observacaoAprovacao: "Cotação aprovada automaticamente por estar dentro da política.",
  },
  {
    id: 4,
    codigo: "COT-2026-004",
    cliente: "A TUDO PARA PNEUS LTDA",
    responsavel: "Everton",
    valor: 25500,
    dataAtualizacao: "2026-03-29",
    etapa: "COTACAO ENVIADA AO CLIENTE",
    statusAprovacao: "aprovado_manualmente",
    observacaoAprovacao: "Cotação aprovada manualmente após análise do gestor.",
  },
  {
    id: 5,
    codigo: "COT-2026-005",
    cliente: "AB TELECOMUNICACOES",
    responsavel: "Gorete",
    valor: 12000,
    dataAtualizacao: "2026-03-25",
    etapa: "PEDIDO FECHADO",
    statusAprovacao: "aprovado_manualmente",
    observacaoAprovacao: "Cotação aprovada manualmente e convertida em pedido.",
    numeroPedido: "PED-2026-001",
    dataPedido: "2026-03-25",
    ocGerada: true,
  },
  {
    id: 6,
    codigo: "COT-2026-006",
    cliente: "AB TRANSMISSAO AUTOMATICA LTDA",
    responsavel: "Keila",
    valor: 39000,
    dataAtualizacao: "2026-03-20",
    etapa: "PERDIDA",
    statusAprovacao: "reprovado",
    observacaoAprovacao: "Cotação reprovada na análise.",
  },
  {
    id: 7,
    codigo: "COT-2026-007",
    cliente: "ABCD IND. E COM. DE EMBALAGENS",
    responsavel: "Everton",
    valor: 18500,
    dataAtualizacao: "2026-03-18",
    etapa: "POSTERGADO",
    statusAprovacao: "em_edicao_ajuste_solicitado",
    observacaoAprovacao: "Cotação retornada para ajuste.",
  },
  {
    id: 8,
    codigo: "COT-2026-008",
    cliente: "ACEARIA FREDERICO MISSNER LTDA",
    responsavel: "Keila",
    valor: 51200,
    dataAtualizacao: "2026-04-05",
    etapa: "AGUARDANDO APROVACAO",
    statusAprovacao: "aguardando_aprovacao",
    observacaoAprovacao: "Cotação aguardando o parecer do gestor.",
  },
  {
    id: 9,
    codigo: "COT-2026-009",
    cliente: "ACEFER INDUSTRIA COMERCIO LTDA",
    responsavel: "Gorete",
    valor: 27800,
    dataAtualizacao: "2026-04-03",
    etapa: "AGUARDANDO REVISAO",
    statusAprovacao: "em_edicao_ajuste_solicitado",
    observacaoAprovacao: "Cotação retornada para ajuste.",
  },
  {
    id: 10,
    codigo: "COT-2026-010",
    cliente: "ACL METAIS LTDA",
    responsavel: "Everton",
    valor: 73400,
    dataAtualizacao: "2026-04-06",
    etapa: "COTACAO APROVADA",
    statusAprovacao: "aprovado_automaticamente",
    observacaoAprovacao: "Cotação aprovada automaticamente por estar dentro da política.",
  },
  {
    id: 11,
    codigo: "COT-2026-011",
    cliente: "ACOBET INDUSTRIA METALICA E C",
    responsavel: "Keila",
    valor: 22150,
    dataAtualizacao: "2026-04-01",
    etapa: "COTACAO ENVIADA AO CLIENTE",
    statusAprovacao: "aprovado_manualmente",
    observacaoAprovacao: "Cotação aprovada manualmente após análise do gestor.",
  },
  {
    id: 12,
    codigo: "COT-2026-012",
    cliente: "ACOCRIL INDUSTRIA E COMERCIO D",
    responsavel: "Gorete",
    valor: 18990,
    dataAtualizacao: "2026-03-30",
    etapa: "PEDIDO FECHADO",
    statusAprovacao: "reprovado",
    observacaoAprovacao: "Cotação reprovada na análise.",
    numeroPedido: "PED-2026-002",
    dataPedido: "2026-03-30",
    ocGerada: true,
  },
  {
    id: 16,
    codigo: "COT-2026-016",
    cliente: "ALFA COMPONENTES INDUSTRIAIS LTDA",
    responsavel: "Everton",
    valor: 41850,
    dataAtualizacao: "2026-04-08",
    etapa: "PEDIDO FECHADO",
    statusAprovacao: "aprovado_automaticamente",
    observacaoAprovacao: "Cotação convertida em pedido após aprovação automática.",
    numeroPedido: "PED-2026-003",
    dataPedido: "2026-04-08",
    ocGerada: true,
  },
  {
    id: 17,
    codigo: "COT-2026-017",
    cliente: "ALUMIFER SOLUCOES METALICAS LTDA",
    responsavel: "Keila",
    valor: 29700,
    dataAtualizacao: "2026-04-09",
    etapa: "PEDIDO FECHADO",
    statusAprovacao: "aprovado_manualmente",
    observacaoAprovacao: "Pedido emitido após negociação final com o cliente.",
    numeroPedido: "PED-2026-004",
    dataPedido: "2026-04-09",
    ocGerada: true,
  },
  {
    id: 18,
    codigo: "COT-2026-018",
    cliente: "BETA INDUSTRIA DE PECAS LTDA",
    responsavel: "Gorete",
    valor: 56320,
    dataAtualizacao: "2026-04-10",
    etapa: "PEDIDO FECHADO",
    statusAprovacao: "aprovado_manualmente",
    observacaoAprovacao: "Cotação aprovada e convertida em pedido no fechamento comercial.",
    numeroPedido: "PED-2026-005",
    dataPedido: "2026-04-10",
    ocGerada: true,
  },
  {
    id: 13,
    codigo: "COT-2026-013",
    cliente: "ACOTECNICAS A/IND E COMERCIO",
    responsavel: "Everton",
    valor: 14750,
    dataAtualizacao: "2026-03-28",
    etapa: "PERDIDA",
    statusAprovacao: "reprovado",
    observacaoAprovacao: "Cotação reprovada na análise.",
  },
  {
    id: 14,
    codigo: "COT-2026-014",
    cliente: "ACQUA MINERA COMERCIO IMPORTA",
    responsavel: "Keila",
    valor: 33300,
    dataAtualizacao: "2026-03-27",
    etapa: "POSTERGADO",
    statusAprovacao: "em_edicao_ajuste_solicitado",
    observacaoAprovacao: "Cotação retornada para ajuste.",
  },
  {
    id: 15,
    codigo: "COT-2026-015",
    cliente: "ACRILDESTAC IND. COM. LTDA EPP",
    responsavel: "Gorete",
    valor: 26400,
    dataAtualizacao: "2026-04-07",
    etapa: "AGUARDANDO APROVACAO",
    statusAprovacao: "aguardando_aprovacao",
    observacaoAprovacao: "Cotação aguardando o parecer do gestor.",
  },
  {
    id: 19,
    codigo: "COT-2026-019",
    cliente: "BRASIL FERROS E METAIS LTDA",
    responsavel: "Everton",
    valor: 34800,
    dataAtualizacao: "2026-04-11",
    etapa: "AGUARDANDO APROVACAO",
    statusAprovacao: "aguardando_aprovacao",
    observacaoAprovacao: "Cotação aguardando aprovação após revisão de preço mínimo.",
  },
  {
    id: 20,
    codigo: "COT-2026-020",
    cliente: "CBA COMPONENTES AUTOMOTIVOS LTDA",
    responsavel: "Gorete",
    valor: 46750,
    dataAtualizacao: "2026-04-11",
    etapa: "AGUARDANDO APROVACAO",
    statusAprovacao: "aguardando_aprovacao",
    observacaoAprovacao: "Cotação pendente de parecer do gestor comercial.",
  },
  {
    id: 21,
    codigo: "COT-2026-021",
    cliente: "DYNAMIC METALURGICA LTDA",
    responsavel: "Keila",
    valor: 28950,
    dataAtualizacao: "2026-04-12",
    etapa: "AGUARDANDO APROVACAO",
    statusAprovacao: "aguardando_aprovacao",
    observacaoAprovacao: "Cotação enviada para validação de margem e frete.",
  },
  {
    id: 22,
    codigo: "COT-2026-022",
    cliente: "ELEVATE INDUSTRIA DE PECAS LTDA",
    responsavel: "Everton",
    valor: 53300,
    dataAtualizacao: "2026-04-12",
    etapa: "AGUARDANDO APROVACAO",
    statusAprovacao: "aguardando_aprovacao",
    observacaoAprovacao: "Cotação aguardando decisão final do gestor.",
  },
  {
    id: 23,
    codigo: "COT-2026-023",
    cliente: "FLEXA SOLUCOES INDUSTRIAIS LTDA",
    responsavel: "Gorete",
    valor: 61200,
    dataAtualizacao: "2026-04-13",
    etapa: "AGUARDANDO APROVACAO",
    statusAprovacao: "aguardando_aprovacao",
    observacaoAprovacao: "Cotação em fila para aprovação após conferência comercial.",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

function getNumeroPedidoMock(cotacao: CotacaoResumo) {
  if (cotacao.etapa !== "PEDIDO FECHADO") {
    return "Não convertido";
  }

  return cotacao.numeroPedido ?? `PED-2026-${String(cotacao.id).padStart(3, "0")}`;
}

function isPedidoGerado(cotacao: CotacaoResumo) {
  return cotacao.etapa === "PEDIDO FECHADO";
}

export function ListaCotacoesView({
  onOpenCotacaoCompleta,
  cotacaoAtualizacoes,
  vendedorFiltro,
}: ListaCotacoesViewProps) {
  const [modoVisualizacao, setModoVisualizacao] =
    useState<ModoVisualizacao>("lista");
  const [filtroRapido, setFiltroRapido] = useState<FiltroRapido>("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCotacao, setSelectedCotacao] =
    useState<CotacaoResumo | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<CotacaoResumo | null>(null);

  const cotacoesComEstado = useMemo(() => {
    return cotacoesMock.map((cotacao) => {
      const atualizacao = cotacaoAtualizacoes?.[cotacao.id];

      if (!atualizacao) {
        return cotacao;
      }

      return {
        ...cotacao,
        etapa: atualizacao.etapa ?? cotacao.etapa,
        motivoPerda: atualizacao.motivoPerda,
        dataEncerramento: atualizacao.dataEncerramento,
        numeroPedido: atualizacao.numeroPedido,
        dataPedido: atualizacao.dataPedido,
        ocGerada: atualizacao.ocGerada,
        dataAtualizacao: atualizacao.dataPedido
          ? atualizacao.dataPedido.slice(0, 10)
          : atualizacao.dataEncerramento
            ? atualizacao.dataEncerramento.slice(0, 10)
            : cotacao.dataAtualizacao,
      };
    });
  }, [cotacaoAtualizacoes]);

  const cotacoesBaseFiltradas = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return cotacoesComEstado.filter((cotacao) => {
      const pertenceAoVendedor = !vendedorFiltro || cotacao.responsavel === vendedorFiltro;

      if (!pertenceAoVendedor) {
        return false;
      }

      const statusMeta = getCotacaoApprovalMeta(cotacao.statusAprovacao);
      return (
        cotacao.codigo.toLowerCase().includes(lowerSearch) ||
        cotacao.cliente.toLowerCase().includes(lowerSearch) ||
        cotacao.responsavel.toLowerCase().includes(lowerSearch) ||
        cotacao.etapa.toLowerCase().includes(lowerSearch) ||
        (cotacao.motivoPerda ?? "").toLowerCase().includes(lowerSearch) ||
        statusMeta.label.toLowerCase().includes(lowerSearch)
      );
    });
  }, [cotacoesComEstado, searchTerm, vendedorFiltro]);

  const cotacoesFiltradas = useMemo(() => {
    return cotacoesBaseFiltradas.filter((cotacao) => {
      switch (filtroRapido) {
        case "andamento":
          return cotacao.etapa !== "PEDIDO FECHADO" && cotacao.etapa !== "PERDIDA";
        case "aguardando-aprovacao":
          return cotacao.statusAprovacao === "aguardando_aprovacao";
        case "aprovadas":
          return (
            cotacao.statusAprovacao === "aprovado_automaticamente" ||
            cotacao.statusAprovacao === "aprovado_manualmente"
          );
        case "pedidos":
          return cotacao.etapa === "PEDIDO FECHADO";
        case "perdidas":
          return cotacao.etapa === "PERDIDA";
        case "todas":
        default:
          return true;
      }
    });
  }, [cotacoesBaseFiltradas, filtroRapido]);

  const totalCotacoes = cotacoesBaseFiltradas.length;
  const totalEmAndamento = cotacoesBaseFiltradas.filter(
    (cotacao) =>
      cotacao.etapa !== "PEDIDO FECHADO" && cotacao.etapa !== "PERDIDA",
  ).length;
  const totalPedidos = cotacoesBaseFiltradas.filter((cotacao) => cotacao.etapa === "PEDIDO FECHADO").length;
  const taxaConversao = totalCotacoes > 0 ? (totalPedidos / totalCotacoes) * 100 : 0;
  const valorTotal = cotacoesBaseFiltradas.reduce(
    (accumulator, cotacao) => accumulator + cotacao.valor,
    0,
  );

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <ChevronRight className="w-4 h-4" />
              <span>Cotações</span>
            </div>
            <h2 className="text-2xl text-gray-900 mb-1">Cotações realizadas</h2>
            <p className="text-sm text-gray-500">
              Acompanhe cotações em lista ou kanban por etapa.
            </p>
          </div>

          <div className="inline-flex items-center rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setModoVisualizacao("lista")}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                modoVisualizacao === "lista"
                  ? "bg-slate-800 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <List className="w-4 h-4" />
              Lista
            </button>
            <button
              onClick={() => setModoVisualizacao("kanban")}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                modoVisualizacao === "kanban"
                  ? "bg-slate-800 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <KanbanSquare className="w-4 h-4" />
              Kanban
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 mb-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500">Total de cotações</p>
            <p className="text-2xl text-gray-900 mt-1">{totalCotacoes}</p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
            <p className="text-xs text-blue-700">Cotações em andamento</p>
            <p className="text-2xl text-blue-800 mt-1">{totalEmAndamento}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-xs text-emerald-700">Valor total</p>
            <p className="text-2xl text-emerald-800 mt-1">
              {formatCurrency(valorTotal)}
            </p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3">
            <p className="text-xs text-sky-700">Pedidos gerados</p>
            <p className="text-2xl text-sky-800 mt-1">{totalPedidos}</p>
          </div>
          <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3">
            <p className="text-xs text-violet-700">Taxa de conversão</p>
            <p className="text-2xl text-violet-800 mt-1">{taxaConversao.toFixed(1)}%</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por código, cliente, responsável ou etapa..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { id: "todas", label: "Todas" },
            { id: "andamento", label: "Em andamento" },
            { id: "aguardando-aprovacao", label: "Aguardando aprovação" },
            { id: "aprovadas", label: "Aprovadas" },
            { id: "pedidos", label: "Pedidos" },
            { id: "perdidas", label: "Perdidas" },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFiltroRapido(chip.id as FiltroRapido)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filtroRapido === chip.id
                  ? "border-slate-800 bg-slate-800 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-slate-50">
        {modoVisualizacao === "lista" ? (
          <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Código</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Responsável</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Aprovação</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Etapa</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Pedido</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Valor</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Atualizado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cotacoesFiltradas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-6 text-sm text-gray-500 text-center"
                    >
                      Nenhuma cotação encontrada para o filtro informado.
                    </td>
                  </tr>
                ) : (
                  cotacoesFiltradas.map((cotacao) => (
                    <tr
                      key={cotacao.id}
                      onClick={() => setSelectedCotacao(cotacao)}
                      className={`cursor-pointer transition-colors ${
                        isPedidoGerado(cotacao)
                          ? "bg-sky-50 hover:bg-sky-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          {isPedidoGerado(cotacao) && <FileText className="h-4 w-4 text-sky-600 shrink-0" />}
                          <span>{cotacao.codigo}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{cotacao.cliente}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{cotacao.responsavel}</td>
                      <td className="px-4 py-3 text-xs">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 ${getCotacaoApprovalMeta(cotacao.statusAprovacao).className}`}
                        >
                          {getCotacaoApprovalMeta(cotacao.statusAprovacao).label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">
                        <div className="flex flex-col gap-2">
                          <span>{cotacao.etapa}</span>
                          {isPedidoGerado(cotacao) && (
                            <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-800">
                              Pedido gerado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <span>{getNumeroPedidoMock(cotacao)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(cotacao.valor)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(cotacao.dataAtualizacao)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
            {etapasCotacao.map((etapa) => {
              const itensEtapa = cotacoesFiltradas.filter(
                (cotacao) => cotacao.etapa === etapa,
              );
              const etapaKanban = etapa === "PEDIDO FECHADO" ? "PEDIDOS GERADOS" : etapa;

              return (
                <div
                  key={etapa}
                  className={`rounded-xl border p-3 flex flex-col min-h-52 transition-colors ${
                    etapa === "PEDIDO FECHADO"
                      ? "border-sky-200 bg-sky-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="mb-3 pb-2 border-b border-slate-200">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-slate-700">{etapaKanban}</p>
                      {etapa === "PEDIDO FECHADO" && (
                        <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-800">
                          Pedido gerado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {itensEtapa.length} item(ns)
                    </p>
                  </div>

                  <div className="space-y-3 overflow-auto pr-1">
                    {itensEtapa.length === 0 ? (
                      <div className="text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg px-2 py-3 text-center">
                        Sem cotações nesta etapa
                      </div>
                    ) : (
                      itensEtapa.map((cotacao) => (
                        <article
                          key={cotacao.id}
                          onClick={() => setSelectedCotacao(cotacao)}
                          className={`rounded-lg border px-3 py-2 transition-colors ${
                            etapa === "PEDIDO FECHADO"
                              ? "border-sky-200 bg-white"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${getCotacaoApprovalMeta(cotacao.statusAprovacao).className}`}
                              >
                                {getCotacaoApprovalMeta(cotacao.statusAprovacao).label}
                              </span>
                              {etapa === "PEDIDO FECHADO" && (
                                <span className="ml-2 inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-800">
                                  Pedido gerado
                                </span>
                              )}
                              <p className="text-xs text-slate-500 mt-2">{cotacao.codigo}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-900 mt-1">{cotacao.cliente}</p>
                          <p className="text-xs text-slate-600 mt-1">Responsável: {cotacao.responsavel}</p>
                          <p className="text-xs text-slate-600 mt-1">
                            {formatCurrency(cotacao.valor)}
                          </p>
                          {etapa === "PEDIDO FECHADO" && (
                            <p className="mt-2 text-xs text-slate-600">
                              Pedido: {getNumeroPedidoMock(cotacao)}
                            </p>
                          )}
                        </article>
                      ))
                    )}
                  </div>
                </div>
              );

            })}
          </section>
        )}
      </div>

      {selectedCotacao && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 p-4 flex items-center justify-center"
          onClick={() => setSelectedCotacao(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[78vh] overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Detalhes da cotação</p>
                <h3 className="text-lg text-slate-900 mt-1">{selectedCotacao.codigo}</h3>
              </div>
              <button
                onClick={() => setSelectedCotacao(null)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-slate-300 hover:bg-slate-100"
                aria-label="Fechar detalhes"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <section className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm text-slate-900">{selectedCotacao.cliente}</p>
                <p className="text-xs text-slate-600 mt-1">
                  Responsável: {selectedCotacao.responsavel}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${getCotacaoApprovalMeta(selectedCotacao.statusAprovacao).className}`}
                  >
                    {getCotacaoApprovalMeta(selectedCotacao.statusAprovacao).label}
                  </span>
                  <p className="text-xs text-slate-600">
                    {getCotacaoApprovalMeta(selectedCotacao.statusAprovacao).context}
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500">Etapa</p>
                  <p className="text-slate-900 mt-1">{selectedCotacao.etapa}</p>
                </div>
                <div className="rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500">Valor</p>
                  <p className="text-slate-900 mt-1">{formatCurrency(selectedCotacao.valor)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500">Atualizado em</p>
                  <p className="text-slate-900 mt-1">{formatDate(selectedCotacao.dataAtualizacao)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500">Código</p>
                  <p className="text-slate-900 mt-1">{selectedCotacao.codigo}</p>
                </div>
              </section>

              {isPedidoGerado(selectedCotacao) && (
                <section className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-sky-700">Pedido gerado</p>
                      <p className="text-sm text-slate-700 mt-1">
                        Número do pedido: {getNumeroPedidoMock(selectedCotacao)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPedido(selectedCotacao)}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <FileText className="h-4 w-4 text-sky-600" />
                      Ver pedido
                    </button>
                  </div>
                </section>
              )}

              <section className="rounded-lg border border-slate-200 px-4 py-3">
                <p className="text-xs text-slate-500">Resumo comercial</p>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                  Esta cotação está atualmente na etapa {selectedCotacao.etapa.toLowerCase()}.
                  O valor registrado é {formatCurrency(selectedCotacao.valor)} para o cliente {" "}
                  {selectedCotacao.cliente}. Para avancar, revise os dados e prossiga com as
                  ações comerciais da etapa atual.
                </p>
              </section>

              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => {
                    onOpenCotacaoCompleta(selectedCotacao.id);
                    setSelectedCotacao(null);
                  }}
                  className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Ver cotação completa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPedido && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 p-4 flex items-center justify-center"
          onClick={() => setSelectedPedido(null)}
        >
          <div
            className="w-full max-w-lg overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-200 px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">Pedido gerado</p>
                <h3 className="text-lg text-slate-900 mt-1 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-600" />
                  {getNumeroPedidoMock(selectedPedido)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPedido(null)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-slate-300 hover:bg-slate-100"
                aria-label="Fechar pedido"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-sm">
              <section className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Observação</p>
                <p className="text-sm text-slate-700 mt-1">Pedido gerado a partir da cotação aprovada.</p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500">Código da cotação</p>
                  <p className="text-slate-900 mt-1">{selectedPedido.codigo}</p>
                </div>
                <div className="rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500">Número do pedido</p>
                  <p className="text-slate-900 mt-1">{getNumeroPedidoMock(selectedPedido)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500">Cliente</p>
                  <p className="text-slate-900 mt-1">{selectedPedido.cliente}</p>
                </div>
                <div className="rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500">Responsável</p>
                  <p className="text-slate-900 mt-1">{selectedPedido.responsavel}</p>
                </div>
                <div className="rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500">Valor final</p>
                  <p className="text-slate-900 mt-1">{formatCurrency(selectedPedido.valor)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-500">Data de conversão</p>
                  <p className="text-slate-900 mt-1">{formatDate(selectedPedido.dataAtualizacao)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 px-4 py-3 md:col-span-2">
                  <p className="text-xs text-slate-500">Status do pedido</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
                      Pedido gerado
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getCotacaoApprovalMeta(selectedPedido.statusAprovacao).className}`}
                    >
                      {getCotacaoApprovalMeta(selectedPedido.statusAprovacao).label}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
