import { useMemo, useState } from "react";
import { ArrowLeft, CalendarPlus, ChevronRight, Eye, PencilLine, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface AgendarVisitaViewProps {
  onBackToMain: () => void;
  vendedorFiltro?: string | null;
}

interface VisitaItem {
  id: number;
  data: string;
  cliente: string;
  solicitante: string;
  responsavel: string;
  motivo: string;
  status: "realizada" | "agendada" | "cancelada";
}

interface NovaVisitaForm {
  data: string;
  cliente: string;
  solicitante: string;
  responsavel: string;
  motivo: string;
}

const clientesMock = [
  "AGTECH PRESTADORA DE SERVICOS",
  "AILA MARIA BARBOSA DE OLIVEIRA",
  "AIRONSUL METAIS LTDA",
  "ALAIR ARENDT - ME",
  "ALCANCRISH IND. E COM. DE COSME",
  "ALBERTO ANTONELLI",
  "ALBERTO DA HORA BRITTO REPARAC",
  "ALBRAS ALUMINIO BRASILEIRO S/A",
  "ALCAST DO BRASIL S/A",
  "ALCEMAR LUDVICK",
  "ALCINDO DO NASCIMENTO ME",
  "ALCIAN INDUSTRIA DE CONECTORES",
  "ALDAIR DE JESUS INOCENCIO",
  "ALDORO INDUSTRIA DE POS E PIGM",
  "ALESSANDRO GOMES DOS SANTOS",
  "ALFA METALURGIA",
  "ALFORGE SEGURANCA PATRIMONIAL",
  "ALIANCA ALUMINIO LTDA",
  "ALIANÇA METALURGICA",
];

const solicitantesMock = ["Gorete", "Everton", "Keila", "Tatiane"];
const responsaveisVisitaMock = ["Gorete", "Everton", "Keila", "Fernanda"];

const visitasMock: VisitaItem[] = [
  {
    id: 1,
    data: "2026-04-03",
    cliente: "AGTECH PRESTADORA DE SERVICOS",
    solicitante: "Everton",
    responsavel: "Keila",
    motivo: "Acompanhar renovação anual",
    status: "realizada",
  },
  {
    id: 2,
    data: "2026-04-05",
    cliente: "AIRONSUL METAIS LTDA",
    solicitante: "Gorete",
    responsavel: "Everton",
    motivo: "Validar requisitos técnicos para nova cotação",
    status: "realizada",
  },
  {
    id: 3,
    data: "2026-04-10",
    cliente: "ALBRAS ALUMINIO BRASILEIRO S/A",
    solicitante: "Keila",
    responsavel: "Gorete",
    motivo: "Apresentação de proposta comercial",
    status: "agendada",
  },
  {
    id: 4,
    data: "2026-04-14",
    cliente: "ALIANÇA METALURGICA",
    solicitante: "Everton",
    responsavel: "Fernanda",
    motivo: "Revisar cronograma e condições de entrega",
    status: "agendada",
  },
];

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

function compareDateStrings(a: string, b: string) {
  return new Date(`${a}T00:00:00`).getTime() - new Date(`${b}T00:00:00`).getTime();
}

function getStatusBadgeLabel(data: string) {
  const hoje = new Date();
  const localHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime();
  const visitaData = new Date(`${data}T00:00:00`).getTime();

  if (visitaData < localHoje) {
    return { label: "Atrasada", className: "bg-red-100 text-red-700 border-red-200" };
  }

  if (visitaData === localHoje) {
    return { label: "Hoje", className: "bg-amber-100 text-amber-800 border-amber-200" };
  }

  return { label: "Futuro", className: "bg-blue-100 text-blue-700 border-blue-200" };
}

export function AgendarVisitaView({ onBackToMain, vendedorFiltro }: AgendarVisitaViewProps) {
  const [visitas, setVisitas] = useState<VisitaItem[]>(visitasMock);
  const [openModal, setOpenModal] = useState(false);
  const [visitaSelecionada, setVisitaSelecionada] = useState<VisitaItem | null>(null);
  const [visitaEmEdicaoId, setVisitaEmEdicaoId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState<NovaVisitaForm>({
    data: "",
    cliente: "",
    solicitante: "",
    responsavel: "",
    motivo: "",
  });

  const visitasVisiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return visitas;
    }

    return visitas.filter(
      (visita) => visita.solicitante === vendedorFiltro || visita.responsavel === vendedorFiltro,
    );
  }, [visitas, vendedorFiltro]);

  const visitasRealizadas = useMemo(() => {
    return [...visitasVisiveis]
      .filter((visita) => visita.status === "realizada")
      .sort((a, b) => compareDateStrings(b.data, a.data));
  }, [visitasVisiveis]);

  const proximasVisitas = useMemo(() => {
    return [...visitasVisiveis]
      .filter((visita) => visita.status === "agendada")
      .sort((a, b) => compareDateStrings(a.data, b.data));
  }, [visitasVisiveis]);

  const handleOpenModal = () => {
    setFeedback("");
    setVisitaEmEdicaoId(null);
    setForm({
      data: "",
      cliente: "",
      solicitante: vendedorFiltro ?? "",
      responsavel: vendedorFiltro ?? "",
      motivo: "",
    });
    setOpenModal(true);
  };

  const solicitantesDisponiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return solicitantesMock;
    }

    return [vendedorFiltro];
  }, [vendedorFiltro]);

  const responsaveisDisponiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return responsaveisVisitaMock;
    }

    return [vendedorFiltro];
  }, [vendedorFiltro]);

  const updateForm = (field: keyof NovaVisitaForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const abrirDetalhesVisita = (visita: VisitaItem) => {
    setVisitaSelecionada(visita);
  };

  const abrirEdicaoVisita = (visita: VisitaItem) => {
    setFeedback("");
    setVisitaEmEdicaoId(visita.id);
    setForm({
      data: visita.data,
      cliente: visita.cliente,
      solicitante: visita.solicitante,
      responsavel: visita.responsavel,
      motivo: visita.motivo,
    });
    setOpenModal(true);
  };

  const cancelarVisita = (visitaId: number) => {
    setVisitas((prev) =>
      prev.map((visita) =>
        visita.id === visitaId ? { ...visita, status: "cancelada" } : visita,
      ),
    );
    setFeedback("Visita cancelada com sucesso.");
    setVisitaSelecionada(null);
  };

  const handleAgendarVisita = () => {
    if (
      !form.data ||
      !form.cliente ||
      !form.solicitante ||
      !form.responsavel ||
      !form.motivo.trim()
    ) {
      setFeedback("Preencha todos os campos para agendar a visita.");
      return;
    }

    if (visitaEmEdicaoId) {
      setVisitas((prev) =>
        prev.map((visita) =>
          visita.id === visitaEmEdicaoId
            ? {
                ...visita,
                data: form.data,
                cliente: form.cliente,
                solicitante: form.solicitante,
                responsavel: form.responsavel,
                motivo: form.motivo.trim(),
              }
            : visita,
        ),
      );
      setFeedback(`Visita atualizada para ${formatDate(form.data)}.`);
    } else {
      const novaVisita: VisitaItem = {
        id: Date.now(),
        data: form.data,
        cliente: form.cliente,
        solicitante: form.solicitante,
        responsavel: form.responsavel,
        motivo: form.motivo.trim(),
        status: "agendada",
      };

      setVisitas((prev) => [novaVisita, ...prev]);
      setFeedback(`Nova visita agendada para ${formatDate(form.data)}.`);
    }

    setVisitaEmEdicaoId(null);
    setOpenModal(false);
  };

  return (
    <div className="h-full bg-slate-50 overflow-auto">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <ChevronRight className="w-4 h-4" />
              <span>Menu principal</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Agendar visita</span>
            </div>
            <h1 className="text-2xl text-slate-900">Gestão de visitas</h1>
            <p className="text-sm text-slate-500 mt-1">
              Visualize as últimas visitas e organize os próximos agendamentos.
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
        {feedback && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-2">
            {feedback}
          </div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base text-slate-900">Últimas visitas realizadas</h2>
              <p className="text-sm text-slate-500 mt-1">Leitura rápida das visitas já concluídas.</p>
            </div>
            <button
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-sm hover:bg-black transition-colors"
            >
              <CalendarPlus className="w-4 h-4" />
              Agendar nova visita
            </button>
          </div>

          {visitasRealizadas.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Nenhuma visita realizada encontrada.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="max-h-[420px] overflow-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-100 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Data</th>
                      <th className="px-4 py-3 text-left font-medium">Cliente</th>
                      <th className="px-4 py-3 text-left font-medium">Responsável</th>
                      <th className="px-4 py-3 text-left font-medium">Motivo</th>
                      <th className="px-4 py-3 text-right font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {visitasRealizadas.map((visita, index) => (
                      <tr key={visita.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                        <td className="px-4 py-3 align-top whitespace-nowrap text-slate-700">
                          {formatDate(visita.data)}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="text-slate-900 font-medium">{visita.cliente}</div>
                          <div className="mt-1 text-xs text-slate-500">Solicitante: {visita.solicitante}</div>
                        </td>
                        <td className="px-4 py-3 align-top text-slate-700">{visita.responsavel}</td>
                        <td className="px-4 py-3 align-top">
                          <span className="block max-w-[420px] truncate text-slate-600" title={visita.motivo}>
                            {visita.motivo}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => abrirDetalhesVisita(visita)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                              title="Visualizar detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => abrirEdicaoVisita(visita)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                              title="Editar visita"
                            >
                              <PencilLine className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => cancelarVisita(visita.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Cancelar visita"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Próximas visitas agendadas</h2>

          {proximasVisitas.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Nenhuma visita agendada no momento.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="max-h-[420px] overflow-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-100 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Data</th>
                      <th className="px-4 py-3 text-left font-medium">Cliente</th>
                      <th className="px-4 py-3 text-left font-medium">Responsável</th>
                      <th className="px-4 py-3 text-left font-medium">Motivo</th>
                      <th className="px-4 py-3 text-right font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {proximasVisitas.map((visita, index) => {
                      const statusBadge = getStatusBadgeLabel(visita.data);

                      return (
                        <tr key={visita.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                          <td className="px-4 py-3 align-top whitespace-nowrap text-slate-700">
                            <div>{formatDate(visita.data)}</div>
                            <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusBadge.className}`}>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="text-slate-900 font-medium">{visita.cliente}</div>
                            <div className="mt-1 text-xs text-slate-500">Solicitante: {visita.solicitante}</div>
                          </td>
                          <td className="px-4 py-3 align-top text-slate-700">{visita.responsavel}</td>
                          <td className="px-4 py-3 align-top">
                            <span className="block max-w-[420px] truncate text-slate-600" title={visita.motivo}>
                              {visita.motivo}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => abrirDetalhesVisita(visita)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                title="Visualizar detalhes"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => abrirEdicaoVisita(visita)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                                title="Editar visita"
                              >
                                <PencilLine className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => cancelarVisita(visita.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                title="Cancelar visita"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      <Dialog open={Boolean(visitaSelecionada)} onOpenChange={(open) => !open && setVisitaSelecionada(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da visita</DialogTitle>
            <DialogDescription>Resumo completo do agendamento selecionado.</DialogDescription>
          </DialogHeader>

          {visitaSelecionada && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Data</p>
                <p className="text-slate-900 mt-1">{formatDate(visitaSelecionada.data)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Cliente</p>
                <p className="text-slate-900 mt-1 font-medium">{visitaSelecionada.cliente}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Solicitante</p>
                <p className="text-slate-900 mt-1">{visitaSelecionada.solicitante}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Responsável</p>
                <p className="text-slate-900 mt-1">{visitaSelecionada.responsavel}</p>
              </div>
              <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Motivo</p>
                <p className="text-slate-900 mt-1">{visitaSelecionada.motivo}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openModal}
        onOpenChange={(open) => {
          setOpenModal(open);
          if (!open) {
            setVisitaEmEdicaoId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{visitaEmEdicaoId ? "Editar visita" : "Agendar nova visita"}</DialogTitle>
            <DialogDescription>
              Preencha os dados da visita para registrar ou atualizar o agendamento.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">Data da visita</label>
              <input
                type="date"
                value={form.data}
                onChange={(event) => updateForm("data", event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Cliente</label>
              <select
                value={form.cliente}
                onChange={(event) => updateForm("cliente", event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                {clientesMock.map((cliente) => (
                  <option key={cliente} value={cliente}>
                    {cliente}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Solicitante da visita</label>
              <select
                value={form.solicitante}
                onChange={(event) => updateForm("solicitante", event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                {solicitantesDisponiveis.map((solicitante) => (
                  <option key={solicitante} value={solicitante}>
                    {solicitante}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Quem irá realizar a visita</label>
              <select
                value={form.responsavel}
                onChange={(event) => updateForm("responsavel", event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                {responsaveisDisponiveis.map((responsavel) => (
                  <option key={responsavel} value={responsavel}>
                    {responsavel}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">Motivo</label>
              <textarea
                rows={4}
                value={form.motivo}
                onChange={(event) => updateForm("motivo", event.target.value)}
                placeholder="Descreva o motivo da visita"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setOpenModal(false)}
              className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAgendarVisita}
              className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              {visitaEmEdicaoId ? "Salvar alterações" : "Confirmar agendamento"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
