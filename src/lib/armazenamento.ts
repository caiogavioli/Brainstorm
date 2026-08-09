import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Armazenamento das fotos das ocorrências.
 *
 * Existem dois destinos possíveis, escolhidos automaticamente:
 *
 * - **Vercel Blob** — usado sempre que `BLOB_READ_WRITE_TOKEN` existe. É o
 *   caminho de produção: o sistema de arquivos da Vercel é efêmero, então uma
 *   foto gravada em disco desapareceria no próximo deploy (ou até antes, se a
 *   requisição cair em outra instância).
 * - **Disco local** (`public/uploads/`) — usado no desenvolvimento, para não
 *   exigir nenhuma conta externa só para rodar o projeto na sua máquina.
 *
 * Em ambos os casos o que fica no banco é só a URL em `caminho`, então o resto
 * da aplicação não sabe (nem precisa saber) onde o arquivo foi parar.
 */

const DIRETORIO_LOCAL = path.join(process.cwd(), "public", "uploads", "ocorrencias");

export const TIPOS_IMAGEM = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
] as const;

export const TAMANHO_MAXIMO = 8 * 1024 * 1024; // 8 MB por foto
export const MAXIMO_POR_ENVIO = 6;

const EXTENSAO_POR_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/heic": ".heic",
};

export type ArquivoSalvo = {
  caminho: string;
  nomeOriginal: string;
  mime: string;
  tamanho: number;
};

/** True quando o Vercel Blob está configurado neste ambiente. */
export function usandoBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function ehImagemValida(arquivo: File): boolean {
  return (
    Boolean(arquivo) &&
    arquivo.size > 0 &&
    arquivo.size <= TAMANHO_MAXIMO &&
    (TIPOS_IMAGEM as readonly string[]).includes(arquivo.type)
  );
}

/**
 * Persiste as imagens enviadas e devolve os registros a gravar no banco.
 * Arquivos inválidos (tipo errado, vazios ou acima do limite) são descartados
 * em silêncio — a validação amigável acontece na interface.
 */
export async function salvarImagens(arquivos: File[]): Promise<ArquivoSalvo[]> {
  const validos = arquivos.filter(ehImagemValida).slice(0, MAXIMO_POR_ENVIO);
  if (validos.length === 0) return [];

  return usandoBlob() ? salvarNoBlob(validos) : salvarNoDisco(validos);
}

async function salvarNoBlob(arquivos: File[]): Promise<ArquivoSalvo[]> {
  // Importado sob demanda para que o desenvolvimento local não precise do pacote
  // resolvido em tempo de execução quando o Blob não está configurado.
  const { put } = await import("@vercel/blob");

  const salvos: ArquivoSalvo[] = [];
  for (const arquivo of arquivos) {
    const extensao = EXTENSAO_POR_MIME[arquivo.type] ?? ".bin";
    // `addRandomSuffix` evita colisão; o nome original nunca compõe o caminho.
    const { url } = await put(
      `ocorrencias/${randomUUID()}${extensao}`,
      arquivo,
      { access: "public", contentType: arquivo.type, addRandomSuffix: false },
    );
    salvos.push({
      caminho: url,
      nomeOriginal: arquivo.name.slice(0, 120),
      mime: arquivo.type,
      tamanho: arquivo.size,
    });
  }
  return salvos;
}

async function salvarNoDisco(arquivos: File[]): Promise<ArquivoSalvo[]> {
  await mkdir(DIRETORIO_LOCAL, { recursive: true });

  const salvos: ArquivoSalvo[] = [];
  for (const arquivo of arquivos) {
    const extensao = EXTENSAO_POR_MIME[arquivo.type] ?? ".bin";
    const nomeArquivo = `${randomUUID()}${extensao}`;
    await writeFile(
      path.join(DIRETORIO_LOCAL, nomeArquivo),
      Buffer.from(await arquivo.arrayBuffer()),
    );
    salvos.push({
      caminho: `/uploads/ocorrencias/${nomeArquivo}`,
      nomeOriginal: arquivo.name.slice(0, 120),
      mime: arquivo.type,
      tamanho: arquivo.size,
    });
  }
  return salvos;
}
