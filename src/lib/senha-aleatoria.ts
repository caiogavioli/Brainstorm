import "server-only";

import { randomInt } from "node:crypto";

// Sem 0/O, 1/l/I: são os pares que mais gente confunde ao digitar uma senha
// escrita à mão ou lida de uma lista impressa. A senha já não é escolhida por
// quem vai usá-la — não faz sentido também torná-la difícil de copiar.
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

/** Senha aleatória para quando a planilha não trouxe uma. `crypto.randomInt`
 *  (não `Math.random`) porque é uma credencial de acesso de verdade. */
export function gerarSenhaAleatoria(tamanho = 12): string {
  let senha = "";
  for (let i = 0; i < tamanho; i++) {
    senha += ALFABETO[randomInt(ALFABETO.length)];
  }
  return senha;
}
