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

type StatusCliente = "Ativo" | "Inativo" | "Venda passiva";

type StatusContato = "aguardando-retorno" | "sim" | "nao";
type MotivoNaoEvolucao =
  | ""
  | "cliente-sem-interesse"
  | "cliente-nao-respondeu"
  | "preco-fora-do-esperado"
  | "momento-inadequado"
  | "sem-orcamento"
  | "concorrencia"
  | "outro";

const motivosNaoEvolucao = [
  { value: "cliente-sem-interesse", label: "Cliente sem interesse" },
  { value: "cliente-nao-respondeu", label: "Cliente não respondeu" },
  { value: "preco-fora-do-esperado", label: "Preço fora do esperado" },
  { value: "momento-inadequado", label: "Momento inadequado" },
  { value: "sem-orcamento", label: "Sem orçamento" },
  { value: "concorrencia", label: "Concorrência" },
  { value: "outro", label: "Outro" },
] as const;

const assuntosPredefinidos = [
  "Apresentação institucional",
  "Proposta comercial",
  "Negociação de preços",
  "Acompanhamento de cotação",
  "Pós-venda",
  "Agendamento de reunião",
  "Suporte técnico",
  "Outro",
] as const;

const statusClienteOpcoes: StatusCliente[] = ["Ativo", "Inativo", "Venda passiva"];

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

const ultimoContatoRegistradoPorCliente: Record<
  number,
  { data: string; canal: string; assunto: string; resultado: string; responsavel: string }
> = {
  1: {
    data: "18/04/2026 - 10:35",
    canal: "Ligação",
    assunto: "Acompanhamento de cotação",
    resultado: "Cliente confirmou interesse e solicitou atualização de preço para novo volume.",
    responsavel: "Everton",
  },
  2: {
    data: "15/04/2026 - 14:10",
    canal: "E-mail",
    assunto: "Proposta comercial",
    resultado: "Proposta enviada. Cliente informou que vai validar internamente antes do retorno final.",
    responsavel: "Gorete",
  },
  3: {
    data: "23/03/2026 - 09:20",
    canal: "Ligação",
    assunto: "Reativação de conta",
    resultado: "Contato sem avanço imediato. Cliente pediu novo contato no próximo ciclo de compras.",
    responsavel: "Keila",
  },
};

type FiltroProdutos = "todos" | "carteira";

