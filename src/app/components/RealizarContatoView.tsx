import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronRight, Save, Search, X } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface RealizarContatoViewProps {
  clientId: number | null;
  vendedorFiltro?: string | null;
  onBackToClients: () => void;
  onAdvanceToSelecionarItens: () => void;
}

interface ClienteContato {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  vendedor: string;
  status: string;
  ultimoContato: string;
  observacoes: string;
}

interface ProdutoContato {
  id: number;
  codigo: string;
  nome: string;
}

type EvolucaoCotacao = "sim" | "nao" | "";
type MotivoNaoEvolucao =
  | ""
  | "cliente-sem-interesse"
  | "preco-fora-do-esperado"
  | "momento-inadequado"
  | "sem-orcamento"
  | "concorrencia"
  | "outro";

const motivosNaoEvolucao = [
  { value: "cliente-sem-interesse", label: "Cliente sem interesse" },
  { value: "preco-fora-do-esperado", label: "Preço fora do esperado" },
  { value: "momento-inadequado", label: "Momento inadequado" },
  { value: "sem-orcamento", label: "Sem orçamento" },
  { value: "concorrencia", label: "Concorrência" },
  { value: "outro", label: "Outro" },
] as const;

const produtosReais = [
  "Níquel Placas",
  "Níquel Catodos",
  "Níquel Full Plate Plating",
  "Coque Metalúrgico Leve",
  "Grafite",
  "Carbeto de Silício",
  "Silício Metálico (SiMe), Rebarba, 10-60mm",
  "Cálcio Silício (CaSi)",
  "Zinco",
  "Tungstênio Metálico",
  "Ferro Molibidênio 0,55 <325 Mesh",
  "Sucata de Alumínio",
  "Silício Metálico (SiMe)",
  "Silício Metálico Contaminado",
  "Resíduo Amido",
  "Pentóxido de Vanádio",
  "Níquel Rounds",
  "Níquel",
  "Níquel Full Plate",
];

const clientesMock: ClienteContato[] = [
  {
    id: 1,
    nome: "KOMATSU DO BRASIL LTDA",
    email: "contact@coffeebeans.com",
    telefone: "(11) 98765-1024",
    vendedor: "Everton",
    status: "Ativo",
    ultimoContato: "2 dias atrás",
    observacoes: "Cliente com interesse recorrente e boa aderência ao produto.",
  },
  {
    id: 2,
    nome: "ACOCRIL INDUSTRIA E COMERCIO",
    email: "inquiry@panels.com",
    telefone: "(21) 99876-4432",
    vendedor: "Gorete",
    status: "Venda passiva",
    ultimoContato: "5 dias atrás",
    observacoes: "Aguardando validação interna para avançar no processo.",
  },
  {
    id: 3,
    nome: "ACRILDESTAC IND. COM. LTDA EPP",
    email: "info@solar.com",
    telefone: "(31) 97654-8890",
    vendedor: "Keila",
    status: "Inativo",
    ultimoContato: "30 dias atrás",
    observacoes: "Contato pausado. Necessita reativação com nova abordagem.",
  },
];

const catalogoProdutos: ProdutoContato[] = produtosReais.map((nome, index) => {
  const id = index + 1;

  return {
    id,
    codigo: `PRD-${String(id).padStart(3, "0")}`,
    nome,
  };
});

const produtosCarteiraPorCliente: Record<number, number[]> = {
  1: [1, 2, 3],
  2: [4, 5, 6, 7, 8, 9, 10, 11],
  3: [12, 13, 14],
};

type FiltroProdutos = "todos" | "carteira";

