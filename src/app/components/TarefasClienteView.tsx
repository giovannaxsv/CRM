import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { TaskForm, type TaskFormValues } from "./TaskForm";
import { TaskList, type TaskItem } from "./TaskList";

interface TarefasClienteViewProps {
  clientId: number | null;
  vendedorFiltro?: string | null;
  onBackToClients: () => void;
}

type TasksViewMode = "list" | "new";

interface ClienteResumo {
  id: number;
  nome: string;
  vendedor: string;
  status: string;
  ultimoContato: string;
}

const clientesMock: ClienteResumo[] = [
  {
    id: 1,
    nome: "ACRILDESTAC IND. COM. LTDA",
    vendedor: "Everton",
    status: "Ativo",
    ultimoContato: "2 dias atrás",
  },
  {
    id: 2,
    nome: "ACEFER INDUSTRIA COMERCIO LTDA",
    vendedor: "Gorete",
    status: "Venda passiva",
    ultimoContato: "5 dias atrás",
  },
  {
    id: 3,
    nome: "ACRILDESTAC IND. COM. LTDA",
    vendedor: "Keila",
    status: "Inativo",
    ultimoContato: "30 dias atrás",
  },
];

const tasksMockByClient: Record<number, TaskItem[]> = {
  1: [
    {
      id: 1,
      titulo: "Confirmar aprovação da proposta",
      descricao: "Validar com o cliente se o escopo final está correto.",
      data: "2026-04-09",
      hora: "10:30",
      responsavel: "Everton",
      status: "Pendente",
    },
  ],
  2: [
    {
      id: 2,
      titulo: "Enviar comparativo de pacotes",
      descricao: "Reforçar diferenciais da proposta premium.",
      data: "2026-04-10",
      hora: "14:00",
      responsavel: "Gorete",
      status: "Pendente",
    },
  ],
  3: [
    {
      id: 3,
      titulo: "Confirmar retorno sobre a proposta comercial",
      descricao: "Validar se a Keila já recebeu o material e se há dúvidas pendentes.",
      data: "2026-04-16",
      hora: "09:00",
      responsavel: "Keila",
      status: "Pendente",
    },
    {
      id: 4,
      titulo: "Agendar reunião de alinhamento",
      descricao: "Reservar um horário para revisar necessidades e próximos passos.",
      data: "2026-04-17",
      hora: "14:30",
      responsavel: "Keila",
      status: "Pendente",
    },
    {
      id: 5,
      titulo: "Enviar resumo dos próximos passos",
      descricao: "Consolidar decisões da reunião e deixar as pendências registradas.",
      data: "2026-04-18",
      hora: "11:00",
      responsavel: "Keila",
      status: "Pendente",
    },
  ],
};

export function TarefasClienteView({
  clientId,
  vendedorFiltro,
  onBackToClients,
}: TarefasClienteViewProps) {
  const [viewMode, setViewMode] = useState<TasksViewMode>("list");
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const clientesDisponiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return clientesMock;
    }

    return clientesMock.filter((cliente) => cliente.vendedor === vendedorFiltro);
  }, [vendedorFiltro]);

  const clienteResolvidoId = useMemo(() => {
    if (clientId && clientesDisponiveis.some((cliente) => cliente.id === clientId)) {
      return clientId;
    }

    return clientesDisponiveis[0]?.id ?? null;
  }, [clientId, clientesDisponiveis]);

  const selectedCliente = useMemo(() => {
    return clientesDisponiveis.find((cliente) => cliente.id === clienteResolvidoId);
  }, [clienteResolvidoId, clientesDisponiveis]);

  useEffect(() => {
    if (!clienteResolvidoId) {
      setTasks([]);
      setViewMode("list");
      return;
    }

    const initialTasks = tasksMockByClient[clienteResolvidoId] ?? [];
    setTasks(initialTasks);
    setViewMode("list");
  }, [clienteResolvidoId]);

  const handleToggleTaskStatus = (taskId: number) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: "Concluida" }
          : task,
      ),
    );
  };

  const handleSaveTask = (values: TaskFormValues) => {
    const newTask: TaskItem = {
      id: Date.now(),
      titulo: values.titulo,
      descricao: values.descricao,
      data: values.data,
      hora: values.hora,
      responsavel: values.responsavel,
      status: "Pendente",
    };

    setTasks((previousTasks) => [newTask, ...previousTasks]);
    setViewMode("list");
  };

  if (!selectedCliente) {
    return (
      <div className="h-full bg-white p-6 flex flex-col">
        <button
          onClick={onBackToClients}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para clientes
        </button>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Cliente não encontrado.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 overflow-auto">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <ChevronRight className="w-4 h-4" />
              <span>Clientes</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Tarefas</span>
            </div>
            <h1 className="text-2xl text-slate-900">Tarefas do cliente</h1>
            <p className="text-sm text-slate-500 mt-1">
              Cliente: {selectedCliente.nome} | Vendedor: {selectedCliente.vendedor} | Status: {selectedCliente.status}
            </p>
          </div>
          <button
            onClick={onBackToClients}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Resumo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Cliente</p>
              <p className="text-slate-900 mt-1">{selectedCliente.nome}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Responsável</p>
              <p className="text-slate-900 mt-1">{selectedCliente.vendedor}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Último contato</p>
              <p className="text-slate-900 mt-1">{selectedCliente.ultimoContato}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Tarefas</p>
              <p className="text-slate-900 mt-1">{tasks.length}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          {viewMode === "list" ? (
            <TaskList
              tasks={tasks}
              onNewTask={() => setViewMode("new")}
              onToggleTaskStatus={handleToggleTaskStatus}
              onBackToDetails={onBackToClients}
            />
          ) : (
            <TaskForm
              defaultResponsavel={selectedCliente.vendedor}
              onSaveTask={handleSaveTask}
              onCancel={() => setViewMode("list")}
            />
          )}
        </section>
      </div>
    </div>
  );
}