import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { SidebarNav } from "./components/SidebarNav";
import { ClientesView } from "./components/ClientesView";
import { MainMenuView } from "./components/MainMenuView";
import { NovoClienteView } from "./components/NovoClienteView";
import { RealizarContatoView } from "./components/RealizarContatoView.tsx";
import { SelecionarItensCarteiraView } from "./components/SelecionarItensCarteiraView.tsx";
import { CotacaoView } from "./components/CotacaoView.tsx";
import { CalculoMargemView } from "./components/CalculoMargemView.tsx";
import { EnviarEmailClienteView } from "./components/EnviarEmailClienteView.tsx";
import { TarefasClienteView } from "./components/TarefasClienteView.tsx";
import { ListaCotacoesView } from "./components/ListaCotacoesView.tsx";
import { CotacaoCompletaView } from "./components/CotacaoCompletaView.tsx";
import type { CotacaoAtualizacaoLocal } from "./components/ListaCotacoesView.tsx";
import { AvaliarCotacoesPendentesView } from "./components/AvaliarCotacoesPendentesView.tsx";
import { AgendarVisitaView } from "./components/AgendarVisitaView.tsx";
import { AgendaView } from "./components/AgendaView.tsx";
import { ConversaoPedidoView } from "./components/ConversaoPedidoView.tsx";
import { NovoContatoView } from "./components/NovoContatoView.tsx";
import { LoginView } from "./components/LoginView.tsx";
import { DiretoriaMenuView } from "./components/DiretoriaMenuView.tsx";
import { PoliticaPrecosView } from "./components/PoliticaPrecosView.tsx";
import { PlanoAcaoView } from "./components/PlanoAcaoView";

const vendedoresDisponiveis = [
  "Keila",
  "Everton",
  "Gorete",
  "Fernanda",
  "Tatiane",
  "Fabiana",
  
] as const;

