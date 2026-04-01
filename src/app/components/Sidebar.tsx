import { Users, Briefcase, Target, BarChart3, Settings } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'leads', icon: Target, label: 'Leads' },
    { id: 'contacts', icon: Users, label: 'Contatos' },
    { id: 'opportunities', icon: Briefcase, label: 'Oportunidades' },
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="w-60 bg-[#1e1e1e] text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl text-white">CRM Pro</h1>
        <p className="text-xs text-gray-400 mt-1">Gestão de Clientes</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeView === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm">U</span>
          </div>
          <div>
            <p className="text-sm">Usuário Demo</p>
            <p className="text-xs text-gray-400">usuario@empresa.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
