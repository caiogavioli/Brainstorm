# Módulo de Orçamentos — plano de construção

Sistema para gerar orçamentos padronizados, enviá-los por e-mail e acompanhar o
que acontece depois: se o cliente abriu, se aceitou, se recusou ou se ficou
faltando entregar alguma coisa.

Este documento é a referência de desenho. Ele registra **o que** será feito,
**por que** cada escolha foi tomada e **em que ordem**. Enquanto o módulo é
construído, é aqui que as decisões ficam.

---

## 1. Decisões já tomadas

| Assunto | Decisão |
|---|---|
| Destinatário | Clientes novos e externos — cadastro próprio, independente do módulo de condomínios |
| Formato | Link rastreável (token único) **+** PDF para download |
| Resposta do cliente | O próprio cliente aceita, recusa ou pede ajuste na página do orçamento |
| Envio | Pela caixa do Outlook do usuário |

### Por que link rastreável em vez de pixel de abertura

O jeito clássico de saber se um e-mail foi lido é embutir uma imagem invisível.
Não funciona mais: Outlook, Gmail e Apple Mail bloqueiam ou pré-carregam
imagens, então o número mente para os dois lados — diz "não abriu" quem abriu, e
"abriu" quem nunca viu.

O link com token resolve isso pela origem certa. O cliente clica para ver o
orçamento, e esse clique é um fato registrado no nosso banco, não uma inferência.
Melhor ainda: como a resposta (aceito / recusado / quero ajuste) acontece na
mesma página, o sinal deixa de ser "ele olhou" e passa a ser "ele decidiu" — que
é a informação que realmente interessa.

---

## 2. O que já existe e será reaproveitado

O projeto é um Next.js 15 (App Router) com Prisma e PostgreSQL, publicado na
Vercel. O módulo de orçamentos entra como uma área nova **dentro** desta mesma
aplicação, aproveitando:

- **Autenticação** (`src/lib/auth.ts`) — cookie de sessão assinado com `jose`,
  papéis `ADMIN` e `GESTOR`. Nenhum login novo é necessário.
- **Padrão de código** — Server Components para leitura, Server Actions em
  `src/lib/acoes/` para escrita, validação com Zod em `src/lib/validacao.ts`.
- **Estilo visual** — os tokens de cor em `globals.css` e os componentes de
  navegação, filtros e KPI já existentes.
- **Estilos de impressão** — a classe `.sem-impressao` já configurada.
- **Migrações Prisma** — o fluxo `prisma migrate` já roda no build.

Nada do módulo de boletins/ocorrências é alterado. As tabelas novas convivem com
as antigas sem tocá-las.

---

## 3. Modelo de dados

Oito tabelas novas. Os nomes seguem o português usado no resto do schema.

### 3.1 Cadastro

**`Cliente`** — quem recebe o orçamento.
`nome` (empresa ou pessoa), `contato` (a pessoa que assina), `email`,
`telefone`, `documento` (CNPJ/CPF), `endereco`, `observacoes`, `ativo`.

**`ServicoCatalogo`** — a base da padronização.
`codigo` (slug estável), `nome`, `descricao`, `unidade` (hora, m², visita,
mês…), `valorPadraoCentavos`, `categoria`, `ativo`.

> Mesma ideia do `ChecklistItem` que já existe no sistema: o catálogo é
> **dado**, não código. Você inclui, reajusta e aposenta serviços pela tela, sem
> migração de banco. E como cada item do orçamento guarda de qual serviço veio,
> dá para responder depois "quanto eu já orcei de manutenção elétrica este ano".

**`ModeloOrcamento`** — o orçamento padrão pronto.
Um conjunto de itens do catálogo mais os textos que se repetem (condições de
pagamento, prazo de execução, observações). Escolher um modelo preenche o
orçamento inteiro; daí você ajusta o que for específico daquele cliente.

> É isto que torna o orçamento "padronizado" na prática. Sem modelo, padrão é só
> uma intenção — cada orçamento sai um pouco diferente do anterior.

### 3.2 O orçamento

