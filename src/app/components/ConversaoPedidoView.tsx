import { useState, useMemo } from "react";
import { ArrowLeft, Copy } from "lucide-react";
import { cotacoesMock } from "./ListaCotacoesView";

interface ConversaoPedidoViewProps {
  cotacaoId: number | null;
  onBackToCotacao: () => void;
  onConfirmarConversao: (payload: {
    cotacaoId: number;
    numeroPedido: string;
    numeroOc: string;
    dataPedido: string;
  }) => void;
}

function toCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function toDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
}

function gerarNumeroPedido(cotacaoId: number) {
  const sequencial = String(cotacaoId).padStart(3, "0");
  return `PED-2026-${sequencial}`;
}

function gerarNumeroOc(cotacaoId: number) {
  const sequencial = String(cotacaoId).padStart(3, "0");
  const timestamp = Date.now().toString().slice(-4);
  return `OC-2026-${sequencial}-${timestamp}`;
}

export function ConversaoPedidoView({
  cotacaoId,
  onBackToCotacao,
  onConfirmarConversao,
}: ConversaoPedidoViewProps) {
  const cotacao = useMemo(() => {
    if (!cotacaoId) return null;
    return cotacoesMock.find((c) => c.id === cotacaoId);
  }, [cotacaoId]);

  const numeroPedido = useMemo(
    () => (cotacaoId ? gerarNumeroPedido(cotacaoId) : ""),
    [cotacaoId]
  );

  const numeroOc = useMemo(
    () => (cotacaoId ? gerarNumeroOc(cotacaoId) : ""),
    [cotacaoId]
  );

  const [observacoes, setObservacoes] = useState("");
  const [condicoesPagamento, setCondicoesPagamento] = useState("30 dias");
  const [contatoPrincipal, setContatoPrincipal] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleCopiar = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setFeedback(`Copiado: ${texto}`);
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleConfirmar = () => {
    if (!contatoPrincipal.trim()) {
      setFeedback("Informe o contato principal para prosseguir.");
      return;
    }

    if (!cotacaoId) return;

    onConfirmarConversao({
      cotacaoId,
      numeroPedido,
      numeroOc,
      dataPedido: new Date().toISOString(),
    });
  };

  if (!cotacao) {
    return (
      <div className="h-full bg-white p-6 flex flex-col">
        <button
          onClick={onBackToCotacao}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para cotação
        </button>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          Cotação não encontrada.
        </div>
      </div>
    );
  }

  const valor = cotacao.valor;
  const quantidade = 6 + (cotacao.id % 7);
  const precoUnitario = Math.round(valor / quantidade);

  return (
    <div className="h-full bg-slate-50 overflow-auto">
      <div className="p-6 border-b border-slate-200 bg-white">
        <button
          onClick={onBackToCotacao}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para cotação
        </button>
        <h1 className="text-2xl text-slate-900">Conversão em pedido</h1>
        <p className="text-sm text-slate-500 mt-1">
          Preencha os dados para gerar o pedido e a OC.
        </p>
      </div>

      <div className="p-6 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Origem da cotação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Código da cotação</p>
              <p className="text-slate-900 mt-1">{cotacao.codigo}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Cliente</p>
              <p className="text-slate-900 mt-1">{cotacao.cliente}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Valor</p>
              <p className="text-slate-900 mt-1">{toCurrency(valor)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Responsável</p>
              <p className="text-slate-900 mt-1">{cotacao.responsavel}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Números gerados</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Número do pedido
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={numeroPedido}
                  readOnly
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm text-slate-700"
                />
                <button
                  onClick={() => handleCopiar(numeroPedido)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
                  title="Copiar número do pedido"
                >
                  <Copy className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Gerado automaticamente para este pedido.
              </p>
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Número da OC
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={numeroOc}
                  readOnly
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm text-slate-700"
                />
                <button
                  onClick={() => handleCopiar(numeroOc)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
                  title="Copiar número da OC"
                >
                  <Copy className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Gerado automaticamente para este pedido.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Informações complementares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Contato principal
              </label>
              <input
                type="text"
                value={contatoPrincipal}
                onChange={(e) => setContatoPrincipal(e.target.value)}
                placeholder="Nome do contato no cliente"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">
                Condições de pagamento
              </label>
              <select
                value={condicoesPagamento}
                onChange={(e) => setCondicoesPagamento(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option>15 dias</option>
                <option>30 dias</option>
                <option>45 dias</option>
                <option>60 dias</option>
                <option>À vista</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">
                Observações adicionais
              </label>
              <textarea
                rows={4}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Anotações importantes sobre o pedido, dados fiscais ou instruções especiais."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Resumo do pedido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Quantidade de itens</p>
              <p className="text-slate-900 mt-1">{quantidade}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Preço unitário</p>
              <p className="text-slate-900 mt-1">{toCurrency(precoUnitario)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Valor total</p>
              <p className="text-slate-900 mt-1 font-semibold">{toCurrency(valor)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Data de geração</p>
              <p className="text-slate-900 mt-1">{new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
        </section>

        {feedback && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-2">
            {feedback}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={onBackToCotacao}
            className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Confirmar conversão
          </button>
        </div>
      </div>
    </div>
  );
}
