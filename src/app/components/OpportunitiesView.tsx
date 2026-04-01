import { useState } from 'react';
import { Search, Filter, Plus, Calendar, DollarSign, MoreVertical } from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  company: string;
  contact: string;
  value: number;
  stage: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechado';
  probability: number;
  closeDate: string;
}

const mockOpportunities: Opportunity[] = [
  { id: 1, title: 'Implementação de CRM', company: 'Tech Solutions', contact: 'João Silva', value: 85000, stage: 'proposta', probability: 65, closeDate: '2026-04-15' },
  { id: 2, title: 'Migração para Cloud', company: 'Startup Inovadora', contact: 'Maria Santos', value: 120000, stage: 'negociacao', probability: 80, closeDate: '2026-04-30' },
  { id: 3, title: 'Sistema de Gestão', company: 'Digital Agency', contact: 'Pedro Costa', value: 95000, stage: 'qualificacao', probability: 45, closeDate: '2026-05-10' },
  { id: 4, title: 'Plataforma E-commerce', company: 'E-commerce Plus', contact: 'Ana Oliveira', value: 150000, stage: 'proposta', probability: 70, closeDate: '2026-04-20' },
  { id: 5, title: 'Consultoria Digital', company: 'Consulting Corp', contact: 'Carlos Mendes', value: 65000, stage: 'prospeccao', probability: 30, closeDate: '2026-05-30' },
];

const stageColors = {
  prospeccao: 'bg-gray-100 text-gray-700',
  qualificacao: 'bg-blue-100 text-blue-700',
  proposta: 'bg-purple-100 text-purple-700',
  negociacao: 'bg-orange-100 text-orange-700',
  fechado: 'bg-green-100 text-green-700',
};

const stageLabels = {
  prospeccao: 'Prospecção',
  qualificacao: 'Qualificação',
  proposta: 'Proposta',
  negociacao: 'Negociação',
  fechado: 'Fechado',
};

export function OpportunitiesView() {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOpps = mockOpportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = filteredOpps.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = filteredOpps.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl text-gray-900 mb-1">Oportunidades</h2>
          <p className="text-sm text-gray-500">Acompanhe suas negociações em andamento</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Pipeline Total</p>
            <p className="text-2xl text-gray-900 mt-1">R$ {totalValue.toLocaleString('pt-BR')}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Valor Ponderado</p>
            <p className="text-2xl text-gray-900 mt-1">R$ {Math.round(weightedValue).toLocaleString('pt-BR')}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Oportunidades Ativas</p>
            <p className="text-2xl text-gray-900 mt-1">{filteredOpps.length}</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar oportunidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Filter size={20} />
            Filtrar
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Plus size={20} />
            Nova Oportunidade
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Oportunidade</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Estágio</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Probabilidade</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Fechamento</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOpps.map((opp) => (
                <tr
                  key={opp.id}
                  onClick={() => setSelectedOpp(opp)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{opp.title}</p>
                      <p className="text-xs text-gray-500">{opp.company} • {opp.contact}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${stageColors[opp.stage]}`}>
                      {stageLabels[opp.stage]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    R$ {opp.value.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${opp.probability}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{opp.probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(opp.closeDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOpp && (
        <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-auto">
          <div className="mb-6">
            <h3 className="text-xl text-gray-900">{selectedOpp.title}</h3>
            <p className="text-sm text-gray-500">{selectedOpp.company}</p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-gray-500 mb-3">Informações da Oportunidade</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Contato Principal</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedOpp.contact}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estágio</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${stageColors[selectedOpp.stage]}`}>
                    {stageLabels[selectedOpp.stage]}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valor</p>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign size={16} className="text-gray-400" />
                    <span className="text-lg text-gray-900">R$ {selectedOpp.value.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Probabilidade de Fechamento</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-900">{selectedOpp.probability}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${selectedOpp.probability}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Data de Fechamento Estimada</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{new Date(selectedOpp.closeDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm text-gray-500 mb-3">Próximas Ações</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Enviar proposta comercial</p>
                    <p className="text-xs text-gray-500">Vence em 2 dias</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Reunião de follow-up</p>
                    <p className="text-xs text-gray-500">Agendada para 05/04</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm text-gray-500 mb-3">Histórico</h4>
              <div className="space-y-3">
                <div className="pb-3 border-b border-gray-100">
                  <p className="text-sm text-gray-900">Movido para "Proposta"</p>
                  <p className="text-xs text-gray-500 mt-1">25 de março, 2026</p>
                </div>
                <div className="pb-3 border-b border-gray-100">
                  <p className="text-sm text-gray-900">Reunião de descoberta realizada</p>
                  <p className="text-xs text-gray-500 mt-1">18 de março, 2026</p>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Atualizar Estágio
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Adicionar Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
