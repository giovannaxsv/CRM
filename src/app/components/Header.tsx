import { Search } from 'lucide-react';

export function Header() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <img
          src="https://i.imgur.com/DdNjr9C.png"
          alt="Logo Cometa"
          className="w-30 h-30 object-contain"
        />
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-slate-700"></span>
          <div className="w-px h-6 bg-gray-300"></div>
          <span className="font-bold text-xl text-slate-700">CRM</span>
        </div>
      </div>
      <div className="flex-1 max-w-xl ml-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
      </div>
    </div>
  );
}
