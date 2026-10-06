# Modelo — pedido de evidências às administradoras (avaliação trimestral BGRE)

Modelo genérico, sem dados de condomínio. Gerado como **rascunho** no Outlook, um por condomínio, para o usuário revisar e enviar. Os destinatários vêm do mapeamento confirmado pelo usuário da rotina de cobrança SafetyDocs (gerente local em "Para", demais em cópia); não são guardados aqui.

## Variáveis

| Variável | Exemplo |
|---|---|
| `{CONDOMÍNIO}` | nome do condomínio |
| `{TRIMESTRE}` | 3º trimestre de 2026 (julho a setembro) |
| `{MESES}` | julho, agosto e setembro |
| `{PRAZO_BGRE}` | 31/10 (1 mês após o fim do trimestre) |
| `{PRAZO_EVIDENCIA}` | sexta-feira, 16/10 (cerca de 2 semanas antes do prazo da BGRE) |

## Assunto

`Avaliação Trimestral BGRE – {TRIMESTRE curto} | {CONDOMÍNIO} | evidências até {PRAZO_EVIDENCIA curto}`

## Corpo

> Prezados, bom dia.
>
> Estamos preparando a Avaliação Trimestral de Prestação de Serviços do **{TRIMESTRE}** do **{CONDOMÍNIO}**, que precisa ser encaminhada à BGRE até {PRAZO_BGRE}. Para fechá-la com a documentação em dia, solicitamos o envio das evidências abaixo, referentes a **{MESES}**, até **{PRAZO_EVIDENCIA}**:
>
> - **1.1 Cumprimento dos prazos das OS:** relatório de OS previstas e realizadas.
> - **2.3 Relatórios gerenciais financeiros:** pasta financeira fechada (sistema ou link com acesso liberado).
> - **2.5 Segurança do Trabalho:** relatório de indicadores de Segurança do Trabalho. *(omitir onde o condomínio não tem TST)*
> - **2.6 RGM:** RGM de cada mês (arquivo ou link com acesso liberado).
> - **3.2 Plano de contas:** justificativas das variações acima de 5%.
>
> **Combinados:**
>
> - O envio deve ser por **e-mail** (anexo ou link com acesso liberado), respondendo a esta mensagem. Mensagens por WhatsApp servem como aviso, mas não serão consideradas como evidência.
> - Os itens que dependem do Action Log (visitas de zeladoria, CAPEX, reunião mensal com o síndico e inadimplência) seguem sendo conferidos lá. Pedimos que o Action Log esteja atualizado semanalmente.
> - Se algum item não chegar até {PRAZO_EVIDENCIA curto}, a DF fará o levantamento diretamente nas plataformas, para não atrasar a avaliação.
>
> A partir do próximo mês, este pedido passa a ser mensal, enviado no primeiro dia útil, para que a evidência de cada mês chegue enquanto ainda está fresca.
>
> Atenciosamente,

## Decisões que o modelo aplica

- **Itens pedidos** = os que a administradora entrega (D3): 1.1, 2.3, 2.5, 2.6, 3.2. Os itens 3.3 e 3.4 saem do pedido (o usuário preenche pelo seu controle). Os itens de Action Log, SafetyDocs e pesquisa de satisfação não são pedidos.
- **Sem penalidade no texto** (regra do usuário): se não chegar, a DF levanta direto.
- **Canal:** e-mail ou link com acesso; WhatsApp só como aviso.
- **Mensal a partir do mês seguinte**, no 1º dia útil.

## Restrições do Outlook (conector)

O corpo em HTML só aceita parágrafos, listas, negrito e tabelas **sem atributos** (sem `border`, `style`, `class`). Tabela sem borda fica ilegível em e-mail, por isso o modelo usa lista. O rascunho sai **sem a assinatura** do Outlook: o usuário a acrescenta ao revisar.
