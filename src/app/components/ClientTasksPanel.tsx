import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { TaskForm, type TaskFormValues } from "./TaskForm";
import { TaskList, type TaskItem } from "./TaskList";

interface ClientTasksPanelProps {
  clientId: number;
  clientName: string;
  defaultResponsavel: string;
  onBackToDetails: () => void;
}

type TasksViewMode = "list" | "new";

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

export function ClientTasksPanel({
  clientId,
  clientName,
  defaultResponsavel,
  onBackToDetails,
}: ClientTasksPanelProps) {
  const [viewMode, setViewMode] = useState<TasksViewMode>("list");
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    const initialTasks = tasksMockByClient[clientId] ?? [];
    setTasks(initialTasks);
    setViewMode("list");
  }, [clientId]);

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

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <ClipboardList className="w-4 h-4 text-slate-700" />
          <span>Módulo de plano de ação</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Cliente: {clientName}</p>
      </div>

      {viewMode === "list" ? (
        <TaskList
          tasks={tasks}
          onNewTask={() => setViewMode("new")}
          onToggleTaskStatus={handleToggleTaskStatus}
          onBackToDetails={onBackToDetails}
        />
      ) : (
        <TaskForm
          defaultResponsavel={defaultResponsavel}
          onSaveTask={handleSaveTask}
          onCancel={() => setViewMode("list")}
        />
      )}
    </div>
  );
}
