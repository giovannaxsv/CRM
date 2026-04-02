import { useState } from "react";
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
  onNovoClienteClick: () => void;
  onOpenRealizarContato: (clientId: number) => void;
}

type ClienteStatus = "ativo" | "venda passiva" | "inativo";

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
  onNovoClienteClick,
  onOpenRealizarContato,
}: ClientesViewProps) {
  const [activeTab, setActiveTab] = useState("clientes");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedClienteId, setSelectedClienteId] = useState<
    number | null
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const clientes: Cliente[] = [
    {
      id: 1,
      nome: "Organic Grade A Coffee Beans",
      vendedor: "Julianaa",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "2 dias atrás",
      email: "contact@coffeebeans.com",
      telefone: "(11) 98765-1024",
      historico: [
        "Contato inicial por email em 15/03",
        "Envio de proposta em 20/03",
        "Follow-up realizado há 2 dias",
      ],
    },
    {
      id: 2,
      nome: "Looking for Eletric Panels",
      vendedor: "Gorete",
      status: "venda passiva",
      statusColor: "bg-yellow-100 text-yellow-800",
      ultimoContato: "5 dias atrás",
      email: "inquiry@panels.com",
      telefone: "(21) 99876-4432",
      historico: [
        "Lead importado da landing page",
        "Primeira reunião agendada",
        "Aguardando retorno sobre orçamento",
      ],
    },
    {
      id: 3,
      nome: "Solar Panels",
      vendedor: "Keila",
      status: "inativo",
      statusColor: "bg-red-100 text-red-800",
      ultimoContato: "30 dias atrás",
      email: "info@solar.com",
      telefone: "(31) 97654-8890",
      historico: [
        "Último contato sem resposta",
        "Oportunidade pausada pelo cliente",
        "Revisão prevista para próximo mês",
      ],
    },
  ];

  const statusFilters = [
    { id: "todos", label: "Todos" },
    { id: "ativo", label: "Ativo" },
    { id: "venda passiva", label: "Venda passiva" },
    { id: "inativo", label: "Inativo" },
  ];

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch = cliente.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "todos" ||
      cliente.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: clientes.length,
    ativos: clientes.filter((c) => c.status === "ativo").length,
    passivos: clientes.filter(
      (c) => c.status === "venda passiva",
    ).length,
    inativos: clientes.filter((c) => c.status === "inativo")
      .length,
  };

  const selectedCliente = clientes.find(
    (cliente) => cliente.id === selectedClienteId,
  );

  const openDetailsDrawer = (clienteId: number) => {
    setSelectedClienteId(clienteId);
    setIsDrawerOpen(true);
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
            onClick={() => setActiveTab("clientes")}
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
            onClick={() => setActiveTab("historico-vendas")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "historico-vendas"
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Histórico de vendas
          </button>
          <button
            onClick={() => setActiveTab("historico-credito")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "historico-credito"
                ? "bg-slate-800 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Histórico de crédito
          </button>
        </div>

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
      </div>

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
                  Último Contato
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

      {isDrawerOpen && selectedCliente && (
        <>
          <button
            onClick={() => setIsDrawerOpen(false)}
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
                onClick={() => setIsDrawerOpen(false)}
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
                  <button className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                    <CheckSquare className="w-4 h-4" />
                    Tarefa
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
                    <Briefcase className="w-4 h-4" />
                    Oportunidade
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