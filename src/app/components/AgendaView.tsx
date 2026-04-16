import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, ChevronRight, ClipboardList, List } from "lucide-react";
import { Calendar } from "./ui/calendar";

interface AgendaViewProps {
  onBackToMain: () => void;
  vendedorFiltro?: string | null;
}

type TipoAgenda = "tarefa" | "visita";
type ModoVisualizacao = "lista" | "calendario";

interface AgendaItem {
  id: number;
  tipo: TipoAgenda;
  data: string;
  titulo: string;
  cliente: string;
  responsavel: string;
  resumo: string;
}

const agendaMock: AgendaItem[] = [
  {
    id: 1,
    tipo: "tarefa",
    data: "2026-04-10",
    titulo: "Acompanhamento da proposta",
    cliente: "Ligas Metalicas Atlas",
    responsavel: "Gorete",
    resumo: "Validar ajustes de preço e confirmar prazo de entrega.",
  },
  {
    id: 2,
    tipo: "visita",
    data: "2026-04-10",
    titulo: "Visita técnica comercial",
    cliente: "Hospital Vida Nova",
    responsavel: "Keila",
    resumo: "Apresentação da proposta e alinhamento de condições comerciais.",
  },
  {
    id: 3,
    tipo: "tarefa",
    data: "2026-04-12",
    titulo: "Revisar margem da cotação",
    cliente: "KOMATSU DO BRASIL LTDA",
    responsavel: "Everton",
    resumo: "Recalcular margem após solicitação de desconto adicional.",
  },
  {
    id: 4,
    tipo: "visita",
    data: "2026-04-14",
    titulo: "Visita de acompanhamento",
    cliente: "Construtora Horizonte",
    responsavel: "Fernanda",
    resumo: "Atualizar cronograma e alinhar o escopo da nova fase.",
  },
  {
    id: 5,
    tipo: "tarefa",
    data: "2026-04-15",
    titulo: "Enviar minuta contratual",
    cliente: "Solar Panels",
    responsavel: "Keila",
    resumo: "Compartilhar minuta com cláusulas comerciais revisadas.",
  },
  {
    id: 6,
    tipo: "visita",
    data: "2026-04-17",
    titulo: "Visita de encerramento",
    cliente: "Mercado Central Sul",
    responsavel: "Everton",
    resumo: "Consolidar aprovações finais para fechamento do pedido.",
  },
];

function toDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function toDateLabel(value: string) {
  return toDate(value).toLocaleDateString("pt-BR");
}

function toDateKey(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getBadgeClass(tipo: TipoAgenda) {
  return tipo === "tarefa"
    ? "border-blue-200 bg-blue-50 text-blue-700"
    : "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function getTipoLabel(tipo: TipoAgenda) {
  return tipo === "tarefa" ? "Plano de ação" : "Visita";
}

export function AgendaView({ onBackToMain, vendedorFiltro }: AgendaViewProps) {
  const [modoVisualizacao, setModoVisualizacao] =
    useState<ModoVisualizacao>("lista");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const proximosItens = useMemo(() => {
    const baseItens = vendedorFiltro
      ? agendaMock.filter((item) => item.responsavel === vendedorFiltro)
      : agendaMock;

    return [...baseItens].sort((a, b) => toDate(a.data).getTime() - toDate(b.data).getTime());
  }, [vendedorFiltro]);

  const proximasTarefas = useMemo(() => {
    return proximosItens.filter((item) => item.tipo === "tarefa");
  }, [proximosItens]);

  const proximasVisitas = useMemo(() => {
    return proximosItens.filter((item) => item.tipo === "visita");
  }, [proximosItens]);

  const datasComItens = useMemo(() => {
    return proximosItens.map((item) => toDate(item.data));
  }, [proximosItens]);

  const itensDoDiaSelecionado = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    const dateKey = toDateKey(selectedDate);
    return proximosItens.filter((item) => item.data === dateKey);
  }, [proximosItens, selectedDate]);

  return (
    <div className="h-full bg-slate-50 overflow-auto">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <ChevronRight className="w-4 h-4" />
              <span>Menu principal</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Agenda</span>
            </div>
            <h1 className="text-2xl text-slate-900">Agenda comercial</h1>
            <p className="text-sm text-slate-500 mt-1">
              Acompanhe os próximos planos de ação e visitas com um resumo rápido dos compromissos.
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
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-base text-slate-900">Visualização da agenda</h2>

            <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white p-1">
              <button
                onClick={() => setModoVisualizacao("lista")}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  modoVisualizacao === "lista"
                    ? "bg-slate-800 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <List className="w-4 h-4" />
                Lista
              </button>
              <button
                onClick={() => setModoVisualizacao("calendario")}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  modoVisualizacao === "calendario"
                    ? "bg-slate-800 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Calendário
              </button>
            </div>
          </div>

          {modoVisualizacao === "lista" ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList className="w-4 h-4 text-blue-700" />
                  <h3 className="text-sm text-slate-900">Próximos planos de ação</h3>
                </div>

                <div className="space-y-3">
                  {proximasTarefas.map((item) => (
                    <div key={item.id} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-slate-900">{item.titulo}</p>
                        <span className="text-xs text-slate-500">{toDateLabel(item.data)}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {item.cliente} | Responsável: {item.responsavel}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{item.resumo}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm text-slate-900">Próximas visitas</h3>
                </div>

                <div className="space-y-3">
                  {proximasVisitas.map((item) => (
                    <div key={item.id} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-slate-900">{item.titulo}</p>
                        <span className="text-xs text-slate-500">{toDateLabel(item.data)}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {item.cliente} | Responsável: {item.responsavel}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{item.resumo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={{ comCompromisso: datasComItens }}
                  modifiersClassNames={{
                    comCompromisso:
                      "bg-blue-100 text-blue-700 font-semibold rounded-md",
                  }}
                  className="rounded-md border bg-white"
                />
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm text-slate-900 mb-3">
                  Compromissos de {selectedDate ? selectedDate.toLocaleDateString("pt-BR") : "-"}
                </h3>

                {itensDoDiaSelecionado.length === 0 ? (
                  <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                    Nenhum compromisso para a data selecionada.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {itensDoDiaSelecionado.map((item) => (
                      <div key={item.id} className="rounded-md border border-slate-200 bg-white px-4 py-3">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm text-slate-900">{item.titulo}</p>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${getBadgeClass(item.tipo)}`}
                          >
                            {getTipoLabel(item.tipo)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {item.cliente} | Responsável: {item.responsavel}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{item.resumo}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
