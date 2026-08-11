-- "Áreas de Lazer, Salão e Auditório" passa a ser apenas "Auditório".
--
-- Mesmo cuidado da renomeação anterior: o nome do item é copiado para dentro
-- de textos na hora em que o boletim é gravado, então trocar só o catálogo
-- deixaria o nome antigo nos boletins, ocorrências e resumos já existentes.
--
-- Substituição da string exata, idempotente.

UPDATE "ChecklistItem"
   SET "nome" = 'Auditório'
 WHERE "codigo" = 'areas-lazer';

UPDATE "Boletim"
   SET "setoresFaltas" = REPLACE("setoresFaltas", 'Áreas de Lazer, Salão e Auditório', 'Auditório')
 WHERE "setoresFaltas" LIKE '%Áreas de Lazer, Salão e Auditório%';

UPDATE "BoletimItem"
   SET "observacao" = REPLACE("observacao", 'Áreas de Lazer, Salão e Auditório', 'Auditório')
 WHERE "observacao" LIKE '%Áreas de Lazer, Salão e Auditório%';

UPDATE "Ocorrencia"
   SET "descricao" = REPLACE("descricao", 'Áreas de Lazer, Salão e Auditório', 'Auditório')
 WHERE "descricao" LIKE '%Áreas de Lazer, Salão e Auditório%';

UPDATE "Ocorrencia"
   SET "setorLivre" = REPLACE("setorLivre", 'Áreas de Lazer, Salão e Auditório', 'Auditório')
 WHERE "setorLivre" LIKE '%Áreas de Lazer, Salão e Auditório%';

UPDATE "OcorrenciaLog"
   SET "mensagem" = REPLACE("mensagem", 'Áreas de Lazer, Salão e Auditório', 'Auditório')
 WHERE "mensagem" LIKE '%Áreas de Lazer, Salão e Auditório%';

UPDATE "PlanoAcao"
   SET "local" = REPLACE("local", 'Áreas de Lazer, Salão e Auditório', 'Auditório')
 WHERE "local" LIKE '%Áreas de Lazer, Salão e Auditório%';
