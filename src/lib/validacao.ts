import { z } from "zod";

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
  houveFaltas: z.boolean(),
  setoresFaltas: textoOpcional,
  qtdeFaltas: z.coerce.number().int().min(0).max(200).default(0),
  observacoes: textoOpcional,
  itens: z
    .array(
      z.object({
        checklistItemId: z.coerce.number().int().positive(),
        situacao,
        observacao: textoOpcional,
        criticidade: criticidade.default("MEDIA"),
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

/** Primeira mensagem de erro de um ZodError, para exibir no formulário. */
export function primeiraMensagem(erro: z.ZodError): string {
  return erro.issues[0]?.message ?? "Dados inválidos.";
}
