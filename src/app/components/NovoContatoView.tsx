import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  MessageCircle,
  Phone,
  Plus,
  PlusCircle,
  Search,
  UserRound,
} from "lucide-react";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { produtosReais } from "../../imports/produtosReais";

interface NovoContatoViewProps {
  vendedorFiltro?: string | null;
  isDiretoria?: boolean;
  onBackToMain: () => void;
  onIniciarContato: (clientId: number) => void;
  onEvoluirParaCotacao: (clientId: number) => void;
}

interface ClienteContato {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  vendedor: string;
  status: string;
}

interface ContatoHistorico {
  id: number;
  clienteId: number;
  cliente: string;
  data: string;
  hora: string;
  tipo: string;
  responsavel: string;
  resultado: string;
  resumo: string;
  proximoPasso: string;
  observacoes: string;
  produtosOferecidos: string[];
}

interface FollowUpContato {
  id: number;
  clienteId: number;
  cliente: string;
  data: string;
  hora: string;
  tipo: string;
  responsavel: string;
  assunto: string;
  resultado: string;
  resumo: string;
  proximoPasso: string;
  observacoes: string;
}

const clientesMock: ClienteContato[] = [
  {
    id: 1,
    nome: "FUNDICAO INDUSTRIAL LTDA",
    email: "contact@coffeebeans.com",
    telefone: "(11) 98765-1024",
    vendedor: "Everton",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "A FERROTEGRAO",
    email: "inquiry@panels.com",
    telefone: "(21) 99876-4432",
    vendedor: "Gorete",
    status: "Venda passiva",
  },
  {
    id: 3,
    nome: "A FRIDBERG DO BRASIL INDUSTRI",
    email: "info@solar.com",
    telefone: "(31) 97654-8890",
    vendedor: "Keila",
    status: "Inativo",
  },
];

const contatosHistoricoMock: ContatoHistorico[] = [
  {
    id: 1,
    clienteId: 1,
    cliente: "FUNDICAO INDUSTRIAL LTDA",
    data: "08/04/2026",
    hora: "09:40",
    tipo: "Ligação",
    responsavel: "Everton",
    resultado: "Cliente demonstrou interesse",
    resumo: "Alinhamento sobre volume mensal e janela de entrega para a próxima safra.",
    proximoPasso: "Enviar proposta revisada e agendar retorno em 2 dias.",
    observacoes: "Cliente pediu atenção ao prazo de faturamento.",
    produtosOferecidos: [produtosReais[0], produtosReais[1], produtosReais[4]],
  },
  {
    id: 2,
    clienteId: 2,
    cliente: "A FERROTEGRAO",
    data: "08/04/2026",
    hora: "11:15",
    tipo: "E-mail",
    responsavel: "Gorete",
    resultado: "Aguardando resposta",
    resumo: "Envio de materiais técnicos e documentação comercial para validação interna.",
    proximoPasso: "Acompanhar retorno do time de compras.",
    observacoes: "Cliente sinalizou que a análise será feita ainda nesta semana.",
    produtosOferecidos: [produtosReais[3], produtosReais[5], produtosReais[6], produtosReais[7]],
  },
  {
    id: 3,
    clienteId: 3,
    cliente: "A FRIDBERG DO BRASIL INDUSTRI",
    data: "07/04/2026",
    hora: "14:20",
    tipo: "Reunião",
    responsavel: "Keila",
    resultado: "Necessita ajuste",
    resumo: "Discussão sobre especificação técnica e condição comercial para reativação.",
    proximoPasso: "Reenviar proposta com novo prazo e condições ajustadas.",
    observacoes: "Contato reacendido após período de inatividade.",
    produtosOferecidos: [produtosReais[11], produtosReais[12], produtosReais[13]],
  },
  {
    id: 4,
    clienteId: 1,
    cliente: "FUNDICAO INDUSTRIAL LTDA",
    data: "06/04/2026",
    hora: "10:05",
    tipo: "WhatsApp",
    responsavel: "Everton",
    resultado: "Follow-up positivo",
    resumo: "Confirmação do recebimento da cotação anterior e refinamento de volumes.",
    proximoPasso: "Retornar com o cálculo final da margem.",
    observacoes: "Cliente prefere contato rápido via WhatsApp.",
    produtosOferecidos: [produtosReais[2], produtosReais[8], produtosReais[9]],
  },
  {
    id: 5,
    clienteId: 2,
    cliente: "A FERROTEGRAO",
    data: "05/04/2026",
    hora: "16:30",
    tipo: "Ligação",
    responsavel: "Gorete",
    resultado: "Sem decisão",
    resumo: "Reforço sobre disponibilidade de estoque e logística de entrega.",
    proximoPasso: "Retomar contato após reunião do cliente.",
    observacoes: "Sem objeção comercial no momento.",
    produtosOferecidos: [produtosReais[18], produtosReais[19], produtosReais[20], produtosReais[21]],
  },
  {
    id: 6,
    clienteId: 3,
    cliente: "A FRIDBERG DO BRASIL INDUSTRI",
    data: "04/04/2026",
    hora: "09:10",
    tipo: "E-mail",
    responsavel: "Keila",
    resultado: "Sem retorno",
    resumo: "Envio de proposta inicial e reforço do portfólio disponível.",
    proximoPasso: "Tentar novo contato na próxima semana.",
    observacoes: "Sem resposta ao primeiro envio.",
    produtosOferecidos: [produtosReais[30], produtosReais[31], produtosReais[32]],
  },
];

