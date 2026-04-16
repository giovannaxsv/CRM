import {
  ArrowLeft,
  BadgeDollarSign,
  Calendar,
  ClipboardCheck,
  FileText,
  PhoneCall,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  KanbanSquare,
} from "lucide-react";

interface DiretoriaMenuViewProps {
  setActiveView: (view: string) => void;
  onBackToLogin: () => void;
}

export function DiretoriaMenuView({ setActiveView, onBackToLogin }: DiretoriaMenuViewProps) {
  const menuCards = [
    {
      id: "diretoria-politica-precos",
      title: "Política de preços",
      description: "Defina a referência comercial por produto e faixa de ICMS.",
      icon: BadgeDollarSign,
      color: "bg-amber-500",
      hoverColor: "hover:bg-amber-600",
    },
    {
      id: "history",
      title: "Avaliar cotações pendentes",
      description: "Avalie cotações pendentes e tome decisões informadas",
      icon: ClipboardCheck,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
    },
    {
      id: "novo-contato",
      title: "Registro de contato",
      description: "Veja os contatos recentes e registre novas interações com clientes.",
      icon: PhoneCall,
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600",
    },
    {
      id: "clients",
      title: "Clientes",
      description: "Consulte clientes, histórico e ações comerciais.",
      icon: Users,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      id: "business",
      title: "Cotações",
      description: "Acompanhe as cotações e seus status de evolução.",
      icon: Target,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
    },
    {
      id: "plano-acao",
      title: "Plano de ação",
      description: "Acompanhe e registre planos de ação de toda a carteira.",
      icon: KanbanSquare,
      color: "bg-slate-700",
      hoverColor: "hover:bg-slate-800",
    },
    {
      id: "messages",
      title: "Agendar visita",
      description: "Organize visitas comerciais com os clientes.",
      icon: Calendar,
      color: "bg-cyan-500",
      hoverColor: "hover:bg-cyan-600",
    },
    /*{
      id: "tasks",
      title: "Plano de ação",
      description: "Gerencie planos de ação pendentes e acompanhamentos.",
      icon: FileText,
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
    },*/
    
    {
      id: "calendar",
      title: "Agenda",
      description: "Visualize os compromissos e eventos da equipe.",
      icon: Calendar,
      color: "bg-teal-500",
      hoverColor: "hover:bg-teal-600",
    },
    
    {
      id: "new-client",
      title: "Novo Cliente",
      description: "Adicionar novo cliente ao sistema",
      icon: UserPlus,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
  ];

  return (
    <div className="h-full overflow-auto bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Menu da Diretoria</h1>
            <p className="text-sm text-gray-500">Selecione uma opção para começar</p>
          </div>
          <button
            onClick={onBackToLogin}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao login
          </button>
        </div>

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
                <p className="text-sm text-gray-600 mb-1">Cotações em andamento</p>
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
                <p className="text-sm text-gray-600 mb-1">Planos de ação pendentes</p>
                <p className="text-3xl text-gray-900">23</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
