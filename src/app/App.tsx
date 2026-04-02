import { useState } from "react";
import { Header } from "./components/Header";
import { SidebarNav } from "./components/SidebarNav";
import { ClientesView } from "./components/ClientesView";
import { MainMenuView } from "./components/MainMenuView";
import { NovoClienteView } from "./components/NovoClienteView";
import { RealizarContatoView } from "./components/RealizarContatoView.tsx";
import { CotacaoView } from "./components/CotacaoView.tsx";
import { CalculoMargemView } from "./components/CalculoMargemView.tsx";

export default function App() {
  const [activeView, setActiveView] = useState("main");
  const [selectedClientId, setSelectedClientId] = useState<
    number | null
  >(null);

  const renderView = () => {
    switch (activeView) {
      case "clients":
        return (
          <ClientesView
            onNovoClienteClick={() =>
              setActiveView("new-client")
            }
            onOpenRealizarContato={(clientId) => {
              setSelectedClientId(clientId);
              setActiveView("realizar-contato");
            }}
          />
        );
      case "new-client":
        return (
          <NovoClienteView
            onBackToClients={() =>
              setActiveView("clients")
            }
          />
        );
      case "realizar-contato":
        return (
          <RealizarContatoView
            clientId={selectedClientId}
            onBackToClients={() => setActiveView("clients")}
            onSaveAndCreateOpportunity={() =>
              setActiveView("cotacao")
            }
          />
        );
      case "cotacao":
        return (
          <CotacaoView
            clientId={selectedClientId}
            onBackToContato={() =>
              setActiveView("realizar-contato")
            }
            onBackToClients={() => setActiveView("clients")}
            onOpenCalculoMargem={() =>
              setActiveView("calculo-margem")
            }
          />
        );
      case "calculo-margem":
        return (
          <CalculoMargemView
            clientId={selectedClientId}
            onBackToCotacao={() => setActiveView("cotacao")}
          />
        );
      case "main":
        return <MainMenuView setActiveView={setActiveView} />;
      default:
        return (
          <div className="p-6 bg-white h-full">
            <h2 className="text-2xl text-gray-900 mb-1">Em desenvolvimento</h2>
            <p className="text-sm text-gray-500">Esta seção estará disponível em breve</p>
          </div>
        );
    }
  };

  return (
    <div className="size-full flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 overflow-hidden m-4 rounded-lg shadow-sm">
          {renderView()}
        </div>
      </div>
    </div>
  );
}