const followUpsMock: FollowUpContato[] = [
  {
    id: 101,
    clienteId: 1,
    cliente: "FUNDICAO INDUSTRIAL LTDA",
    data: "08/04/2026",
    hora: "16:10",
    tipo: "Follow-up",
    responsavel: "Everton",
    assunto: "Retorno sobre cotação revisada",
    resultado: "Em negociação",
    resumo:
      "Cliente pediu ajuste leve nas condições e confirmou que vai validar internamente com a diretoria.",
    proximoPasso: "Enviar nova versão com prazo atualizado e recontatar em 24 horas.",
    observacoes: "Contato com boa probabilidade de evolução.",
  },
  {
    id: 102,
    clienteId: 1,
    cliente: "FUNDICAO INDUSTRIAL LTDA",
    data: "07/04/2026",
    hora: "10:00",
    tipo: "WhatsApp",
    responsavel: "Everton",
    assunto: "Confirmação de recebimento",
    resultado: "Aguardando retorno",
    resumo:
      "Mensagem enviada para confirmar o recebimento da proposta e alinhar a agenda de decisão.",
    proximoPasso: "Ligar no fim do dia para reforçar a proposta.",
    observacoes: "Cliente respondeu parcialmente no WhatsApp.",
  },
  {
    id: 103,
    clienteId: 2,
    cliente: "A FERROTEGRAO",
    data: "08/04/2026",
    hora: "15:25",
    tipo: "E-mail",
    responsavel: "Gorete",
    assunto: "Envio de documentação comercial",
    resultado: "Em análise",
    resumo:
      "E-mail com documentação e tabela comercial encaminhado para validação do time de compras.",
    proximoPasso: "Aguardar feedback e preparar alternativa de condição comercial.",
    observacoes: "Documentos enviados em resposta a uma solicitação interna.",
  },
  {
    id: 104,
    clienteId: 2,
    cliente: "A FERROTEGRAO",
    data: "06/04/2026",
    hora: "11:50",
    tipo: "Ligação",
    responsavel: "Gorete",
    assunto: "Reforço de disponibilidade",
    resultado: "Sem decisão",
    resumo:
      "Ligação para reforçar disponibilidade de estoque e prazo de entrega.",
    proximoPasso: "Tentar contato após reunião interna do cliente.",
    observacoes: "Sem objeção imediata.",
  },
  {
    id: 105,
    clienteId: 3,
    cliente: "A FRIDBERG DO BRASIL INDUSTRI",
    data: "07/04/2026",
    hora: "14:20",
    tipo: "Reunião",
    responsavel: "Keila",
    assunto: "Reativação de oportunidade",
    resultado: "Necessita ajuste",
    resumo:
      "Reunião para discussão de especificação técnica e reavaliação da condição comercial.",
    proximoPasso: "Reenviar proposta ajustada e validar prazo de aprovação.",
    observacoes: "Contato reacendido após período de inatividade.",
  },
  {
    id: 106,
    clienteId: 3,
    cliente: "A FRIDBERG DO BRASIL INDUSTRI",
    data: "04/04/2026",
    hora: "09:10",
    tipo: "E-mail",
    responsavel: "Keila",
    assunto: "Envio de proposta inicial",
    resultado: "Sem retorno",
    resumo:
      "Envio de proposta inicial com reforço do portfólio disponível e condições base.",
    proximoPasso: "Tentar novo contato na próxima semana.",
    observacoes: "Sem resposta ao primeiro envio.",
  },
];

