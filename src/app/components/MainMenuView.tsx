import {
  Users,
  PlusCircle,
  Clock,
  MessageSquare,
  TrendingUp,
  Briefcase,
  FileText,
  Settings,
  BarChart3,
  UserPlus,
  Target,
  Calendar
} from 'lucide-react';

interface MainMenuViewProps {
  setActiveView: (view: string) => void;
}

export function MainMenuView({ setActiveView }: MainMenuViewProps) {
  const menuCards = [
    {
      id: 'clients',
      title: 'Clientes',
      description: 'Gerencie seus clientes e contatos',
      icon: Users,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      id: 'add',
      title: 'Novo Cliente',
      description: 'Adicionar novo cliente ao sistema',
      icon: UserPlus,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      id: 'business',
      title: 'Oportunidades',
      description: 'Acompanhe suas oportunidades de vendas',
      icon: Target,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
    {
      id: 'history',
      title: 'Histórico',
      description: 'Visualize o histórico de atividades',
      icon: Clock,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
    },
    {
      id: 'messages',
      title: 'Mensagens',
      description: 'Central de comunicação com clientes',
      icon: MessageSquare,
      color: 'bg-cyan-500',
      hoverColor: 'hover:bg-cyan-600',
    },
    {
      id: 'reports',
      title: 'Relatórios',
      description: 'Análises e relatórios de desempenho',
      icon: BarChart3,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
    },
    {
      id: 'tasks',
      title: 'Tarefas',
      description: 'Gerencie suas tarefas e atividades',
      icon: FileText,
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600',
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
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Menu Principal</h1>
          <p className="text-sm text-gray-500">Selecione uma opção para começar</p>
        </div>

        {/**/}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Clientes</p>
                <p className="text-3xl text-gray-900">1,234</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Oportunidades Abertas</p>
                <p className="text-3xl text-gray-900">87</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tarefas Pendentes</p>
                <p className="text-3xl text-gray-900">23</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
