import {
  Users,
  TrendingUp,
  FileText,
  UserPlus,
  Target,
  Calendar,
  ClipboardCheck,
  KanbanSquare,
} from 'lucide-react';

interface MainMenuViewProps {
  setActiveView: (view: string) => void;
  onBackToLogin: () => void;
  vendedorSelecionado: string;
  vendedores: readonly string[];
  onChangeVendedor: (vendedor: string) => void;
}

export function MainMenuView({
  setActiveView,
  onBackToLogin,
  vendedorSelecionado,
  vendedores,
  onChangeVendedor,
}: MainMenuViewProps) {
  const isDiretoria = (nome: string) => nome.trim().toLowerCase().includes('diretoria');

  const vendedoresOperacionais = vendedores.filter((vendedor) => !isDiretoria(vendedor));

  const baseVendedores =
    vendedoresOperacionais.length > 0 ? vendedoresOperacionais : vendedores;

  const kpisPorVendedor = baseVendedores.reduce<
    Record<string, { clientes: number; cotacoes: number; tarefas: number }>
  >((acc, vendedor, index) => {
    const fator = index + 1;
    acc[vendedor] = {
      clientes: 180 + fator * 37,
      cotacoes: 10 + fator * 4,
      tarefas: 3 + fator * 2,
    };
    return acc;
  }, {});

  const totaisKpi = Object.values(kpisPorVendedor).reduce(
    (acc, atual) => ({
      clientes: acc.clientes + atual.clientes,
      cotacoes: acc.cotacoes + atual.cotacoes,
      tarefas: acc.tarefas + atual.tarefas,
    }),
    { clientes: 0, cotacoes: 0, tarefas: 0 },
  );

  const isDiretoriaSelecionada = isDiretoria(vendedorSelecionado);

  const kpisExibidos = isDiretoriaSelecionada
    ? totaisKpi
    : kpisPorVendedor[vendedorSelecionado] ?? { clientes: 0, cotacoes: 0, tarefas: 0 };

  const menuCards = [
    {
      id: 'novo-contato',
      title: 'Novo contato',
      description: 'Selecione o cliente e registre um novo contato',
      icon: Calendar,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
    },
    {
      id: 'clients',
      title: 'Clientes',
      description: 'Gerencie seus clientes e contatos',
      icon: Users,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    
    
    {
      id: 'business',
      title: 'Cotações',
      description: 'Acompanhe suas cotações realizadas',
      icon: Target,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
    
    {
      id: 'messages',
      title: 'Agendar visita',
      description: 'Agende visitas para seus clientes',
      icon: Calendar,
      color: 'bg-cyan-500',
      hoverColor: 'hover:bg-cyan-600',
    },
    
   /* {
      id: 'tasks',
      title: 'Plano de ação',
      description: 'Gerencie seus planos de ação e atividades',
      icon: FileText,
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600',
    },*/
    {
      id: 'plano-acao',
      title: 'Plano de ação',
      description: 'Acompanhe e registre planos de ação.',
      icon: KanbanSquare,
      color: 'bg-slate-700',
      hoverColor: 'hover:bg-slate-800',
    },
    {
      id: 'calendar',
      title: 'Agenda',
      description: 'Calendário de compromissos',
      icon: Calendar,
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-600',
    },
    
  ];

  return (
    <div className="h-full overflow-auto bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Menu Principal</h1>
            
            <p className="text-xl text-slate-900 mt-2">
              Bem-vinda(o), {vendedorSelecionado}!
            </p>
            <p className="text-sm text-gray-500">Selecione uma opção para começar</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="w-full min-w-[220px]">
              <label className="block text-xs text-gray-500 mb-1">Vendedor</label>
              <select
                value={vendedorSelecionado}
                onChange={(event) => onChangeVendedor(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                {vendedores.map((vendedor) => (
                  <option key={vendedor} value={vendedor}>
                    {vendedor}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onBackToLogin}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Voltar ao login
            </button>
          </div>
        </div>

        {/**/}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {isDiretoriaSelecionada ? 'Total de clientes' : 'Seus clientes'}
                </p>
                <p className="text-3xl text-gray-900">
                  {kpisExibidos.clientes.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {isDiretoriaSelecionada ? 'Total de cotações em andamento' : 'Suas cotações em andamento'}
                </p>
                <p className="text-3xl text-gray-900">
                  {kpisExibidos.cotacoes.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {isDiretoriaSelecionada ? 'Total de planos de ação pendentes' : 'Seus planos de ação pendentes'}
                </p>
                <p className="text-3xl text-gray-900">
                  {kpisExibidos.tarefas.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => setActiveView(card.id)}
                className="group bg-white border-2 border-gray-200 rounded-lg p-6 text-left transition-all hover:border-slate-800 hover:shadow-lg"
              >
                <div className={`${card.color} ${card.hoverColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2 group-hover:text-slate-800">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {card.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