**`Orcamento`**
- `numero` — sequencial por ano, único e visível ao cliente (`2026-0007`).
- `clienteId`, `titulo`, `status`, `versao`.
- `subtotalCentavos`, `descontoCentavos`, `totalCentavos`.
- `condicoesPagamento`, `prazoExecucao`, `observacoes`, `validoAte`.
- `token` — string aleatória longa e única, o endereço secreto do link público.
- Rastreio: `enviadoEm`, `primeiraVisualizacaoEm`, `ultimaVisualizacaoEm`,
  `totalVisualizacoes`, `respondidoEm`, `respostaMensagem`.
- `criadoPorId`, `criadoEm`, `atualizadoEm`.

> **Valores em centavos, como número inteiro.** Dinheiro em ponto flutuante
> erra: `0,1 + 0,2` não dá `0,3` em nenhuma linguagem que use `float`. Em
> orçamento de dezenas de linhas, o total fecha com centavos de diferença do que
> a soma na calculadora diz — e é exatamente o tipo de erro que o cliente nota.

**`OrcamentoItem`** — as linhas.
`ordem`, `descricao`, `detalhe`, `unidade`, `quantidade`,
`valorUnitarioCentavos`, `totalCentavos`, `servicoCatalogoId` (opcional).

> A descrição e o valor são **copiados** do catálogo no momento da criação, não
> lidos por referência. Reajustar o preço de um serviço amanhã não pode reescrever
> o valor de um orçamento que o cliente já recebeu ontem.

### 3.3 Status

```
RASCUNHO → ENVIADO → VISUALIZADO → ACEITO
                                 → RECUSADO
                                 → AJUSTE_SOLICITADO → (nova versão) → ENVIADO
                                 → EXPIRADO (passou de validoAte sem resposta)
```

`AJUSTE_SOLICITADO` é o estado que responde direto à sua pergunta "preciso
entregar mais alguma coisa?". Ele não é um fim de linha: gera uma nova versão do
orçamento, que volta para o começo do fluxo mantendo o histórico da anterior.

### 3.4 Acompanhamento

**`OrcamentoEnvio`** — um registro por disparo de e-mail.
`paraEmail`, `copiaEmails`, `assunto`, `corpo`, `provedor`, `mensagemId`,
`status` (`FILA` / `ENVIADO` / `ERRO`), `erro`, `enviadoEm`, `criadoPorId`.

> Uma linha por envio, não um campo no orçamento. Reenviar é rotina — o contato
> mudou, o e-mail caiu no spam, o cliente pediu para mandar para o sócio — e cada
> disparo precisa ficar registrado com data, destinatário e resultado.

**`OrcamentoEvento`** — a linha do tempo.
`tipo` (`CRIADO`, `ENVIADO`, `VISUALIZADO`, `PDF_BAIXADO`, `ACEITO`, `RECUSADO`,
`AJUSTE_SOLICITADO`, `LEMBRETE`, `STATUS_ALTERADO`, `ANOTACAO`), `descricao`,
`ip`, `userAgent`, `usuarioId`, `criadoEm`.

> Mesmo princípio do `OcorrenciaLog` que já existe. Os campos de status contam o
> **agora**; a linha do tempo conta **como se chegou até aqui**. Quando o cliente
> disser "eu nunca recebi isso", a resposta está aqui.

**`OrcamentoPendencia`** — o "falta entregar alguma coisa".
`descricao`, `responsavel`, `prazo`, `concluidoEm`, `status`.

