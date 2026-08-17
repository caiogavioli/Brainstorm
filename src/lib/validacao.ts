import { z } from "zod";

import { lerMoeda, lerQuantidade } from "@/lib/dinheiro";

const criticidade = z.enum(["BAIXA", "MEDIA", "ALTA"]);
const statusTarefa = z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"]);
const situacao = z.enum(["CONFORME", "NAO_CONFORME", "NAO_APLICAVEL"]);

/** "" -> null, para campos opcionais vindos de <input>. */
const textoOpcional = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable();

const dataOpcional = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: "Data inválida (use o seletor de data).",
  });

export const boletimSchema = z.object({
  condominioId: z.coerce.number().int().positive("Selecione o condomínio."),
  dataReferencia: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de referência inválida."),
  statusGeral: z.enum([
    "EM_CONFORMIDADE",
    "OCORRENCIA_PONTUAL",
    "OCORRENCIA_CRITICA",
  ]),
  observacoes: textoOpcional,
  // Sem faltas: elas saem dos itens do grupo de equipes.
  //
  // Criticidade, plano de ação e prazo vêm de quem preenche, e só para os itens
  // não conformes. O catálogo continua sugerindo a gravidade — mas quem esteve
  // no local decide, porque é quem viu o tamanho do problema.
  itens: z
    .array(
      z.object({
        checklistItemId: z.coerce.number().int().positive(),
        situacao,
        observacao: textoOpcional,
        criticidade: z.enum(["ALTA", "MEDIA", "BAIXA"]).optional(),
        planoAcao: textoOpcional,
        /**
         * Data estimada de conclusão, sempre opcional e NUNCA preenchida pelo
         * sistema. Um prazo que ninguém assumiu vira cobrança sem dono e
         * contamina todo indicador de atraso; melhor um campo vazio, que se lê
         * como "ainda sem prazo", do que uma data inventada que parece
         * compromisso.
         */
        previsaoFinalizacao: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de conclusão inválida.")
          .optional()
          .or(z.literal("").transform(() => undefined)),
      }),
    )
    .min(1, "O boletim precisa de ao menos um item."),
});

export type EntradaBoletim = z.infer<typeof boletimSchema>;

export const ocorrenciaSchema = z.object({
  condominioId: z.coerce.number().int().positive("Selecione o condomínio."),
  checklistItemId: z
    .union([z.coerce.number().int().positive(), z.literal(0), z.null()])
    .transform((v) => (v === 0 ? null : v))
    .nullable(),
  setorLivre: textoOpcional,
  descricao: z.string().trim().min(5, "Descreva o problema (mín. 5 caracteres)."),
  planoAcao: textoOpcional,
  criticidade,
  status: statusTarefa,
  previsaoFinalizacao: dataOpcional,
});

export const atualizacaoOcorrenciaSchema = z.object({
  id: z.coerce.number().int().positive(),
  planoAcao: textoOpcional,
  criticidade,
  status: statusTarefa,
  previsaoFinalizacao: dataOpcional,
  comentario: textoOpcional,
});

export const planoAcaoSchema = z.object({
  condominioId: z.coerce.number().int().positive("Selecione o condomínio."),
  local: z.string().trim().min(2, "Informe o local/setor."),
  descricao: z.string().trim().min(5, "Descreva o projeto ou melhoria."),
  criticidade,
  status: statusTarefa,
  previsaoFinalizacao: dataOpcional,
  responsavel: textoOpcional,
  observacoes: textoOpcional,
});

export const condominioSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do condomínio."),
  endereco: textoOpcional,
  gerenteResponsavel: textoOpcional,
  telefone: textoOpcional,
  email: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine((v) => v === null || z.string().email().safeParse(v).success, {
      message: "E-mail inválido.",
    }),
  ativo: z.boolean().default(true),
});

// ---------------------------------------------------------------------------
// Módulo de Orçamentos — fase 1: cadastros
// ---------------------------------------------------------------------------

/**
 * Campo de dinheiro: recebe o TEXTO que a pessoa digitou e devolve centavos.
 *
 * A conversão mora no servidor de propósito. O formulário mostra uma prévia
 * usando a mesma função, mas quem decide o valor gravado é esta linha — assim
 * um campo adulterado no navegador não vira preço no banco.
 */
const valorEmCentavos = z
  .string()
  .trim()
  .transform((v) => (v === "" ? 0 : lerMoeda(v)))
  .refine((v): v is number => v !== null, {
    message: "Valor inválido. Use o formato 1.234,56.",
  })
  .refine((v) => v >= 0, { message: "O valor não pode ser negativo." });

