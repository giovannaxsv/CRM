import {
  Home,
  User,
  PlusCircle,
  Clock,
  MessageSquare,
  Image,
  Briefcase,
  Globe,
  Headphones,
  LogOut
} from 'lucide-react';

interface SidebarNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function SidebarNav({ activeView, setActiveView }: SidebarNavProps) {
  const menuItems = [
    { id: 'main', icon: Home, label: 'Main' },
    { id: 'clients', icon: User, label: 'Clientes' },
    { id: 'add', icon: PlusCircle, label: 'Adicionar' },
    { id: 'history', icon: Clock, label: 'Histórico' },
    { id: 'messages', icon: MessageSquare, label: 'Mensagens' },
    { id: 'gallery', icon: Image, label: 'Galeria' },
    { id: 'business', icon: Briefcase, label: 'Negócios' },
    { id: 'global', icon: Globe, label: 'Global' },
    { id: 'support', icon: Headphones, label: 'Suporte' },
    { id: 'logout', icon: LogOut, label: 'Sair' },
  ];

  return (
    <div className="w-[90px] bg-slate-800 flex flex-col items-center py-6 gap-2">
      <div className="mb-4 text-white text-xs px-3 py-2 bg-slate-700 rounded-md">
        Main
      </div>
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
