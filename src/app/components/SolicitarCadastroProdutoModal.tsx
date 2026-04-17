import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { produtosReais } from "../../imports/produtosReais";

export interface SolicitarCadastroProdutoData {
  codigoProduto: string;
  nomeProduto: string;
  categoria: string;
  especificacao: string;
  unidade: string;
  justificativa: string;
  observacoes: string;
}

interface ProdutoEmpresaCatalogo {
  codigo: string;
  nome: string;
  categoria: string;
  especificacao: string;
  unidade: string;
}

const produtosEmpresaMock: ProdutoEmpresaCatalogo[] = [
  {
    codigo: "EMP-001",
    nome: produtosReais[14],
    categoria: "Ligas de Alumínio",
    especificacao: "Alta resistência mecânica para aplicações estruturais.",
    unidade: "ton",
  },
  {
    codigo: "EMP-002",
    nome: produtosReais[15],
    categoria: "Ligas de Cobre",
    especificacao: "Excelente condutividade para processos elétricos.",
    unidade: "ton",
  },
  {
    codigo: "EMP-003",
    nome: produtosReais[16],
    categoria: "Ligas de Aço Inoxidável",
    especificacao: "Resistência superior à corrosão em ambientes agressivos.",
    unidade: "ton",
  },
  {
    codigo: "EMP-004",
    nome: produtosReais[17],
    categoria: "Ligas de Aço Inoxidável",
    especificacao: "Kit modular para implantação de sistemas.",
    unidade: "un",
  },
];

interface SolicitarCadastroProdutoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SolicitarCadastroProdutoData) => void;
}

const initialFormState: SolicitarCadastroProdutoData = {
  codigoProduto: "",
  nomeProduto: "",
  categoria: "",
  especificacao: "",
  unidade: "",
  justificativa: "",
  observacoes: "",
};

export function SolicitarCadastroProdutoModal({
  open,
  onOpenChange,
  onSubmit,
}: SolicitarCadastroProdutoModalProps) {
  const [form, setForm] = useState<SolicitarCadastroProdutoData>(
    initialFormState,
  );

  useEffect(() => {
    if (open) {
      setForm(initialFormState);
    }
  }, [open]);

  const updateField = <K extends keyof SolicitarCadastroProdutoData>(
    field: K,
    value: SolicitarCadastroProdutoData[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSelectProduto = (codigoProduto: string) => {
    const produtoSelecionado = produtosEmpresaMock.find(
      (produto) => produto.codigo === codigoProduto,
    );

    if (!produtoSelecionado) {
      setForm(initialFormState);
      return;
    }

    setForm((previous) => ({
      ...previous,
      codigoProduto: produtoSelecionado.codigo,
      nomeProduto: produtoSelecionado.nome,
      categoria: produtoSelecionado.categoria,
      especificacao: produtoSelecionado.especificacao,
      unidade: produtoSelecionado.unidade,
    }));
  };

  const canSubmit =
    form.nomeProduto.trim().length > 0 &&
    form.codigoProduto.trim().length > 0 &&
    form.categoria.trim().length > 0 &&
    form.especificacao.trim().length > 0 &&
    form.unidade.trim().length > 0 &&
    form.justificativa.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    onSubmit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Solicitar cadastro de novo produto</DialogTitle>
          <DialogDescription>
            Selecione um produto do catálogo da empresa e registre a justificativa da solicitação.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-700 mb-2">
              Produto da empresa
            </label>
            <Select value={form.codigoProduto} onValueChange={handleSelectProduto}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Selecione um produto do catálogo" />
              </SelectTrigger>
              <SelectContent>
                {produtosEmpresaMock.map((produto) => (
                  <SelectItem key={produto.codigo} value={produto.codigo}>
                    {produto.codigo} - {produto.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-2">Categoria</label>
            <input
              type="text"
              value={form.categoria}
              readOnly
              placeholder="Preenchido a partir do catálogo"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-700 mb-2">Especificação / descrição</label>
            <textarea
              rows={3}
              value={form.especificacao}
              readOnly
              placeholder="Preenchido a partir do catálogo"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-2">Unidade</label>
            <input
              type="text"
              value={form.unidade}
              readOnly
              placeholder="Preenchido a partir do catálogo"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-2">Justificativa da solicitação</label>
            <textarea
              rows={3}
              value={form.justificativa}
              onChange={(event) => updateField("justificativa", event.target.value)}
              placeholder="Explique por que este produto deve entrar na carteira"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-700 mb-2">Observações</label>
            <textarea
              rows={3}
              value={form.observacoes}
              onChange={(event) => updateField("observacoes", event.target.value)}
              placeholder="Informações complementares da solicitação"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-slate-300 text-sm rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enviar solicitação
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}