export type CotacaoApprovalStatus =
  | "aprovado_automaticamente"
  | "aguardando_aprovacao"
  | "aprovado_manualmente"
  | "em_edicao_ajuste_solicitado"
  | "reprovado";

export interface CotacaoApprovalMeta {
  label: string;
  className: string;
  context: string;
}

export function getCotacaoApprovalMeta(
  status: CotacaoApprovalStatus,
): CotacaoApprovalMeta {
  switch (status) {
    case "aprovado_automaticamente":
      return {
        label: "Aprovado automaticamente",
        className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        context: "Cotação aprovada automaticamente por estar dentro da política.",
      };
    case "aguardando_aprovacao":
      return {
        label: "Aguardando aprovação",
        className: "bg-amber-100 text-amber-700 border-amber-200",
        context: "Cotação aguardando o parecer do gestor.",
      };
    case "aprovado_manualmente":
      return {
        label: "Aprovado manualmente",
        className: "bg-sky-100 text-sky-700 border-sky-200",
        context: "Cotação aprovada manualmente após análise do gestor.",
      };
    case "em_edicao_ajuste_solicitado":
      return {
        label: "Ajuste solicitado",
        className: "bg-orange-100 text-orange-700 border-orange-200",
        context: "Cotação retornada para ajuste.",
      };
    case "reprovado":
    default:
      return {
        label: "Reprovado",
        className: "bg-rose-100 text-rose-700 border-rose-200",
        context: "Cotação reprovada na análise.",
      };
  }
}
