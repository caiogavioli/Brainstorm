-- Remove "Zeladoria" do sistema: o item passa a se chamar "Equipe de Administração".
--
-- O nome do item também foi congelado em textos já gravados no momento em que
-- o boletim foi enviado, então trocar só o catálogo deixaria a palavra
-- circulando na tela e nos resumos de WhatsApp de dias anteriores.
--
-- A substituição é da string exata do nome antigo. Observações escritas à mão
-- não são reescritas por acidente, e rodar de novo não faz nada — depois da
-- primeira passada a string não existe mais.

UPDATE "ChecklistItem"
   SET "nome" = 'Equipe de Administração'
 WHERE "codigo" = 'equipe-administracao';

-- Derivado do nome do item na gravação do boletim.
UPDATE "Boletim"
   SET "setoresFaltas" = REPLACE("setoresFaltas", 'Administração e Zeladoria', 'Equipe de Administração')
 WHERE "setoresFaltas" LIKE '%Administração e Zeladoria%';

-- Observação do item no boletim, exibida na página do dia.
UPDATE "BoletimItem"
   SET "observacao" = REPLACE("observacao", 'Administração e Zeladoria', 'Equipe de Administração')
 WHERE "observacao" LIKE '%Administração e Zeladoria%';

-- Descrição padrão das ocorrências abertas sem observação do gerente.
UPDATE "Ocorrencia"
   SET "descricao" = REPLACE("descricao", 'Administração e Zeladoria', 'Equipe de Administração')
 WHERE "descricao" LIKE '%Administração e Zeladoria%';

UPDATE "Ocorrencia"
   SET "setorLivre" = REPLACE("setorLivre", 'Administração e Zeladoria', 'Equipe de Administração')
 WHERE "setorLivre" LIKE '%Administração e Zeladoria%';

-- Histórico das ocorrências.
UPDATE "OcorrenciaLog"
   SET "mensagem" = REPLACE("mensagem", 'Administração e Zeladoria', 'Equipe de Administração')
 WHERE "mensagem" LIKE '%Administração e Zeladoria%';

-- Planos de ação criados a partir de uma ocorrência deste item.
UPDATE "PlanoAcao"
   SET "local" = REPLACE("local", 'Administração e Zeladoria', 'Equipe de Administração')
 WHERE "local" LIKE '%Administração e Zeladoria%';
