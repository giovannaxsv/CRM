import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CalendarPlus,
  ChevronRight,
  Eye,
  PencilLine,
  Search,
  XCircle,
} from "lucide-react";
import { Calendar as CalendarComponent } from "./ui/calendar";
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

interface ProdutoRelatorioItem {
  id: number;
  nome: string;
  demandaMensal: string;
  precoFornecedor: string;
  precoNosso: string;
  status: string;
}

interface CapacidadeProducaoItem {
  id: number;
  produto: string;
  capacidadeProdutiva: string;
  producaoReal: string;
}

interface RelatorioVisitaForm {
  cliente: string;
  comprador: string;
  emailComprador: string;
  celularComprador: string;
  responsavelTecnico: string;
  emailResponsavelTecnico: string;
  celularResponsavelTecnico: string;
  entrada: string;
  saida: string;
  tempo: string;
  objetivosVisita: string;
  questionario: {
    entregaFornecedores: string;
    compraMensalOuSobDemanda: string;
    problemaFrete: string;
    avaliacaoCometa: string;
    principalDesafio: string;
    motivoParouOuNuncaComprou: string;
    frequenciaCometa: string;
  };
  planoAcao: string;
}

type ModoVisualizacao = "lista" | "kanban" | "calendario";

const clientesMock = [
  "AGTECH PRESTADORA DE SERVICOS",
  "AIRONSUL METAIS LTDA",
  "ALBRAS ALUMINIO BRASILEIRO S/A",
  "ALIANÇA METALURGICA",
  "ALFA METALURGIA",
  "BETA INDUSTRIA DE PECAS LTDA",
  "CBA COMPONENTES AUTOMOTIVOS LTDA",
  "DYNAMIC METALURGICA LTDA",
  "ELEVATE INDUSTRIA DE PECAS LTDA",
  "FLEXA SOLUCOES INDUSTRIAIS LTDA",
];

const solicitantesMock = ["Gorete", "Everton", "Keila", "Tatiane"];
const responsaveisVisitaMock = ["Gorete", "Everton", "Keila", "Fernanda"];
const statusProdutoOptions = ["Aprovado", "Em análise", "Pendência", "Rever preço"];

const produtosPrincipaisMock: ProdutoRelatorioItem[] = [
  { id: 1, nome: "Silicio 75%", demandaMensal: "120 ton.", precoFornecedor: "R$ 5.480,00", precoNosso: "R$ 5.150,00", status: "Aprovado" },
  { id: 2, nome: "Silicio 80%", demandaMensal: "95 ton.", precoFornecedor: "R$ 5.920,00", precoNosso: "R$ 5.640,00", status: "Em análise" },
];

const produtosHomologacaoMock: ProdutoRelatorioItem[] = [
  { id: 1, nome: "Silicio baixo fósforo", demandaMensal: "45 ton.", precoFornecedor: "R$ 6.120,00", precoNosso: "R$ 5.980,00", status: "Pendência" },
  { id: 2, nome: "Silicio granulado", demandaMensal: "38 ton.", precoFornecedor: "R$ 6.430,00", precoNosso: "R$ 6.210,00", status: "Rever preço" },
];

const capacidadeProducaoMock: CapacidadeProducaoItem[] = [
  { id: 1, produto: "Cinzento", capacidadeProdutiva: "150", producaoReal: "118" },
  { id: 2, produto: "Nodular", capacidadeProdutiva: "140", producaoReal: "121" },
  { id: 3, produto: "Alumínio", capacidadeProdutiva: "95", producaoReal: "74" },
  { id: 4, produto: "Aço", capacidadeProdutiva: "110", producaoReal: "88" },
  { id: 5, produto: "Outros (Ferro)", capacidadeProdutiva: "65", producaoReal: "42" },
];

const visitasMock: VisitaItem[] = [
  { id: 1, data: "2026-04-03", cliente: "AGTECH PRESTADORA DE SERVICOS", solicitante: "Everton", responsavel: "Keila", motivo: "Acompanhar renovação anual", status: "realizada" },
  { id: 2, data: "2026-04-05", cliente: "AIRONSUL METAIS LTDA", solicitante: "Gorete", responsavel: "Everton", motivo: "Validar requisitos técnicos para nova cotação", status: "realizada" },
  { id: 3, data: "2026-04-10", cliente: "ALBRAS ALUMINIO BRASILEIRO S/A", solicitante: "Keila", responsavel: "Gorete", motivo: "Apresentação de proposta comercial", status: "agendada" },
  { id: 4, data: "2026-04-14", cliente: "ALIANÇA METALURGICA", solicitante: "Everton", responsavel: "Fernanda", motivo: "Revisar cronograma e condições de entrega", status: "agendada" },
  { id: 5, data: "2026-05-05", cliente: "ALFA METALURGIA", solicitante: "Tatiane", responsavel: "Gorete", motivo: "Visita técnica de acompanhamento", status: "agendada" },
  { id: 6, data: "2026-05-05", cliente: "BETA INDUSTRIA DE PECAS LTDA", solicitante: "Gorete", responsavel: "Fernanda", motivo: "Alinhamento de pendências comerciais", status: "realizada" },
  { id: 7, data: "2026-05-12", cliente: "CBA COMPONENTES AUTOMOTIVOS LTDA", solicitante: "Everton", responsavel: "Keila", motivo: "Acompanhamento de negociação", status: "agendada" },
  { id: 8, data: "2026-05-12", cliente: "DYNAMIC METALURGICA LTDA", solicitante: "Keila", responsavel: "Everton", motivo: "Revisão de condições comerciais", status: "agendada" },
];

