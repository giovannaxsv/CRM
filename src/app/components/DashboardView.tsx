import { Users, TrendingUp, DollarSign, ShoppingCart, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function DashboardView() {
  const kpiCards = [
    {
      title: 'Total de Clientes',
      value: '1,234',
      change: '+12.5%',
      isPositive: true,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 45.2K',
      change: '+8.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Oportunidades',
      value: '87',
      change: '-3.1%',
      isPositive: false,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Novos Leads',
      value: '156',
      change: '+23.4%',
      isPositive: true,
      icon: ShoppingCart,
      color: 'bg-orange-500',
    },
  ];

  const salesData = [
    { mes: 'Jan', vendas: 4000 },
    { mes: 'Fev', vendas: 3000 },
    { mes: 'Mar', vendas: 5000 },
    { mes: 'Abr', vendas: 4500 },
    { mes: 'Mai', vendas: 6000 },
    { mes: 'Jun', vendas: 5500 },
  ];

  const statusData = [
    { name: 'Ativo', value: 45, color: '#10b981' },
    { name: 'Venda Passiva', value: 30, color: '#f59e0b' },
    { name: 'Inativo', value: 25, color: '#ef4444' },
  ];

  const recentActivities = [
    {
      id: 1,
      cliente: 'Organic Grade A Coffee Beans',
      acao: 'Novo contato realizado',
      horario: 'Há 2 horas',
      tipo: 'contato',
    },
    {
      id: 2,
      cliente: 'Looking for Solar Panels',
      acao: 'Status alterado para Venda Passiva',
      horario: 'Há 4 horas',
      tipo: 'status',
    },
    {
      id: 3,
      cliente: 'Tech Solutions Inc',
      acao: 'Nova oportunidade criada',
      horario: 'Há 5 horas',
      tipo: 'oportunidade',
    },
    {
      id: 4,
      cliente: 'Global Trading Co',
      acao: 'Reunião agendada',
      horario: 'Há 1 dia',
      tipo: 'reuniao',
    },
  ];

  return (
    <div className="h-full overflow-auto bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl text-gray-900 mb-2">Dashboard Principal</h1>
        <p className="text-sm text-gray-500">Visão geral do sistema</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    card.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {card.isPositive ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span>{card.change}</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
              <p className="text-2xl text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/**/}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/*Vendas por Mês */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg text-gray-900 mb-4">Vendas por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="vendas" fill="#1e293b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status dos Clientes */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg text-gray-900 mb-4">Status dos Clientes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg text-gray-900 mb-4">Atividades Recentes</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
            >
              <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-slate-800"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.cliente}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">{activity.acao}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.horario}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