export function RealizarContatoView({
  clientId,
  vendedorFiltro,
  onBackToClients,
  onAdvanceToSelecionarItens,
}: RealizarContatoViewProps) {
  const [evoluiParaCotacao, setEvoluiParaCotacao] = useState<StatusContato>("aguardando-retorno");
  const [tipoContato, setTipoContato] = useState("ligacao");
  const [dataContato, setDataContato] = useState("");
  const [horaContato, setHoraContato] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [assunto, setAssunto] = useState("");
  const [statusCliente, setStatusCliente] = useState<StatusCliente>("Ativo");
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

  const ultimoContatoRegistrado = useMemo(() => {
    if (!clientId) {
      return null;
    }

    return ultimoContatoRegistradoPorCliente[clientId] ?? null;
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

  useEffect(() => {
    if (!selectedCliente) {
      return;
    }

    setStatusCliente(selectedCliente.status as StatusCliente);
  }, [selectedCliente]);

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
      ? "Salvar e marcar como perdido"
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
              Vendedor: {selectedCliente.vendedor} | Status: {statusCliente} | Último contato: {selectedCliente.ultimoContato}
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

      <div className="p-4 md:p-5 grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4">
        <aside className="h-fit space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm text-slate-500 mb-3">Informações do cliente</h2>
            <dl className="space-y-3">
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
                <dt className="text-xs text-slate-500">Status do cliente</dt>
                <dd className="mt-2">
                  <select
                    value={statusCliente}
                    onChange={(event) => setStatusCliente(event.target.value as StatusCliente)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    {statusClienteOpcoes.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
             
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm text-slate-500 mb-3">Resumo do último contato</h2>

            {ultimoContatoRegistrado ? (
              <dl className="space-y-2.5">
                <div>
                  <dt className="text-xs text-slate-500">Data e hora</dt>
                  <dd className="text-sm text-slate-900 mt-1">{ultimoContatoRegistrado.data}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Canal</dt>
                  <dd className="text-sm text-slate-900 mt-1">{ultimoContatoRegistrado.canal}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Assunto</dt>
                  <dd className="text-sm text-slate-900 mt-1">{ultimoContatoRegistrado.assunto}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Responsável</dt>
                  <dd className="text-sm text-slate-900 mt-1">{ultimoContatoRegistrado.responsavel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">Resultado</dt>
                  <dd className="text-sm text-slate-700 mt-1">{ultimoContatoRegistrado.resultado}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-slate-500">Nenhum contato anterior registrado para este cliente.</p>
            )}
          </div>
        </aside>

        <main className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="text-base text-slate-900 mb-3">Registro do contato</h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        
            <div className="md:col-span-2">
              <label className="block text-xs text-slate-700 mb-1">Tipo de contato</label>
              <select
                value={tipoContato}
                onChange={(event) => setTipoContato(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="ligacao">Ligação</option>
                <option value="email">E-mail</option>
                <option value="reuniao">Reunião</option>
                <option value="visita">Visita</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs text-slate-700 mb-1">Assunto</label>
              <select
                value={assunto}
                onChange={(event) => setAssunto(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Selecione um assunto</option>
                {assuntosPredefinidos.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs text-slate-700 mb-1">Responsável</label>
              <input
                type="text"
                value={responsavel}
                onChange={(event) => setResponsavel(event.target.value)}
                placeholder="Nome do responsável"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-slate-700 mb-1">Data do contato</label>
              <input
                type="date"
                value={dataContato}
                onChange={(event) => setDataContato(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-12">
              <label className="block text-xs text-slate-700 mb-1">Resultado do contato</label>
              <textarea
                rows={3}
                value={resultadoContato}
                onChange={(event) => setResultadoContato(event.target.value)}
                placeholder="Descreva o resultado da interação"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-12 rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">
                    Produtos oferecidos no contato
                  </label>
                  <p className="text-xs text-slate-500 max-w-2xl leading-tight">
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
                      <div className="border-b border-slate-200 p-3 space-y-2.5">
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

                      <div className="max-h-64 overflow-auto p-2">
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

              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-sm text-slate-900">Produtos selecionados</h3>
                  <p className="text-xs text-slate-500">
                    {produtosSelecionados.length > 0
                      ? `${produtosSelecionados.length} item(ns)`
                      : "Nenhum item"}
                  </p>
                </div>

                {produtosSelecionados.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                    Abra o menu suspenso, filtre a lista e escolha os produtos que foram ofertados neste contato.
                  </div>
                ) : (
                  <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {produtosSelecionados.map((produto) => (
                      <div
                        key={produto.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-slate-900 truncate leading-tight">{produto.nome}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removerProduto(produto.id)}
                          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                          aria-label={`Remover ${produto.nome}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-12">
              <label className="block text-sm text-slate-700 mb-2">
                Status do contato
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Defina se o contato evolui para cotação, está aguardando retorno ou foi perdido.
              </p>
              <Select
                value={evoluiParaCotacao}
                onValueChange={(value) =>
                  setEvoluiParaCotacao(value as StatusContato)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aguardando-retorno">Aguardando retorno</SelectItem>
                  <SelectItem value="sim">Evolui para cotação</SelectItem>
                  <SelectItem value="nao">Contato perdido</SelectItem>
                </SelectContent>
              </Select>
              
            </div>

            {precisaMotivoNaoEvolucao && (
              <div className="md:col-span-12 rounded-xl border border-amber-200 bg-amber-50/60 p-3 space-y-3">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Motivo da perda</label>
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
                      rows={3}
                      value={detalheMotivo}
                      onChange={(event) => setDetalheMotivo(event.target.value)}
                      placeholder="Explique por que este contato não evoluiu para cotação"
                      className="bg-white"
                    />
                  </div>
                )}

                <p className="text-xs text-slate-500">Informe o motivo para registrar o encerramento correto do contato.</p>
              </div>
            )}
          </div>

  
          {saveFeedback && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-2">
              {saveFeedback}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
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
