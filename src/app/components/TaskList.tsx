import { CheckCircle2, Plus } from "lucide-react";

export type TaskStatus = "Pendente" | "Concluida";

export interface TaskItem {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  responsavel: string;
  status: TaskStatus;
}

interface TaskListProps {
  tasks: TaskItem[];
  onNewTask: () => void;
  onToggleTaskStatus: (taskId: number) => void;
  onBackToDetails: () => void;
}

export function TaskList({
  tasks,
  onNewTask,
  onToggleTaskStatus,
  onBackToDetails,
}: TaskListProps) {
  const formatTaskStatus = (status: TaskStatus) => {
    return status === "Concluida" ? "Concluída" : status;
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm text-gray-500">Lista de planos de ação</h4>
        <button
          onClick={onNewTask}
          className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo plano de ação
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-4 text-sm text-gray-500">
          Nenhum plano de ação cadastrado
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="rounded-md border border-gray-200 bg-white px-3 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-900">{task.titulo}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {task.data}
                    {task.hora ? ` às ${task.hora}` : ""} | Responsável: {task.responsavel || "Não informado"}
                  </p>
                  {task.descricao && (
                    <p className="text-xs text-gray-600 mt-2">{task.descricao}</p>
                  )}
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    task.status === "Concluida"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {formatTaskStatus(task.status)}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => onToggleTaskStatus(task.id)}
                  disabled={task.status === "Concluida"}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    task.status === "Concluida"
                      ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Marcar como concluída
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onBackToDetails}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Voltar
      </button>
    </section>
  );
}