> Nasce de um pedido de ajuste ou é lançada por você à mão ("mandar foto do
> equipamento", "cotar a peça importada"). Sem isso, a bola combinada por
> telefone se perde e o orçamento morre de silêncio.

---

## 4. Telas e rotas

### Área interna (exige login)

| Rota | O que faz |
|---|---|
| `/clientes` | Lista e cadastro de clientes |
| `/servicos` | Catálogo de serviços e modelos de orçamento |
| `/orcamentos` | Painel: lista com filtros por status, cliente e período, mais os KPIs |
| `/orcamentos/novo` | Editor: escolhe cliente, aplica um modelo, ajusta as linhas |
| `/orcamentos/[id]` | Detalhe: itens, linha do tempo, envios, pendências, botões de enviar e reenviar |
| `/orcamentos/[id]/imprimir` | Versão para impressão, usando o CSS que já existe |

**KPIs do painel** — as perguntas que o sistema precisa responder de relance:
enviados no período, taxa de abertura, taxa de aceite, valor em aberto, valor
ganho, e a fila de atenção (enviado há X dias sem abrir, aberto sem resposta,
vencendo esta semana, pendência atrasada).

### Área pública (sem login, só com o token)

| Rota | O que faz |
|---|---|
| `/o/[token]` | O orçamento como o cliente vê. Registra a visualização. |
| `/o/[token]/pdf` | Download do PDF |
| `/o/[token]/responder` | Recebe aceite, recusa ou pedido de ajuste |

Cuidados na área pública, porque ela fica aberta na internet:

- **Token longo e aleatório** (32 bytes, base64url). É a única credencial, então
  precisa ser impossível de adivinhar por tentativa.
- **`noindex`** no cabeçalho, para o orçamento nunca aparecer no Google.
- **Nada além do necessário** na tela: dados do cliente, itens, valores e
  condições. Sem margem, sem custo interno, sem outros clientes.
- **Limite de tentativas** na rota de resposta, contra abuso.
- **Orçamento expirado** abre em modo leitura, com aviso da data e sem botões.

---

## 5. Geração do PDF

Proposta: **`@react-pdf/renderer`**.

O layout é escrito em componentes React, roda em Node puro e funciona no
serverless da Vercel sem depender de navegador. A alternativa comum — Puppeteer
com Chromium — significa empacotar um navegador inteiro na função: fica pesado,
lento para iniciar a frio e é um problema recorrente de limite de tamanho na
Vercel.

O PDF é gerado sob demanda a partir dos dados do orçamento, não guardado como
arquivo. Menos coisa para armazenar e nunca sai desatualizado. Se o volume
crescer a ponto de o custo importar, dá para cachear depois.

O PDF sai com: seu logotipo e dados, dados do cliente, número e data, itens com
quantidade e valores, total, condições de pagamento, prazo, validade e o link do
orçamento online.

---

## 6. Envio pelo Outlook

O envio fica atrás de uma interface única (`src/lib/email/`), com adaptadores
trocáveis. Assim trocar de provedor amanhã é mudar uma variável de ambiente, não
reescrever o módulo.

### Ponto que precisa ser confirmado

**Qual é o tipo da sua conta Outlook?** A resposta muda a forma de conectar:

**a) Microsoft 365 corporativo** (e-mail no seu domínio, `@suaempresa.com.br`)

O caminho é a **API Microsoft Graph**: registra-se um aplicativo no Entra ID,
com permissão `Mail.Send` restrita à sua caixa por política de acesso. O envio
aparece nos Itens Enviados do seu Outlook e as respostas do cliente chegam na
sua caixa normalmente.

A Microsoft descontinuou o SMTP com senha comum (Basic Auth) no Exchange Online,
então em conta corporativa o SMTP tradicional tende a simplesmente não
autenticar. Vale confirmar a situação do seu locatário antes de investir nesse
caminho.

**b) Conta pessoal `@outlook.com` / `@hotmail.com`**

Aqui o **SMTP via `nodemailer`** (`smtp.office365.com:587`, STARTTLS) resolve,
usando uma senha de aplicativo gerada na conta Microsoft — o que exige verificação
em duas etapas ativada.

Vale saber que conta pessoal tem limite baixo de envios por dia e reputação de
entrega mais fraca. Para orçamento comercial em nome de empresa, o domínio
próprio passa mais confiança e cai menos em spam.

### O que o Outlook não entrega

Nenhum dos dois caminhos oferece webhook de entrega ou de abertura, como um
serviço de e-mail transacional teria. Consequências práticas:

- **Abertura e resposta**: cobertas pelo link com token. Sem perda.
- **Devolução (bounce)**: chega como e-mail na sua caixa, e o sistema não fica
  sabendo. O painel vai mostrar "enviado" para um endereço que não existe. O
  contorno é conferir o registro de envio quando um orçamento ficar muito tempo
  sem abertura.

Se um dia a entrega precisar ser monitorada de verdade, trocar para um provedor
transacional é mudar o adaptador — o resto do módulo não muda.

---

## 7. Lembretes automáticos

