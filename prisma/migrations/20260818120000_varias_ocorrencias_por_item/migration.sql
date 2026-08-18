-- Um item não conforme podia gerar no máximo uma ocorrência, porque
-- `boletimItemId` era único. Mas "falta na equipe de segurança" pode ser o
-- líder e o vigilante de piso ao mesmo tempo: dois problemas distintos, com
-- responsáveis, planos e prazos próprios, que a trava obrigava a espremer em
-- um registro só.
--
-- A coluna vira um índice comum: continua servindo para achar rápido as
-- ocorrências de um item, sem limitar a quantidade.
DROP INDEX "Ocorrencia_boletimItemId_key";

CREATE INDEX "Ocorrencia_boletimItemId_idx" ON "Ocorrencia"("boletimItemId");
