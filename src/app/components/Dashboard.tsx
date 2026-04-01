import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';

const salesData = [
  { month: 'Jan', vendas: 45000 },
  { month: 'Fev', vendas: 52000 },
  { month: 'Mar', vendas: 48000 },
  { month: 'Abr', vendas: 61000 },
  { month: 'Mai', vendas: 55000 },
  { month: 'Jun', vendas: 67000 },
];

const leadStatusData = [
  { name: 'Novo', value: 35, color: '#3b82f6' },
  { name: 'Qualificado', value: 28, color: '#8b5cf6' },
  { name: 'Negociação', value: 22, color: '#f59e0b' },
  { name: 'Fechado', value: 15, color: '#10b981' },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      <div>
        <h2 className="text-2xl text-gray-900 mb-1">Dashboard</h2>
        <p className="text-sm text-gray-500">Visão geral do desempenho</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="text-blue-600" size={24} />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp size={14} />
              +12%
            </span>
          </div>
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-3xl text-gray-900 mt-1">847</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp size={14} />
              +8%
            </span>
          </div>
          <p className="text-sm text-gray-500">Clientes Ativos</p>
          <p className="text-3xl text-gray-900 mt-1">1,234</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp size={14} />
              +23%
            </span>
          </div>
          <p className="text-sm text-gray-500">Receita Mensal</p>
          <p className="text-3xl text-gray-900 mt-1">R$ 67k</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Target className="text-orange-600" size={24} />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp size={14} />
              +5%
            </span>
          </div>
          <p className="text-sm text-gray-500">Taxa de Conversão</p>
          <p className="text-3xl text-gray-900 mt-1">18.5%</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg text-gray-900 mb-4">Vendas por Mês</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="vendas" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg text-gray-900 mb-4">Status dos Leads</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {leadStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {leadStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
