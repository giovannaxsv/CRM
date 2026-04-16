import { useMemo, useState } from "react";
import { Box, CalendarDays, ChevronRight, Plus, UserRound, X } from "lucide-react";

type PlanoStatus =
  | "A iniciar"
  | "Em andamento"
  | "Em atraso"
  | "Concluído"
  | "Cancelado";

type Prioridade = "Baixa" | "Média" | "Alta" | "Emergencial";

interface PlanoAcaoViewProps {
  vendedorFiltro?: string | null;
  vendedores: readonly string[];
  onBackToMain: () => void;
}

interface ClientePlanoAcao {
  id: number;
  nome: string;
  vendedor: string;
  produtos: string[];
}

interface PlanoAcaoItem {
  id: number;
  clienteId: number;
  cliente: string;
  vendedor: string;
  produtoNoCliente: string;
  procedencia: string;
  acao: string;
  detalhes: string;
  responsavel: string;
  prioridade: Prioridade;
  prazoConclusao: string;
  status: PlanoStatus;
}

const statusColumns: PlanoStatus[] = [
  "A iniciar",
  "Em andamento",
  "Em atraso",
  "Concluído",
  "Cancelado",
];

const statusMoveOptions: Array<"A iniciar" | "Em andamento" | "Concluído" | "Cancelado"> = [
  "A iniciar",
  "Em andamento",
  "Concluído",
  "Cancelado",
];

const procedencias = [
  "Contato ativo",
  "Contato receptivo",
  "Pós-venda",
  "Visita técnica",
  "Reclamação",
  "Oportunidade identificada",
];

const clientesMock: ClientePlanoAcao[] = [
  {
    id: 1,
    nome: "FUNDICAO INDUSTRIAL LTDA",
    vendedor: "Everton",
    produtos: ["Painel de comando", "Cabos de alta tensão"],
  },
  {
    id: 2,
    nome: "A FERROTEGRAO",
    vendedor: "Gorete",
    produtos: ["Chapas galvanizadas", "Conjunto de fixação"],
  },
  {
    id: 3,
    nome: "A FRIDBERG DO BRASIL INDUSTRI",
    vendedor: "Keila",
    produtos: ["Inversor solar", "Estrutura de fixação"],
  },
  {
    id: 4,
    nome: "AB TRANSMISSAO AUTOMATICA LTDA",
    vendedor: "Keila",
    produtos: ["Kit de transmissão", "Lubrificante industrial"],
  },
  {
    id: 5,
    nome: "ACUMULADORES MOURA S.A",
    vendedor: "Keila",
    produtos: ["Bateria estacionária", "Controlador de carga"],
  },
  {
    id: 6,
    nome: "ACOBET INDUSTRIA METALICA E C",
    vendedor: "Gorete",
    produtos: ["Perfil metálico", "Conector estruturado"],
  },
];

const planosMock: PlanoAcaoItem[] = [
  {
    id: 1,
    clienteId: 3,
    cliente: "A FRIDBERG DO BRASIL INDUSTRI",
    vendedor: "Keila",
    produtoNoCliente: "Inversor solar",
    procedencia: "Contato ativo",
    acao: "Validar cronograma de instalação",
    detalhes: "Confirmar equipe disponível e janela de manutenção com o cliente.",
    responsavel: "Keila",
    prioridade: "Alta",
    prazoConclusao: "2026-04-18",
    status: "A iniciar",
  },
  {
    id: 2,
    clienteId: 1,
    cliente: "FUNDICAO INDUSTRIAL LTDA",
    vendedor: "Everton",
    produtoNoCliente: "Painel de comando",
    procedencia: "Visita técnica",
    acao: "Ajustar proposta técnica",
    detalhes: "Incluir observações da visita e revisar condições comerciais.",
    responsavel: "Everton",
    prioridade: "Média",
    prazoConclusao: "2026-04-20",
    status: "Em andamento",
  },
  {
    id: 3,
    clienteId: 2,
    cliente: "A FERROTEGRAO",
    vendedor: "Gorete",
    produtoNoCliente: "Conjunto de fixação",
    procedencia: "Reclamação",
    acao: "Tratar divergência de lote",
    detalhes: "Coletar evidências e alinhar com suprimentos para reposição.",
    responsavel: "Gorete",
    prioridade: "Emergencial",
    prazoConclusao: "2026-04-14",
    status: "Em atraso",
  },
  {
    id: 4,
    clienteId: 6,
    cliente: "ACOBET INDUSTRIA METALICA E C",
    vendedor: "Gorete",
    produtoNoCliente: "Perfil metálico",
    procedencia: "Pós-venda",
    acao: "Consolidar resultados da implantação",
    detalhes: "Enviar resumo do primeiro ciclo após implantação.",
    responsavel: "Gorete",
    prioridade: "Baixa",
    prazoConclusao: "2026-04-12",
    status: "Concluído",
  },
  {
    id: 5,
    clienteId: 4,
    cliente: "AB TRANSMISSAO AUTOMATICA LTDA",
    vendedor: "Keila",
    produtoNoCliente: "Lubrificante industrial",
    procedencia: "Oportunidade identificada",
    acao: "Avaliar extensão do contrato",
    detalhes: "Cliente suspendeu o projeto de ampliação neste trimestre.",
    responsavel: "Keila",
    prioridade: "Média",
    prazoConclusao: "2026-04-10",
    status: "Cancelado",
  },
];

