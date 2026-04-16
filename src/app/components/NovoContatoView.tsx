import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  MessageCircle,
  Phone,
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
  const [decisaoContato, setDecisaoContato] = useState<"sim" | "nao" | "">("");
  const [motivoSemCotacao, setMotivoSemCotacao] = useState("");
  const [detalheMotivo, setDetalheMotivo] = useState("");
  const [feedbackAcao, setFeedbackAcao] = useState("");
  const [produtosAbertos, setProdutosAbertos] = useState(false);

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

  const handleAvancar = () => {
    if (!clienteSelecionado) {
      return;
    }
    setRegistroAberto(false);
    onIniciarContato(clienteSelecionado.id);
  };

  const abrirDetalhesContato = (contato: ContatoHistorico) => {
    setContatoSelecionado(contato);
    setDecisaoContato("");
    setMotivoSemCotacao("");
    setDetalheMotivo("");
    setFeedbackAcao("");
    setProdutosAbertos(false);
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
    }
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
              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-slate-900 mb-3">Resumo executivo</h3>
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
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-slate-900 mb-3">Status e resultado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Assunto</p>
                    <p className="text-slate-900 mt-1">{contatoSelecionado.resultado}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2">
                    <p className="text-xs text-slate-500">Resultado do contato</p>
                    <p className="text-slate-900 mt-1 leading-relaxed">{contatoSelecionado.resumo}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4">
                <button
                  type="button"
                  onClick={() => setProdutosAbertos((previous) => !previous)}
                  className="w-full flex items-center justify-between gap-3 text-left"
                >
                  <div>
                    <h3 className="text-slate-900">Produtos oferecidos ao cliente</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {contatoSelecionado.produtosOferecidos.length} item(ns) oferecido(s)
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${produtosAbertos ? "rotate-180" : ""}`}
                  />
                </button>

                {produtosAbertos && (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="max-h-56 overflow-y-auto pr-1">
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {contatoSelecionado.produtosOferecidos.map((produto) => (
                          <div
                            key={produto}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                          >
                            <p className="text-sm text-slate-900 truncate">{produto}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-slate-900 mb-3">Encaminhamento do contato</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() => {
                      setDecisaoContato("sim");
                      setMotivoSemCotacao("");
                      setDetalheMotivo("");
                      setFeedbackAcao("");
                    }}
                    className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                      decisaoContato === "sim"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Evoluir para cotação
                  </button>

                  <button
                    onClick={() => {
                      setDecisaoContato("nao");
                      setFeedbackAcao("");
                    }}
                    className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                      decisaoContato === "nao"
                        ? "border-amber-300 bg-amber-50 text-amber-800"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Finalizar sem cotação
                  </button>
                </div>

                {decisaoContato === "nao" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-2">Motivo</label>
                      <select
                        value={motivoSemCotacao}
                        onChange={(event) => setMotivoSemCotacao(event.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option value="">Selecione um motivo</option>
                        {motivosSemCotacao.map((motivo) => (
                          <option key={motivo} value={motivo}>
                            {motivo}
                          </option>
                        ))}
                      </select>
                    </div>

                    {motivoSemCotacao === "Outro" && (
                      <div>
                        <label className="block text-xs text-slate-500 mb-2">Detalhe do motivo</label>
                        <textarea
                          rows={3}
                          value={detalheMotivo}
                          onChange={(event) => setDetalheMotivo(event.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                          placeholder="Descreva o motivo do encerramento"
                        />
                      </div>
                    )}
                  </div>
                )}

                {feedbackAcao && (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs px-3 py-2">
                    {feedbackAcao}
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleConfirmarEncaminhamento}
                    disabled={
                      decisaoContato === "" ||
                      (decisaoContato === "nao" && !podeFinalizarSemCotacao)
                    }
                    className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {decisaoContato === "sim"
                      ? "Confirmar evolução para cotação"
                      : decisaoContato === "nao"
                        ? "Confirmar encerramento sem cotação"
                        : "Confirme uma opção"}
                  </button>
                </div>
              </section>
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
