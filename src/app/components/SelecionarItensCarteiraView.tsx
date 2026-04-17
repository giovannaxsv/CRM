import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Save } from "lucide-react";
import { SolicitarCadastroProdutoModal, type SolicitarCadastroProdutoData } from "./SolicitarCadastroProdutoModal";
import { produtosReais } from "../../imports/produtosReais";

interface ClienteResumoBasico {
  id: number;
  nome: string;
  vendedor: string;
  status: string;
  ultimoContato: string;
}

interface SelecionarItensCarteiraViewProps {
  clientId: number | null;
  clienteResumo?: ClienteResumoBasico | null;
  onBackToContato: () => void;
  onAdvanceToCotacao: () => void;
}

interface ItemCarteira {
  id: number;
  clientId: number;
  codigo: string;
  nome: string;
  categoria: string;
}

type MotivoExclusao =
  | ""
  | "sem interesse no momento"
  | "cliente com estoque"
  | "preco nao competitivo"
  | "fora do escopo"
  | "outro";

interface ItemSelectionState {
  incluirNaCotacao: boolean;
  motivo: MotivoExclusao;
  outroMotivo: string;
}

interface SolicitacaoProduto {
  id: number;
  codigoProduto: string;
  nomeProduto: string;
  categoria: string;
  unidade: string;
}

const clientesResumoMock: ClienteResumoBasico[] = [
  {
    id: 1,
    nome: "KOMATSU DO BRASIL LTDA",
    vendedor: "Everton",
    status: "Ativo",
    ultimoContato: "2 dias atrás",
  },
  {
    id: 2,
    nome: "Ligas Metálicas Atlas",
    vendedor: "Gorete",
    status: "Venda passiva",
    ultimoContato: "5 dias atrás",
  },
  {
    id: 3,
    nome: "ACOCRIL INDUSTRIA E COMERCIO",
    vendedor: "Keila",
    status: "Inativo",
    ultimoContato: "30 dias atrás",
  },
];

const itensCarteiraMock: ItemCarteira[] = [
  {
    id: 1,
    clientId: 1,
    codigo: "TOT-001",
    nome: produtosReais[0],
    categoria: "Ligas metálicas",
  },
  {
    id: 2,
    clientId: 1,
    codigo: "TOT-002",
    nome: produtosReais[1],
    categoria: "Ligas metálicas",
  },
  {
    id: 3,
    clientId: 1,
    codigo: "TOT-003",
    nome: produtosReais[2],
    categoria: "Ligas metálicas",
  },
  {
    id: 4,
    clientId: 2,
    codigo: "LIG-101",
    nome: produtosReais[3],
    categoria: "Ligas de Alumínio",
  },
  {
    id: 5,
    clientId: 2,
    codigo: "LIG-102",
    nome: produtosReais[4],
    categoria: "Ligas de Alumínio",
  },
  {
    id: 6,
    clientId: 2,
    codigo: "LIG-103",
    nome: produtosReais[5],
    categoria: "Ligas de Cobre",
  },
  {
    id: 7,
    clientId: 2,
    codigo: "LIG-104",
    nome: produtosReais[6],
    categoria: "Ligas de Cobre",
  },
  {
    id: 8,
    clientId: 2,
    codigo: "LIG-105",
    nome: produtosReais[7],
    categoria: "Ligas de Aço Inoxidável",
  },
  {
    id: 9,
    clientId: 2,
    codigo: "LIG-106",
    nome: produtosReais[8],
    categoria: "Ligas de Aço Inoxidável",
  },
  {
    id: 10,
    clientId: 2,
    codigo: "LIG-107",
    nome: produtosReais[9],
    categoria: "Ligas Especiais",
  },
  {
    id: 11,
    clientId: 2,
    codigo: "LIG-108",
    nome: produtosReais[10],
    categoria: "Ligas metálicas",
  },
  {
    id: 12,
    clientId: 3,
    codigo: "TOT-201",
    nome: produtosReais[11],
    categoria: "Ligas metálicas",
  },
  {
    id: 13,
    clientId: 3,
    codigo: "TOT-202",
    nome: produtosReais[12],
    categoria: "Ligas metálicas",
  },
  {
    id: 14,
    clientId: 3,
    codigo: "TOT-203",
    nome: produtosReais[13],
    categoria: "Ligas metálicas",
  },
];

