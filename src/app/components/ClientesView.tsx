import { useMemo, useState } from "react";
import {
  Briefcase,
  CheckSquare,
  ChevronRight,
  Eye,
  Filter,
  Mail,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";

interface ClientesViewProps {
  vendedorFiltro?: string | null;
  onNovoClienteClick: () => void;
  onOpenRealizarContato: (clientId: number) => void;
  onOpenEnviarEmail: (clientId: number) => void;
  onOpenClientTasks: (clientId: number) => void;
  onOpenNovoContato: () => void;
}

type ClienteStatus = "ativo" | "venda passiva" | "inativo";
type ActiveTab =
  | "clientes"
  | "historico-vendas"
  | "historico-credito";

interface Cliente {
  id: number;
  nome: string;
  vendedor: string;
  status: ClienteStatus;
  statusColor: string;
  ultimoContato: string;
  email: string;
  telefone: string;
  historico: string[];
}

export function ClientesView({
  vendedorFiltro,
  onNovoClienteClick,
  onOpenRealizarContato,
  onOpenEnviarEmail,
  onOpenClientTasks,
  onOpenNovoContato,
}: ClientesViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    "clientes",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedClienteId, setSelectedClienteId] = useState<
    number | null
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const clientes: Cliente[] = [
    {
      id: 1,
      nome: "FUNDICAO INDUSTRIAL LTDA",
      vendedor: "Everton",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "2 dias atrás",
      email: "comercial1@empresa.com.br",
      telefone: "(11) 98650-2101",
      historico: [
        "Contato inicial por e-mail em 18/03",
        "Envio de proposta em 24/03",
        "Acompanhamento realizado há 2 dias",
      ],
    },
    {
      id: 2,
      nome: "A FERROTEGRAO",
      vendedor: "Gorete",
      status: "venda passiva",
      statusColor: "bg-yellow-100 text-yellow-800",
      ultimoContato: "5 dias atrás",
      email: "comercial2@empresa.com.br",
      telefone: "(21) 98650-2102",
      historico: [
        "Lead importado da página de captura",
        "Primeira reunião agendada",
        "Aguardando retorno sobre orçamento",
      ],
    },
    {
      id: 3,
      nome: "A FRIDBERG DO BRASIL INDUSTRI",
      vendedor: "Keila",
      status: "inativo",
      statusColor: "bg-red-100 text-red-800",
      ultimoContato: "30 dias atrás",
      email: "comercial3@empresa.com.br",
      telefone: "(31) 98650-2103",
      historico: [
        "Último contato sem resposta",
        "Oportunidade pausada pelo cliente",
        "Revisão prevista para o próximo mês",
      ],
    },
    {
      id: 4,
      nome: "A TUDO PARA PNEUS LTDA",
      vendedor: "Everton",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "1 dia atrás",
      email: "comercial4@empresa.com.br",
      telefone: "(11) 98650-2104",
      historico: [
        "Contato comercial por telefone",
        "Catálogo enviado",
        "Aguardando pedido de reposição",
      ],
    },
    {
      id: 5,
      nome: "AB TELECOMUNICACOES",
      vendedor: "Gorete",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "3 dias atrás",
      email: "comercial5@empresa.com.br",
      telefone: "(21) 98650-2105",
      historico: [
        "Reunião de alinhamento comercial",
        "Atualização de tabela de preços",
        "Negociação em andamento",
      ],
    },
    {
      id: 6,
      nome: "AB TRANSMISSAO AUTOMATICA LTDA",
      vendedor: "Keila",
      status: "venda passiva",
      statusColor: "bg-yellow-100 text-yellow-800",
      ultimoContato: "7 dias atrás",
      email: "comercial6@empresa.com.br",
      telefone: "(31) 98650-2106",
      historico: [
        "Cliente solicitou orçamento",
        "Orçamento encaminhado",
        "Aguardando validação interna",
      ],
    },
    {
      id: 7,
      nome: "ABCD IND. E COM. DE EMBALAGENS",
      vendedor: "Everton",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "2 dias atrás",
      email: "comercial7@empresa.com.br",
      telefone: "(11) 98650-2107",
      historico: [
        "Contato via representante",
        "Amostras liberadas",
        "Reunião técnica marcada",
      ],
    },
    {
      id: 8,
      nome: "ACEARIA FREDERICO MISSNER LTDA",
      vendedor: "Gorete",
      status: "inativo",
      statusColor: "bg-red-100 text-red-800",
      ultimoContato: "26 dias atrás",
      email: "comercial8@empresa.com.br",
      telefone: "(21) 98650-2108",
      historico: [
        "Proposta sem retorno",
        "Contato de retomada enviado",
        "Sem resposta até o momento",
      ],
    },
    {
      id: 9,
      nome: "ACEFER INDUSTRIA COMERCIO LTDA",
      vendedor: "Keila",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "4 dias atrás",
      email: "comercial9@empresa.com.br",
      telefone: "(31) 98650-2109",
      historico: [
        "Pedido recorrente confirmado",
        "Condição comercial revisada",
        "Entrega acompanhada pela equipe",
      ],
    },
    {
      id: 10,
      nome: "ACL METAIS LTDA",
      vendedor: "Everton",
      status: "venda passiva",
      statusColor: "bg-yellow-100 text-yellow-800",
      ultimoContato: "8 dias atrás",
      email: "comercial10@empresa.com.br",
      telefone: "(11) 98650-2110",
      historico: [
        "Consulta de preços recebida",
        "Proposta enviada por e-mail",
        "Aguardando devolutiva do comprador",
      ],
    },
    {
      id: 11,
      nome: "ACOBET INDUSTRIA METALICA E C",
      vendedor: "Gorete",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "3 dias atrás",
      email: "comercial11@empresa.com.br",
      telefone: "(21) 98650-2111",
      historico: [
        "Reunião comercial concluída",
        "Cliente pediu ajuste de prazo de entrega",
        "Negociação avançada",
      ],
    },
    {
      id: 12,
      nome: "ACOCRIL INDUSTRIA E COMERCIO D",
      vendedor: "Keila",
      status: "inativo",
      statusColor: "bg-red-100 text-red-800",
      ultimoContato: "45 dias atrás",
      email: "comercial12@empresa.com.br",
      telefone: "(31) 98650-2112",
      historico: [
        "Oportunidade congelada",
        "Contato de reativação programado",
        "Sem avanço no trimestre",
      ],
    },
    {
      id: 13,
      nome: "ACOTECNICAS A/IND E COMERCIO",
      vendedor: "Everton",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "2 dias atrás",
      email: "comercial13@empresa.com.br",
      telefone: "(11) 98650-2113",
      historico: [
        "Contato de manutenção da conta",
        "Cliente solicitou nova cotação",
        "Proposta enviada no mesmo dia",
      ],
    },
    {
      id: 14,
      nome: "ACQUA MINERA COMERCIO IMPORTA",
      vendedor: "Gorete",
      status: "venda passiva",
      statusColor: "bg-yellow-100 text-yellow-800",
      ultimoContato: "9 dias atrás",
      email: "comercial14@empresa.com.br",
      telefone: "(21) 98650-2114",
      historico: [
        "Demanda sazonal identificada",
        "Orçamento enviado",
        "Aguardando janela de compra",
      ],
    },
    {
      id: 15,
      nome: "ACRILDESTAC IND. COM. LTDA EPP",
      vendedor: "Keila",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "1 dia atrás",
      email: "comercial15@empresa.com.br",
      telefone: "(31) 98650-2115",
      historico: [
        "Acompanhamento comercial realizado",
        "Pedido piloto aprovado",
        "Expansão da carteira em discussão",
      ],
    },
    {
      id: 16,
      nome: "ACRIVILLE COMERCIO DE ACRILICO",
      vendedor: "Everton",
      status: "inativo",
      statusColor: "bg-red-100 text-red-800",
      ultimoContato: "60 dias atrás",
      email: "comercial16@empresa.com.br",
      telefone: "(11) 98650-2116",
      historico: [
        "Conta sem movimentação",
        "Contato de retomada sem retorno",
        "Revisão para o próximo ciclo",
      ],
    },
    {
      id: 17,
      nome: "ACTIONGYM COMERCIO DE MATERIAL",
      vendedor: "Gorete",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "4 dias atrás",
      email: "comercial17@empresa.com.br",
      telefone: "(21) 98650-2117",
      historico: [
        "Contato inicial convertido em oportunidade",
        "Condições comerciais apresentadas",
        "Cliente analisando pedido inicial",
      ],
    },
    {
      id: 18,
      nome: "ACUMULADORES MOURA S.A",
      vendedor: "Keila",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "2 dias atrás",
      email: "comercial18@empresa.com.br",
      telefone: "(31) 98650-2118",
      historico: [
        "Revisão anual de contrato",
        "Ajuste de volumes acordado",
        "Nova proposta encaminhada",
      ],
    },
  ];

  const statusFilters = [
    { id: "todos", label: "Todos" },
    { id: "ativo", label: "Ativo" },
    { id: "venda passiva", label: "Venda passiva" },
    { id: "inativo", label: "Inativo" },
  ];

  const clientesVisiveis = useMemo(() => {
    if (!vendedorFiltro) {
      return clientes;
    }

    return clientes.filter((cliente) => cliente.vendedor === vendedorFiltro);
  }, [clientes, vendedorFiltro]);

  const filteredClientes = useMemo(() => {
    return clientesVisiveis.filter((cliente) => {
      const matchesSearch = cliente.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "todos" ||
        cliente.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [clientesVisiveis, filterStatus, searchTerm]);

  const stats = {
    total: clientesVisiveis.length,
    ativos: clientesVisiveis.filter((c) => c.status === "ativo").length,
    passivos: clientesVisiveis.filter(
      (c) => c.status === "venda passiva",
    ).length,
    inativos: clientesVisiveis.filter((c) => c.status === "inativo")
      .length,
  };

  const historicoVendasBase = [
    {
      id: 1,
      cliente: "FUNDICAO INDUSTRIAL LTDA",
      data: "02/04/2026",
      evento: "Fechamento de venda recorrente",
      valor: "R$ 28.400,00",
      status: "Concluída",
      responsavel: "Everton",
    },
    {
      id: 2,
      cliente: "A FERROTEGRAO",
      data: "28/03/2026",
      evento: "Proposta enviada",
      valor: "R$ 42.900,00",
      status: "Em negociação",
      responsavel: "Gorete",
    },
    {
      id: 3,
      cliente: "A FRIDBERG DO BRASIL INDUSTRI",
      data: "15/03/2026",
      evento: "Renovação parcial",
      valor: "R$ 16.700,00",
      status: "Concluída",
      responsavel: "Keila",
    },
  ];

  const historicoCreditoBase = [
    {
      id: 1,
      cliente: "FUNDICAO INDUSTRIAL LTDA",
      dataAnalise: "01/04/2026",
      limite: "R$ 120.000,00",
      utilizado: "R$ 63.500,00",
      score: "AA",
      situacao: "Aprovado",
    },
    {
      id: 2,
      cliente: "A FERROTEGRAO",
      dataAnalise: "29/03/2026",
      limite: "R$ 95.000,00",
      utilizado: "R$ 88.200,00",
      score: "B",
      situacao: "Monitorar",
    },
    {
      id: 3,
      cliente: "A FRIDBERG DO BRASIL INDUSTRI",
      dataAnalise: "20/03/2026",
      limite: "R$ 60.000,00",
      utilizado: "R$ 15.900,00",
      score: "A",
      situacao: "Aprovado",
    },
  ];

  const historicoVendas = useMemo(() => {
    if (!vendedorFiltro) {
      return historicoVendasBase;
    }

    return historicoVendasBase.filter((item) => item.responsavel === vendedorFiltro);
  }, [vendedorFiltro]);

  const historicoCredito = useMemo(() => {
    if (!vendedorFiltro) {
      return historicoCreditoBase;
    }

    const clientesPermitidos = new Set(clientesVisiveis.map((cliente) => cliente.nome));
    return historicoCreditoBase.filter((item) => clientesPermitidos.has(item.cliente));
  }, [clientesVisiveis, vendedorFiltro]);

  const selectedCliente = clientesVisiveis.find(
    (cliente) => cliente.id === selectedClienteId,
  );

  const openDetailsDrawer = (clienteId: number) => {
    setSelectedClienteId(clienteId);
    setIsDrawerOpen(true);
  };

  const changeTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsDrawerOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-white relative">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium">Clientes</span>
          </div>
          <button
            onClick={onNovoClienteClick}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Cliente
          </button>
        </div>

        <div className="flex gap-0 border-b border-gray-200">
          <button
            onClick={() => changeTab("clientes")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "clientes"
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Clientes
            <span className="ml-2 text-xs opacity-75">
              ({stats.total})
            </span>
          </button>
          <button
            onClick={() => changeTab("historico-vendas")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "historico-vendas"
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Histórico de vendas
          </button>
          <button
            onClick={() => changeTab("historico-credito")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "historico-credito"
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Histórico de crédito
          </button>
        </div>

        {activeTab === "clientes" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500">Total de clientes</p>
              <p className="text-2xl text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-xs text-green-700">Clientes ativos</p>
              <p className="text-2xl text-green-800 mt-1">{stats.ativos}</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs text-red-700">Inativos</p>
              <p className="text-2xl text-red-800 mt-1">{stats.inativos}</p>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
              <p className="text-xs text-yellow-700">Venda passiva</p>
              <p className="text-2xl text-yellow-800 mt-1">{stats.passivos}</p>
            </div>
          </div>
        )}

        {activeTab === "historico-vendas" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500">Eventos de vendas</p>
              <p className="text-2xl text-gray-900 mt-1">{historicoVendas.length}</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-xs text-blue-700">Concluídas</p>
              <p className="text-2xl text-blue-800 mt-1">
                {
                  historicoVendas.filter(
                    (evento) => evento.status === "Concluída",
                  ).length
                }
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-100 px-4 py-3">
              <p className="text-xs text-amber-700">Em negociação</p>
              <p className="text-2xl text-amber-800 mt-1">
                {
                  historicoVendas.filter(
                    (evento) => evento.status === "Em negociação",
                  ).length
                }
              </p>
            </div>
          </div>
        )}

        {activeTab === "historico-credito" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500">Análises de crédito</p>
              <p className="text-2xl text-gray-900 mt-1">{historicoCredito.length}</p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-xs text-green-700">Aprovados</p>
              <p className="text-2xl text-green-800 mt-1">
                {
                  historicoCredito.filter(
                    (item) => item.situacao === "Aprovado",
                  ).length
                }
              </p>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
              <p className="text-xs text-yellow-700">Monitorar</p>
              <p className="text-2xl text-yellow-800 mt-1">
                {
                  historicoCredito.filter(
                    (item) => item.situacao === "Monitorar",
                  ).length
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {activeTab === "clientes" && (
        <>
          {/* Search and Filters */}
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar clientes por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-sm text-gray-600 pr-1">
                <Filter className="w-4 h-4" />
                Status:
              </span>
              {statusFilters.map((status) => {
                const isActive = filterStatus === status.id;
                return (
                  <button
                    key={status.id}
                    onClick={() => setFilterStatus(status.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 ${
                      isActive
                        ? "bg-slate-800 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.label}
                  </button>
                );
              })}
            </div>
            {filterStatus !== "todos" && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Filtrando por:
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm">
                  {filterStatus.charAt(0).toUpperCase() +
                    filterStatus.slice(1)}
                  <button
                    onClick={() => setFilterStatus("todos")}
                    className="hover:text-slate-600"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto">
            {filteredClientes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Search className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg mb-2">
                  Nenhum cliente encontrado
                </p>
                <p className="text-sm">
                  Tente ajustar sua busca ou filtros
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Vendedor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Último contato
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                      Detalhes
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className={`transition-colors duration-200 ease-out ${
                        selectedClienteId === cliente.id
                          ? "bg-slate-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            {cliente.nome}
                          </p>
                          <p className="text-xs text-gray-500">
                            {cliente.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {cliente.vendedor}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cliente.statusColor}`}
                        >
                          {cliente.status.charAt(0).toUpperCase() +
                            cliente.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {cliente.ultimoContato}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => openDetailsDrawer(cliente.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                        >
                          <Eye className="w-4 h-4" />
                          Ver detalhes
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-slate-800 hover:bg-gray-100 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                            title="Enviar mensagem"
                            aria-label="Enviar mensagem"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              onOpenRealizarContato(cliente.id)
                            }
                            className="px-3 py-1.5 bg-slate-800 text-white text-xs rounded hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                          >
                            + Contato
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {activeTab === "historico-vendas" && (
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Evento
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Responsável
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historicoVendas.map((evento) => (
                  <tr key={evento.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {evento.data}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {evento.cliente}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {evento.evento}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {evento.valor}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {evento.responsavel}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          evento.status === "Concluída"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {evento.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "historico-credito" && (
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Data da análise
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Limite
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Utilizado
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Situação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historicoCredito.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.dataAnalise}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.cliente}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.limite}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.utilizado}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.score}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.situacao === "Aprovado"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.situacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isDrawerOpen && selectedCliente && (
        <>
          <button
            onClick={() => {
              setIsDrawerOpen(false);
            }}
            className="absolute inset-0 bg-slate-900/20 transition-opacity"
            aria-label="Fechar painel de detalhes"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white border-l border-gray-200 shadow-xl z-10 flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg text-gray-900">Detalhes do cliente</h3>
                <p className="text-xs text-gray-500">Visão rápida e ações</p>
              </div>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
                className="w-8 h-8 inline-flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5 space-y-6">
              <section>
                <h4 className="text-sm text-gray-500 mb-3">Dados</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-900">{selectedCliente.nome}</p>
                  <p className="text-gray-600">{selectedCliente.email}</p>
                  <p className="text-gray-600">{selectedCliente.telefone}</p>
                  <p className="text-gray-600">Vendedor: {selectedCliente.vendedor}</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedCliente.statusColor}`}
                  >
                    {selectedCliente.status.charAt(0).toUpperCase() +
                      selectedCliente.status.slice(1)}
                  </span>
                </div>
              </section>

              <section>
                <h4 className="text-sm text-gray-500 mb-3">Histórico simples</h4>
                <ul className="space-y-2">
                  {selectedCliente.historico.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-md px-3 py-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="text-sm text-gray-500 mb-3">Ações</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onOpenEnviarEmail(selectedCliente.id);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    E-mail
                  </button>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onOpenClientTasks(selectedCliente.id);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Plano de ação
                  </button>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onOpenNovoContato();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                  >
                    <Briefcase className="w-4 h-4" />
                    Contatos
                  </button>
                </div>
              </section>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}