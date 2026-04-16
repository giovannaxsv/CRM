import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  ChevronDown,
  ChevronUp,
  FileUp,
  Search,
  ShieldCheck,
} from "lucide-react";

type IcmsFaixa = "4%" | "7%" | "12%" | "17%" | "18%";

interface MetricasFaixa {
  custo: number;
  meta: number;
  minimo: number;
}

interface ProdutoPolitica {
  id: number;
  nome: string;
  codigo: string;
  especificacao: string;
  atualizadoEm: string;
  atualizadoPor: string;
  faixas: Record<IcmsFaixa, MetricasFaixa>;
}

const filiaisMock = ["Belo Horizonte","São Paulo"];

const faixasIcms: IcmsFaixa[] = ["4%", "7%", "12%", "17%", "18%"];

const produtosMock: ProdutoPolitica[] = [
  {
    id: 1,
    nome: "Carbeto de Silício SiC",
    codigo: "MET-SIC-001",
    especificacao: "Granulometria 0-1 mm",
    atualizadoEm: "08/04/2026",
    atualizadoPor: "Mariana Costa",
    faixas: {
      "4%": { custo: 5100, meta: 5480, minimo: 5320 },
      "7%": { custo: 5150, meta: 5520, minimo: 5380 },
      "12%": { custo: 5220, meta: 5590, minimo: 5450 },
      "17%": { custo: 5290, meta: 5660, minimo: 5520 },
      "18%": { custo: 5310, meta: 5680, minimo: 5550 },
    },
  },
  {
    id: 2,
    nome: "CaSi",
    codigo: "MET-CASI-014",
    especificacao: "Granulometria 10-30 mm",
    atualizadoEm: "07/04/2026",
    atualizadoPor: "Renato Prado",
    faixas: {
      "4%": { custo: 6320, meta: 6700, minimo: 6550 },
      "7%": { custo: 6380, meta: 6760, minimo: 6620 },
      "12%": { custo: 6460, meta: 6840, minimo: 6680 },
      "17%": { custo: 6510, meta: 6900, minimo: 6760 },
      "18%": { custo: 6540, meta: 6930, minimo: 6790 },
    },
  },
  {
    id: 3,
    nome: "FeCr A/C",
    codigo: "LIG-FECR-101",
    especificacao: "Teor Cr 60-65%",
    atualizadoEm: "05/04/2026",
    atualizadoPor: "Mariana Costa",
    faixas: {
      "4%": { custo: 0, meta: 0, minimo: 0 },
      "7%": { custo: 0, meta: 0, minimo: 0 },
      "12%": { custo: 0, meta: 0, minimo: 0 },
      "17%": { custo: 0, meta: 0, minimo: 0 },
      "18%": { custo: 0, meta: 0, minimo: 0 },
    },
  },
  {
    id: 4,
    nome: "FeCr B/C",
    codigo: "LIG-FECR-102",
    especificacao: "Teor Cr 52-58%",
    atualizadoEm: "03/04/2026",
    atualizadoPor: "Pedro Lacerda",
    faixas: {
      "4%": { custo: 4690, meta: 5080, minimo: 4920 },
      "7%": { custo: 4730, meta: 5120, minimo: 4970 },
      "12%": { custo: 4810, meta: 5190, minimo: 5030 },
      "17%": { custo: 4880, meta: 5260, minimo: 5100 },
      "18%": { custo: 4910, meta: 5290, minimo: 5130 },
    },
  },
  {
    id: 5,
    nome: "Areia de Cromita",
    codigo: "MIN-CROM-220",
    especificacao: "Granulometria 0,2-0,6 mm",
    atualizadoEm: "02/04/2026",
    atualizadoPor: "Ana Ribeiro",
    faixas: {
      "4%": { custo: 1890, meta: 2140, minimo: 2050 },
      "7%": { custo: 1940, meta: 2180, minimo: 2090 },
      "12%": { custo: 1990, meta: 2230, minimo: 2140 },
      "17%": { custo: 2050, meta: 2290, minimo: 2200 },
      "18%": { custo: 2070, meta: 2320, minimo: 2230 },
    },
  },
  {
    id: 6,
    nome: "Níquel",
    codigo: "LIG-NI-077",
    especificacao: "Cátodo 99,8%",
    atualizadoEm: "01/04/2026",
    atualizadoPor: "Pedro Lacerda",
    faixas: {
      "4%": { custo: 0, meta: 14300, minimo: 13950 },
      "7%": { custo: 13150, meta: 14550, minimo: 14100 },
      "12%": { custo: 13380, meta: 14820, minimo: 14390 },
      "17%": { custo: 13620, meta: 15090, minimo: 14670 },
      "18%": { custo: 13710, meta: 15210, minimo: 14830 },
    },
  },
  {
    id: 7,
    nome: "FeSi 75%",
    codigo: "LIG-FESI-075",
    especificacao: "Silício 74-76%",
    atualizadoEm: "31/03/2026",
    atualizadoPor: "Ana Ribeiro",
    faixas: {
      "4%": { custo: 3950, meta: 4290, minimo: 4150 },
      "7%": { custo: 4020, meta: 4360, minimo: 4220 },
      "12%": { custo: 4090, meta: 4430, minimo: 4280 },
      "17%": { custo: 4150, meta: 4510, minimo: 4350 },
      "18%": { custo: 4180, meta: 4540, minimo: 4380 },
    },
  },
  {
    id: 8,
    nome: "CaSi PM 20%",
    codigo: "MET-CASI-220",
    especificacao: "Pó micronizado 20%",
    atualizadoEm: "30/03/2026",
    atualizadoPor: "Mariana Costa",
    faixas: {
      "4%": { custo: 2860, meta: 3180, minimo: 3070 },
      "7%": { custo: 2900, meta: 3210, minimo: 3100 },
      "12%": { custo: 2940, meta: 3260, minimo: 3140 },
      "17%": { custo: 2990, meta: 3320, minimo: 3200 },
      "18%": { custo: 3010, meta: 3340, minimo: 3220 },
    },
  },
];

