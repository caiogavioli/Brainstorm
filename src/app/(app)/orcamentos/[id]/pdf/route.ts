import { exigirAdmin } from "@/lib/auth";
import { orcamentoCompleto, paraDadosPdf } from "@/lib/orcamentos/consultas";
import { gerarPdfOrcamento, nomeArquivoPdf } from "@/lib/orcamentos/pdf";

/**
 * Download do PDF pela área interna.
 *
 * `nodejs` e não `edge`: o gerador de PDF depende de APIs de Node (Buffer,
 * streams) que o runtime Edge não oferece.
 */
export const runtime = "nodejs";

/** Nunca cacheia: o rascunho muda a cada edição, e um PDF velho é pior que nenhum. */
export const dynamic = "force-dynamic";

export async function GET(
  _requisicao: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await exigirAdmin();

  const { id } = await params;
  const numeroId = Number(id);
  if (!Number.isInteger(numeroId) || numeroId <= 0) {
    return new Response("Orçamento inválido.", { status: 400 });
  }

  const orcamento = await orcamentoCompleto(numeroId);
  if (!orcamento) return new Response("Orçamento não encontrado.", { status: 404 });

  const pdf = await gerarPdfOrcamento(paraDadosPdf(orcamento));

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      // `inline` abre no visualizador do navegador em vez de baixar direto —
      // conferir antes de enviar é o uso mais comum aqui.
      "Content-Disposition": `inline; filename="${nomeArquivoPdf(orcamento.numero, orcamento.versao)}"`,
      "Cache-Control": "no-store",
    },
  });
}