const motivosSemCotacao = [
  "Cliente sem interesse",
  "Preço fora do esperado",
  "Momento inadequado",
  "Sem orçamento",
  "Concorrência",
  "Outro",
] as const;

function formatarDataHora(data: string, hora: string) {
  return `${data} às ${hora}`;
}

function converterDataParaIso(data: string) {
  const [dia, mes, ano] = data.split("/");

  if (!dia || !mes || !ano) {
    return "";
  }

  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

export function NovoContatoView({
  vendedorFiltro,
  isDiretoria = false,
  onBackToMain,
  onIniciarContato,
  onEvoluirParaCotacao,
}: NovoContatoViewProps) {
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [filtroVendedor, setFiltroVendedor] = useState("");
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<string>("");
  const [contatoSelecionado, setContatoSelecionado] = useState<ContatoHistorico | null>(null);
  const [registroAberto, setRegistroAberto] = useState(false);
  const [novoFollowUpAberto, setNovoFollowUpAberto] = useState(false);
  const [followUpSelecionado, setFollowUpSelecionado] = useState<FollowUpContato | null>(null);
  const [decisaoContato, setDecisaoContato] = useState<"sim" | "nao" | "">("");
  const [motivoSemCotacao, setMotivoSemCotacao] = useState("");
  const [detalheMotivo, setDetalheMotivo] = useState("");
  const [feedbackAcao, setFeedbackAcao] = useState("");
  const [produtosAbertos, setProdutosAbertos] = useState(false);
  const [abaDetalhesContato, setAbaDetalhesContato] = useState<"principal" | "followups">("principal");
  const [tipoFollowUp, setTipoFollowUp] = useState("Ligação");
  const [dataFollowUp, setDataFollowUp] = useState("");
  const [horaFollowUp, setHoraFollowUp] = useState("");
  const [responsavelFollowUp, setResponsavelFollowUp] = useState("");
  const [assuntoFollowUp, setAssuntoFollowUp] = useState("");
  const [resultadoFollowUp, setResultadoFollowUp] = useState("");
  const [resumoFollowUp, setResumoFollowUp] = useState("");
  const [proximoPassoFollowUp, setProximoPassoFollowUp] = useState("");
  const [observacoesFollowUp, setObservacoesFollowUp] = useState("");
  const [followUps, setFollowUps] = useState<FollowUpContato[]>(followUpsMock);

  const clientesDisponiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return clientesMock;
    }

    return clientesMock.filter((cliente) => cliente.vendedor === vendedorFiltro);
  }, [vendedorFiltro]);

  const contatosDisponiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return contatosHistoricoMock;
    }

    return contatosHistoricoMock.filter((contato) => contato.responsavel === vendedorFiltro);
  }, [vendedorFiltro]);

  const vendedoresDisponiveisFiltro = useMemo(() => {
    const vendedores = contatosHistoricoMock.map((contato) => contato.responsavel);
    return Array.from(new Set(vendedores)).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, []);

  const clienteSelecionado = useMemo(() => {
    if (!clienteSelecionadoId) {
      return null;
    }
    return clientesDisponiveis.find((cliente) => cliente.id === Number(clienteSelecionadoId)) ?? null;
  }, [clienteSelecionadoId, clientesDisponiveis]);

  const vendedorAtivoFiltro = isDiretoria ? filtroVendedor : vendedorFiltro ?? "";

  const contatosFiltrados = useMemo(() => {
    const clienteNormalizado = filtroCliente.trim().toLowerCase();
    const dataNormalizada = filtroData.trim();

    return [...contatosDisponiveis]
      .sort((a, b) => {
        const dataB = new Date(`${converterDataParaIso(b.data)}T${b.hora}:00`).getTime();
        const dataA = new Date(`${converterDataParaIso(a.data)}T${a.hora}:00`).getTime();
        return dataB - dataA;
      })
      .filter((contato) => {
        const correspondeCliente =
          !clienteNormalizado || contato.cliente.toLowerCase().includes(clienteNormalizado);
        const correspondeData = !dataNormalizada || converterDataParaIso(contato.data) === dataNormalizada;
        const correspondeVendedor = !vendedorAtivoFiltro || contato.responsavel === vendedorAtivoFiltro;

        return correspondeCliente && correspondeData && correspondeVendedor;
      });
  }, [contatosDisponiveis, filtroCliente, filtroData, vendedorAtivoFiltro]);

  const followUpsDoContatoSelecionado = useMemo(() => {
    if (!contatoSelecionado) {
      return [];
    }

    return [...followUps]
      .filter((followUp) => followUp.clienteId === contatoSelecionado.clienteId)
      .sort((a, b) => {
        const dataB = new Date(`${converterDataParaIso(b.data)}T${b.hora}:00`).getTime();
        const dataA = new Date(`${converterDataParaIso(a.data)}T${a.hora}:00`).getTime();
        return dataB - dataA;
      });
  }, [contatoSelecionado, followUps]);

  const handleAvancar = () => {
    if (!clienteSelecionado) {
      return;
    }
    setRegistroAberto(false);
    onIniciarContato(clienteSelecionado.id);
  };

  const abrirDetalhesContato = (contato: ContatoHistorico) => {
    setContatoSelecionado(contato);
    setAbaDetalhesContato("principal");
    setDecisaoContato("");
    setMotivoSemCotacao("");
    setDetalheMotivo("");
    setFeedbackAcao("");
    setProdutosAbertos(false);
    setFollowUpSelecionado(null);
  };

  const podeFinalizarSemCotacao =
    decisaoContato === "nao" &&
    motivoSemCotacao !== "" &&
    (motivoSemCotacao !== "Outro" || detalheMotivo.trim().length > 0);

  const handleEvoluirParaCotacao = () => {
    if (!contatoSelecionado || decisaoContato !== "sim") {
      return;
    }

    setContatoSelecionado(null);
    onEvoluirParaCotacao(contatoSelecionado.clienteId);
  };

  const handleFinalizarSemCotacao = () => {
    if (!contatoSelecionado || !podeFinalizarSemCotacao) {
      return;
    }

    setFeedbackAcao("Contato finalizado sem cotação com motivo registrado.");
    setTimeout(() => {
      setContatoSelecionado(null);
    }, 700);
  };

  const handleConfirmarEncaminhamento = () => {
    if (decisaoContato === "sim") {
      handleEvoluirParaCotacao();
      return;
    }

    if (decisaoContato === "nao") {
      handleFinalizarSemCotacao();
    }
  };

  const handleFecharDetalhes = (open: boolean) => {
    if (!open) {
      setContatoSelecionado(null);
      setProdutosAbertos(false);
      setNovoFollowUpAberto(false);
      setFollowUpSelecionado(null);
      setAbaDetalhesContato("principal");
    }
  };

  const abrirNovoFollowUp = () => {
    if (!contatoSelecionado) {
      return;
    }

    setTipoFollowUp("Ligação");
    setDataFollowUp(converterDataParaIso(contatoSelecionado.data));
    setHoraFollowUp(contatoSelecionado.hora);
    setResponsavelFollowUp(contatoSelecionado.responsavel);
    setAssuntoFollowUp("");
    setResultadoFollowUp("");
    setResumoFollowUp("");
    setProximoPassoFollowUp("");
    setObservacoesFollowUp("");
    setNovoFollowUpAberto(true);
  };

  const confirmarNovoFollowUp = () => {
    if (!contatoSelecionado) {
      return;
    }

    if (!dataFollowUp || !horaFollowUp || !responsavelFollowUp.trim() || !assuntoFollowUp.trim() || !resultadoFollowUp.trim() || !resumoFollowUp.trim()) {
      return;
    }

    const novaInteracao: FollowUpContato = {
      id: Date.now(),
      clienteId: contatoSelecionado.clienteId,
      cliente: contatoSelecionado.cliente,
      data: new Date(`${dataFollowUp}T00:00:00`).toLocaleDateString("pt-BR"),
      hora: horaFollowUp,
      tipo: tipoFollowUp,
      responsavel: responsavelFollowUp.trim(),
      assunto: assuntoFollowUp.trim(),
      resultado: resultadoFollowUp.trim(),
      resumo: resumoFollowUp.trim(),
      proximoPasso: proximoPassoFollowUp.trim(),
      observacoes: observacoesFollowUp.trim(),
    };

    setFollowUps((previous) => [novaInteracao, ...previous]);
    setNovoFollowUpAberto(false);
  };

  const abrirDetalheFollowUp = (followUp: FollowUpContato) => {
    setFollowUpSelecionado(followUp);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl text-slate-900">Histórico de contatos</h1>
            <p className="text-sm text-slate-500 mt-1">
              Consulte os contatos realizados e registre um novo contato quando necessário.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRegistroAberto(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Registrar novo contato
            </button>
            <button
              onClick={onBackToMain}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Contatos registrados</p>
                <p className="text-2xl text-slate-900 mt-1">{contatosDisponiveis.length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Com evolução para cotação</p>
                <p className="text-2xl text-slate-900 mt-1">3</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Atualização mais recente</p>
                <p className="text-sm text-slate-900 mt-1">08/04/2026 às 11:15</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base text-slate-900">Lista de contatos realizados</h2>
                <p className="text-sm text-slate-500 mt-1">Use os filtros para localizar clientes, datas e vendedores com rapidez.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Cliente</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={filtroCliente}
                    onChange={(event) => setFiltroCliente(event.target.value)}
                    placeholder="Filtrar por cliente"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Data</label>
                <input
                  type="date"
                  value={filtroData}
                  onChange={(event) => setFiltroData(event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  {isDiretoria ? "Vendedor" : "Vendedor logado"}
                </label>
                {isDiretoria ? (
                  <select
                    value={filtroVendedor}
                    onChange={(event) => setFiltroVendedor(event.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    <option value="">Todos os vendedores</option>
                    {vendedoresDisponiveisFiltro.map((vendedor) => (
                      <option key={vendedor} value={vendedor}>
                        {vendedor}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm text-slate-700">
                    {vendedorFiltro ?? "Sem vendedor definido"}
                  </div>
                )}
              </div>
            </div>

            {(filtroCliente || filtroData || filtroVendedor) && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1">
                  {contatosFiltrados.length} registro(s) filtrado(s)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFiltroCliente("");
                    setFiltroData("");
                    setFiltroVendedor("");
                  }}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}

            <div className="space-y-2">
              {contatosFiltrados.map((contato) => (
                <button
                  key={contato.id}
                  onClick={() => abrirDetalhesContato(contato)}
                  className="w-full text-left rounded-lg border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm text-slate-900 truncate">{contato.cliente}</h3>

                      <div className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                        <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-slate-500">
                          <MessageCircle className="h-3 w-3" />
                          Assunto
                        </p>
                        <p className="mt-0 text-xs text-slate-700 line-clamp-1">{contato.resumo}</p>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatarDataHora(contato.data, contato.hora)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {contato.tipo}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <UserRound className="h-3.5 w-3.5" />
                          {contato.responsavel}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
                      <Eye className="w-3.5 h-3.5" />
                      Detalhes
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {contatosFiltrados.length === 0 && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                Nenhum contato encontrado para o filtro informado.
              </div>
            )}
          </section>
        </div>
      </div>

      <Dialog open={Boolean(contatoSelecionado)} onOpenChange={handleFecharDetalhes}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do contato</DialogTitle>
            <DialogDescription>
              Visualização completa do registro realizado no CRM.
            </DialogDescription>
          </DialogHeader>

          {contatoSelecionado && (
            <div className="space-y-4 text-sm">
              <section className="rounded-xl border border-slate-200 bg-white p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAbaDetalhesContato("principal")}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      abaDetalhesContato === "principal"
                        ? "bg-slate-800 text-white"
                        : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    Visão principal
                  </button>
                  <button
                    type="button"
                    onClick={() => setAbaDetalhesContato("followups")}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      abaDetalhesContato === "followups"
                        ? "bg-slate-800 text-white"
                        : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    Follow-ups
                  </button>
                </div>
              </section>

              {abaDetalhesContato === "principal" && (
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-slate-900">Visão principal</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Resumo do contato selecionado e seus dados principais.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={abrirNovoFollowUp}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Novo follow up
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Cliente</p>
                    <p className="text-slate-900 mt-1">{contatoSelecionado.cliente}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Data e hora</p>
                    <p className="text-slate-900 mt-1">{formatarDataHora(contatoSelecionado.data, contatoSelecionado.hora)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Tipo de contato</p>
                    <p className="text-slate-900 mt-1">{contatoSelecionado.tipo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Responsável</p>
                    <p className="text-slate-900 mt-1">{contatoSelecionado.responsavel}</p>
                  </div>
                  <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs text-slate-500">Resumo do contato</p>
                    <p className="text-slate-900 mt-1 leading-relaxed">{contatoSelecionado.resumo}</p>
                  </div>
                  <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs text-slate-500">Próximo passo</p>
                    <p className="text-slate-900 mt-1 leading-relaxed">{contatoSelecionado.proximoPasso}</p>
                  </div>
                  <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs text-slate-500">Observações</p>
                    <p className="text-slate-900 mt-1 leading-relaxed">{contatoSelecionado.observacoes}</p>
                  </div>
                  <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xs text-slate-500">Produtos oferecidos</p>
                    <p className="text-slate-900 mt-1">{contatoSelecionado.produtosOferecidos.join(" • ")}</p>
                  </div>
                </div>
              </section>
              )}

              {abaDetalhesContato === "followups" && (
                <section className="space-y-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-slate-900">Follow-ups associados</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {followUpsDoContatoSelecionado.length} registro(s) encontrado(s)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={abrirNovoFollowUp}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Novo follow up
                      </button>
                    </div>

                    {followUpsDoContatoSelecionado.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                        Nenhum follow-up registrado para este contato.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {followUpsDoContatoSelecionado.map((followUp) => (
                          <button
                            key={followUp.id}
                            type="button"
                            onClick={() => abrirDetalheFollowUp(followUp)}
                            className="w-full text-left rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100 hover:border-slate-300 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm text-slate-900">{followUp.tipo}</p>
                                  <span className="text-[11px] rounded-full border border-slate-200 bg-white px-2 py-0.5 text-slate-600">
                                    {followUp.resultado}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                  {formatarDataHora(followUp.data, followUp.hora)} • {followUp.responsavel}
                                </p>
                                <p className="text-sm text-slate-700 mt-2 line-clamp-2">{followUp.resumo}</p>
                              </div>
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
                                <Eye className="w-3.5 h-3.5" />
                                Detalhes
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={novoFollowUpAberto} onOpenChange={setNovoFollowUpAberto}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Novo follow up</DialogTitle>
            <DialogDescription>
              Registre um novo follow-up para este contato sem sair da tela de detalhes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Tipo</label>
                <select
                  value={tipoFollowUp}
                  onChange={(event) => setTipoFollowUp(event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="Ligação">Ligação</option>
                  <option value="E-mail">E-mail</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Reunião">Reunião</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Data</label>
                <input
                  type="date"
                  value={dataFollowUp}
                  onChange={(event) => setDataFollowUp(event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Hora</label>
                <input
                  type="time"
                  value={horaFollowUp}
                  onChange={(event) => setHoraFollowUp(event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Responsável</label>
                <input
                  type="text"
                  value={responsavelFollowUp}
                  onChange={(event) => setResponsavelFollowUp(event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Assunto</label>
                <input
                  type="text"
                  value={assuntoFollowUp}
                  onChange={(event) => setAssuntoFollowUp(event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Resultado</label>
                <input
                  type="text"
                  value={resultadoFollowUp}
                  onChange={(event) => setResultadoFollowUp(event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Próximo passo</label>
                <input
                  type="text"
                  value={proximoPassoFollowUp}
                  onChange={(event) => setProximoPassoFollowUp(event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Resumo</label>
              <textarea
                rows={3}
                value={resumoFollowUp}
                onChange={(event) => setResumoFollowUp(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Observações</label>
              <textarea
                rows={3}
                value={observacoesFollowUp}
                onChange={(event) => setObservacoesFollowUp(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setNovoFollowUpAberto(false)}
              className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarNovoFollowUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Salvar follow up
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(followUpSelecionado)} onOpenChange={(open) => !open && setFollowUpSelecionado(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do follow up</DialogTitle>
            <DialogDescription>
              Visualização completa do registro selecionado.
            </DialogDescription>
          </DialogHeader>

          {followUpSelecionado && (
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Assunto</p>
                <p className="text-slate-900 mt-1">{followUpSelecionado.assunto}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Data e hora</p>
                  <p className="text-slate-900 mt-1">{formatarDataHora(followUpSelecionado.data, followUpSelecionado.hora)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Responsável</p>
                  <p className="text-slate-900 mt-1">{followUpSelecionado.responsavel}</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Tipo / resultado</p>
                <p className="text-slate-900 mt-1">{followUpSelecionado.tipo} • {followUpSelecionado.resultado}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Resumo</p>
                <p className="text-slate-900 mt-1 leading-relaxed">{followUpSelecionado.resumo}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Próximo passo</p>
                <p className="text-slate-900 mt-1 leading-relaxed">{followUpSelecionado.proximoPasso}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Observações</p>
                <p className="text-slate-900 mt-1 leading-relaxed">{followUpSelecionado.observacoes || "Sem observações"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={registroAberto} onOpenChange={setRegistroAberto}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar novo contato</DialogTitle>
            <DialogDescription>
              Selecione o cliente para iniciar um novo registro de contato.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">Cliente</label>
              <select
                value={clienteSelecionadoId}
                onChange={(event) => setClienteSelecionadoId(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Selecione um cliente</option>
                {clientesDisponiveis.map((cliente) => (
                  <option key={cliente.id} value={String(cliente.id)}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>

            {clienteSelecionado && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <div className="flex items-center gap-2 text-slate-900 mb-3">
                  <UserRound className="w-4 h-4" />
                  <span>Dados do cliente selecionado</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Nome</p>
                    <p className="text-slate-900 mt-1">{clienteSelecionado.nome}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">E-mail</p>
                    <p className="text-slate-900 mt-1">{clienteSelecionado.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Telefone</p>
                    <p className="text-slate-900 mt-1">{clienteSelecionado.telefone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Vendedor</p>
                    <p className="text-slate-900 mt-1">{clienteSelecionado.vendedor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Status</p>
                    <p className="text-slate-900 mt-1">{clienteSelecionado.status}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setRegistroAberto(false)}
              className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAvancar}
              disabled={!clienteSelecionado}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Ir para registro de contato
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
