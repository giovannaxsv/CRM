import {
  Calendar,
  Clock,
  FileText,
  PhoneCall,
  Target,
  Users,
  UserPlus,
  ClipboardCheck,
  BadgeDollarSign,
  KanbanSquare,
} from 'lucide-react';

interface SidebarNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  profile?: 'vendedores' | 'diretoria';
}

export function SidebarNav({ activeView, setActiveView, profile = 'vendedores' }: SidebarNavProps) {
  const menuItems =
    profile === 'diretoria'
      ? [
          { id: 'novo-contato', icon: PhoneCall, label: 'Novo contato' },
          { id: 'clients', icon: Users, label: 'Clientes' },
          { id: 'business', icon: Target, label: 'Cotações' },
          { id: 'messages', icon: Clock, label: 'Agendar visita' },
          //{ id: 'tasks', icon: FileText, label: 'Plano de ação' },
          { id: 'plano-acao', icon: KanbanSquare, label: 'Plano de ação' },
          { id: 'calendar', icon: Calendar, label: 'Agenda' },
          { id: 'diretoria-politica-precos', icon: BadgeDollarSign, label: 'Política de preços' },
          { id: 'history', icon: ClipboardCheck, label: 'Avaliar cotações pendentes' },
          { id: 'new-client', icon: UserPlus, label: 'Novo cliente' },
        ]
      : [
          { id: 'clients', icon: Users, label: 'Clientes' },
          { id: 'novo-contato', icon: PhoneCall, label: 'Novo contato' },
          { id: 'new-client', icon: UserPlus, label: 'Novo cliente' },
          { id: 'business', icon: Target, label: 'Cotações' },
          { id: 'messages', icon: Clock, label: 'Agendar visita' },
          //{ id: 'tasks', icon: FileText, label: 'Plano de ação' },
          { id: 'plano-acao', icon: KanbanSquare, label: 'Plano de ação' },
          { id: 'calendar', icon: Calendar, label: 'Agenda' },
        ];

  const menuHomeView = profile === 'diretoria' ? 'diretoria-menu' : 'main';

  return (
    <div className="w-[90px] bg-slate-800 flex flex-col items-center py-6 gap-2">
      <button
        onClick={() => setActiveView(menuHomeView)}
        className="mb-4 text-white text-xs px-3 py-2 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
        title="Menu principal"
      >
        MENU
      </button>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
              isActive
                ? 'bg-slate-600 text-white'
                : 'text-gray-400 hover:bg-slate-700 hover:text-white'
            }`}
            title={item.label}
          >
            <Icon className="w-6 h-6" />
          </button>
        );
      })}
    </div>
  );
}