const prioridadeStyle: Record<Prioridade, string> = {
  Baixa: "bg-slate-100 text-slate-700",
  Média: "bg-blue-100 text-blue-700",
  Alta: "bg-amber-100 text-amber-700",
  Emergencial: "bg-rose-100 text-rose-700",
};

interface PlanoFormData {
  clienteId: string;
  produtoNoCliente: string;
  procedencia: string;
  acao: string;
  detalhes: string;
  responsavel: string;
  prioridade: "" | Prioridade;
  prazoConclusao: string;
}

const initialForm: PlanoFormData = {
  clienteId: "",
  produtoNoCliente: "",
  procedencia: "",
  acao: "",
  detalhes: "",
  responsavel: "",
  prioridade: "",
  prazoConclusao: "",
};

function formatDateToBr(dateIso: string): string {
  if (!dateIso) {
    return "";
  }

  const [year, month, day] = dateIso.split("-");
  if (!year || !month || !day) {
    return dateIso;
  }

  return `${day}/${month}/${year}`;
}

export function PlanoAcaoView({ vendedorFiltro, vendedores, onBackToMain }: PlanoAcaoViewProps) {
  const [planos, setPlanos] = useState<PlanoAcaoItem[]>(planosMock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("todos");
  const [filtroProduto, setFiltroProduto] = useState("todos");
  const [filtroProcedencia, setFiltroProcedencia] = useState("todos");
  const [filtroResponsavel, setFiltroResponsavel] = useState("todos");
  const [formData, setFormData] = useState<PlanoFormData>(initialForm);

  const isDiretoria = vendedorFiltro == null;

  const clientesDisponiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return clientesMock;
    }

    return clientesMock.filter((cliente) => cliente.vendedor === vendedorFiltro);
  }, [vendedorFiltro]);

  const planosVisiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return planos;
    }

    return planos.filter((plano) => plano.vendedor === vendedorFiltro);
  }, [planos, vendedorFiltro]);

  const responsaveisDisponiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return [...vendedores];
    }

    return [vendedorFiltro];
  }, [vendedorFiltro, vendedores]);

  const produtosDisponiveisFormulario = useMemo(() => {
    const clienteSelecionado = clientesDisponiveis.find(
      (cliente) => String(cliente.id) === formData.clienteId,
    );

    return clienteSelecionado?.produtos ?? [];
  }, [clientesDisponiveis, formData.clienteId]);

  const opcoesProdutosFiltro = useMemo(
    () => Array.from(new Set(planosVisiveis.map((plano) => plano.produtoNoCliente))),
    [planosVisiveis],
  );

  const planosFiltrados = useMemo(() => {
    return planosVisiveis.filter((plano) => {
      const termo = busca.trim().toLowerCase();
      const matchBusca =
        !termo ||
        plano.acao.toLowerCase().includes(termo) ||
        plano.detalhes.toLowerCase().includes(termo) ||
        plano.cliente.toLowerCase().includes(termo);

      const matchCliente = filtroCliente === "todos" || String(plano.clienteId) === filtroCliente;
      const matchProduto = filtroProduto === "todos" || plano.produtoNoCliente === filtroProduto;
      const matchProcedencia = filtroProcedencia === "todos" || plano.procedencia === filtroProcedencia;
      const matchResponsavel = filtroResponsavel === "todos" || plano.responsavel === filtroResponsavel;

      return matchBusca && matchCliente && matchProduto && matchProcedencia && matchResponsavel;
    });
  }, [
    busca,
    filtroCliente,
    filtroProcedencia,
    filtroProduto,
    filtroResponsavel,
    planosVisiveis,
  ]);

  const planosPorStatus = useMemo(() => {
    const grouped: Record<PlanoStatus, PlanoAcaoItem[]> = {
      "A iniciar": [],
      "Em andamento": [],
      "Em atraso": [],
      "Concluído": [],
      Cancelado: [],
    };

    for (const plano of planosFiltrados) {
      grouped[plano.status].push(plano);
    }

    return grouped;
  }, [planosFiltrados]);

  const resetFiltros = () => {
    setBusca("");
    setFiltroCliente("todos");
    setFiltroProduto("todos");
    setFiltroProcedencia("todos");
    setFiltroResponsavel("todos");
  };

  const openModal = () => {
    const firstClient = clientesDisponiveis[0];

    setFormData({
      clienteId: firstClient ? String(firstClient.id) : "",
      produtoNoCliente: firstClient?.produtos[0] ?? "",
      procedencia: "",
      acao: "",
      detalhes: "",
      responsavel: vendedorFiltro ?? firstClient?.vendedor ?? "",
      prioridade: "",
      prazoConclusao: "",
    });

    setFeedback("");
    setIsModalOpen(true);
  };

  const handleFormField = <K extends keyof PlanoFormData>(field: K, value: PlanoFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClienteFormChange = (clienteId: string) => {
    const clienteSelecionado = clientesDisponiveis.find((cliente) => String(cliente.id) === clienteId);

    setFormData((prev) => ({
      ...prev,
      clienteId,
      produtoNoCliente: clienteSelecionado?.produtos[0] ?? "",
      responsavel: vendedorFiltro ?? clienteSelecionado?.vendedor ?? "",
    }));
  };

  const handleSavePlano = () => {
    const clienteSelecionado = clientesDisponiveis.find(
      (cliente) => String(cliente.id) === formData.clienteId,
    );

    if (
      !clienteSelecionado ||
      !formData.produtoNoCliente ||
      !formData.procedencia ||
      !formData.acao.trim() ||
      !formData.detalhes.trim() ||
      !formData.responsavel ||
      !formData.prioridade ||
      !formData.prazoConclusao
    ) {
      setFeedback("Preencha todos os campos obrigatórios para registrar o plano de ação.");
      return;
    }

    const novoPlano: PlanoAcaoItem = {
      id: Date.now(),
      clienteId: clienteSelecionado.id,
      cliente: clienteSelecionado.nome,
      vendedor: clienteSelecionado.vendedor,
      produtoNoCliente: formData.produtoNoCliente,
      procedencia: formData.procedencia,
      acao: formData.acao.trim(),
      detalhes: formData.detalhes.trim(),
      responsavel: formData.responsavel,
      prioridade: formData.prioridade,
      prazoConclusao: formData.prazoConclusao,
      status: "A iniciar",
    };

    setPlanos((prev) => [novoPlano, ...prev]);
    setIsModalOpen(false);
  };

  const handleMovePlanoStatus = (
    planoId: number,
    nextStatus: "A iniciar" | "Em andamento" | "Concluído" | "Cancelado",
  ) => {
    setPlanos((prev) =>
      prev.map((plano) => {
        if (plano.id !== planoId) {
          return plano;
        }

        return {
          ...plano,
          status: nextStatus,
        };
      }),
    );
  };

  return (
    <div className="h-full bg-slate-100 overflow-auto">
      <div className="p-6 border-b border-slate-200 bg-white space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <ChevronRight className="w-4 h-4" />
              <span>Acompanhamento</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Plano de ação</span>
            </div>
            <h1 className="text-2xl text-slate-900">Acompanhamento de plano de ação</h1>
            <p className="text-sm text-slate-500 mt-1">
              {isDiretoria
                ? "Diretoria: visualização de todos os planos de ação."
                : `Vendedor: visualização somente dos planos de ${vendedorFiltro}.`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFiltros}
              className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Remover filtros
            </button>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Registrar plano de ação
            </button>
            <button
              onClick={onBackToMain}
              className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          <div className="space-y-1">
            <label className="block text-xs text-slate-600">Cliente</label>
            <select
              value={filtroCliente}
              onChange={(event) => setFiltroCliente(event.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
            >
              <option value="todos">Todos</option>
              {clientesDisponiveis.map((cliente) => (
                <option key={cliente.id} value={String(cliente.id)}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-slate-600">Produto no cliente</label>
            <select
              value={filtroProduto}
              onChange={(event) => setFiltroProduto(event.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
            >
              <option value="todos">Todos</option>
              {opcoesProdutosFiltro.map((produto) => (
                <option key={produto} value={produto}>
                  {produto}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-slate-600">Procedência</label>
            <select
              value={filtroProcedencia}
              onChange={(event) => setFiltroProcedencia(event.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
            >
              <option value="todos">Todas</option>
              {procedencias.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-slate-600">Responsável</label>
            <select
              value={filtroResponsavel}
              onChange={(event) => setFiltroResponsavel(event.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
            >
              <option value="todos">Todos</option>
              {responsaveisDisponiveis.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-slate-600">Busca</label>
            <input
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Busque por ação, detalhe ou cliente"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {statusColumns.map((status) => (
            <section key={status} className="bg-white border border-slate-200 rounded-xl min-h-[420px] flex flex-col">
              <header className="px-4 py-3 border-b border-slate-200 bg-slate-900 text-white rounded-t-xl">
                <div className="flex items-center justify-between text-sm">
                  <span>{status}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full">
                    {planosPorStatus[status].length}
                  </span>
                </div>
              </header>

              <div className="p-3 space-y-3 flex-1">
                {planosPorStatus[status].length === 0 ? (
                  <div className="rounded-md border border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500 text-center">
                    Sem planos
                  </div>
                ) : (
                  planosPorStatus[status].map((plano) => (
                    <article key={plano.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-slate-900">{plano.acao}</p>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${prioridadeStyle[plano.prioridade]}`}>
                          {plano.prioridade}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{plano.cliente}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Box className="h-3.5 w-3.5 text-slate-500" />
                        <span>Produto: {plano.produtoNoCliente}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <UserRound className="h-3.5 w-3.5 text-slate-500" />
                        <span>Responsável: {plano.responsavel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                        <span>Prazo: {formatDateToBr(plano.prazoConclusao)}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Mover para
                        </label>
                        <select
                          defaultValue=""
                          onChange={(event) => {
                            const nextStatus = event.target.value as "A iniciar" | "Em andamento" | "Concluído" | "Cancelado" | "";
                            if (!nextStatus) {
                              return;
                            }

                            handleMovePlanoStatus(plano.id, nextStatus);
                            event.target.value = "";
                          }}
                          className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700"
                        >
                          <option value="">Selecionar status</option>
                          {statusMoveOptions
                            .filter((nextStatus) => nextStatus !== plano.status)
                            .map((nextStatus) => (
                              <option key={nextStatus} value={nextStatus}>
                                {nextStatus}
                              </option>
                            ))}
                        </select>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg text-slate-900">Registro de plano de ação</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-md hover:bg-slate-100"
                aria-label="Fechar formulário"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Cliente</label>
                <select
                  value={formData.clienteId}
                  onChange={(event) => handleClienteFormChange(event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  <option value="">Selecione</option>
                  {clientesDisponiveis.map((cliente) => (
                    <option key={cliente.id} value={String(cliente.id)}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Produto no cliente</label>
                <select
                  value={formData.produtoNoCliente}
                  onChange={(event) => handleFormField("produtoNoCliente", event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  <option value="">Selecione</option>
                  {produtosDisponiveisFormulario.map((produto) => (
                    <option key={produto} value={produto}>
                      {produto}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Procedência da ação</label>
                <select
                  value={formData.procedencia}
                  onChange={(event) => handleFormField("procedencia", event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  <option value="">Selecione</option>
                  {procedencias.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Responsável</label>
                <select
                  value={formData.responsavel}
                  onChange={(event) => handleFormField("responsavel", event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  <option value="">Selecione</option>
                  {responsaveisDisponiveis.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Ação</label>
                <input
                  type="text"
                  value={formData.acao}
                  onChange={(event) => handleFormField("acao", event.target.value)}
                  placeholder="Descreva a ação planejada"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Detalhes da ação</label>
                <textarea
                  rows={4}
                  value={formData.detalhes}
                  onChange={(event) => handleFormField("detalhes", event.target.value)}
                  placeholder="Inclua contexto, objetivo e observações"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Prioridade</label>
                <select
                  value={formData.prioridade}
                  onChange={(event) => handleFormField("prioridade", event.target.value as "" | Prioridade)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white"
                >
                  <option value="">Selecione</option>
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                  <option value="Emergencial">Emergencial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Prazo conclusão</label>
                <input
                  type="date"
                  value={formData.prazoConclusao}
                  onChange={(event) => handleFormField("prazoConclusao", event.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>
            </div>

            {feedback && (
              <div className="mx-5 mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {feedback}
              </div>
            )}

            <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePlano}
                className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Salvar plano de ação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
