import { useMemo, useState } from "react";
import {
  X,
  ChevronRight,
  KanbanSquare,
  List,
  Search,
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

export function ListaCotacoesView({
  onOpenCotacaoCompleta,
  cotacaoAtualizacoes,
  vendedorFiltro,
}: ListaCotacoesViewProps) {
  const [modoVisualizacao, setModoVisualizacao] =
    useState<ModoVisualizacao>("lista");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCotacao, setSelectedCotacao] =
    useState<CotacaoResumo | null>(null);

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

  const cotacoesFiltradas = useMemo(() => {
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

  const totalCotacoes = cotacoesFiltradas.length;
  const totalEmAndamento = cotacoesFiltradas.filter(
    (cotacao) =>
      cotacao.etapa !== "PEDIDO FECHADO" && cotacao.etapa !== "PERDIDA",
  ).length;
  const valorTotal = cotacoesFiltradas.reduce(
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
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
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Valor</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-600">Atualizado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cotacoesFiltradas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
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
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">{cotacao.codigo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{cotacao.cliente}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{cotacao.responsavel}</td>
                      <td className="px-4 py-3 text-xs">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 ${getCotacaoApprovalMeta(cotacao.statusAprovacao).className}`}
                        >
                          {getCotacaoApprovalMeta(cotacao.statusAprovacao).label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">{cotacao.etapa}</td>
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

              return (
                <div
                  key={etapa}
                  className="rounded-xl border border-slate-200 bg-white p-3 flex flex-col min-h-52"
                >
                  <div className="mb-3 pb-2 border-b border-slate-200">
                    <p className="text-xs text-slate-700">{etapa}</p>
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
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                        >
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${getCotacaoApprovalMeta(cotacao.statusAprovacao).className}`}
                          >
                            {getCotacaoApprovalMeta(cotacao.statusAprovacao).label}
                          </span>
                          <p className="text-xs text-slate-500">{cotacao.codigo}</p>
                          <p className="text-sm text-slate-900 mt-1">{cotacao.cliente}</p>
                          <p className="text-xs text-slate-600 mt-1">Responsável: {cotacao.responsavel}</p>
                          <p className="text-xs text-slate-600 mt-1">
                            {formatCurrency(cotacao.valor)}
                          </p>
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
    </div>
  );
}