export function RealizarContatoView({
  clientId,
  vendedorFiltro,
  onBackToClients,
  onAdvanceToSelecionarItens,
}: RealizarContatoViewProps) {
  const [evoluiParaCotacao, setEvoluiParaCotacao] = useState<EvolucaoCotacao>("");
  const [tipoContato, setTipoContato] = useState("ligacao");
  const [dataContato, setDataContato] = useState("");
  const [horaContato, setHoraContato] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [assunto, setAssunto] = useState("");
  const [resultadoContato, setResultadoContato] = useState("");
  const [demonstrouPotencial, setDemonstrouPotencial] =
    useState(false);
  const [motivoNaoEvolucao, setMotivoNaoEvolucao] = useState<MotivoNaoEvolucao>("");
  const [detalheMotivo, setDetalheMotivo] = useState("");
  const [saveFeedback, setSaveFeedback] = useState("");
  const [filtroProdutos, setFiltroProdutos] = useState<FiltroProdutos>("todos");
  const [produtosSelecionadosIds, setProdutosSelecionadosIds] = useState<number[]>([]);
  const [buscaProdutos, setBuscaProdutos] = useState("");
  const [popoverProdutosAberto, setPopoverProdutosAberto] = useState(false);

  const clientesDisponiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return clientesMock;
    }

    return clientesMock.filter((cliente) => cliente.vendedor === vendedorFiltro);
  }, [vendedorFiltro]);

  const selectedCliente = useMemo(() => {
    return clientesDisponiveis.find((cliente) => cliente.id === clientId);
  }, [clientId, clientesDisponiveis]);

  const produtosCarteiraCliente = useMemo(() => {
    const ids = clientId ? produtosCarteiraPorCliente[clientId] ?? [] : [];

    return catalogoProdutos.filter((produto) => ids.includes(produto.id));
  }, [clientId]);

  const produtosVisiveis = useMemo(() => {
    const baseProdutos =
      filtroProdutos === "carteira" ? produtosCarteiraCliente : catalogoProdutos;

    const termoBusca = buscaProdutos.trim().toLowerCase();

    if (!termoBusca) {
      return baseProdutos;
    }

    return baseProdutos.filter((produto) => {
      return (
        produto.nome.toLowerCase().includes(termoBusca) ||
        produto.codigo.toLowerCase().includes(termoBusca)
      );
    });
  }, [buscaProdutos, catalogoProdutos, filtroProdutos, produtosCarteiraCliente]);

  const produtosSelecionados = useMemo(() => {
    const selecionados = catalogoProdutos.filter((produto) =>
      produtosSelecionadosIds.includes(produto.id),
    );

    return selecionados.sort((produtoA, produtoB) => {
      return (
        produtosSelecionadosIds.indexOf(produtoA.id) -
        produtosSelecionadosIds.indexOf(produtoB.id)
      );
    });
  }, [produtosSelecionadosIds]);

  useEffect(() => {
    if (evoluiParaCotacao === "sim") {
      setMotivoNaoEvolucao("");
      setDetalheMotivo("");
    }
  }, [evoluiParaCotacao]);

  useEffect(() => {
    if (motivoNaoEvolucao !== "outro") {
      setDetalheMotivo("");
    }
  }, [motivoNaoEvolucao]);

  const precisaMotivoNaoEvolucao = evoluiParaCotacao === "nao";
  const motivoNaoEvolucaoValido =
    !precisaMotivoNaoEvolucao ||
    (motivoNaoEvolucao !== "" &&
      (motivoNaoEvolucao !== "outro" || detalheMotivo.trim().length > 0));
  const podeAvancarParaItens = evoluiParaCotacao === "sim";
  const acaoPrincipalHabilitada =
    evoluiParaCotacao === "sim" ||
    (evoluiParaCotacao === "nao" && motivoNaoEvolucaoValido);
  const rotuloAcaoPrincipal =
    evoluiParaCotacao === "nao"
      ? "Salvar e encerrar contato"
      : evoluiParaCotacao === "sim"
        ? "Salvar e selecionar itens"
        : "Salvar e selecionar itens";

  const alternarProduto = (produtoId: number) => {
    setProdutosSelecionadosIds((previous) => {
      if (previous.includes(produtoId)) {
        return previous.filter((id) => id !== produtoId);
      }

      return [...previous, produtoId];
    });
  };

  const removerProduto = (produtoId: number) => {
    setProdutosSelecionadosIds((previous) => previous.filter((id) => id !== produtoId));
  };

  const filtroProdutosLabel =
    filtroProdutos === "carteira"
      ? "PRODUTOS DA CARTEIRA"
      : "TODOS OS PRODUTOS";

  const handleSave = () => {
    setSaveFeedback("Contato salvo com sucesso.");
  };

  const handlePrimaryAction = () => {
    if (!acaoPrincipalHabilitada) {
      return;
    }

    if (podeAvancarParaItens) {
      setSaveFeedback("Contato salvo. Seguindo para seleção de itens.");
      onAdvanceToSelecionarItens();
      return;
    }

    setSaveFeedback("Contato salvo como não evolutivo.");
    onBackToClients();
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
              <span className="text-slate-900">Realizar contato</span>
            </div>
            <h1 className="text-2xl text-slate-900">
              {selectedCliente.nome}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Vendedor: {selectedCliente.vendedor} | Status: {selectedCliente.status} | Último contato: {selectedCliente.ultimoContato}
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

      <div className="p-6 grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
        <aside className="rounded-xl border border-slate-200 bg-white p-5 h-fit">
          <h2 className="text-sm text-slate-500 mb-4">Informações do cliente</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs text-slate-500">Nome</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.nome}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">E-mail</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Telefone</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.telefone}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Vendedor</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.vendedor}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Status</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.status}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Último contato</dt>
              <dd className="text-sm text-slate-900 mt-1">{selectedCliente.ultimoContato}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Observações resumidas</dt>
              <dd className="text-sm text-slate-700 mt-1">{selectedCliente.observacoes}</dd>
            </div>
          </dl>
        </aside>

        <main className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-base text-slate-900 mb-4">Registro do contato</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
            <div>
              <label className="block text-sm text-slate-700 mb-2">Tipo de contato</label>
              <select
                value={tipoContato}
                onChange={(event) => setTipoContato(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="ligacao">Ligação</option>
                <option value="email">E-mail</option>
                <option value="reuniao">Reunião</option>
                <option value="visita">Visita</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
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

            <div>
              <label className="block text-sm text-slate-700 mb-2">Data do contato</label>
              <input
                type="date"
                value={dataContato}
                onChange={(event) => setDataContato(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Hora do contato</label>
              <input
                type="time"
                value={horaContato}
                onChange={(event) => setHoraContato(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">Assunto</label>
              <input
                type="text"
                value={assunto}
                onChange={(event) => setAssunto(event.target.value)}
                placeholder="Resumo do assunto tratado"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">Resultado do contato</label>
              <textarea
                rows={4}
                value={resultadoContato}
                onChange={(event) => setResultadoContato(event.target.value)}
                placeholder="Descreva o resultado da interação"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Produtos oferecidos no contato
                  </label>
                  <p className="text-xs text-slate-500 max-w-2xl">
                    Selecione um ou mais produtos para registrar a oferta. A busca ocorre dentro do menu suspenso e a lista pode ser restringida aos itens da carteira do cliente.
                  </p>
                </div>

                <div className="relative w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => setPopoverProdutosAberto((previous) => !previous)}
                    className="w-full md:w-auto inline-flex items-center justify-between gap-3 px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm hover:bg-slate-50 transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Selecionar produtos
                    </span>
                    <span className="inline-flex items-center gap-2">
                      {produtosSelecionadosIds.length > 0 && (
                        <Badge variant="secondary" className="rounded-full px-2">
                          {produtosSelecionadosIds.length}
                        </Badge>
                      )}
                      <ChevronDown className={`w-4 h-4 transition-transform ${popoverProdutosAberto ? "rotate-180" : ""}`} />
                    </span>
                  </button>

                  {popoverProdutosAberto && (
                    <div className="absolute right-0 top-full z-40 mt-2 w-[min(42rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white overflow-hidden shadow-lg">
                      <div className="border-b border-slate-200 p-4 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setFiltroProdutos("todos")}
                            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                              filtroProdutos === "todos"
                                ? "bg-slate-800 text-white border-slate-800"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            TODOS OS PRODUTOS
                          </button>
                          <button
                            type="button"
                            onClick={() => setFiltroProdutos("carteira")}
                            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                              filtroProdutos === "carteira"
                                ? "bg-slate-800 text-white border-slate-800"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            PRODUTOS DA CARTEIRA
                          </button>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 flex items-center justify-between gap-3">
                          <span>Filtro atual: {filtroProdutosLabel}</span>
                          <span>{produtosVisiveis.length} itens encontrados</span>
                        </div>

                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            value={buscaProdutos}
                            onChange={(event) => setBuscaProdutos(event.target.value)}
                            placeholder="Digite para buscar produto pelo nome ou código"
                            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                          />
                        </div>
                      </div>

                      <div className="max-h-80 overflow-auto p-2">
                        {produtosVisiveis.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-slate-500">
                            Nenhum produto encontrado com esse filtro.
                          </div>
                        ) : (
                          produtosVisiveis.map((produto) => {
                            const estaSelecionado = produtosSelecionadosIds.includes(produto.id);

                            return (
                              <button
                                key={produto.id}
                                type="button"
                                onClick={() => alternarProduto(produto.id)}
                                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors text-left"
                              >
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded border border-slate-300 bg-white">
                                    {estaSelecionado && <Check className="h-3.5 w-3.5 text-slate-900" />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm text-slate-900 truncate">{produto.nome}</p>
                                    <p className="text-xs text-slate-500">{produto.codigo}</p>
                                  </div>
                                </div>
                                <Badge variant={estaSelecionado ? "default" : "outline"} className="shrink-0">
                                  {estaSelecionado ? "Selecionado" : "Adicionar"}
                                </Badge>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm text-slate-900">Produtos selecionados</h3>
                    <p className="text-xs text-slate-500">
                      {produtosSelecionados.length > 0
                        ? `${produtosSelecionados.length} item(ns) selecionado(s)`
                        : "Nenhum produto selecionado ainda."}
                    </p>
                  </div>
                </div>

                {produtosSelecionados.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    Abra o menu suspenso, filtre a lista e escolha os produtos que foram ofertados neste contato.
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {produtosSelecionados.map((produto) => (
                      <div
                        key={produto.id}
                        className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-slate-900 truncate">{produto.nome}</p>
                          <p className="text-xs text-slate-500">{produto.codigo}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removerProduto(produto.id)}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          aria-label={`Remover ${produto.nome}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-700 mb-2">
                Contato evolui para cotação?
              </label>
              <p className="mt-2 text-xs text-slate-500">
                Defina se este contato segue para cotação ou encerra o fluxo de pré-venda.
              </p>
              <Select
                value={evoluiParaCotacao}
                onValueChange={(value) =>
                  setEvoluiParaCotacao(value as EvolucaoCotacao)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aguardando retorno">Aguardando retorno</SelectItem>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
              
            </div>

            {precisaMotivoNaoEvolucao && (
              <div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    Motivo de não evolução
                  </label>
                  <Select
                    value={motivoNaoEvolucao}
                    onValueChange={(value) =>
                      setMotivoNaoEvolucao(value as MotivoNaoEvolucao)
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Selecione o motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {motivosNaoEvolucao.map((motivo) => (
                        <SelectItem key={motivo.value} value={motivo.value}>
                          {motivo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {motivoNaoEvolucao === "outro" && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">
                      Detalhar motivo
                    </label>
                    <Textarea
                      rows={4}
                      value={detalheMotivo}
                      onChange={(event) => setDetalheMotivo(event.target.value)}
                      placeholder="Explique por que este contato não evoluiu para cotação"
                      className="bg-white"
                    />
                  </div>
                )}

                <p className="text-xs text-slate-500">
                  Informe o motivo para registrar o encerramento correto do contato.
                </p>
              </div>
            )}
          </div>

  
          {saveFeedback && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-2">
              {saveFeedback}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar contato
            </button>
            <button
              onClick={handlePrimaryAction}
              disabled={!acaoPrincipalHabilitada}
              className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {rotuloAcaoPrincipal}
            </button>
            <button
              onClick={onBackToClients}
              className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