const defaultRelatorioForm = (cliente = "", responsavelTecnico = ""): RelatorioVisitaForm => ({
  cliente,
  comprador: "",
  emailComprador: "",
  celularComprador: "",
  responsavelTecnico,
  emailResponsavelTecnico: "",
  celularResponsavelTecnico: "",
  entrada: "",
  saida: "",
  tempo: "",
  objetivosVisita: "",
  questionario: {
    entregaFornecedores: "",
    compraMensalOuSobDemanda: "",
    problemaFrete: "",
    avaliacaoCometa: "",
    principalDesafio: "",
    motivoParouOuNuncaComprou: "",
    frequenciaCometa: "",
  },
  planoAcao: "",
});

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

function isVisitaAtrasada(visita: VisitaItem) {
  if (visita.status !== "agendada") {
    return false;
  }

  const hoje = new Date();
  const localHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime();
  const visitaData = new Date(`${visita.data}T00:00:00`).getTime();

  return visitaData < localHoje;
}

function getKanbanStatus(visita: VisitaItem): "agendada" | "finalizada" | "cancelada" | "atrasada" {
  if (visita.status === "cancelada") {
    return "cancelada";
  }

  if (visita.status === "realizada") {
    return "finalizada";
  }

  return isVisitaAtrasada(visita) ? "atrasada" : "agendada";
}

function getKanbanStatusLabel(status: "agendada" | "finalizada" | "cancelada" | "atrasada") {
  switch (status) {
    case "agendada":
      return { label: "Agendada", className: "border-blue-200 bg-blue-50 text-blue-800" };
    case "finalizada":
      return { label: "Finalizada", className: "border-emerald-200 bg-emerald-50 text-emerald-800" };
    case "cancelada":
      return { label: "Cancelada", className: "border-rose-200 bg-rose-50 text-rose-800" };
    case "atrasada":
      return { label: "Atrasada", className: "border-amber-200 bg-amber-50 text-amber-800" };
  }
}

