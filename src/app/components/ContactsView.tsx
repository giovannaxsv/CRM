import { useState } from 'react';
import { Search, Filter, Plus, Mail, Phone, Building2, MoreVertical } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  type: 'cliente' | 'prospect' | 'parceiro';
  lastContact: string;
}

const mockContacts: Contact[] = [
  { id: 1, name: 'FUNDICAO INDUSTRIAL LTDA', email: 'contato1@empresa.com.br', phone: '(11) 97650-1201', company: 'FUNDICAO INDUSTRIAL LTDA', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-28' },
  { id: 2, name: 'A FERROTEGRAO', email: 'contato2@empresa.com.br', phone: '(21) 97650-1202', company: 'A FERROTEGRAO', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-27' },
  { id: 3, name: 'A FRIDBERG DO BRASIL INDUSTRI', email: 'contato3@empresa.com.br', phone: '(11) 97650-1203', company: 'A FRIDBERG DO BRASIL INDUSTRI', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-26' },
  { id: 4, name: 'A TUDO PARA PNEUS LTDA', email: 'contato4@empresa.com.br', phone: '(21) 97650-1204', company: 'A TUDO PARA PNEUS LTDA', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-25' },
  { id: 5, name: 'AB TELECOMUNICACOES', email: 'contato5@empresa.com.br', phone: '(11) 97650-1205', company: 'AB TELECOMUNICACOES', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-24' },
  { id: 6, name: 'AB TRANSMISSAO AUTOMATICA LTDA', email: 'contato6@empresa.com.br', phone: '(21) 97650-1206', company: 'AB TRANSMISSAO AUTOMATICA LTDA', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-23' },
  { id: 7, name: 'ABCD IND. E COM. DE EMBALAGENS', email: 'contato7@empresa.com.br', phone: '(11) 97650-1207', company: 'ABCD IND. E COM. DE EMBALAGENS', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-22' },
  { id: 8, name: 'ACEARIA FREDERICO MISSNER LTDA', email: 'contato8@empresa.com.br', phone: '(21) 97650-1208', company: 'ACEARIA FREDERICO MISSNER LTDA', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-21' },
  { id: 9, name: 'ACEFER INDUSTRIA COMERCIO LTDA', email: 'contato9@empresa.com.br', phone: '(11) 97650-1209', company: 'ACEFER INDUSTRIA COMERCIO LTDA', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-20' },
  { id: 10, name: 'ACL METAIS LTDA', email: 'contato10@empresa.com.br', phone: '(21) 97650-1210', company: 'ACL METAIS LTDA', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-19' },
  { id: 11, name: 'ACOBET INDUSTRIA METALICA E C', email: 'contato11@empresa.com.br', phone: '(11) 97650-1211', company: 'ACOBET INDUSTRIA METALICA E C', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-18' },
  { id: 12, name: 'ACOCRIL INDUSTRIA E COMERCIO D', email: 'contato12@empresa.com.br', phone: '(21) 97650-1212', company: 'ACOCRIL INDUSTRIA E COMERCIO D', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-17' },
  { id: 13, name: 'ACOTECNICAS A/IND E COMERCIO', email: 'contato13@empresa.com.br', phone: '(11) 97650-1213', company: 'ACOTECNICAS A/IND E COMERCIO', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-16' },
  { id: 14, name: 'ACQUA MINERA COMERCIO IMPORTA', email: 'contato14@empresa.com.br', phone: '(21) 97650-1214', company: 'ACQUA MINERA COMERCIO IMPORTA', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-15' },
  { id: 15, name: 'ACRILDESTAC IND. COM. LTDA EPP', email: 'contato15@empresa.com.br', phone: '(11) 97650-1215', company: 'ACRILDESTAC IND. COM. LTDA EPP', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-14' },
  { id: 16, name: 'ACRIVILLE COMERCIO DE ACRILICO', email: 'contato16@empresa.com.br', phone: '(21) 97650-1216', company: 'ACRIVILLE COMERCIO DE ACRILICO', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-13' },
  { id: 17, name: 'ACTIONGYM COMERCIO DE MATERIAL', email: 'contato17@empresa.com.br', phone: '(11) 97650-1217', company: 'ACTIONGYM COMERCIO DE MATERIAL', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-12' },
  { id: 18, name: 'ACUMULADORES MOURA S.A', email: 'contato18@empresa.com.br', phone: '(21) 97650-1218', company: 'ACUMULADORES MOURA S.A', position: 'Cliente Corporativo', type: 'cliente', lastContact: '2026-03-11' },
];

const typeColors = {
  cliente: 'bg-green-100 text-green-700',
  prospect: 'bg-blue-100 text-blue-700',
  parceiro: 'bg-purple-100 text-purple-700',
};

const typeLabels = {
  cliente: 'Cliente',
  prospect: 'Prospect',
  parceiro: 'Parceiro',
};

export function ContactsView() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl text-gray-900 mb-1">Contatos</h2>
          <p className="text-sm text-gray-500">Gerencie seus contatos de negócios</p>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar contatos..."
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
            Novo Contato
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <span>{contact.name.charAt(0)}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${typeColors[contact.type]}`}>
                  {typeLabels[contact.type]}
                </span>
              </div>

              <h3 className="text-lg text-gray-900 mb-1">{contact.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{contact.position}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 size={14} className="text-gray-400" />
                  <span className="truncate">{contact.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  <span className="truncate">{contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Último contato: {new Date(contact.lastContact).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedContact && (
        <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl text-gray-900">{selectedContact.name}</h3>
              <p className="text-sm text-gray-500">{selectedContact.position}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-gray-500 mb-3">Informações</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Empresa</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedContact.company}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Telefone</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedContact.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tipo</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${typeColors[selectedContact.type]}`}>
                    {typeLabels[selectedContact.type]}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm text-gray-500 mb-3">Histórico de Interações</h4>
              <div className="space-y-3">
                <div className="pb-3 border-b border-gray-100">
                  <p className="text-sm text-gray-900">Reunião de follow-up</p>
                  <p className="text-xs text-gray-500 mt-1">28 de março, 2026</p>
                </div>
                <div className="pb-3 border-b border-gray-100">
                  <p className="text-sm text-gray-900">Proposta comercial enviada</p>
                  <p className="text-xs text-gray-500 mt-1">15 de março, 2026</p>
                </div>
                <div className="pb-3 border-b border-gray-100">
                  <p className="text-sm text-gray-900">Primeira reunião</p>
                  <p className="text-xs text-gray-500 mt-1">8 de março, 2026</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm text-gray-500 mb-3">Notas</h4>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Adicionar nota sobre o contato..."
              />
            </div>

            <div className="pt-6 space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Enviar Email
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Agendar Reunião
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Registrar Atividade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
