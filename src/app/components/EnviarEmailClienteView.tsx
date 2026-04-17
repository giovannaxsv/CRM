import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Mail, Save, Send } from "lucide-react";

interface EnviarEmailClienteViewProps {
  clientId: number | null;
  onBackToClients: () => void;
}

type TipoTemplate = "ultima-acao" | "ultima-cotacao" | "outro";

interface ClienteEmailResumo {
  id: number;
  nome: string;
  vendedor: string;
  email: string;
  ultimaAcao: string;
  ultimaCotacao: string;
}

const clientesMock: ClienteEmailResumo[] = [
  {
    id: 1,
    nome: "KOMATSU DO BRASIL LTDA",
    vendedor: "Everton",
    email: "contact@coffeebeans.com",
    ultimaAcao: "Follow-up realizado há 2 dias com interesse em renovação mensal.",
    ultimaCotacao:
      "Cotação da renovação anual 2026 com plano premium no valor de R$ 30.000,00.",
  },
  {
    id: 2,
    nome: "ACOCRIL INDUSTRIA E COMERCIO",
    vendedor: "Gorete",
    email: "inquiry@panels.com",
    ultimaAcao: "Primeira reunião concluída e aguardando retorno interno do cliente.",
    ultimaCotacao:
      "Cotação enviada com comparativo de pacotes no valor de R$ 42.900,00.",
  },
  {
    id: 3,
    nome: "ACRILDESTAC IND. COM. LTDA EPP",
    vendedor: "Keila",
    email: "info@solar.com",
    ultimaAcao: "Oportunidade pausada, sugerida retomada com nova abordagem comercial.",
    ultimaCotacao:
      "Última cotação registrada para implantação em fases no valor de R$ 16.700,00.",
  },
];

function montarTemplate(
  tipoTemplate: TipoTemplate,
  cliente: ClienteEmailResumo,
): { assunto: string; corpo: string } {
  if (tipoTemplate === "outro") {
    return {
      assunto: "",
      corpo: "",
    };
  }

  if (tipoTemplate === "ultima-cotacao") {
    return {
      assunto: `Atualização sobre a última cotação - ${cliente.nome}`,
      corpo: `Olá,\n\nSegue um resumo da última informação de cotação registrada:\n${cliente.ultimaCotacao}\n\nFico à disposição para ajustarmos os próximos passos e confirmar os detalhes.\n\nAtenciosamente,\n${cliente.vendedor}`,
    };
  }

  return {
    assunto: `Resumo da última ação realizada - ${cliente.nome}`,
    corpo: `Olá,\n\nConforme nosso último contato, compartilho o resumo da última ação realizada:\n${cliente.ultimaAcao}\n\nSe desejar, posso seguir com as próximas etapas ainda hoje.\n\nAtenciosamente,\n${cliente.vendedor}`,
  };
}

export function EnviarEmailClienteView({
  clientId,
  onBackToClients,
}: EnviarEmailClienteViewProps) {
  const [tipoTemplate, setTipoTemplate] =
    useState<TipoTemplate>("ultima-acao");
  const [destinatario, setDestinatario] = useState("");
  const [assuntoManual, setAssuntoManual] = useState("");
  const [corpoManual, setCorpoManual] = useState("");
  const [feedback, setFeedback] = useState("");

  const selectedCliente = useMemo(() => {
    return clientesMock.find((cliente) => cliente.id === clientId);
  }, [clientId]);

  const templateAtual = useMemo(() => {
    if (!selectedCliente) {
      return { assunto: "", corpo: "" };
    }
    return montarTemplate(tipoTemplate, selectedCliente);
  }, [selectedCliente, tipoTemplate]);

  const assunto = assuntoManual || templateAtual.assunto;
  const corpo = corpoManual || templateAtual.corpo;

  const handleTemplateChange = (novoTipo: TipoTemplate) => {
    setTipoTemplate(novoTipo);
    setAssuntoManual("");
    setCorpoManual("");
    setFeedback("");
  };

  const handleEnviar = () => {
    if (!destinatario.trim()) {
      setFeedback("Informe o e-mail do destinatário para enviar.");
      return;
    }

    setFeedback("E-mail enviado com sucesso.");
  };

  const handleSalvarRascunho = () => {
    setFeedback("Rascunho salvo com sucesso.");
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
              <span className="text-slate-900">Enviar e-mail</span>
            </div>
            <h1 className="text-2xl text-slate-900">Envio de e-mail</h1>
            <p className="text-sm text-slate-500 mt-1">
              Cliente: {selectedCliente.nome} | Vendedor: {selectedCliente.vendedor}
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
          <h2 className="text-base text-slate-900 mb-4">Modelo do e-mail</h2>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm text-slate-700 mb-2">Escolha o modelo</label>
              <select
                value={tipoTemplate}
                onChange={(event) =>
                  handleTemplateChange(event.target.value as TipoTemplate)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="ultima-acao">Última ação realizada</option>
                <option value="ultima-cotacao">Última cotação</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <p className="text-xs text-slate-500">
              Em Outro, o corpo do e-mail inicia vazio para composição livre.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Compor e-mail</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">E-mail do destinatário</label>
              <input
                type="email"
                value={destinatario}
                onChange={(event) => setDestinatario(event.target.value)}
                placeholder={selectedCliente.email}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Assunto</label>
              <input
                type="text"
                value={assunto}
                onChange={(event) => setAssuntoManual(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Corpo do e-mail</label>
              <textarea
                rows={10}
                value={corpo}
                onChange={(event) => setCorpoManual(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          {feedback && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-2">
              {feedback}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleEnviar}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Enviar e-mail
            </button>
            <button
              onClick={handleSalvarRascunho}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar rascunho
            </button>
            <button
              onClick={onBackToClients}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
