import { useState } from 'react';
import { Search, Filter, Plus, Mail, Phone, MoreVertical } from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'novo' | 'qualificado' | 'negociacao' | 'perdido';
  value: number;
  source: string;
}

const mockLeads: Lead[] = [
  { id: 1, name: 'João Silva', email: 'joao@empresa.com', phone: '(11) 98765-4321', company: 'Tech Solutions', status: 'novo', value: 15000, source: 'Website' },
  { id: 2, name: 'Maria Santos', email: 'maria@startup.com', phone: '(21) 99876-5432', company: 'Startup Inovadora', status: 'qualificado', value: 25000, source: 'LinkedIn' },
  { id: 3, name: 'Pedro Costa', email: 'pedro@digital.com', phone: '(11) 97654-3210', company: 'Digital Agency', status: 'negociacao', value: 45000, source: 'Referência' },
  { id: 4, name: 'Ana Oliveira', email: 'ana@commerce.com', phone: '(85) 96543-2109', company: 'E-commerce Plus', status: 'qualificado', value: 32000, source: 'Google Ads' },
  { id: 5, name: 'Carlos Mendes', email: 'carlos@consulting.com', phone: '(11) 95432-1098', company: 'Consulting Corp', status: 'novo', value: 18000, source: 'Website' },
];

const statusColors = {
  novo: 'bg-blue-100 text-blue-700',
  qualificado: 'bg-purple-100 text-purple-700',
  negociacao: 'bg-orange-100 text-orange-700',
  perdido: 'bg-red-100 text-red-700',
};

const statusLabels = {
  novo: 'Novo',
  qualificado: 'Qualificado',
  negociacao: 'Negociação',
  perdido: 'Perdido',
};

export function LeadsView() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = mockLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl text-gray-900 mb-1">Leads</h2>
          <p className="text-sm text-gray-500">Gerencie seus potenciais clientes</p>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar leads..."
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
            Novo Lead
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Empresa</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Origem</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lead.company}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${statusColors[lead.status]}`}>
                      {statusLabels[lead.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    R$ {lead.value.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{lead.source}</td>
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

      {selectedLead && (
        <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-auto">
          <div className="mb-6">
            <h3 className="text-xl text-gray-900">{selectedLead.name}</h3>
            <p className="text-sm text-gray-500">{selectedLead.company}</p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-gray-500 mb-3">Informações de Contato</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-900">{selectedLead.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-900">{selectedLead.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm text-gray-500 mb-3">Detalhes</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${statusColors[selectedLead.status]}`}>
                    {statusLabels[selectedLead.status]}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valor Estimado</p>
                  <p className="text-sm text-gray-900 mt-1">R$ {selectedLead.value.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Origem</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedLead.source}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm text-gray-500 mb-3">Atividades Recentes</h4>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-900">Email enviado</p>
                  <p className="text-xs text-gray-500">Há 2 dias</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-900">Reunião agendada</p>
                  <p className="text-xs text-gray-500">Há 5 dias</p>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Enviar Email
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Agendar Reunião
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