A Vercel executa tarefas agendadas via `vercel.json`. Uma rota diária
(`/api/cron/lembretes`, protegida por segredo) faz a varredura:

- Enviado há 3 dias e nunca aberto → lembrete ao cliente.
- Aberto há 5 dias sem resposta → aviso para **você**, não para o cliente.
- Vence em 2 dias sem resposta → lembrete de validade.
- Passou da validade → marca `EXPIRADO`.
- Pendência vencida → aviso para você.

Todo lembrete vira um `OrcamentoEvento`, e cada orçamento tem teto de lembretes
automáticos. Insistência demais custa o cliente.

---

## 8. Ordem de construção

Cada fase entrega algo usável por si. Dá para parar em qualquer uma e já ter
valor em mãos.

**Fase 1 — Cadastros.** Modelos Prisma, migração, telas de `/clientes` e
`/servicos` (catálogo e modelos de orçamento), entradas no menu.
*Ao final:* você cadastra clientes e monta seu catálogo padrão.

**Fase 2 — Orçamento e PDF.** Editor com aplicação de modelo, cálculo de totais,
numeração automática, detalhe, página de impressão e geração do PDF.
*Ao final:* você gera o orçamento e baixa o PDF — já dá para enviar na mão.

**Fase 3 — Envio.** Camada de e-mail com adaptador do Outlook, modelo de
mensagem, botão de enviar e reenviar, registro em `OrcamentoEnvio`.
*Ao final:* o envio sai de dentro do sistema, com registro.

**Fase 4 — Página do cliente.** Rota pública com token, registro de
visualização, botões de aceitar, recusar e pedir ajuste, notificação para você.
*Ao final:* o controle de interesse fecha o ciclo.

**Fase 5 — Acompanhamento.** Painel com KPIs e filtros, linha do tempo,
pendências, lembretes automáticos, versionamento do orçamento.
*Ao final:* o módulo está completo.

---

## 9. Variáveis de ambiente novas

```bash
# Endereço público do sistema — usado para montar o link do orçamento.
APP_URL="https://seu-sistema.vercel.app"

# --- Envio de e-mail ---
# Adaptador: "graph" (Microsoft 365), "smtp" (Outlook pessoal) ou "log" (testes)
EMAIL_PROVEDOR="graph"
EMAIL_REMETENTE="voce@suaempresa.com.br"
EMAIL_NOME_REMETENTE="Sua Empresa"

# Microsoft Graph (EMAIL_PROVEDOR="graph")
MS_TENANT_ID=""
MS_CLIENT_ID=""
MS_CLIENT_SECRET=""

# SMTP (EMAIL_PROVEDOR="smtp")
SMTP_HOST="smtp.office365.com"
SMTP_PORTA="587"
SMTP_USUARIO=""
SMTP_SENHA=""          # senha de aplicativo, não a senha da conta

# Protege a rota de lembretes automáticos
CRON_SEGREDO=""

# Dados da empresa que saem no cabeçalho do orçamento
EMPRESA_NOME=""
EMPRESA_DOCUMENTO=""
EMPRESA_ENDERECO=""
EMPRESA_TELEFONE=""
```

O adaptador `log` grava o e-mail no banco sem enviar nada. É com ele que as
fases 1 a 3 podem ser construídas e testadas antes de o Outlook estar
configurado — o desenvolvimento não fica parado esperando credencial.

---

## 10. Pontos em aberto

1. **Tipo da conta Outlook** — define Graph ou SMTP (seção 6). É o único item
   que bloqueia a fase 3; as fases 1 e 2 seguem sem ele.
2. **Aceite tem valor de contrato?** Se o aceite pelo link precisar valer como
   assinatura, é preciso guardar IP, data, identificação de quem aceitou e o
   texto exato aceito. O plano já registra IP e data; formalizar isso é uma
   decisão sua.
3. **Anexos no orçamento** — fotos, plantas, ficha técnica. Não está previsto.
   Se for necessário, entra como uma tabela de anexos na fase 2.
4. **Impostos** — o modelo hoje tem subtotal, desconto e total. Se for preciso
   destacar ISS, retenção ou nota, isso muda o cálculo e o layout do PDF.