export function AgendarVisitaView({ onBackToMain, vendedorFiltro }: AgendarVisitaViewProps) {
  const [visitas, setVisitas] = useState<VisitaItem[]>(visitasMock);
  const [modoVisualizacao, setModoVisualizacao] = useState<ModoVisualizacao>("lista");
  const [dataCalendarioSelecionada, setDataCalendarioSelecionada] = useState<Date>(() => new Date());
  const [openModal, setOpenModal] = useState(false);
  const [openRelatorioModal, setOpenRelatorioModal] = useState(false);
  const [visitaSelecionada, setVisitaSelecionada] = useState<VisitaItem | null>(null);
  const [visitaParaRelatorio, setVisitaParaRelatorio] = useState<VisitaItem | null>(null);
  const [visitaEmEdicaoId, setVisitaEmEdicaoId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | VisitaItem["status"]>("todos");
  const [filtroSolicitante, setFiltroSolicitante] = useState("todos");
  const [filtroResponsavel, setFiltroResponsavel] = useState("todos");
  const [form, setForm] = useState<NovaVisitaForm>({
    data: "",
    cliente: "",
    solicitante: "",
    responsavel: "",
    motivo: "",
  });
  const [relatorioForm, setRelatorioForm] = useState<RelatorioVisitaForm>(defaultRelatorioForm());
  const [produtosPrincipais, setProdutosPrincipais] = useState<ProdutoRelatorioItem[]>(produtosPrincipaisMock);
  const [produtosHomologacao, setProdutosHomologacao] = useState<ProdutoRelatorioItem[]>(produtosHomologacaoMock);
  const [capacidadeProducao, setCapacidadeProducao] = useState<CapacidadeProducaoItem[]>(capacidadeProducaoMock);

  const visitasVisiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return visitas;
    }

    return visitas.filter((visita) => visita.solicitante === vendedorFiltro || visita.responsavel === vendedorFiltro);
  }, [visitas, vendedorFiltro]);

  const solicitantesDisponiveisFiltro = useMemo(() => {
    return Array.from(new Set(visitasVisiveis.map((visita) => visita.solicitante))).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [visitasVisiveis]);

  const responsaveisDisponiveisFiltro = useMemo(() => {
    return Array.from(new Set(visitasVisiveis.map((visita) => visita.responsavel))).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [visitasVisiveis]);

  const visitasFiltradas = useMemo(() => {
    const busca = filtroBusca.trim().toLowerCase();

    return visitasVisiveis.filter((visita) => {
      const statusCorresponde = filtroStatus === "todos" || visita.status === filtroStatus;
      const solicitanteCorresponde = filtroSolicitante === "todos" || visita.solicitante === filtroSolicitante;
      const responsavelCorresponde = filtroResponsavel === "todos" || visita.responsavel === filtroResponsavel;
      const buscaCorresponde =
        !busca ||
        visita.cliente.toLowerCase().includes(busca) ||
        visita.motivo.toLowerCase().includes(busca);

      return statusCorresponde && solicitanteCorresponde && responsavelCorresponde && buscaCorresponde;
    });
  }, [filtroBusca, filtroResponsavel, filtroSolicitante, filtroStatus, visitasVisiveis]);

  const visitasRealizadas = useMemo(
    () => [...visitasFiltradas].filter((visita) => visita.status === "realizada").sort((a, b) => compareDateStrings(b.data, a.data)),
    [visitasFiltradas],
  );

  const proximasVisitas = useMemo(
    () => [...visitasFiltradas].filter((visita) => visita.status === "agendada").sort((a, b) => compareDateStrings(a.data, b.data)),
    [visitasFiltradas],
  );

  const visitasKanban = useMemo(() => {
    return visitasFiltradas.reduce<Record<"agendada" | "finalizada" | "cancelada" | "atrasada", VisitaItem[]>>(
      (acc, visita) => {
        acc[getKanbanStatus(visita)].push(visita);
        return acc;
      },
      { agendada: [], finalizada: [], cancelada: [], atrasada: [] },
    );
  }, [visitasFiltradas]);

  const dataCalendarioISO = useMemo(() => dataCalendarioSelecionada.toISOString().slice(0, 10), [dataCalendarioSelecionada]);
  const visitasDoDiaSelecionado = useMemo(
    () => visitasFiltradas.filter((visita) => visita.data === dataCalendarioISO).sort((a, b) => compareDateStrings(a.data, b.data)),
    [dataCalendarioISO, visitasFiltradas],
  );
  const visitasNoMesSelecionado = useMemo(() => {
    const ano = dataCalendarioSelecionada.getFullYear();
    const mes = dataCalendarioSelecionada.getMonth();

    return visitasFiltradas.filter((visita) => {
      const dataVisita = new Date(`${visita.data}T00:00:00`);
      return dataVisita.getFullYear() === ano && dataVisita.getMonth() === mes;
    });
  }, [dataCalendarioSelecionada, visitasFiltradas]);

  const solicitantesDisponiveis = vendedorFiltro ? [vendedorFiltro] : solicitantesMock;
  const responsaveisDisponiveis = vendedorFiltro ? [vendedorFiltro] : responsaveisVisitaMock;

  const updateForm = (field: keyof NovaVisitaForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateRelatorioField = <K extends keyof RelatorioVisitaForm>(field: K, value: RelatorioVisitaForm[K]) => {
    setRelatorioForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateQuestionarioField = (field: keyof RelatorioVisitaForm["questionario"], value: string) => {
    setRelatorioForm((prev) => ({
      ...prev,
      questionario: {
        ...prev.questionario,
        [field]: value,
      },
    }));
  };

  const updateProdutoRow = (setRows: typeof setProdutosPrincipais, rowId: number, field: keyof ProdutoRelatorioItem, value: string) => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)));
  };

  const updateCapacidadeRow = (rowId: number, field: keyof CapacidadeProducaoItem, value: string) => {
    setCapacidadeProducao((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)));
  };

  const calcularDeltaCapacidade = (capacidade: string, producaoReal: string) => {
    const capacidadeNumero = Number.parseFloat(capacidade.replace(",", "."));
    const producaoNumero = Number.parseFloat(producaoReal.replace(",", "."));

    if (Number.isNaN(capacidadeNumero) || Number.isNaN(producaoNumero)) {
      return "-";
    }

    return (capacidadeNumero - producaoNumero).toFixed(1);
  };

  const handleOpenModal = () => {
    setFeedback("");
    setVisitaEmEdicaoId(null);
    setForm({ data: "", cliente: "", solicitante: vendedorFiltro ?? "", responsavel: vendedorFiltro ?? "", motivo: "" });
    setOpenModal(true);
  };

  const abrirDetalhesVisita = (visita: VisitaItem) => setVisitaSelecionada(visita);

  const abrirEdicaoVisita = (visita: VisitaItem) => {
    setFeedback("");
    setVisitaEmEdicaoId(visita.id);
    setForm({ data: visita.data, cliente: visita.cliente, solicitante: visita.solicitante, responsavel: visita.responsavel, motivo: visita.motivo });
    setOpenModal(true);
  };

  const abrirRelatorioVisita = (visita: VisitaItem) => {
    setVisitaParaRelatorio(visita);
    setRelatorioForm(defaultRelatorioForm(visita.cliente, visita.responsavel));
    setProdutosPrincipais(produtosPrincipaisMock);
    setProdutosHomologacao(produtosHomologacaoMock);
    setCapacidadeProducao(capacidadeProducaoMock);
    setVisitaSelecionada(null);
    setOpenRelatorioModal(true);
  };

  const atualizarStatusVisita = (visitaId: number, status: VisitaItem["status"]) => {
    setVisitas((prev) => prev.map((visita) => (visita.id === visitaId ? { ...visita, status } : visita)));
    setVisitaSelecionada((prev) => (prev && prev.id === visitaId ? { ...prev, status } : prev));
    setFeedback(status === "realizada" ? "Visita marcada como finalizada." : status === "cancelada" ? "Visita marcada como cancelada." : "Status da visita atualizado.");
  };

  const cancelarVisita = (visitaId: number) => {
    setVisitas((prev) => prev.map((visita) => (visita.id === visitaId ? { ...visita, status: "cancelada" } : visita)));
    setFeedback("Visita cancelada com sucesso.");
    setVisitaSelecionada(null);
  };

  const handleAgendarVisita = () => {
    if (!form.data || !form.cliente || !form.solicitante || !form.responsavel || !form.motivo.trim()) {
      setFeedback("Preencha todos os campos para agendar a visita.");
      return;
    }

    if (visitaEmEdicaoId) {
      setVisitas((prev) =>
        prev.map((visita) =>
          visita.id === visitaEmEdicaoId
            ? { ...visita, data: form.data, cliente: form.cliente, solicitante: form.solicitante, responsavel: form.responsavel, motivo: form.motivo.trim() }
            : visita,
        ),
      );
      setFeedback(`Visita atualizada para ${formatDate(form.data)}.`);
    } else {
      setVisitas((prev) => [
        { id: Date.now(), data: form.data, cliente: form.cliente, solicitante: form.solicitante, responsavel: form.responsavel, motivo: form.motivo.trim(), status: "agendada" },
        ...prev,
      ]);
      setFeedback(`Nova visita agendada para ${formatDate(form.data)}.`);
    }

    setVisitaEmEdicaoId(null);
    setOpenModal(false);
  };

  const handleSalvarRelatorio = () => {
    if (!relatorioForm.cliente || !relatorioForm.comprador || !relatorioForm.responsavelTecnico || !relatorioForm.planoAcao.trim()) {
      setFeedback("Preencha os dados principais do relatório antes de salvar.");
      return;
    }

    const resumoRelatorio = relatorioForm.objetivosVisita.trim() || "Relatório técnico registrado";

    if (visitaParaRelatorio) {
      setVisitas((prev) =>
        prev.map((visita) =>
          visita.id === visitaParaRelatorio.id
            ? { ...visita, cliente: relatorioForm.cliente, responsavel: relatorioForm.responsavelTecnico, motivo: resumoRelatorio }
            : visita,
        ),
      );
      setFeedback("Relatório de visita salvo com sucesso.");
    } else {
      setVisitas((prev) => [
        {
          id: Date.now(),
          data: new Date().toISOString().slice(0, 10),
          cliente: relatorioForm.cliente,
          solicitante: relatorioForm.comprador,
          responsavel: relatorioForm.responsavelTecnico,
          motivo: resumoRelatorio,
          status: "realizada",
        },
        ...prev,
      ]);
      setFeedback("Novo relatório de visita registrado.");
    }

    setOpenRelatorioModal(false);
    setVisitaParaRelatorio(null);
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
            <p className="text-sm text-slate-500 mt-1">Visualize as últimas visitas e organize os próximos agendamentos.</p>
          </div>
          <button onClick={onBackToMain} className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao menu
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {feedback && <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-2">{feedback}</div>}

        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base text-slate-900">Filtros estratégicos</h2>
              <p className="text-sm text-slate-500 mt-1">Use critérios comerciais para localizar visitas com mais rapidez.</p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">{visitasFiltradas.length} registro(s) visível(is)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Busca rápida</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={filtroBusca} onChange={(event) => setFiltroBusca(event.target.value)} placeholder="Cliente ou motivo" className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Status estratégico</label>
              <select value={filtroStatus} onChange={(event) => setFiltroStatus(event.target.value as "todos" | VisitaItem["status"])} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                <option value="todos">Todos os status</option>
                <option value="agendada">Agendada</option>
                <option value="realizada">Realizada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Solicitante</label>
              <select value={filtroSolicitante} onChange={(event) => setFiltroSolicitante(event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                <option value="todos">Todos os solicitantes</option>
                {solicitantesDisponiveisFiltro.map((solicitante) => <option key={solicitante} value={solicitante}>{solicitante}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Responsável</label>
              <select value={filtroResponsavel} onChange={(event) => setFiltroResponsavel(event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                <option value="todos">Todos os responsáveis</option>
                {responsaveisDisponiveisFiltro.map((responsavel) => <option key={responsavel} value={responsavel}>{responsavel}</option>)}
              </select>
            </div>
          </div>

          {(filtroBusca || filtroStatus !== "todos" || filtroSolicitante !== "todos" || filtroResponsavel !== "todos") && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <button type="button" onClick={() => { setFiltroBusca(""); setFiltroStatus("todos"); setFiltroSolicitante("todos"); setFiltroResponsavel("todos"); }} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:bg-slate-50 transition-colors">
                Limpar filtros
              </button>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base text-slate-900">Visão das visitas</h2>
              <p className="text-sm text-slate-500 mt-1">Alterna entre a leitura em lista, kanban e calendário.</p>
            </div>
            <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white p-1">
              <button type="button" onClick={() => setModoVisualizacao("lista")} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${modoVisualizacao === "lista" ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-100"}`}>Lista</button>
              <button type="button" onClick={() => setModoVisualizacao("kanban")} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${modoVisualizacao === "kanban" ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-100"}`}>Kanban</button>
              <button type="button" onClick={() => setModoVisualizacao("calendario")} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${modoVisualizacao === "calendario" ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-100"}`}>Calendário</button>
            </div>
          </div>

          {modoVisualizacao === "lista" ? (
            <div className="space-y-6">
              <section>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base text-slate-900">Últimas visitas realizadas</h3>
                    <p className="text-sm text-slate-500 mt-1">Leitura rápida das visitas já concluídas.</p>
                  </div>
                  <button onClick={handleOpenModal} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-sm hover:bg-black transition-colors">
                    <CalendarPlus className="w-4 h-4" />
                    Agendar nova visita
                  </button>
                </div>

                {visitasRealizadas.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Nenhuma visita realizada encontrada.</div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="max-h-[420px] overflow-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="sticky top-0 z-10 bg-slate-100 text-slate-600"><tr><th className="px-4 py-3 text-left font-medium">Data</th><th className="px-4 py-3 text-left font-medium">Cliente</th><th className="px-4 py-3 text-left font-medium">Responsável</th><th className="px-4 py-3 text-left font-medium">Motivo</th><th className="px-4 py-3 text-right font-medium">Ações</th></tr></thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {visitasRealizadas.map((visita, index) => (
                            <tr key={visita.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                              <td className="px-4 py-3 align-top whitespace-nowrap text-slate-700">{formatDate(visita.data)}</td>
                              <td className="px-4 py-3 align-top"><div className="text-slate-900 font-medium">{visita.cliente}</div><div className="mt-1 text-xs text-slate-500">Solicitante: {visita.solicitante}</div></td>
                              <td className="px-4 py-3 align-top text-slate-700">{visita.responsavel}</td>
                              <td className="px-4 py-3 align-top"><span className="block max-w-[420px] truncate text-slate-600" title={visita.motivo}>{visita.motivo}</span></td>
                              <td className="px-4 py-3 align-top"><div className="flex items-center justify-end gap-2"><button type="button" onClick={() => abrirDetalhesVisita(visita)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors" title="Visualizar detalhes"><Eye className="h-4 w-4" /></button><button type="button" onClick={() => abrirEdicaoVisita(visita)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors" title="Editar visita"><PencilLine className="h-4 w-4" /></button><button type="button" onClick={() => cancelarVisita(visita.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors" title="Cancelar visita"><XCircle className="h-4 w-4" /></button></div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-base text-slate-900 mb-4">Próximas visitas agendadas</h3>
                {proximasVisitas.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Nenhuma visita agendada no momento.</div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <div className="max-h-[420px] overflow-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="sticky top-0 z-10 bg-slate-100 text-slate-600"><tr><th className="px-4 py-3 text-left font-medium">Data</th><th className="px-4 py-3 text-left font-medium">Cliente</th><th className="px-4 py-3 text-left font-medium">Responsável</th><th className="px-4 py-3 text-left font-medium">Motivo</th><th className="px-4 py-3 text-right font-medium">Ações</th></tr></thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {proximasVisitas.map((visita, index) => {
                            const statusBadge = getStatusBadgeLabel(visita.data);
                            return (
                              <tr key={visita.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                                <td className="px-4 py-3 align-top whitespace-nowrap text-slate-700"><div>{formatDate(visita.data)}</div><span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusBadge.className}`}>{statusBadge.label}</span></td>
                                <td className="px-4 py-3 align-top"><div className="text-slate-900 font-medium">{visita.cliente}</div><div className="mt-1 text-xs text-slate-500">Solicitante: {visita.solicitante}</div></td>
                                <td className="px-4 py-3 align-top text-slate-700">{visita.responsavel}</td>
                                <td className="px-4 py-3 align-top"><span className="block max-w-[420px] truncate text-slate-600" title={visita.motivo}>{visita.motivo}</span></td>
                                <td className="px-4 py-3 align-top"><div className="flex items-center justify-end gap-2"><button type="button" onClick={() => abrirDetalhesVisita(visita)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors" title="Visualizar detalhes"><Eye className="h-4 w-4" /></button><button type="button" onClick={() => abrirEdicaoVisita(visita)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors" title="Editar visita"><PencilLine className="h-4 w-4" /></button><button type="button" onClick={() => cancelarVisita(visita.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors" title="Cancelar visita"><XCircle className="h-4 w-4" /></button></div></td>
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
          ) : modoVisualizacao === "kanban" ? (
            <section>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base text-slate-900">Kanban de visitas</h3>
                  <p className="text-sm text-slate-500 mt-1">Agrupado por status operacional da visita.</p>
                </div>
                <button onClick={handleOpenModal} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-sm hover:bg-black transition-colors">
                  <CalendarPlus className="w-4 h-4" />
                  Agendar nova visita
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                {(["agendada", "finalizada", "cancelada", "atrasada"] as const).map((status) => {
                  const statusMeta = getKanbanStatusLabel(status);
                  const visitasDaColuna = visitasKanban[status];

                  return (
                    <div key={status} className="flex min-h-[24rem] flex-col rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className={`rounded-lg border px-3 py-2 ${statusMeta.className}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-medium">{statusMeta.label}</h4>
                            <p className="mt-1 text-xs opacity-80">{status === "agendada" ? "Visitas programadas para os próximos dias." : status === "finalizada" ? "Visitas concluídas e sinalizadas pelo usuário." : status === "cancelada" ? "Visitas descartadas ou interrompidas." : "Visitas agendadas com prazo vencido."}</p>
                          </div>
                          <span className="rounded-full border border-white/60 bg-white/60 px-2 py-0.5 text-[11px] font-medium">{visitasDaColuna.length}</span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-3 overflow-auto pr-1">
                        {visitasDaColuna.length === 0 ? (
                          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-4 text-center text-xs text-slate-500">Nenhuma visita nesta coluna.</div>
                        ) : (
                          visitasDaColuna.map((visita) => (
                            <button key={visita.id} type="button" onClick={() => abrirDetalhesVisita(visita)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-left shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm text-slate-900">{visita.cliente}</p>
                                  <p className="mt-1 text-xs text-slate-500">{formatDate(visita.data)}</p>
                                  <p className="mt-2 line-clamp-2 text-xs text-slate-600">{visita.motivo}</p>
                                </div>
                                <Eye className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                              </div>
                              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500"><span className="inline-flex items-center gap-1">Solicitante: {visita.solicitante}</span><span className="inline-flex items-center gap-1">Responsável: {visita.responsavel}</span></div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            <section>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base text-slate-900">Calendário de visitas</h3>
                  <p className="text-sm text-slate-500 mt-1">Selecione um dia para ver os registros associados ao compromisso.</p>
                </div>
                <button onClick={handleOpenModal} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-sm hover:bg-black transition-colors">
                  <CalendarIcon className="w-4 h-4" />
                  Agendar nova visita
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Calendário</h4>
                      <p className="text-xs text-slate-500 mt-1">{visitasNoMesSelecionado.length} registro(s) no mês.</p>
                    </div>
                    <button type="button" onClick={() => setDataCalendarioSelecionada(new Date())} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors">Hoje</button>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                    <CalendarComponent mode="single" selected={dataCalendarioSelecionada} onSelect={(date) => date && setDataCalendarioSelecionada(date)} className="w-full" />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Registros de {formatDate(dataCalendarioISO)}</h4>
                      <p className="text-xs text-slate-500 mt-1">{visitasDoDiaSelecionado.length} compromisso(s) encontrados para o dia selecionado.</p>
                    </div>
                  </div>

                  {visitasDoDiaSelecionado.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">Nenhuma visita encontrada para este dia.</div>
                  ) : (
                    <div className="space-y-3">
                      {visitasDoDiaSelecionado.map((visita) => {
                        const statusBadge = getStatusBadgeLabel(visita.data);
                        return (
                          <div key={visita.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300 hover:bg-white">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <h5 className="text-sm font-medium text-slate-900">{visita.cliente}</h5>
                                <p className="mt-1 text-xs text-slate-500">{visita.motivo}</p>
                              </div>
                              <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusBadge.className}`}>{statusBadge.label}</span>
                            </div>

                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                              <div><p className="text-slate-500">Solicitante</p><p className="mt-1 text-slate-900">{visita.solicitante}</p></div>
                              <div><p className="text-slate-500">Responsável</p><p className="mt-1 text-slate-900">{visita.responsavel}</p></div>
                              <div><p className="text-slate-500">Data</p><p className="mt-1 text-slate-900">{formatDate(visita.data)}</p></div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <button type="button" onClick={() => abrirDetalhesVisita(visita)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 transition-colors"><Eye className="h-3.5 w-3.5" /> Ver detalhes</button>
                              <button type="button" onClick={() => abrirEdicaoVisita(visita)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 transition-colors"><PencilLine className="h-3.5 w-3.5" /> Editar</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
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
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Data</p><p className="text-slate-900 mt-1">{formatDate(visitaSelecionada.data)}</p></div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Cliente</p><p className="text-slate-900 mt-1 font-medium">{visitaSelecionada.cliente}</p></div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Solicitante</p><p className="text-slate-900 mt-1">{visitaSelecionada.solicitante}</p></div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Responsável</p><p className="text-slate-900 mt-1">{visitaSelecionada.responsavel}</p></div>
              <div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-xs text-slate-500">Motivo</p><p className="text-slate-900 mt-1">{visitaSelecionada.motivo}</p></div>
              <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white p-3">
                <label className="block text-xs text-slate-500 mb-2">Status da visita</label>
                <select value={visitaSelecionada.status} onChange={(event) => atualizarStatusVisita(visitaSelecionada.id, event.target.value as VisitaItem["status"])} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                  <option value="agendada">Agendada</option>
                  <option value="realizada">Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
                <p className="mt-2 text-xs text-slate-500">Use este campo para sinalizar o andamento da visita sem sair dos detalhes.</p>
                {visitaSelecionada.status === "realizada" && (
                  <button type="button" onClick={() => abrirRelatorioVisita(visitaSelecionada)} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700 transition-colors">Registrar relatório de visita</button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openModal} onOpenChange={(open) => { setOpenModal(open); if (!open) setVisitaEmEdicaoId(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{visitaEmEdicaoId ? "Editar visita" : "Agendar nova visita"}</DialogTitle>
            <DialogDescription>Preencha os dados da visita para registrar ou atualizar o agendamento.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm text-slate-700 mb-2">Data da visita</label><input type="date" value={form.data} onChange={(event) => updateForm("data", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent" /></div>
            <div><label className="block text-sm text-slate-700 mb-2">Cliente</label><select value={form.cliente} onChange={(event) => updateForm("cliente", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"><option value="">Selecione</option>{clientesMock.map((cliente) => <option key={cliente} value={cliente}>{cliente}</option>)}</select></div>
            <div><label className="block text-sm text-slate-700 mb-2">Solicitante da visita</label><select value={form.solicitante} onChange={(event) => updateForm("solicitante", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"><option value="">Selecione</option>{solicitantesDisponiveis.map((solicitante) => <option key={solicitante} value={solicitante}>{solicitante}</option>)}</select></div>
            <div><label className="block text-sm text-slate-700 mb-2">Quem irá realizar a visita</label><select value={form.responsavel} onChange={(event) => updateForm("responsavel", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"><option value="">Selecione</option>{responsaveisDisponiveis.map((responsavel) => <option key={responsavel} value={responsavel}>{responsavel}</option>)}</select></div>
            <div className="md:col-span-2"><label className="block text-sm text-slate-700 mb-2">Motivo</label><textarea rows={4} value={form.motivo} onChange={(event) => updateForm("motivo", event.target.value)} placeholder="Descreva o motivo da visita" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent" /></div>
          </div>

          <DialogFooter>
            <button onClick={() => setOpenModal(false)} className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors">Cancelar</button>
            <button onClick={handleAgendarVisita} className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors">{visitaEmEdicaoId ? "Salvar alterações" : "Confirmar agendamento"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openRelatorioModal} onOpenChange={(open) => { setOpenRelatorioModal(open); if (!open) setVisitaParaRelatorio(null); }}>
        <DialogContent className="sm:max-w-6xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>RELATÓRIO DE VISITA TÉCNICA</DialogTitle>
            <DialogDescription>Preencha o card com os dados da visita, produtos analisados e o plano de ação.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-medium text-slate-900 mb-4">Dados da visita</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="md:col-span-2"><label className="block text-sm text-slate-700 mb-2">Cliente</label><select value={relatorioForm.cliente} onChange={(event) => updateRelatorioField("cliente", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500"><option value="">Selecione</option>{clientesMock.map((cliente) => <option key={cliente} value={cliente}>{cliente}</option>)}</select></div>
                <div><label className="block text-sm text-slate-700 mb-2">Comprador</label><input value={relatorioForm.comprador} onChange={(event) => updateRelatorioField("comprador", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div><label className="block text-sm text-slate-700 mb-2">e-mail</label><input type="email" value={relatorioForm.emailComprador} onChange={(event) => updateRelatorioField("emailComprador", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div><label className="block text-sm text-slate-700 mb-2">cel</label><input value={relatorioForm.celularComprador} onChange={(event) => updateRelatorioField("celularComprador", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div><label className="block text-sm text-slate-700 mb-2">Responsável técnico</label><input value={relatorioForm.responsavelTecnico} onChange={(event) => updateRelatorioField("responsavelTecnico", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div><label className="block text-sm text-slate-700 mb-2">e-mail</label><input type="email" value={relatorioForm.emailResponsavelTecnico} onChange={(event) => updateRelatorioField("emailResponsavelTecnico", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div><label className="block text-sm text-slate-700 mb-2">cel</label><input value={relatorioForm.celularResponsavelTecnico} onChange={(event) => updateRelatorioField("celularResponsavelTecnico", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div><label className="block text-sm text-slate-700 mb-2">Entrada</label><input type="time" value={relatorioForm.entrada} onChange={(event) => updateRelatorioField("entrada", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div><label className="block text-sm text-slate-700 mb-2">Saída</label><input type="time" value={relatorioForm.saida} onChange={(event) => updateRelatorioField("saida", event.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div><label className="block text-sm text-slate-700 mb-2">Tempo</label><input value={relatorioForm.tempo} onChange={(event) => updateRelatorioField("tempo", event.target.value)} placeholder="Ex.: 2h 30min" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Objetivos da visita</h3>
              <textarea rows={5} value={relatorioForm.objetivosVisita} onChange={(event) => updateRelatorioField("objetivosVisita", event.target.value)} placeholder="Descreva os resultados esperados" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
              <h3 className="text-sm font-medium text-slate-900">Produtos principais</h3>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-100 text-slate-600"><tr><th className="px-4 py-3 text-left font-medium">Principais produtos</th><th className="px-4 py-3 text-left font-medium">Demanda mensal</th><th className="px-4 py-3 text-left font-medium">Preço praticado com fornecedor</th><th className="px-4 py-3 text-left font-medium">Preço praticado por nós</th><th className="px-4 py-3 text-left font-medium">Nosso status</th></tr></thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {produtosPrincipais.map((produto) => (
                        <tr key={produto.id}>
                          <td className="px-4 py-3"><input value={produto.nome} onChange={(event) => updateProdutoRow(setProdutosPrincipais, produto.id, "nome", event.target.value)} className="w-full min-w-[220px] rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" /></td>
                          <td className="px-4 py-3"><input value={produto.demandaMensal} onChange={(event) => updateProdutoRow(setProdutosPrincipais, produto.id, "demandaMensal", event.target.value)} className="w-full min-w-[150px] rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" /></td>
                          <td className="px-4 py-3"><input value={produto.precoFornecedor} onChange={(event) => updateProdutoRow(setProdutosPrincipais, produto.id, "precoFornecedor", event.target.value)} className="w-full min-w-[170px] rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" /></td>
                          <td className="px-4 py-3"><input value={produto.precoNosso} onChange={(event) => updateProdutoRow(setProdutosPrincipais, produto.id, "precoNosso", event.target.value)} className="w-full min-w-[170px] rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" /></td>
                          <td className="px-4 py-3"><select value={produto.status} onChange={(event) => updateProdutoRow(setProdutosPrincipais, produto.id, "status", event.target.value)} className="w-full min-w-[150px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">{statusProdutoOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
              <h3 className="text-sm font-medium text-slate-900">Produtos para homologação</h3>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-100 text-slate-600"><tr><th className="px-4 py-3 text-left font-medium">Principais produtos</th><th className="px-4 py-3 text-left font-medium">Demanda mensal</th><th className="px-4 py-3 text-left font-medium">Preço praticado com fornecedor</th><th className="px-4 py-3 text-left font-medium">Preço praticado por nós</th><th className="px-4 py-3 text-left font-medium">Nosso status</th></tr></thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {produtosHomologacao.map((produto) => (
                        <tr key={produto.id}>
                          <td className="px-4 py-3"><input value={produto.nome} onChange={(event) => updateProdutoRow(setProdutosHomologacao, produto.id, "nome", event.target.value)} className="w-full min-w-[220px] rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" /></td>
                          <td className="px-4 py-3"><input value={produto.demandaMensal} onChange={(event) => updateProdutoRow(setProdutosHomologacao, produto.id, "demandaMensal", event.target.value)} className="w-full min-w-[150px] rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" /></td>
                          <td className="px-4 py-3"><input value={produto.precoFornecedor} onChange={(event) => updateProdutoRow(setProdutosHomologacao, produto.id, "precoFornecedor", event.target.value)} className="w-full min-w-[170px] rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" /></td>
                          <td className="px-4 py-3"><input value={produto.precoNosso} onChange={(event) => updateProdutoRow(setProdutosHomologacao, produto.id, "precoNosso", event.target.value)} className="w-full min-w-[170px] rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500" /></td>
                          <td className="px-4 py-3"><select value={produto.status} onChange={(event) => updateProdutoRow(setProdutosHomologacao, produto.id, "status", event.target.value)} className="w-full min-w-[150px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">{statusProdutoOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
              <h3 className="text-sm font-medium text-slate-900">Questionário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className="block text-sm text-slate-700 mb-2">Qual o modelo de entrega dos principais fornecedores? (CIF ou FOB)</label><textarea rows={3} value={relatorioForm.questionario.entregaFornecedores} onChange={(event) => updateQuestionarioField("entregaFornecedores", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div className="md:col-span-2"><label className="block text-sm text-slate-700 mb-2">O cliente costuma comprar mensalmente ou sob demanda?</label><textarea rows={3} value={relatorioForm.questionario.compraMensalOuSobDemanda} onChange={(event) => updateQuestionarioField("compraMensalOuSobDemanda", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div className="md:col-span-2"><label className="block text-sm text-slate-700 mb-2">Cliente teria ou tem problema com frete?</label><textarea rows={3} value={relatorioForm.questionario.problemaFrete} onChange={(event) => updateQuestionarioField("problemaFrete", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div className="md:col-span-2"><label className="block text-sm text-slate-700 mb-2">Como ele avalia a qualidade dos produtos Cometa?</label><textarea rows={3} value={relatorioForm.questionario.avaliacaoCometa} onChange={(event) => updateQuestionarioField("avaliacaoCometa", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div className="md:col-span-2"><label className="block text-sm text-slate-700 mb-2">Qual o principal desafio do cliente em relação aos fornecedores?</label><textarea rows={3} value={relatorioForm.questionario.principalDesafio} onChange={(event) => updateQuestionarioField("principalDesafio", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div className="md:col-span-2"><label className="block text-sm text-slate-700 mb-2">Qual o motivo de ter parado de comprar ou de nunca ter comprado conosco?</label><textarea rows={3} value={relatorioForm.questionario.motivoParouOuNuncaComprou} onChange={(event) => updateQuestionarioField("motivoParouOuNuncaComprou", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
                <div className="md:col-span-2"><label className="block text-sm text-slate-700 mb-2">Com qual frequência compra com a Cometa? Há possibilidade de aumentarmos a frequência? Se sim, como?</label><textarea rows={3} value={relatorioForm.questionario.frequenciaCometa} onChange={(event) => updateQuestionarioField("frequenciaCometa", event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500" /></div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
              <h3 className="text-sm font-medium text-slate-900">Capacidade de produção</h3>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-100 text-slate-600"><tr><th className="px-4 py-3 text-left font-medium">Produto</th><th className="px-4 py-3 text-left font-medium">Capacidade produtiva (ton.)</th><th className="px-4 py-3 text-left font-medium">Produção real (ton.)</th><th className="px-4 py-3 text-left font-medium">Delta (ton.)</th></tr></thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {capacidadeProducao.map((row) => (
                        <tr key={row.id}>
                          <td className="px-4 py-3"><input value={row.produto} onChange={(event) => updateCapacidadeRow(row.id, "produto", event.target.value)} className="w-full min-w-[180px] rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500" /></td>
                          <td className="px-4 py-3"><input value={row.capacidadeProdutiva} onChange={(event) => updateCapacidadeRow(row.id, "capacidadeProdutiva", event.target.value)} className="w-full min-w-[160px] rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500" /></td>
                          <td className="px-4 py-3"><input value={row.producaoReal} onChange={(event) => updateCapacidadeRow(row.id, "producaoReal", event.target.value)} className="w-full min-w-[160px] rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500" /></td>
                          <td className="px-4 py-3 text-slate-700">{calcularDeltaCapacidade(row.capacidadeProdutiva, row.producaoReal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Plano de ação</h3>
              <textarea rows={6} value={relatorioForm.planoAcao} onChange={(event) => updateRelatorioField("planoAcao", event.target.value)} placeholder="Descreva o plano de ação" className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500" />
            </section>
          </div>

          <DialogFooter>
            <button onClick={() => setOpenRelatorioModal(false)} className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors">Cancelar</button>
            <button onClick={handleSalvarRelatorio} className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors">Salvar relatório</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