function formatMoney(value: number) {
  if (value <= 0) {
    return "Não definido";
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function isValueMissing(value: number) {
  return value <= 0;
}

export function PoliticaPrecosView() {
  const [filial, setFilial] = useState(filiaisMock[0]);
  const [busca, setBusca] = useState("");
  const [idsAbertos, setIdsAbertos] = useState<number[]>([1, 2]);
  const [feedback, setFeedback] = useState("");

  const produtosFiltrados = useMemo(() => {
    const term = busca.trim().toLowerCase();

    if (!term) {
      return produtosMock;
    }

    return produtosMock.filter((produto) => {
      return (
        produto.nome.toLowerCase().includes(term) ||
        produto.codigo.toLowerCase().includes(term) ||
        produto.especificacao.toLowerCase().includes(term)
      );
    });
  }, [busca]);

  const ultimaAtualizacao = useMemo(() => {
    const primeiro = produtosMock[0];
    return `${primeiro.atualizadoEm} por ${primeiro.atualizadoPor}`;
  }, []);

  const alternarProduto = (id: number) => {
    setIdsAbertos((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleImportarPlanilha = () => {
    setFeedback("Importação iniciada. A validação da planilha será exibida aqui.");
  };

  const handleAtualizarPrecos = () => {
    setFeedback("Política de referência atualizada com sucesso.");
  };

  return (
    <div className="h-full overflow-auto bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <header className="rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl text-slate-900">Política de referência de preços</h1>
          <p className="text-sm text-slate-500 mt-2">
            Defina os valores de custo, meta e preço mínimo por produto e faixa de ICMS.
          </p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_auto_auto] gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Filial</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={filial}
                  onChange={(event) => setFilial(event.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  {filiaisMock.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">Buscar produto</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Nome, código ou especificação"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>

            <button
              onClick={handleImportarPlanilha}
              className="h-10 self-end inline-flex items-center justify-center gap-2 px-4 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
            >
              <FileUp className="w-4 h-4" />
              Importar planilha
            </button>

            <button
              onClick={handleAtualizarPrecos}
              className="h-10 self-end inline-flex items-center justify-center gap-2 px-4 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Atualizar preços
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Última atualização em {ultimaAtualizacao}
          </p>
        </section>

        {feedback && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm px-4 py-3">
            {feedback}
          </div>
        )}

        <div className="space-y-4 pb-2">
          {produtosFiltrados.map((produto) => {
            const aberto = idsAbertos.includes(produto.id);

            return (
              <section key={produto.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <button
                  onClick={() => alternarProduto(produto.id)}
                  className="w-full px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base text-slate-900">{produto.nome}</h2>
                      <p className="text-sm text-slate-500 mt-1">{produto.especificacao}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>Código: {produto.codigo}</span>
                        <span>Última atualização: {produto.atualizadoEm}</span>
                        <span>Usuário: {produto.atualizadoPor}</span>
                      </div>
                    </div>
                    <div className="text-slate-500 mt-1">
                      {aberto ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {aberto && (
                  <div className="px-5 pb-5 border-t border-slate-200 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 mt-4">
                      {faixasIcms.map((faixa) => {
                        const valores = produto.faixas[faixa];

                        return (
                          <article key={faixa} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <p className="text-sm text-slate-700 mb-3">ICMS {faixa}</p>

                            <div className="space-y-2 text-sm">
                              <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                                <p className="text-xs text-slate-500">Custo</p>
                                <p
                                  className={`mt-1 ${
                                    isValueMissing(valores.custo) ? "text-amber-700" : "text-slate-800"
                                  }`}
                                >
                                  {formatMoney(valores.custo)}
                                </p>
                              </div>

                              <div className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2">
                                <p className="text-xs text-sky-700">Meta</p>
                                <p
                                  className={`mt-1 ${
                                    isValueMissing(valores.meta) ? "text-amber-700" : "text-sky-900"
                                  }`}
                                >
                                  {formatMoney(valores.meta)}
                                </p>
                              </div>

                              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
                                <p className="text-xs text-amber-700">Mínimo</p>
                                <p
                                  className={`mt-1 font-medium ${
                                    isValueMissing(valores.minimo) ? "text-amber-700" : "text-amber-900"
                                  }`}
                                >
                                  {formatMoney(valores.minimo)}
                                </p>
                              </div>
                            </div>

                            {(isValueMissing(valores.custo) ||
                              isValueMissing(valores.meta) ||
                              isValueMissing(valores.minimo)) && (
                              <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-amber-700">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Valores pendentes nesta faixa
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            );
          })}

          {produtosFiltrados.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Nenhum produto encontrado para os filtros informados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
