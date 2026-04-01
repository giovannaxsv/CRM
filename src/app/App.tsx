import { useState } from "react";
import { Header } from "./components/Header";
import { SidebarNav } from "./components/SidebarNav";
import { ClientesView } from "./components/ClientesView";
import { MainMenuView } from "./components/MainMenuView";

export default function App() {
  const [activeView, setActiveView] = useState("main");

  const renderView = () => {
    switch (activeView) {
      case "clients":
        return <ClientesView />;
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