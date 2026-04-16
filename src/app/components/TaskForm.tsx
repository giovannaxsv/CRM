import { useState } from "react";

export interface TaskFormValues {
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  responsavel: string;
}

interface TaskFormProps {
  defaultResponsavel: string;
  onSaveTask: (values: TaskFormValues) => void;
  onCancel: () => void;
}

export function TaskForm({
  defaultResponsavel,
  onSaveTask,
  onCancel,
}: TaskFormProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [responsavel, setResponsavel] = useState(defaultResponsavel);
  const [feedback, setFeedback] = useState("");

  const handleSave = () => {
    if (!titulo.trim() || !data) {
      setFeedback("Preencha os campos obrigatórios: título e data.");
      return;
    }

    onSaveTask({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      data,
      hora,
      responsavel: responsavel.trim(),
    });
  };

  return (
    <section className="space-y-4">
      <h4 className="text-sm text-gray-500">Novo plano de ação</h4>

      <div>
        <label className="block text-sm text-slate-700 mb-2">Título do plano de ação *</label>
        <input
          type="text"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          placeholder="Ex: Confirmar retorno da proposta"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-700 mb-2">Descrição</label>
        <textarea
          rows={3}
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          placeholder="Detalhes do plano de ação"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-700 mb-2">Data *</label>
          <input
            type="date"
            value={data}
            onChange={(event) => setData(event.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-700 mb-2">Hora</label>
          <input
            type="time"
            value={hora}
            onChange={(event) => setHora(event.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-700 mb-2">Responsável</label>
        <input
          type="text"
          value={responsavel}
          onChange={(event) => setResponsavel(event.target.value)}
          placeholder="Nome do responsável"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
        />
      </div>

      {feedback && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {feedback}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          className="px-3 py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-700 transition-colors"
        >
          Salvar plano de ação
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </section>
  );
}