export default function App() {
  const [activeView, setActiveView] = useState("login");
  const [perfilAtivo, setPerfilAtivo] = useState<"vendedores" | "diretoria" | null>(null);
  const [origemAgendarVisita, setOrigemAgendarVisita] = useState<"menu" | "login">("menu");
  const [vendedorSelecionadoVendas, setVendedorSelecionadoVendas] =
    useState<string>(vendedoresDisponiveis[0]);
  const [origemRealizarContato, setOrigemRealizarContato] = useState<"clients" | "novo-contato">("clients");
  const [selectedClientId, setSelectedClientId] = useState<
    number | null
  >(null);
  const [selectedCotacaoId, setSelectedCotacaoId] = useState<
    number | null
  >(null);
  const [cotacaoAtualizacoes, setCotacaoAtualizacoes] = useState<
    Record<number, CotacaoAtualizacaoLocal>
  >({});

  const handleMarcarCotacaoPerdida = (
    cotacaoId: number,
    payload: { motivoPerda: string; dataEncerramento: string },
  ) => {
    setCotacaoAtualizacoes((prev) => ({
      ...prev,
      [cotacaoId]: {
        etapa: "PERDIDA",
        motivoPerda: payload.motivoPerda,
        dataEncerramento: payload.dataEncerramento,
      },
    }));
  };

  const handleConfirmarConversaoPedido = (
    payload: {
      cotacaoId: number;
      numeroPedido: string;
      numeroOc: string;
      dataPedido: string;
    },
  ) => {
    setCotacaoAtualizacoes((prev) => ({
      ...prev,
      [payload.cotacaoId]: {
        ...prev[payload.cotacaoId],
        etapa: "PEDIDO FECHADO",
        numeroPedido: payload.numeroPedido,
        dataPedido: payload.dataPedido,
        ocGerada: true,
      },
    }));
    setActiveView("cotacao-completa");
  };

  const voltarMenuPrincipal = () => {
    setActiveView(perfilAtivo === "diretoria" ? "diretoria-menu" : "main");
  };

  const voltarAgendarVisita = () => {
    if (origemAgendarVisita === "login") {
      setPerfilAtivo(null);
      setActiveView("login");
      setOrigemAgendarVisita("menu");
      return;
    }

    voltarMenuPrincipal();
  };

  const vendedorFiltroVendas =
    perfilAtivo === "vendedores" ? vendedorSelecionadoVendas : null;

  useEffect(() => {
    if (!perfilAtivo) {
      return;
    }

    const isDiretoriaOnlyView =
      activeView === "diretoria-menu" || activeView === "diretoria-politica-precos";

    if (perfilAtivo !== "diretoria" && isDiretoriaOnlyView) {
      setActiveView("main");
      return;
    }

    if (perfilAtivo === "diretoria" && activeView === "main") {
      setActiveView("diretoria-menu");
    }
  }, [activeView, perfilAtivo]);

  const renderView = () => {
    switch (activeView) {
      case "clients":
        return (
          <ClientesView
            vendedorFiltro={vendedorFiltroVendas}
            onNovoClienteClick={() =>
              setActiveView("new-client")
            }
            onOpenRealizarContato={(clientId) => {
              setSelectedClientId(clientId);
              setOrigemRealizarContato("clients");
              setActiveView("realizar-contato");
            }}
            onOpenEnviarEmail={(clientId) => {
              setSelectedClientId(clientId);
              setActiveView("enviar-email-cliente");
            }}
            onOpenClientTasks={(clientId) => {
              setSelectedClientId(clientId);
              setActiveView("tarefas-cliente");
            }}
            onOpenNovoContato={() => {
              setActiveView("novo-contato");
            }}
          />
        );
      case "tarefas-cliente":
        return (
          <TarefasClienteView
            vendedorFiltro={vendedorFiltroVendas}
            clientId={selectedClientId}
            onBackToClients={() => setActiveView("clients")}
          />
        );
      case "tasks":
        return (
          <TarefasClienteView
            vendedorFiltro={vendedorFiltroVendas}
            clientId={selectedClientId}
            onBackToClients={voltarMenuPrincipal}
          />
        );
      case "enviar-email-cliente":
        return (
          <EnviarEmailClienteView
            clientId={selectedClientId}
            onBackToClients={() => setActiveView("clients")}
          />
        );
      case "new-client":
        return (
          <NovoClienteView
            isDiretoria={perfilAtivo === "diretoria"}
            onBackToClients={voltarMenuPrincipal}
          />
        );
      case "realizar-contato":
        return (
          <RealizarContatoView
            vendedorFiltro={vendedorFiltroVendas}
            clientId={selectedClientId}
            onBackToClients={() => setActiveView(origemRealizarContato)}
            onAdvanceToSelecionarItens={() =>
              setActiveView("selecionar-itens-carteira")
            }
          />
        );
      case "novo-contato":
        return (
          <NovoContatoView
            vendedorFiltro={vendedorFiltroVendas}
            isDiretoria={perfilAtivo === "diretoria"}
            onBackToMain={voltarMenuPrincipal}
            onIniciarContato={(clientId) => {
              setSelectedClientId(clientId);
              setOrigemRealizarContato("novo-contato");
              setActiveView("realizar-contato");
            }}
            onEvoluirParaCotacao={(clientId) => {
              setSelectedClientId(clientId);
              setOrigemRealizarContato("novo-contato");
              setActiveView("selecionar-itens-carteira");
            }}
          />
        );
      case "selecionar-itens-carteira":
        return (
          <SelecionarItensCarteiraView
            clientId={selectedClientId}
            onBackToContato={() =>
              setActiveView(origemRealizarContato === "novo-contato" ? "novo-contato" : "realizar-contato")
            }
            onAdvanceToCotacao={() =>
              setActiveView("cotacao")
            }
          />
        );
      case "cotacao":
        return (
          <CotacaoView
            clientId={selectedClientId}
            onBackToSelecionarItens={() =>
              setActiveView("selecionar-itens-carteira")
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
            onGoToListaCotacoes={() => setActiveView("business")}
          />
        );
      case "business":
        return (
          <ListaCotacoesView
            vendedorFiltro={vendedorFiltroVendas}
            cotacaoAtualizacoes={cotacaoAtualizacoes}
            onOpenCotacaoCompleta={(cotacaoId) => {
              setSelectedCotacaoId(cotacaoId);
              setActiveView("cotacao-completa");
            }}
          />
        );
      case "cotacao-completa":
        return (
          <CotacaoCompletaView
            cotacaoId={selectedCotacaoId}
            cotacaoAtualizacao={
              selectedCotacaoId ? cotacaoAtualizacoes[selectedCotacaoId] : undefined
            }
            onMarcarComoPerdida={handleMarcarCotacaoPerdida}
            onGerarPedido={() => setActiveView("conversao-pedido")}
            onBackToCotacoes={() => setActiveView("business")}
          />
        );
      case "conversao-pedido":
        return (
          <ConversaoPedidoView
            cotacaoId={selectedCotacaoId}
            onBackToCotacao={() => setActiveView("cotacao-completa")}
            onConfirmarConversao={handleConfirmarConversaoPedido}
          />
        );
      case "history":
        return (
          <AvaliarCotacoesPendentesView
            onBackToMain={voltarMenuPrincipal}
          />
        );
      case "messages":
        return (
          <AgendarVisitaView
            vendedorFiltro={vendedorFiltroVendas}
            onBackToMain={voltarAgendarVisita}
          />
        );
      case "calendar":
        return (
          <AgendaView
            vendedorFiltro={vendedorFiltroVendas}
            onBackToMain={voltarMenuPrincipal}
          />
        );
      case "plano-acao":
        return (
          <PlanoAcaoView
            vendedorFiltro={vendedorFiltroVendas}
            vendedores={vendedoresDisponiveis}
            onBackToMain={voltarMenuPrincipal}
          />
        );
      case "main":
        return (
          <MainMenuView
            vendedorSelecionado={vendedorSelecionadoVendas}
            vendedores={vendedoresDisponiveis}
            onChangeVendedor={setVendedorSelecionadoVendas}
            setActiveView={setActiveView}
            onBackToLogin={() => {
              setPerfilAtivo(null);
              setActiveView("login");
            }}
          />
        );
      case "diretoria-menu":
        return (
          <DiretoriaMenuView
            setActiveView={setActiveView}
            onBackToLogin={() => {
              setPerfilAtivo(null);
              setActiveView("login");
            }}
          />
        );
      case "diretoria-politica-precos":
        return <PoliticaPrecosView />;
      default:
        return (
          <div className="p-6 bg-white h-full">
            <h2 className="text-2xl text-gray-900 mb-1">Em desenvolvimento</h2>
            <p className="text-sm text-gray-500">Esta seção estará disponível em breve</p>
          </div>
        );
    }
  };

  if (activeView === "login") {
    return (
      <LoginView
        onEntrarVendedores={() => {
          setOrigemAgendarVisita("menu");
          setPerfilAtivo("vendedores");
          setVendedorSelecionadoVendas(vendedoresDisponiveis[0]);
          setActiveView("main");
        }}
        onEntrarDiretoria={() => {
          setOrigemAgendarVisita("menu");
          setPerfilAtivo("diretoria");
          setActiveView("diretoria-menu");
        }}
        onEntrarAgendarVisita={() => {
          setOrigemAgendarVisita("login");
          setPerfilAtivo(null);
          setActiveView("messages");
        }}
      />
    );
  }

  const hideSidebar = activeView === "messages" && origemAgendarVisita === "login";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {!hideSidebar && (
          <SidebarNav
            activeView={activeView}
            setActiveView={setActiveView}
            profile={perfilAtivo ?? 'vendedores'}
          />
        )}
        <div className="flex-1 min-h-0 overflow-hidden m-4 rounded-lg shadow-sm">
          {renderView()}
        </div>
      </div>
    </div>
  );
}