/** Campo de quantidade: texto -> milésimos (1,5 -> 1500). */
const quantidadeEmMilesimos = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : lerQuantidade(v)))
  .refine((v): v is number => v !== null, { message: "Quantidade inválida." })
  .refine((v) => v > 0, { message: "A quantidade precisa ser maior que zero." });

/** Unidade de medida ("un", "h", "m²"…). Vazio volta a "un". */
const unidade = z
  .string()
  .trim()
  .max(12, "Unidade muito longa (máx. 12 caracteres).")
  .transform((v) => (v === "" ? "un" : v));

export const clienteSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome ou razão social do cliente."),
  contato: textoOpcional,
  /**
   * Obrigatório, ao contrário do e-mail do condomínio. Um cliente sem e-mail
   * não pode receber orçamento — que é a única razão de ele existir aqui. Deixar
   * o campo opcional só adia a descoberta do problema para a hora do envio.
   */
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Informe o e-mail do cliente.")
    .email("E-mail inválido."),
  telefone: textoOpcional,
  documento: textoOpcional,
  endereco: textoOpcional,
  observacoes: textoOpcional,
  ativo: z.boolean().default(true),
});

export const servicoCatalogoSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do serviço."),
  descricao: textoOpcional,
  categoria: z
    .string()
    .trim()
    .max(40, "Categoria muito longa (máx. 40 caracteres).")
    .transform((v) => (v === "" ? "Geral" : v)),
  unidade,
  valorPadrao: valorEmCentavos,
  ordem: z.coerce.number().int().min(0).max(9999).default(0),
  ativo: z.boolean().default(true),
});

export const modeloOrcamentoSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do modelo."),
  descricao: textoOpcional,
  condicoesPagamento: textoOpcional,
  prazoExecucao: textoOpcional,
  observacoes: textoOpcional,
  validadeDias: z.coerce
    .number()
    .int()
    .min(1, "A validade precisa ser de ao menos 1 dia.")
    .max(365, "Validade muito longa (máx. 365 dias)."),
  ativo: z.boolean().default(true),
  itens: z
    .array(
      z.object({
        // 0 = linha avulsa, sem origem no catálogo.
        servicoCatalogoId: z.coerce
          .number()
          .int()
          .min(0)
          .transform((v) => (v === 0 ? null : v))
          .nullable(),
        descricao: z.string().trim().min(2, "Descreva o item do modelo."),
        detalhe: textoOpcional,
        unidade,
        quantidade: quantidadeEmMilesimos,
        valorUnitario: valorEmCentavos,
      }),
    )
    .min(1, "O modelo precisa de ao menos um item.")
    .max(100, "Modelo com itens demais (máx. 100)."),
});

export type EntradaModeloOrcamento = z.infer<typeof modeloOrcamentoSchema>;

/** Uma linha do orçamento — mesmo formato do item de modelo. */
const itemOrcamentoSchema = z.object({
  servicoCatalogoId: z.coerce
    .number()
    .int()
    .min(0)
    .transform((v) => (v === 0 ? null : v))
    .nullable(),
  descricao: z.string().trim().min(2, "Descreva o item do orçamento."),
  detalhe: textoOpcional,
  unidade,
  quantidade: quantidadeEmMilesimos,
  valorUnitario: valorEmCentavos,
});

export const orcamentoSchema = z.object({
  clienteId: z.coerce.number().int().positive("Selecione o cliente."),
  titulo: z.string().trim().min(3, "Dê um título ao orçamento."),
  condicoesPagamento: textoOpcional,
  prazoExecucao: textoOpcional,
  observacoes: textoOpcional,
  /**
   * Desconto sobre o subtotal, em centavos. Aceita zero, mas nunca negativo:
   * desconto negativo é acréscimo disfarçado, e o cliente leria "desconto" num
   * campo que aumentou a conta.
   */
  desconto: valorEmCentavos,
  validadeDias: z.coerce
    .number()
    .int()
    .min(1, "A validade precisa ser de ao menos 1 dia.")
    .max(365, "Validade muito longa (máx. 365 dias)."),
  itens: z
    .array(itemOrcamentoSchema)
    .min(1, "O orçamento precisa de ao menos um item.")
    .max(200, "Orçamento com itens demais (máx. 200)."),
});

export type EntradaOrcamento = z.infer<typeof orcamentoSchema>;

/** Primeira mensagem de erro de um ZodError, para exibir no formulário. */
export function primeiraMensagem(erro: z.ZodError): string {
  return erro.issues[0]?.message ?? "Dados inválidos.";
}
