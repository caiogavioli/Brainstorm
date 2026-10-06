# Prompt do agente de inventário (um por condomínio)

Valores recebidos na mensagem: `NOME`, `SLUG`, `DICA`. Saída em `/tmp/claude-0/-home-user-Brainstorm/608713b8-196a-5954-b823-e22fe51e6ab9/scratchpad/inventario/<SLUG>.json`.

---

Você está ajudando o Caio Gavioli (Diretor de Operações da DF Síndicos, síndico profissional de condomínios da carteira BGRE/Brookfield). Todo condomínio deve enviar um "Flash Report" toda segunda-feira, cobrindo a semana anterior (segunda a domingo).

**TAREFA: apenas inventariar.** Descubra quais Flash Reports do condomínio **{NOME}** existem no Outlook do Caio de **01/01/2026 até hoje (06/10/2026)**. **Não abra nem leia os anexos (PDF/PPT), e não analise o conteúdo.** Use só os metadados que a busca devolve (assunto, remetente, data de recebimento, se tem anexo). Se o resultado da busca não trouxer o período, deduza-o do assunto; se o assunto não tiver período, infira pela data de recebimento e marque como `inferido`.

## Como buscar
1. Carregue as ferramentas: ToolSearch com query "select:mcp__Microsoft_365__outlook_email_search".
2. Use `outlook_email_search` (limit 25, paginando com `offset` até acabar) com `query` "Flash Report" combinada com o remetente ou o assunto do condomínio, e também por remetente + `afterDateTime` 2026-01-01 (sem `query`). A busca por `query` é ranqueada por relevância e não por data: pagine tudo e filtre por data de recebimento. Tente variações do nome do condomínio e do tipo de assunto ("Flash", "Relatório semanal", sem o termo "Flash Report"), em qualquer remetente do domínio da administradora e na pasta de enviados/respostas. Pode haver remetentes diferentes ao longo do ano (troca de equipe) e assuntos em formatos diferentes.
3. Considere só o e-mail **original** do report (com anexo). Respostas (RES:, RE:, ENC:, FW:) da BGRE sem anexo **não são** reports; ignore-as, exceto para saber que o report existiu. Se o mesmo período aparece em mais de um e-mail (reenvio, versão atualizada), liste todos e marque `reenvio: true` nos posteriores.
4. Não use `read_resource` em anexos. Só abra o corpo de um e-mail se for indispensável para saber o período, e nunca o anexo.

## Saída
Grave um JSON válido (UTF-8) com este esquema e valide com `python3 -c "import json;json.load(open('<arquivo>'))"`:

```
{
  "condominio": "{NOME}", "slug": "{SLUG}",
  "busca": ["consultas e remetentes que você usou"],
  "mais_antigo_no_ano": "AAAA-MM-DD do primeiro report encontrado em 2026",
  "mais_antigo_encontrado": "AAAA-MM-DD do mais antigo que você viu, mesmo anterior a 2026, ou null",
  "reports": [
    {"recebido_em_brasilia": "AAAA-MM-DD HH:MM", "remetente": "nome <endereço>", "assunto": "...",
     "periodo_inicio": "AAAA-MM-DD|null", "periodo_fim": "AAAA-MM-DD|null", "periodo_inferido": true|false,
     "tem_anexo": true|false, "reenvio": true|false}
  ],
  "semanas_cobertas": ["AAAA-MM-DD (segunda-feira de cada semana com report, de 2026-01-05 a 2026-09-28; um consolidado cobre várias)"],
  "semanas_sem_report": ["AAAA-MM-DD (segundas sem nenhum report)"],
  "observacoes": "mudança de remetente, mudança de assunto, consolidados, meses sem nada, limites da busca (limite de requisições, máximo de 1000 resultados) e qualquer dúvida"
}
```

A API devolve horários em UTC; converta para Brasília (UTC-3). A semana do ano 1 de 2026 começa em 29/12/2025; o primeiro report possível em 2026 chega na segunda 05/01/2026 e o último esperado até 05/10/2026 (semana de 28/09). As segundas-feiras de referência vão de 2026-01-05 a 2026-09-28 (40 semanas, contando a semana de 29/12/2025 como a primeira).

## Resposta final (curta, em português)
Caminho do arquivo, número de reports encontrados, data do primeiro e do último de 2026, quantas semanas ficaram cobertas e sem report (liste as sem report em intervalos), e qualquer limite da busca. Não cole o JSON.
