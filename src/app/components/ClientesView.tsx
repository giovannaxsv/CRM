import { useState } from "react";
import {
  ChevronRight,
  Eye,
  Send,
  Filter,
  Download,
  Plus,
  Search,
} from "lucide-react";

export function ClientesView() {
  const [activeTab, setActiveTab] = useState("clientes");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const clientes = [
    {
      id: 1,
      nome: "Organic Grade A Coffee Beans",
      vendedor: "Julianaa",
      status: "ativo",
      statusColor: "bg-green-100 text-green-800",
      ultimoContato: "2 dias atrás",
      email: "contact@coffeebeans.com",
    },
    {
      id: 2,
      nome: "Looking for Eletric Panels",
      vendedor: "Gorete",
      status: "venda passiva",
      statusColor: "bg-yellow-100 text-yellow-800",
      ultimoContato: "5 dias atrás",
      email: "inquiry@panels.com",
    },
    {
      id: 3,
      nome: "Solar Panels",
      vendedor: "Keila",
      status: "inativo",
      statusColor: "bg-red-100 text-red-800",
      ultimoContato: "30 dias atrás",
      email: "info@solar.com",
    },
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

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium">Clientes</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors">
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
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
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
                  className="hover:bg-gray-50 transition-colors"
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
                    <button className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-slate-800 hover:bg-gray-100 rounded transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:text-slate-800 hover:bg-gray-100 rounded transition-colors"
                        title="Enviar mensagem"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-1.5 bg-slate-800 text-white text-xs rounded hover:bg-slate-700 transition-colors">
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
    </div>
  );
}