function buildInitialSelectionState(
  itens: ItemCarteira[],
): Record<number, ItemSelectionState> {
  return itens.reduce<Record<number, ItemSelectionState>>(
    (accumulator, item) => {
      accumulator[item.id] = {
        incluirNaCotacao: true,
        motivo: "",
        outroMotivo: "",
      };
      return accumulator;
    },
    {},
  );
}

export function SelecionarItensCarteiraView({
  clientId,
  clienteResumo,
  onBackToContato,
  onAdvanceToCotacao,
}: SelecionarItensCarteiraViewProps) {
  const [feedbackType, setFeedbackType] = useState<"success" | "error">(
    "success",
  );
  const [feedback, setFeedback] = useState("");
  const [openSolicitacaoProduto, setOpenSolicitacaoProduto] = useState(false);
  const [solicitacoesProduto, setSolicitacoesProduto] = useState<SolicitacaoProduto[]>([]);

  const selectedCliente = useMemo(() => {
    if (clienteResumo && clientId === clienteResumo.id) {
      return clienteResumo;
    }
    return clientesResumoMock.find((cliente) => cliente.id === clientId);
  }, [clientId, clienteResumo]);

  const itensCliente = useMemo(() => {
    return itensCarteiraMock.filter((item) => item.clientId === clientId);
  }, [clientId]);

  const [selectionByItem, setSelectionByItem] = useState<
    Record<number, ItemSelectionState>
  >(() => buildInitialSelectionState(itensCliente));

  useEffect(() => {
    setSelectionByItem(buildInitialSelectionState(itensCliente));
    setFeedback("");
    setFeedbackType("success");
  }, [itensCliente]);

  const itensSelecionados = useMemo(() => {
    return itensCliente.filter(
      (item) => selectionByItem[item.id]?.incluirNaCotacao,
    );
  }, [itensCliente, selectionByItem]);

  const itensSemMotivoValido = useMemo(() => {
    return itensCliente.filter((item) => {
      const itemState = selectionByItem[item.id];
      if (!itemState || itemState.incluirNaCotacao) {
        return false;
      }

      if (!itemState.motivo) {
        return true;
      }

      if (itemState.motivo === "outro" && !itemState.outroMotivo.trim()) {
        return true;
      }

      return false;
    });
  }, [itensCliente, selectionByItem]);

  const canAdvance =
    itensSelecionados.length > 0 && itensSemMotivoValido.length === 0;

  const updateItemState = (
    itemId: number,
    nextState: Partial<ItemSelectionState>,
  ) => {
    setSelectionByItem((previousState) => ({
      ...previousState,
      [itemId]: {
        ...previousState[itemId],
        ...nextState,
      },
    }));
  };

  const handleToggleInclude = (itemId: number, checked: boolean) => {
    if (checked) {
      updateItemState(itemId, {
        incluirNaCotacao: true,
        motivo: "",
        outroMotivo: "",
      });
      return;
    }

    updateItemState(itemId, {
      incluirNaCotacao: false,
      motivo: "",
      outroMotivo: "",
    });
  };

  const handleSaveSelection = () => {
    setFeedbackType("success");
    setFeedback("Seleção de itens salva com sucesso.");
  };

  const handleAdvanceToCotacao = () => {
    if (!canAdvance) {
      setFeedbackType("error");
      setFeedback(
        "Para avançar, selecione ao menos 1 item e preencha os motivos dos itens não incluídos.",
      );
      return;
    }

    setFeedback("");
    onAdvanceToCotacao();
  };

  const handleSubmitSolicitacaoProduto = (
    data: SolicitarCadastroProdutoData,
  ) => {
    setSolicitacoesProduto((previous) => [
      ...previous,
      {
        id: Date.now(),
        codigoProduto: data.codigoProduto,
        nomeProduto: data.nomeProduto,
        categoria: data.categoria,
        unidade: data.unidade,
      },
    ]);
    setFeedbackType("success");
    setFeedback("Solicitação registrada com sucesso.");
  };

  if (!selectedCliente) {
    return (
      <div className="h-full bg-white p-6 flex flex-col">
        <button
          onClick={onBackToContato}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para realizar contato
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
              <span>Realizar contato</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">Seleção de itens</span>
            </div>
            <h1 className="text-2xl text-slate-900">Seleção de itens para cotação</h1>
            <p className="text-sm text-slate-500 mt-1">
              Revise os itens da carteira do cliente e defina quais seguem para a etapa de cotação.
            </p>
          </div>
          <button
            onClick={onBackToContato}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Resumo do cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Nome do cliente</p>
              <p className="text-slate-900 mt-1">{selectedCliente.nome}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Vendedor responsável</p>
              <p className="text-slate-900 mt-1">{selectedCliente.vendedor}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Status</p>
              <p className="text-slate-900 mt-1">{selectedCliente.status}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Último contato</p>
              <p className="text-slate-900 mt-1">{selectedCliente.ultimoContato}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Itens da carteira </h2>

          {itensCliente.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Nenhum item de carteira encontrado para este cliente.
            </div>
          ) : (
            <div className="space-y-4">
              {itensCliente.map((item) => {
                const itemState = selectionByItem[item.id];
                const isNotIncluded = !itemState?.incluirNaCotacao;
                const isOutroMotivo = itemState?.motivo === "outro";

                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4 items-start">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-slate-500">Código</p>
                          <p className="text-slate-900 mt-1">{item.codigo}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Nome do item</p>
                          <p className="text-slate-900 mt-1">{item.nome}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Categoria</p>
                          <p className="text-slate-900 mt-1">{item.categoria}</p>
                        </div>
                      </div>

                      <label className="inline-flex items-center gap-2 text-sm text-slate-700 xl:justify-self-end">
                        <input
                          type="checkbox"
                          checked={itemState?.incluirNaCotacao ?? true}
                          onChange={(event) =>
                            handleToggleInclude(item.id, event.target.checked)
                          }
                          className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                        />
                        Incluir na cotação
                      </label>
                    </div>

                    {isNotIncluded && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-slate-700 mb-2">
                            Motivo *
                          </label>
                          <select
                            value={itemState.motivo}
                            onChange={(event) =>
                              updateItemState(item.id, {
                                motivo: event.target.value as MotivoExclusao,
                                outroMotivo:
                                  event.target.value === "outro"
                                    ? itemState.outroMotivo
                                    : "",
                              })
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                          >
                            <option value="">Selecione um motivo</option>
                            <option value="sem interesse no momento">Sem interesse no momento</option>
                            <option value="cliente com estoque">Cliente com estoque</option>
                            <option value="preco nao competitivo">Preço não competitivo</option>
                            <option value="fora do escopo">Fora do escopo</option>
                            <option value="outro">Outro</option>
                          </select>
                        </div>

                        {isOutroMotivo && (
                          <div>
                            <label className="block text-sm text-slate-700 mb-2">
                              Detalhar motivo *
                            </label>
                            <input
                              type="text"
                              value={itemState.outroMotivo}
                              onChange={(event) =>
                                updateItemState(item.id, {
                                  outroMotivo: event.target.value,
                                })
                              }
                              placeholder="Descreva o motivo"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <p>Itens incluídos: {itensSelecionados.length}</p>
            <p>
              Itens sem motivo válido: {itensSemMotivoValido.length}
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-900">Solicitar inclusão de produto</p>
                <p className="text-xs text-slate-500 mt-1">
                  Use esta ação quando o item ainda não existir na carteira do cliente.
                </p>
              </div>
              <button
                onClick={() => setOpenSolicitacaoProduto(true)}
                className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
              >
                Solicitar cadastro de novo produto
              </button>
            </div>

            {solicitacoesProduto.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {solicitacoesProduto.map((solicitacao) => (
                  <span
                    key={solicitacao.id}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                  >
                    {solicitacao.codigoProduto} • {solicitacao.nomeProduto} • {solicitacao.categoria} • {solicitacao.unidade}
                  </span>
                ))}
              </div>
            )}
          </div>

          {feedback && (
            <div
              className={`mt-4 rounded-lg text-sm px-4 py-2 ${
                feedbackType === "success"
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {feedback}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onBackToContato}
              className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleSaveSelection}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar seleção
            </button>
            <button
              onClick={handleAdvanceToCotacao}
              disabled={!canAdvance}
              className={`px-4 py-2 border text-sm rounded-lg transition-colors ${
                canAdvance
                  ? "border-slate-300 hover:bg-slate-100 text-slate-900"
                  : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              Avançar para cotação
            </button>
          </div>
        </section>
      </div>

      <SolicitarCadastroProdutoModal
        open={openSolicitacaoProduto}
        onOpenChange={setOpenSolicitacaoProduto}
        onSubmit={handleSubmitSolicitacaoProduto}
      />
    </div>
  );
}
