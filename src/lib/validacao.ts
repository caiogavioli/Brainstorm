import { z } from "zod";

const criticidade = z.enum(["BAIXA", "MEDIA", "ALTA"]);
const statusTarefa = z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"]);
const situacao = z.enum(["CONFORME", "NAO_CONFORME", "NAO_APLICAVEL"]);

/** "" -> null, para campos opcionais vindos de <input>. */
export const textoOpcional = z
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
        /**
         * Ocorrências deste item — uma ou mais.
         *
         * "Falta na equipe de segurança" pode ser o líder e o vigilante de
         * piso: dois problemas com responsáveis, planos e prazos próprios.
         * Item conforme chega com a lista vazia.
         */
        ocorrencias: z
          .array(
            z.object({
              descricao: textoOpcional,
              criticidade: z.enum(["ALTA", "MEDIA", "BAIXA"]).optional(),
              planoAcao: textoOpcional,
              /**
               * Data estimada de conclusão, sempre opcional e NUNCA preenchida
               * pelo sistema. Um prazo que ninguém assumiu vira cobrança sem
               * dono e contamina todo indicador de atraso; melhor um campo
               * vazio, que se lê como "ainda sem prazo", do que uma data
               * inventada que parece compromisso.
               */
              previsaoFinalizacao: z
                .string()
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de conclusão inválida.")
                .optional()
                .or(z.literal("").transform(() => undefined)),
              /**
               * Id da ocorrência que já estava aberta e voltou hoje. Quando
               * presente, o servidor registra recorrência nela em vez de abrir
               * outra. É a identidade exata do problema — deduzir pelo item
               * deixou de funcionar agora que um item comporta vários.
               */
              origemPendencia: z.coerce.number().int().positive().nullable().optional(),
              /**
               * Problema vindo de dias anteriores. Não muda o que é gravado —
               * muda o que é CONTADO: uma falta de equipe em aberto não pode
               * entrar na estatística de faltas todo dia até ser resolvida.
               */
              continuacao: z.boolean().optional().default(false),
            }),
          )
          .default([]),
      }),
    )
    .min(1, "O boletim precisa de ao menos um item."),
  /**
   * Ocorrências de dias anteriores que o preenchedor deu como resolvidas hoje.
   *
   * Só os ids: o que muda no banco é decidido no servidor, e a posse de cada
   * ocorrência é conferida contra o condomínio do boletim antes de fechar
   * qualquer uma. As que continuam em aberto não vêm aqui — elas chegam como
   * itens não conformes normais e caem na regra de recorrência que já existe.
   */
  pendenciasResolvidas: z
    .array(z.coerce.number().int().positive())
    .optional()
    .default([]),
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
