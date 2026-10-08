// Apresentação de defesa técnica — DF Síndicos x Einstein (13/10/2026)
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const path = require("path");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const DIR = __dirname;
const OUT = process.argv[2] || path.join(DIR, "DF_Apresentacao_Einstein_13-10.pptx");

const HEX = { navy: "2F4162", gold: "B8934A", ink: "1F2A37", muted: "5B6470", light: "F3F4F6", line: "CBD5E4", green: "2E7D5C", sand: "FAF8F3" };
const THEME = {
  name: "DF Síndicos",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: HEX.ink, lt1: "FFFFFF", dk2: HEX.navy, lt2: HEX.light,
    accent1: HEX.navy, accent2: HEX.gold, accent3: HEX.muted, accent4: "7E93B8", accent5: HEX.line, accent6: HEX.green,
    hlink: HEX.navy, folHlink: HEX.muted,
  },
};

async function icon(Comp, color, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pres.author = "DF Síndicos Profissionais";
  pres.company = "DF Síndicos Profissionais";
  pres.title = "Defesa técnica — Representante Condominial Einstein";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;

  const FOOT = "DF Síndicos Profissionais  ·  Defesa técnica — Representante Condominial Einstein  ·  Confidencial";

  // ---------- layouts ----------
  pres.defineSlideMaster({
    title: "CAPA",
    background: { color: HEX.navy },
    objects: [{ image: { path: path.join(DIR, "logo_white.png"), x: 0.8, y: 0.7, w: 1.45, h: 0.92 } }],
    slideNumber: undefined,
  });
  pres.defineSlideMaster({
    title: "CONTEUDO",
    background: { color: "FFFFFF" },
    margin: [0.5, 0.6, 0.6, 0.6],
    objects: [
      { image: { path: path.join(DIR, "logo.png"), x: 12.05, y: 0.32, w: 0.72, h: 0.46 } },
      { text: { text: FOOT, options: { x: 0.6, y: 7.02, w: 10.5, h: 0.3, fontSize: 9, color: C.text2, italic: true, margin: 0 } } },
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 11.2, h: 0.75, fontSize: 30, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.2, y: 7.0, w: 0.5, h: 0.3, fontSize: 9, color: C.text2, align: "right" },
  });

  const sec = (t) => pres.addSection({ title: t });
  const content = (s, title) => { const sl = pres.addSlide({ masterName: "CONTEUDO", sectionTitle: s }); sl.addText(title, { placeholder: "title" }); return sl; };
  const kicker = (sl, t, y = 1.12) => sl.addText(t, { x: 0.6, y, w: 11.5, h: 0.4, fontSize: 15, color: C.accent3, margin: 0, isTextBox: true, objectName: "subtitulo" });
  const card = (sl, x, y, w, h, fill = HEX.light, name = "cartao") => sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill }, objectName: name });
  const circleIcon = async (sl, Comp, x, y, d = 0.62, bg = C.accent1, fg = "FFFFFF") => {
    sl.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg }, objectName: "icone-fundo" });
    sl.addImage({ data: await icon(Comp, fg), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52, objectName: "icone" });
  };

  // ================= 1. CAPA =================
  sec("Abertura");
  let s = pres.addSlide({ masterName: "CAPA", sectionTitle: "Abertura" });
  s.addText("DEFESA TÉCNICA DA PROPOSTA", { x: 0.8, y: 2.35, w: 11, h: 0.4, fontSize: 14, bold: true, color: C.accent2, charSpacing: 4, margin: 0, isTextBox: true });
  s.addText("Representante Condominial — Subsíndico Profissional", { x: 0.8, y: 2.8, w: 11.5, h: 1.5, fontSize: 42, bold: true, color: "FFFFFF", margin: 0, isTextBox: true, valign: "top" });
  s.addText("Einstein  ·  Parque Global  ·  Unidade Hospitalar Pinheiros  ·  Espaço Einstein Artur de Azevedo", { x: 0.8, y: 4.35, w: 11.5, h: 0.4, fontSize: 18, color: "CBD5E4", margin: 0, isTextBox: true });
  s.addText([
    { text: "Denise Ferreira", options: { bold: true, color: "FFFFFF" } }, { text: "  CEO   ·   ", options: { color: "CBD5E4" } },
    { text: "Caio Gavioli", options: { bold: true, color: "FFFFFF" } }, { text: "  Diretor de Operações", options: { color: "CBD5E4" } },
  ], { x: 0.8, y: 6.15, w: 9, h: 0.4, fontSize: 15, margin: 0, isTextBox: true });
  s.addText("13 de outubro de 2026", { x: 9.3, y: 6.15, w: 3.2, h: 0.4, fontSize: 15, color: C.accent2, align: "right", margin: 0, isTextBox: true });
  s.addNotes("DENISE abre: agradece o convite da Tami e do time, apresenta a si e ao Caio, e diz o objetivo: mostrar como a DF vai representar o Einstein nas três unidades e responder todas as dúvidas. Tempo: 1 min.");

  // ================= 2. AGENDA =================
  s = content("Abertura", "Agenda");
  const ag = [
    ["01", "O que entendemos do Einstein", "As três unidades e o papel do subsíndico"],
    ["02", "Quem é a DF", "Números, equipe e cases semelhantes"],
    ["03", "Como vamos atuar", "Rateio, presença, SLAs e governança de voto"],
    ["04", "O que o Einstein recebe", "Entregáveis, mobilização, continuidade e controles DF"],
    ["05", "Escopo e premissas", "O que está incluído e onde termina o nosso papel"],
    ["06", "Perguntas", "Saneamento das dúvidas"],
  ];
  ag.forEach((a, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.55 + row * 2.45;
    card(s, x, y, 3.85, 2.15, HEX.light, "agenda-" + a[0]);
    s.addText(a[0], { x: x + 0.3, y: y + 0.25, w: 1.2, h: 0.6, fontSize: 30, bold: true, color: C.accent2, margin: 0, isTextBox: true });
    s.addText(a[1], { x: x + 0.3, y: y + 0.9, w: 3.3, h: 0.5, fontSize: 18, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(a[2], { x: x + 0.3, y: y + 1.4, w: 3.3, h: 0.55, fontSize: 14, color: C.accent3, margin: 0, isTextBox: true, valign: "top" });
  });
  s.addText("Pela DF na reunião: Denise Ferreira · Caio Gavioli · Amanda Tigre · Marco Murino · Cláudia De Santi · André Ferreira da Silva", { x: 0.6, y: 6.55, w: 12, h: 0.35, fontSize: 12, color: C.accent3, italic: true, margin: 0, isTextBox: true });
  s.addNotes("DENISE: ~40 minutos de apresentação e o restante para perguntas. Apresenta rapidamente quem está na sala pela DF e em que cada um pode ajudar nas perguntas (Amanda: jurídico/convenção; Marco: financeiro/rateio; Cláudia: LGPD).");

  // ================= 3. ENTENDIMENTO =================
  sec("O que entendemos");
  s = content("O que entendemos", "Três unidades, três desafios diferentes");
  kicker(s, "Um único modelo não serve às três — por isso a dedicação e o foco mudam por unidade");
  const un = [
    [fa.FaCity, "Parque Global", "Complexo multiuso", ["Setores e subcondomínios com despesas comuns e específicas", "Múltiplos stakeholders e governança descentralizada", "Maior complexidade de governança das três"], "Foco: governança setorial e segregação de despesas"],
    [fa.FaHospital, "Unidade Hospitalar Pinheiros", "Ocupante majoritário", ["Einstein com ~95% de ocupação; mall com ~5%", "Sistemas críticos operados diretamente pelo Einstein", "Entrega da obra out/2026, operação jan/2027"], "Foco: rateio dos sistemas críticos e implantação"],
    [fa.FaBuilding, "Espaço Einstein Artur de Azevedo", "Condômino minoritário", ["~1.400 m² no térreo e 1º pavimento", "Edifício de terceiros, com outros usos", "Necessidades específicas de operação de saúde"], "Foco: pagar só o que é seu e defender a operação"],
  ];
  for (let i = 0; i < 3; i++) {
    const [Ic, t, sub, items, foco] = un[i];
    const x = 0.6 + i * 4.1, y = 1.75;
    card(s, x, y, 3.85, 4.95, HEX.light, "unidade-" + i);
    await circleIcon(s, Ic, x + 0.3, y + 0.3);
    s.addText(t, { x: x + 0.3, y: y + 1.05, w: 3.35, h: 0.75, fontSize: 18, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: "top" });
    s.addText(sub.toUpperCase(), { x: x + 0.3, y: y + 1.8, w: 3.35, h: 0.3, fontSize: 11, bold: true, color: C.accent2, charSpacing: 2, margin: 0, isTextBox: true });
    s.addText(items.map((it, k) => ({ text: it, options: { bullet: true, breakLine: k < items.length - 1 } })), { x: x + 0.3, y: y + 2.2, w: 3.35, h: 1.75, fontSize: 14, color: C.text1, paraSpaceAfter: 6, margin: 0, isTextBox: true, valign: "top" });
    s.addText(foco, { x: x + 0.3, y: y + 4.05, w: 3.35, h: 0.65, fontSize: 13, bold: true, italic: true, color: C.text2, margin: 0, isTextBox: true, valign: "top" });
  }
  s.addNotes("CAIO lidera (visitou o Parque Global em 24/09 e leu o workshop). Mensagem: lemos o material do Einstein e entendemos que são três situações diferentes. Pinheiros: o Einstein assumiu da administradora os sistemas críticos — isso tem efeito direto no rateio. Artur de Azevedo: posição defensiva. Parque Global: governança entre setores. Não citar nomes de administradoras.");

  // ================= 4. GOVERNANÇA x OPERAÇÃO =================
  s = content("O que entendemos", "O subsíndico é governança — a operação é da administradora");
  kicker(s, "Separar quem executa de quem fiscaliza é o que dá ao Einstein uma representação independente");
  const lanes = [
    ["EINSTEIN", "Decide", ["Aprova votos e posicionamentos", "Define alçadas e prioridades", "Recebe análises e recomendações"], HEX.navy, "FFFFFF"],
    ["DF — SUBSÍNDICA", "Representa e fiscaliza", ["Representa o Einstein nas instâncias condominiais", "Analisa orçamento, rateio, contratos e contas", "Fiscaliza e cobra a administradora", "Recomenda — nunca vota sem autorização"], HEX.gold, "FFFFFF"],
    ["ADMINISTRADORA", "Executa", ["Operação diária, equipes e fornecedores", "Contas a pagar e receber, boletos", "Elabora balancetes e prestação de contas"], HEX.light, HEX.ink],
  ];
  for (let i = 0; i < 3; i++) {
    const [t, v, items, fill, fg] = lanes[i];
    const x = 0.6 + i * 3.35, y = 1.8;
    card(s, x, y, 3.05, 4.3, fill, "papel-" + i);
    s.addText(t, { x: x + 0.25, y: y + 0.25, w: 2.6, h: 0.35, fontSize: 12, bold: true, color: fg, charSpacing: 2, margin: 0, isTextBox: true });
    s.addText(v, { x: x + 0.25, y: y + 0.65, w: 2.6, h: 0.5, fontSize: 22, bold: true, color: fg, margin: 0, isTextBox: true });
    s.addText(items.map((it, k) => ({ text: it, options: { bullet: true, breakLine: k < items.length - 1 } })), { x: x + 0.25, y: y + 1.35, w: 2.6, h: 2.8, fontSize: 14, color: fg, paraSpaceAfter: 6, margin: 0, isTextBox: true, valign: "top" });
    if (i < 2) s.addImage({ data: await icon(fa.FaChevronRight, HEX.muted), x: x + 3.08, y: y + 1.95, w: 0.22, h: 0.4, objectName: "seta" });
  }
  card(s, 10.75, 1.8, 2.0, 4.3, HEX.sand, "alerta");
  await circleIcon(s, fa.FaExclamation, 11.44, 2.05, 0.62, HEX.gold);
  s.addText("Se a administradora ocupar também a subsindicância, quem fiscaliza a administradora?", { x: 10.9, y: 2.85, w: 1.7, h: 3.0, fontSize: 15, bold: true, italic: true, color: C.text2, margin: 0, isTextBox: true, valign: "top" });
  s.addText("Subsíndico setorial, nos termos da convenção: não substitui o Síndico Geral e atua sempre dentro das alçadas definidas pelo Einstein.", { x: 0.6, y: 6.3, w: 12.1, h: 0.5, fontSize: 13, color: C.accent3, italic: true, margin: 0, isTextBox: true });
  s.addNotes("DENISE: este é o argumento central da DF. A DF não é administradora predial e não concorre com ela — fiscaliza a administradora em nome do Einstein. Reforçar: subsíndico setorial, não substitui o Síndico Geral, não vota sem autorização. Evitar falar em 'convocar/presidir assembleias' ou 'aprovar despesas' — a decisão é sempre do Einstein.");

  // ================= 5. DF EM NÚMEROS =================
  sec("Quem é a DF");
  s = content("Quem é a DF", "A DF em números");
  kicker(s, "Sindicância profissional de empreendimentos corporativos, multiuso e logísticos em São Paulo e no Rio de Janeiro");
  const st = [["40+", "condomínios sob gestão"], ["2 mi m²", "de área locável sob gestão"], ["R$ 24 mi", "de OPEX mensal sob gestão"], ["R$ 35 mi", "de CAPEX por ano sob gestão"]];
  st.forEach((v, i) => {
    const x = 0.6 + i * 3.08;
    card(s, x, 1.85, 2.85, 3.0, HEX.light, "numero-" + i);
    s.addText(v[0], { x: x + 0.25, y: 2.35, w: 2.4, h: 1.0, fontSize: 40, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(v[1], { x: x + 0.25, y: 3.5, w: 2.4, h: 0.9, fontSize: 15, color: C.accent3, margin: 0, isTextBox: true, valign: "top" });
  });
  const fat = [[fa.FaUserTie, "Síndica profissional desde 2000", "Trajetória da fundadora, com 16 anos à frente da divisão imobiliária de um family office de acionistas do Itaú"], [fa.FaBalanceScale, "Jurídico e engenharia na casa", "Sócias advogadas em Direito Imobiliário e diretor de operações engenheiro eletricista"], [fa.FaHandshake, "Clientes de primeira linha", "Gestoras, fundos e proprietários de ativos AAA, com atestados de capacidade técnica"]];
  for (let i = 0; i < 3; i++) {
    const x = 0.6 + i * 4.1;
    await circleIcon(s, fat[i][0], x, 5.35, 0.55);
    s.addText(fat[i][1], { x: x + 0.7, y: 5.3, w: 3.25, h: 0.45, fontSize: 15, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(fat[i][2], { x: x + 0.7, y: 5.75, w: 3.25, h: 1.2, fontSize: 13, color: C.accent3, margin: 0, isTextBox: true, valign: "top" });
  }
  s.addNotes("DENISE: números de porte. Destacar que a DF está do lado de quem precisa de uma representação técnica e independente: jurídico, engenharia e financeiro dentro de casa.");

  // ================= 6. EQUIPE =================
  s = content("Quem é a DF", "Equipe dedicada ao Einstein");
  kicker(s, "Uma titular, dois substitutos qualificados e retaguarda especializada — o serviço não depende de uma pessoa só");
  const eq = [["denise.png", "Denise Ferreira", "TITULAR · CEO", "Advogada, pós em Direito Imobiliário (PUC-SP), síndica profissional desde 2000. Interlocutora oficial, assembleias e governança de voto."], ["amanda.png", "Amanda Tigre", "SUBSTITUTA · SÓCIA DIRETORA", "Advogada, pós em Direito Imobiliário (PUC-SP). Contratos, pareceres jurídicos e interpretação da convenção."], ["caio.png", "Caio Gavioli", "SUBSTITUTO · DIRETOR DE OPERAÇÕES", "Engenheiro eletricista (Mackenzie), pós em Segurança do Trabalho. Sistemas críticos, manutenção e custos de infraestrutura."]];
  eq.forEach((e, i) => {
    const x = 0.6 + i * 3.1;
    s.addImage({ path: path.join(DIR, e[0]), x: x + 0.52, y: 1.85, w: 1.9, h: 1.9, objectName: "foto-" + i });
    s.addText(e[1], { x, y: 4.0, w: 2.95, h: 0.4, fontSize: 18, bold: true, color: C.text2, align: "center", margin: 0, isTextBox: true });
    s.addText(e[2], { x, y: 4.42, w: 2.95, h: 0.3, fontSize: 10.5, bold: true, color: C.accent2, align: "center", charSpacing: 1, margin: 0, isTextBox: true });
    s.addText(e[3], { x: x + 0.05, y: 4.85, w: 2.85, h: 1.7, fontSize: 13.5, color: C.text1, align: "center", margin: 0, isTextBox: true, valign: "top" });
  });
  card(s, 9.95, 1.75, 2.8, 5.0, HEX.light, "retaguarda");
  s.addText("RETAGUARDA", { x: 10.2, y: 1.95, w: 2.4, h: 0.3, fontSize: 12, bold: true, color: C.accent2, charSpacing: 2, margin: 0, isTextBox: true });
  s.addText([
    { text: "Marco Murino", options: { bold: true, color: C.text2, breakLine: true } }, { text: "Gerente Financeiro — balancetes, orçamento e rateio", options: { breakLine: true } }, { text: " ", options: { breakLine: true, fontSize: 6 } },
    { text: "Cláudia De Santi", options: { bold: true, color: C.text2, breakLine: true } }, { text: "Diretora de LGPD — proteção de dados", options: { breakLine: true } }, { text: " ", options: { breakLine: true, fontSize: 6 } },
    { text: "Prepostos DF", options: { bold: true, color: C.text2, breakLine: true } }, { text: "Administradores, engenheiros e advogados", options: { breakLine: true } }, { text: " ", options: { breakLine: true, fontSize: 6 } },
    { text: "Parceiros de mercado", options: { bold: true, color: C.text2, breakLine: true } }, { text: "Jurídico, engenharia e consultoria, contratados por concorrência e com aprovação do Einstein" },
  ], { x: 10.2, y: 2.4, w: 2.4, h: 4.2, fontSize: 13, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  s.addNotes("DENISE apresenta a equipe; pode pedir que Amanda, Marco e Cláudia se apresentem em 15 segundos cada. Atenção: a proposta enviada grafou 'Marco Murilo' — o nome correto no convite é Marco Murino.");

  // ================= 7. CASES DE RATEIO =================
  s = content("Quem é a DF", "Cases de rateio: o subsídio cruzado que a RFP quer evitar");
  const cs = [
    ["SPHQ I", "São Paulo · 64 mil m² · condomínio geral + 3 subcondomínios · DF síndica desde 2014", "Convenção previa rateio único por fração ideal; subcondomínios pagavam despesas uns dos outros", "Levantamento de áreas, estruturas e equipamentos; criação de um Coeficiente de Rateio de Despesas (CRD) aprovado em assembleia", "Cada subcondomínio paga só o que é seu", "Semelhante ao Parque Global"],
    ["17007 Nações", "São Paulo · Torres Sigma e Alpha + garagem + mall · DF síndica desde 2025", "Rateio fora da convenção: o subcondomínio garagem pagava muito acima das suas despesas reais", "Diagnóstico de engenharia, financeiro e jurídico; revisão do rateio e reorganização da gestão com a administradora", "Garagem paga o real; diferença redistribuída entre as torres; mall não onerado", "Semelhante a Pinheiros"],
  ];
  for (let i = 0; i < 2; i++) {
    const [t, meta, des, fez, res, tag] = cs[i];
    const x = 0.6 + i * 6.15, y = 1.3;
    card(s, x, y, 5.9, 5.45, HEX.light, "case-" + i);
    s.addText(t, { x: x + 0.3, y: y + 0.25, w: 3.4, h: 0.55, fontSize: 24, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 3.75, y: y + 0.3, w: 1.9, h: 0.42, rectRadius: 0.2, fill: { color: HEX.gold }, line: { color: HEX.gold }, objectName: "etiqueta" });
    s.addText(tag, { x: x + 3.75, y: y + 0.3, w: 1.9, h: 0.42, fontSize: 11, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText(meta, { x: x + 0.3, y: y + 0.85, w: 5.3, h: 0.5, fontSize: 12, italic: true, color: C.accent3, margin: 0, isTextBox: true, valign: "top" });
    const rows = [["Desafio", des], ["O que a DF fez", fez], ["Resultado", res]];
    rows.forEach((r, k) => {
      const yy = y + 1.5 + k * 1.3;
      s.addText(r[0].toUpperCase(), { x: x + 0.3, y: yy, w: 5.3, h: 0.3, fontSize: 11, bold: true, color: k === 2 ? C.accent6 : C.accent2, charSpacing: 2, margin: 0, isTextBox: true });
      s.addText(r[1], { x: x + 0.3, y: yy + 0.32, w: 5.3, h: 0.9, fontSize: k === 2 ? 15 : 14, bold: k === 2, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
    });
  }
  s.addNotes("DENISE conta o SPHQ I (correção por deliberação de assembleia, sem precisar reformar a convenção). CAIO conta o 17007 — a garagem é um paralelo direto com Pinheiros, onde o Einstein opera o estacionamento. Não temos o valor em R$ desses ajustes: se perguntarem, responder qualitativamente e oferecer o contato da referência.");

  // ================= 8. CASE O PARQUE =================
  s = content("Quem é a DF", "Hospital dentro de condomínio multiuso: já fazemos isso hoje");
  card(s, 0.6, 1.3, 7.4, 5.45, HEX.light, "case-oparque");
  await circleIcon(s, fa.FaClinicMedical, 0.9, 1.55);
  s.addText("Complexo O Parque", { x: 1.7, y: 1.55, w: 5.2, h: 0.6, fontSize: 24, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: "middle" });
  s.addText("São Paulo (Brooklin) · torre de escritórios + torre do Hospital Sírio-Libanês (~10 mil m², 9 andares) + duas torres residenciais + varejo · DF síndica desde o início de 2026", { x: 0.9, y: 2.3, w: 6.8, h: 0.75, fontSize: 12.5, italic: true, color: C.accent3, margin: 0, isTextBox: true, valign: "top" });
  s.addText([
    { text: "Desafio", options: { bold: true, color: C.accent2, breakLine: true } },
    { text: "Implantação com o complexo ainda em obras e ocupantes entrando; sincronizar escritórios, hospital e moradores sensíveis a obras, ruído e horários.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 6 } },
    { text: "O que muda com o hospital", options: { bold: true, color: C.accent2, breakLine: true } },
    { text: "Perfil do público, fluxo de pacientes e acompanhantes, estacionamento — e elevadores, geradores e água passam a ser operação crítica.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 6 } },
    { text: "O que a DF faz", options: { bold: true, color: C.accent2, breakLine: true } },
    { text: "Coordena a operação do complexo, compatibiliza as regras de cada segmento e estrutura a gestão dos sistemas críticos para a operação hospitalar." },
  ], { x: 0.9, y: 3.15, w: 6.8, h: 3.5, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  s.addText("TAMBÉM NA CARTEIRA", { x: 8.4, y: 1.35, w: 4.3, h: 0.3, fontSize: 12, bold: true, color: C.accent2, charSpacing: 2, margin: 0, isTextBox: true });
  const ap = [["Passeio Paulista", "Uso misto AAA — torre corporativa, lojas e lofts residenciais. DF síndica desde 2025."], ["Arquipeo", "57 mil m² para um único grande ocupante (~4.000 pessoas). Planos de contingência. DF síndica desde 2024."]];
  ap.forEach((a, i) => {
    const y = 1.8 + i * 1.75;
    card(s, 8.4, y, 4.35, 1.55, HEX.sand, "apoio-" + i);
    s.addText(a[0], { x: 8.65, y: y + 0.18, w: 3.9, h: 0.4, fontSize: 16, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(a[1], { x: 8.65, y: y + 0.6, w: 3.9, h: 0.85, fontSize: 12.5, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  });
  card(s, 8.4, 5.35, 4.35, 1.4, HEX.navy, "semelhanca");
  s.addText("Hospital em condomínio multiuso (Parque Global) + implantação junto com a entrada em operação (Pinheiros)", { x: 8.65, y: 5.45, w: 3.9, h: 1.2, fontSize: 14, bold: true, color: "FFFFFF", margin: 0, isTextBox: true, valign: "middle" });
  s.addNotes("CAIO: é o case mais próximo da RFP. A locação do Sírio-Libanês é pública, pode citar. Mensagem: já operamos hoje a convivência de hospital com outros usos e sabemos o que vira crítico. Passeio Paulista e Arquipeo em uma frase cada.");

  // ================= 9. RATEIO =================
  sec("Como vamos atuar");
  s = content("Como vamos atuar", "Metodologia de análise e validação de rateios");
  kicker(s, "Prioridade da RFP: alocação correta de custos e nenhum subsídio cruzado entre setores");
  const fases = [
    [fa.FaSearch, "1  Diagnóstico", "até D+60", ["Convenção, especificação, frações, contratos, orçamento e 12 balancetes", "Entrevistas e visita técnica: áreas, uso e medidores", "Matriz de critério por conta (fração, área, consumo, uso)", "Relatório: situação atual × situação correta"]],
    [fa.FaSyncAlt, "2  Rotina mensal", "todo mês", ["Revisão do balancete contra orçamento e contratos", "Conferência das pastas de prestação de contas por amostragem", "Gatilho: conta com desvio de ±5% → parecer com recomendação", "Resultados no relatório mensal e no dashboard"]],
    [fa.FaCalendarCheck, "3  Orçamento e eventos", "anual / sob demanda", ["Revisão da matriz na Previsão Orçamentária", "Simulação do rateio por setor antes da votação", "Revisão em novo contrato, obra ou mudança de ocupação", "Proposta formal de correção em assembleia; validação das contas antes da AGO"]],
  ];
  for (let i = 0; i < 3; i++) {
    const [Ic, t, when, items] = fases[i];
    const x = 0.6 + i * 4.1, y = 1.75;
    card(s, x, y, 3.85, 3.85, HEX.light, "fase-" + i);
    await circleIcon(s, Ic, x + 0.3, y + 0.3, 0.55);
    s.addText(t, { x: x + 1.0, y: y + 0.3, w: 2.7, h: 0.35, fontSize: 17, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(when, { x: x + 1.0, y: y + 0.63, w: 2.7, h: 0.3, fontSize: 12, color: C.accent2, bold: true, margin: 0, isTextBox: true });
    s.addText(items.map((it, k) => ({ text: it, options: { bullet: true, breakLine: k < items.length - 1 } })), { x: x + 0.3, y: y + 1.1, w: 3.3, h: 2.65, fontSize: 13, color: C.text1, paraSpaceAfter: 5, margin: 0, isTextBox: true, valign: "top" });
  }
  card(s, 0.6, 5.8, 12.15, 0.95, HEX.sand, "exemplo");
  s.addText([{ text: "Exemplo do que procuramos: ", options: { bold: true, color: C.text2 } }, { text: "sistemas operados e pagos por um condômino — geradores, subestação, elevadores, estacionamento — que também atendem outros setores. Sem critério de reembolso, quem opera subsidia os demais." }], { x: 0.85, y: 5.85, w: 11.7, h: 0.85, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, valign: "middle" });
  s.addNotes("CAIO explica as três fases. Exemplo genérico (sem citar a administradora): em Pinheiros o Einstein opera sistemas que atendem também o mall — é exatamente o subsídio cruzado que a RFP quer evitar. Marco pode complementar a parte de balancete se perguntarem.");

  // ================= 10. PRESENÇA =================
  s = content("Como vamos atuar", "Presença e dedicação por unidade");
  kicker(s, "Visitas presenciais de 6 horas, sempre com a titular; visitas técnicas do Diretor de Operações em paralelo");
  s.addChart(pres.charts.BAR, [
    { name: "Titular presencial", labels: ["Parque Global", "Pinheiros (até jun/27)", "Pinheiros (a partir de jul/27)", "Artur de Azevedo"], values: [24, 24, 12, 6] },
    { name: "Titular remoto", labels: ["Parque Global", "Pinheiros (até jun/27)", "Pinheiros (a partir de jul/27)", "Artur de Azevedo"], values: [16, 12, 10, 6] },
    { name: "Visita técnica", labels: ["Parque Global", "Pinheiros (até jun/27)", "Pinheiros (a partir de jul/27)", "Artur de Azevedo"], values: [6, 12, 6, 2] },
  ], {
    x: 0.6, y: 1.65, w: 7.2, h: 5.1, barDir: "bar", barGrouping: "stacked", chartColors: [HEX.navy, "7E93B8", HEX.gold],
    showLegend: true, legendPos: "b", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.muted,
    showValue: true, dataLabelPosition: "ctr", dataLabelColor: "FFFFFF", dataLabelFontSize: 11, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: HEX.ink, catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin",
    valAxisLabelColor: HEX.muted, valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt", valAxisMaxVal: 50,
    valGridLine: { color: "E5E7EB", size: 0.5 }, catGridLine: { style: "none" },
    showTitle: true, title: "Horas dedicadas por mês", titleFontSize: 14, titleColor: HEX.navy, titleFontFace: "+mn-lt",
  });
  const pr = [["Parque Global", "46 h/mês", "Semanal (4 visitas) + visita técnica mensal + todas as assembleias"], ["Pinheiros", "48 → 28 h/mês", "Semanal até jun/2027 (implantação), depois quinzenal; 2 visitas técnicas/mês na implantação"], ["Artur de Azevedo", "~14 h/mês", "Mensal + visita técnica trimestral + todas as assembleias"]];
  pr.forEach((p, i) => {
    const y = 1.7 + i * 1.55;
    card(s, 8.15, y, 4.6, 1.35, HEX.light, "presenca-" + i);
    s.addText(p[0], { x: 8.4, y: y + 0.15, w: 2.4, h: 0.35, fontSize: 15, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(p[1], { x: 10.6, y: y + 0.15, w: 2.0, h: 0.35, fontSize: 15, bold: true, color: C.accent2, align: "right", margin: 0, isTextBox: true });
    s.addText(p[2], { x: 8.4, y: y + 0.55, w: 4.2, h: 0.75, fontSize: 12.5, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  });
  s.addText("Incluídos em todas: assembleias ordinárias e extraordinárias, reunião mensal com o Einstein e plantão 24x7.", { x: 8.15, y: 6.4, w: 4.6, h: 0.45, fontSize: 12, italic: true, color: C.accent3, margin: 0, isTextBox: true });
  s.addNotes("DENISE: a Tami disse que não há mínimo de visitas e pediu a recomendação de cada proponente. Explicar a lógica: dedicação proporcional à complexidade; Pinheiros reforçado durante a implantação e o primeiro semestre de operação.");

  // ================= 11. SLAs =================
  s = content("Como vamos atuar", "SLAs alinhados à referência do Einstein");
  kicker(s, "Compromisso da DF igual ou melhor que a referência enviada pelo Einstein em 30/09");
  const H = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: HEX.navy }, fontSize: 13, valign: "middle" } });
  const ok = { text: "✓", options: { bold: true, color: HEX.green, align: "center", fontSize: 18, valign: "middle" } };
  const r = (n, ref1, ref2, d1, d2, fill) => [
    { text: n, options: { bold: true, color: HEX.navy, fill: { color: fill } } },
    { text: ref1, options: { color: HEX.muted, fill: { color: fill } } }, { text: ref2, options: { color: HEX.muted, fill: { color: fill } } },
    { text: d1, options: { bold: true, color: HEX.ink, fill: { color: fill } } }, { text: d2, options: { bold: true, color: HEX.ink, fill: { color: fill } } },
    { ...ok, options: { ...ok.options, fill: { color: fill } } },
  ];
  s.addTable([
    [H("Criticidade"), H("Einstein — resposta inicial"), H("Einstein — parecer / encaminhamento"), H("DF — resposta inicial"), H("DF — parecer / encaminhamento"), H("")],
    r("Crítica", "até 1 hora", "até 4 horas ou plano de ação imediato", "até 30 min, por telefone, 24x7", "plano de ação em até 4 h; presença em até 6 h", "FFFFFF"),
    r("Urgente", "até 4 horas", "até 1 dia útil", "até 2 horas úteis, por telefone", "até 1 dia útil", "F6F7F9"),
    r("Ordinária", "até 1 dia útil", "até 5 dias úteis", "até 1 dia útil", "até 5 dias úteis", "FFFFFF"),
    r("Complexa", "até 2 dias úteis", "prazo acordado conforme escopo", "até 1 dia útil, com prazo proposto", "até 10 dias úteis, prévia em 5", "F6F7F9"),
  ], { x: 0.6, y: 1.7, w: 12.15, colW: [1.6, 2.1, 2.6, 2.45, 2.75, 0.65], fontSize: 13, fontFace: "Calibri", border: { type: "solid", pt: 0.75, color: "E5E7EB" }, rowH: [0.55, 0.75, 0.6, 0.6, 0.6], valign: "middle", margin: 0.08, objectName: "tabela-sla" });
  const ex = [[fa.FaGavel, "Parecer para assembleia", "até 3 dias úteis após o edital e no mínimo 5 dias úteis antes da assembleia — tempo para as alçadas internas do Einstein"], [fa.FaPhoneAlt, "Plantão 24x7", "Denise → Amanda → Caio → prepostos da DF; horário comercial de segunda a sexta, das 8h às 18h"]];
  for (let i = 0; i < 2; i++) {
    const x = 0.6 + i * 6.15;
    card(s, x, 5.35, 5.9, 1.4, HEX.sand, "sla-extra-" + i);
    await circleIcon(s, ex[i][0], x + 0.25, 5.6, 0.55);
    s.addText(ex[i][1], { x: x + 1.0, y: 5.5, w: 4.7, h: 0.35, fontSize: 15, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(ex[i][2], { x: x + 1.0, y: 5.85, w: 4.7, h: 0.8, fontSize: 12.5, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  }
  s.addNotes("DENISE: aqui equalizamos os SLAs com a referência do e-mail de 30/09. Diferença em relação à proposta enviada: a primeira resposta da demanda ordinária passa de 2 dias úteis para 1 dia útil, e a crítica ganha 'plano de ação em até 4 horas'. Dizer explicitamente que a DF formaliza esse ajuste por escrito após a reunião.");

  // ================= 12. GOVERNANÇA DE VOTO =================
  s = content("Como vamos atuar", "Governança: nenhum voto sem autorização escrita do Einstein");
  kicker(s, "Inclusive em matérias de rotina — a DF analisa e recomenda; o Einstein decide");
  const etapas = [["1", "Classificação", "Pauta classificada em rotina ou estratégica", "1 dia útil após o edital"], ["2", "Análise", "Nota (rotina) ou parecer completo (estratégica) com recomendação", "3 dias úteis após o edital"], ["3", "Alinhamento", "Reunião ou call com os representantes do Einstein", "antes da autorização"], ["4", "Autorização", "Orientação de voto por escrito, conforme alçadas; procuração quando necessária", "antes da assembleia"], ["5", "Assembleia", "A DF vota exatamente conforme autorizado", "na assembleia"], ["6", "Registro", "Deliberações e recomendações registradas e enviadas", "até 5 dias úteis após"]];
  etapas.forEach((e, i) => {
    const x = 0.6 + i * 2.05, y = 1.8;
    card(s, x, y, 1.9, 3.3, i === 3 ? HEX.navy : HEX.light, "etapa-" + e[0]);
    const fg = i === 3 ? "FFFFFF" : HEX.navy;
    s.addText(e[0], { x: x + 0.2, y: y + 0.2, w: 1.0, h: 0.6, fontSize: 30, bold: true, color: i === 3 ? HEX.gold : HEX.gold, margin: 0, isTextBox: true });
    s.addText(e[1], { x: x + 0.2, y: y + 0.85, w: 1.6, h: 0.4, fontSize: 15, bold: true, color: fg, margin: 0, isTextBox: true });
    s.addText(e[2], { x: x + 0.2, y: y + 1.3, w: 1.6, h: 1.3, fontSize: 12, color: i === 3 ? "FFFFFF" : HEX.ink, margin: 0, isTextBox: true, valign: "top" });
    s.addText(e[3], { x: x + 0.2, y: y + 2.65, w: 1.6, h: 0.55, fontSize: 11, italic: true, bold: true, color: i === 3 ? "CBD5E4" : HEX.gold, margin: 0, isTextBox: true, valign: "top" });
  });
  card(s, 0.6, 5.35, 12.15, 1.4, HEX.sand, "imprevistos");
  await circleIcon(s, fa.FaShieldAlt, 0.85, 5.75, 0.6, HEX.gold);
  s.addText([{ text: "Imprevistos em assembleia: ", options: { bold: true, color: C.text2 } }, { text: "tema fora da pauta ou proposta diferente da analisada — a DF não vota em nome do Einstein. Abstém-se, pede ressalva em ata ou adiamento, e comunica o Einstein no mesmo dia. Temas críticos seguem o escalonamento por telefone." }], { x: 1.65, y: 5.45, w: 10.9, h: 1.2, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, valign: "middle" });
  s.addNotes("DENISE (Amanda pode complementar a parte jurídica). Este slide responde ao maior receio da RFP — a regra aparece três vezes no edital. Conecta com o item 5 do e-mail de 30/09: preparação prévia, recomendação técnica, escalonamento, registro e comunicação estruturada.");

  // ================= 13. ENTREGÁVEIS (amostra) =================
  sec("O que o Einstein recebe");
  s = content("O que o Einstein recebe", "O que chega ao Einstein todo mês");
  s.addText("EXEMPLO ILUSTRATIVO — DADOS FICTÍCIOS", { x: 0.6, y: 1.15, w: 6, h: 0.3, fontSize: 11, bold: true, color: C.accent2, charSpacing: 2, margin: 0, isTextBox: true });
  card(s, 0.6, 1.55, 7.6, 5.2, HEX.light, "mock-dashboard");
  const kp = [["Orçado × realizado", "+2,1%", HEX.navy], ["Contas acima de ±5%", "3", HEX.gold], ["Pareceres no mês", "4", HEX.navy], ["Votos autorizados", "100%", HEX.green]];
  kp.forEach((k, i) => {
    const x = 0.8 + i * 1.83;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.75, w: 1.7, h: 1.0, rectRadius: 0.06, fill: { color: "FFFFFF" }, line: { color: "E5E7EB" }, objectName: "kpi-" + i });
    s.addText(k[1], { x: x + 0.12, y: 1.8, w: 1.5, h: 0.5, fontSize: 22, bold: true, color: k[2], margin: 0, isTextBox: true });
    s.addText(k[0], { x: x + 0.12, y: 2.3, w: 1.5, h: 0.4, fontSize: 10.5, color: C.accent3, margin: 0, isTextBox: true });
  });
  s.addChart(pres.charts.BAR, [
    { name: "Orçado", labels: ["Mai", "Jun", "Jul", "Ago", "Set", "Out"], values: [412, 415, 418, 420, 421, 425] },
    { name: "Realizado", labels: ["Mai", "Jun", "Jul", "Ago", "Set", "Out"], values: [405, 431, 416, 437, 419, 434] },
  ], {
    x: 0.8, y: 2.95, w: 7.2, h: 3.65, barDir: "col", barGrouping: "clustered", chartColors: ["CBD5E4", HEX.navy],
    showLegend: true, legendPos: "t", legendFontSize: 11, legendFontFace: "+mn-lt", legendColor: HEX.muted,
    catAxisLabelColor: HEX.muted, catAxisLabelFontSize: 11, catAxisLabelFontFace: "+mn-lt",
    valAxisLabelColor: HEX.muted, valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt", valAxisMinVal: 380, valAxisMaxVal: 450,
    valGridLine: { color: "E5E7EB", size: 0.5 }, catGridLine: { style: "none" },
    showTitle: true, title: "Despesa do setor — orçado × realizado (R$ mil)", titleFontSize: 13, titleColor: HEX.navy, titleFontFace: "+mn-lt",
  });
  const ent = [["Relatório executivo mensal", "análise financeira, rateio e riscos", "D+30"], ["Dashboard orçamentário e de rateio", "em formato de relatório mensal", "D+90"], ["Pareceres técnicos", "contratos, extraordinárias, reajustes", "sob demanda"], ["Matriz de riscos e mitigação", "atualização trimestral", "D+60"], ["Registro de assembleias", "deliberações e recomendações", "5 dias úteis"], ["Plano de ação", "priorizado, acompanhado no relatório", "D+60"]];
  s.addText("OS 6 ENTREGÁVEIS DA RFP — ACEITOS INTEGRALMENTE", { x: 8.5, y: 1.15, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: C.accent2, charSpacing: 1, margin: 0, isTextBox: true });
  ent.forEach((e, i) => {
    const y = 1.55 + i * 0.87;
    s.addText(e[0], { x: 8.5, y, w: 3.15, h: 0.35, fontSize: 13.5, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(e[1], { x: 8.5, y: y + 0.35, w: 3.15, h: 0.35, fontSize: 11.5, color: C.accent3, margin: 0, isTextBox: true });
    s.addText(e[2], { x: 11.65, y, w: 1.1, h: 0.35, fontSize: 12, bold: true, color: C.accent2, align: "right", margin: 0, isTextBox: true });
  });
  s.addNotes("CAIO: mostra o formato do produto que o Einstein vai receber. Deixar claro que os números são fictícios. O dashboard é entregue como relatório mensal (não é um sistema online). Reforçar: os seis entregáveis da RFP foram aceitos formalmente na proposta.");

  // ================= 14. MOBILIZAÇÃO =================
  s = content("O que o Einstein recebe", "Plano de mobilização: 90 dias até a operação plena");
  const mob = [["Semana 1", "Kick-off", "Interlocutores, canais, alçadas e temas que exigem autorização", "Ata + matriz de contatos e escalonamento"], ["Semanas 1–2", "Apresentação e acessos", "Apresentação à administradora, ao síndico geral e aos condôminos; pedido de documentos", "Lista de documentos solicitados × recebidos"], ["Semanas 2–4", "Imersão", "Primeira visita a cada unidade (titular + Diretor de Operações), entrevistas e leitura", "1º relatório executivo (D+30)"], ["Até D+60", "Diagnóstico", "Matriz de critérios, diagnóstico do rateio, matriz de riscos", "Relatório de diagnóstico + plano de ação"], ["D+90", "Operação plena", "Rotina mensal completa", "Dashboard em relatório mensal"]];
  s.addShape(pres.shapes.LINE, { x: 0.9, y: 2.05, w: 11.6, h: 0, line: { color: HEX.line, width: 2 }, objectName: "linha-tempo" });
  mob.forEach((m, i) => {
    const x = 0.6 + i * 2.45;
    s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: 1.85, w: 0.4, h: 0.4, fill: { color: i === 4 ? HEX.gold : HEX.navy }, line: { color: "FFFFFF", width: 2 }, objectName: "marco-" + i });
    s.addText(m[0], { x, y: 1.25, w: 2.3, h: 0.35, fontSize: 13, bold: true, color: C.accent2, margin: 0, isTextBox: true });
    card(s, x, 2.5, 2.3, 3.25, HEX.light, "fase-mob-" + i);
    s.addText(m[1], { x: x + 0.2, y: 2.65, w: 1.95, h: 0.45, fontSize: 16, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(m[2], { x: x + 0.2, y: 3.15, w: 1.95, h: 1.45, fontSize: 12.5, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
    s.addText(m[3], { x: x + 0.2, y: 4.65, w: 1.95, h: 0.95, fontSize: 12, bold: true, italic: true, color: C.text2, margin: 0, isTextBox: true, valign: "top" });
  });
  card(s, 0.6, 6.0, 12.15, 0.8, HEX.sand, "orcamento-2027");
  s.addText([{ text: "Previsão Orçamentária 2027: ", options: { bold: true, color: C.text2 } }, { text: "se ainda não tiver sido aprovada em assembleia no início do contrato, a DF a revisa com prioridade — primeiro resultado concreto para o Einstein." }], { x: 0.85, y: 6.03, w: 11.7, h: 0.75, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, valign: "middle" });
  s.addNotes("CAIO: cronograma. Do Einstein, a DF precisa de: ata de eleição, procurações aplicáveis, contratos, convenção, pastas de prestação de contas e contatos da administradora e do síndico geral. A Previsão Orçamentária 2027 é a vitória rápida.");

  // ================= 15. CONTINUIDADE =================
  s = content("O que o Einstein recebe", "Continuidade, segurança da informação e independência");
  const cont = [[fa.FaUserFriends, "Titular + 2 substitutos", "Substituição imediata em férias, afastamentos e emergências"], [fa.FaPhoneAlt, "Plantão 24x7", "Escalonamento telefônico para situações críticas, inclusive assembleias emergenciais"], [fa.FaCloud, "Histórico centralizado", "Documentos, pareceres e decisões em repositório corporativo (OneDrive / Microsoft 365) com acesso restrito"], [fa.FaLock, "LGPD", "Diretora de LGPD dedicada; documentos do Einstein só pelos canais autorizados; incidentes comunicados de imediato"], [fa.FaShieldAlt, "Seguro de RC", "Apólices de Responsabilidade Civil Profissional e Geral vigentes, sem custo ao Einstein"], [fa.FaBalanceScale, "Independência declarada", "Nenhum vínculo com condomínios, administradoras, proprietários ou gestores das unidades"]];
  for (let i = 0; i < 6; i++) {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.4 + row * 2.75;
    card(s, x, y, 3.85, 2.5, HEX.light, "continuidade-" + i);
    await circleIcon(s, cont[i][0], x + 0.3, y + 0.3, 0.6);
    s.addText(cont[i][1], { x: x + 0.3, y: y + 1.05, w: 3.3, h: 0.4, fontSize: 17, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(cont[i][2], { x: x + 0.3, y: y + 1.45, w: 3.3, h: 0.95, fontSize: 13, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  }
  s.addNotes("DENISE abre; CLÁUDIA pode falar 30 segundos sobre LGPD se a banca demonstrar interesse. Ponto-chave: o serviço não depende de uma pessoa só (exigência do item 10.1 da RFP).");

  // ================= CONTROLES DF (3 slides) =================
  sec("Como a DF controla");

  // --- Boletim Diário ---
  s = content("Como a DF controla", "Boletim Diário de Operações: a rotina de cada prédio, medida");
  kicker(s, "Sistema próprio da DF: o checklist diário vira indicadores, alertas de SLA e relatório executivo");
  // celular ilustrativo
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.9, y: 1.75, w: 2.75, h: 5.0, rectRadius: 0.3, fill: { color: HEX.navy }, line: { color: HEX.navy }, objectName: "celular" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.05, y: 2.0, w: 2.45, h: 4.5, rectRadius: 0.15, fill: { color: "FFFFFF" }, line: { color: "FFFFFF" }, objectName: "tela" });
  s.addText("Boletim de hoje", { x: 1.2, y: 2.12, w: 2.2, h: 0.32, fontSize: 12, bold: true, color: C.text2, margin: 0, isTextBox: true });
  const chk = [["Geradores", true], ["Elevadores", true], ["Reservatórios", true], ["SDAI / incêndio", true], ["Climatização", false], ["Limpeza e segurança", true]];
  for (let k = 0; k < chk.length; k++) {
    const yy = 2.55 + k * 0.5;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.2, y: yy, w: 2.15, h: 0.4, rectRadius: 0.06, fill: { color: HEX.light }, line: { color: HEX.light }, objectName: "item-check" });
    s.addImage({ data: await icon(chk[k][1] ? fa.FaCheckCircle : fa.FaExclamationTriangle, chk[k][1] ? HEX.green : HEX.gold), x: 1.28, y: yy + 0.09, w: 0.22, h: 0.22, objectName: "status" });
    s.addText(chk[k][0], { x: 1.58, y: yy, w: 1.7, h: 0.4, fontSize: 11, color: C.text1, valign: "middle", margin: 0, isTextBox: true });
  }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.2, y: 5.65, w: 2.15, h: 0.45, rectRadius: 0.08, fill: { color: HEX.gold }, line: { color: HEX.gold }, objectName: "botao" });
  s.addText("Enviar boletim", { x: 1.2, y: 5.65, w: 2.15, h: 0.45, fontSize: 11.5, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addText("Ilustração", { x: 0.9, y: 6.78, w: 2.75, h: 0.22, fontSize: 9, italic: true, color: C.accent3, align: "center", margin: 0, isTextBox: true });
  const bol = [[fa.FaMobileAlt, "Checklist no celular", "O gerente predial registra sistemas, ocorrências e pendências em etapas — substitui WhatsApp e planilhas"], [fa.FaChartLine, "Painel e indicadores", "Visão de vários condomínios com KPIs, gráficos e matriz de risco de SLA"], [fa.FaExclamationCircle, "Ocorrências e planos", "Cada ocorrência registrada vira acompanhamento até o encerramento"], [fa.FaFileAlt, "Relatório executivo", "Resumo gerencial gerado a partir dos dados do período; resumo pronto para os grupos de WhatsApp"]];
  for (let k = 0; k < 4; k++) {
    const col = k % 2, row = Math.floor(k / 2);
    const x = 4.15 + col * 4.3, y = 1.75 + row * 2.05;
    card(s, x, y, 4.1, 1.85, HEX.light, "boletim-" + k);
    await circleIcon(s, bol[k][0], x + 0.25, y + 0.25, 0.55);
    s.addText(bol[k][1], { x: x + 0.95, y: y + 0.25, w: 3.0, h: 0.4, fontSize: 15, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(bol[k][2], { x: x + 0.95, y: y + 0.68, w: 3.0, h: 1.1, fontSize: 12.5, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  }
  card(s, 4.15, 5.9, 8.4, 0.85, HEX.navy, "beneficio-boletim");
  s.addText([{ text: "Para o Einstein: ", options: { bold: true, color: HEX.gold } }, { text: "a DF chega às assembleias e às reuniões mensais com dados da operação, não com impressões." }], { x: 4.4, y: 5.95, w: 8.0, h: 0.75, fontSize: 14, color: "FFFFFF", margin: 0, isTextBox: true, valign: "middle" });
  s.addNotes("CAIO: sistema desenvolvido pela DF. Mostrar que a fiscalização da administradora é feita com dados. Não é um sistema que o Einstein precisa usar — é a ferramenta da DF que alimenta os relatórios. Se perguntarem sobre LGPD: dados nos ambientes autorizados, acesso por usuário.");

  // --- Rotinas automáticas ---
  s = content("Como a DF controla", "Rotinas automáticas: nenhum prazo esquecido");
  kicker(s, "Automações próprias que rodam todos os dias e todas as semanas, sem depender da memória de ninguém");
  const rot = [
    [fa.FaInbox, "Triagem diária de demandas", "Todo dia, 7h30", ["Lê a caixa de e-mail e identifica pedidos e prazos do cliente", "Atualiza o quadro de acompanhamento das demandas", "Envia o resumo do dia com tudo o que está em aberto"]],
    [fa.FaFileSignature, "Cobrança de documentação", "Toda segunda-feira", ["Lê os relatórios de documentos a vencer e vencidos", "Separa por condomínio e envia uma cobrança para cada um", "Só envia a destinatários confirmados — na dúvida, não envia"]],
  ];
  for (let k = 0; k < 2; k++) {
    const [Ic, t, quando, passos] = rot[k];
    const x = 0.6 + k * 6.15, y = 1.75;
    card(s, x, y, 5.9, 3.75, HEX.light, "rotina-" + k);
    await circleIcon(s, Ic, x + 0.3, y + 0.3, 0.7);
    s.addText(t, { x: x + 1.2, y: y + 0.3, w: 4.5, h: 0.4, fontSize: 19, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(quando, { x: x + 1.2, y: y + 0.72, w: 4.5, h: 0.3, fontSize: 13, bold: true, color: C.accent2, margin: 0, isTextBox: true });
    for (let j = 0; j < 3; j++) {
      const yy = y + 1.35 + j * 0.7;
      s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: yy, w: 0.42, h: 0.42, fill: { color: "FFFFFF" }, line: { color: HEX.navy, width: 1.5 }, objectName: "passo" });
      s.addText(String(j + 1), { x: x + 0.35, y: yy, w: 0.42, h: 0.42, fontSize: 13, bold: true, color: C.text2, align: "center", valign: "middle", margin: 0, isTextBox: true });
      s.addText(passos[j], { x: x + 0.95, y: yy - 0.05, w: 4.7, h: 0.55, fontSize: 13.5, color: C.text1, valign: "middle", margin: 0, isTextBox: true });
    }
  }
  card(s, 0.6, 5.95, 12.15, 0.8, HEX.navy, "beneficio-rotinas");
  s.addText([{ text: "Para o Einstein: ", options: { bold: true, color: HEX.gold } }, { text: "cada demanda do Einstein entra na triagem no mesmo dia — é o que sustenta os SLAs que propusemos." }], { x: 0.85, y: 6.0, w: 11.7, h: 0.7, fontSize: 14, color: "FFFFFF", margin: 0, isTextBox: true, valign: "middle" });
  s.addNotes("CAIO: duas automações da DF. A triagem diária garante que nenhuma demanda se perca entre e-mails; a cobrança semanal mantém a documentação legal dos prédios em dia. Ligar com o slide de SLA.");

  // --- Relatórios técnicos ---
  s = content("Como a DF controla", "Relatórios técnicos que sustentam decisões");
  kicker(s, "O padrão de análise que o Einstein recebe numa ocorrência crítica ou numa revisão de contrato");
  const rel = [
    [fa.FaSearchPlus, "Relatório de apuração de incidente", "Edifício AAA de uso misto — vazamento no sistema de geradores", ["Análise técnica e jurídica dos relatórios de cinco prestadores", "Cronologia completa do evento, com vistorias da DF no local", "Análise da cobertura das apólices de seguro de cada prestador", "Responsabilidades e plano de ação com responsáveis e prazos"]],
    [fa.FaCalculator, "Auditoria e conciliação financeira", "Complexo multiuso com subsetores — contrato de administração predial", ["Apuração de questionamentos de condôminos sobre pagamentos à administradora", "39 notas fiscais de 20 meses conciliadas com os comprovantes", "Confronto entre proposta, ata de assembleia, contrato e aditivos", "Rateio entre subsetores e erro material de contrato identificados, com conclusão documentada"]],
  ];
  for (let k = 0; k < 2; k++) {
    const [Ic, t, ctx, items] = rel[k];
    const x = 0.6 + k * 6.15, y = 1.75;
    card(s, x, y, 5.9, 4.0, HEX.light, "relatorio-" + k);
    await circleIcon(s, Ic, x + 0.3, y + 0.3, 0.7);
    s.addText(t, { x: x + 1.2, y: y + 0.28, w: 4.5, h: 0.45, fontSize: 19, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(ctx, { x: x + 1.2, y: y + 0.75, w: 4.5, h: 0.5, fontSize: 12.5, italic: true, color: C.accent3, margin: 0, isTextBox: true, valign: "top" });
    s.addText(items.map((it, j) => ({ text: it, options: { bullet: true, breakLine: j < items.length - 1 } })), { x: x + 0.35, y: y + 1.45, w: 5.3, h: 2.4, fontSize: 14, color: C.text1, paraSpaceAfter: 7, margin: 0, isTextBox: true, valign: "top" });
  }
  card(s, 0.6, 5.95, 12.15, 0.8, HEX.navy, "beneficio-relatorios");
  s.addText([{ text: "Sigilo: ", options: { bold: true, color: HEX.gold } }, { text: "apresentamos o método, não o cliente — o mesmo cuidado que teremos com as informações do Einstein." }], { x: 0.85, y: 6.0, w: 11.7, h: 0.7, fontSize: 14, color: "FFFFFF", margin: 0, isTextBox: true, valign: "middle" });
  s.addNotes("DENISE e CAIO: relatórios elaborados pela DF no padrão que o Einstein receberia numa ocorrência crítica (apuração multi-prestador) e numa revisão de contrato (auditoria). Não citar os clientes nem os prédios — o próprio slide diz que é por sigilo. Se pedirem, oferecer mostrar uma versão anonimizada após a contratação.");

  // ================= 16. ESCOPO =================
  sec("Escopo e premissas");
  s = content("Escopo e premissas", "Escopo claro, sem surpresas na fatura");
  const col3 = [["Incluído na mensalidade", HEX.navy, "FFFFFF", ["Titular, substitutos e retaguarda", "Visitas presenciais e técnicas", "Deslocamento, estacionamento e alimentação na Grande SP", "Assembleias ordinárias e extraordinárias", "Plantão 24x7", "Relatórios, dashboard, matriz de riscos e plano de ação", "Pareceres da equipe DF", "Seguro de RC e tributos"]], ["Só com autorização prévia do Einstein", HEX.sand, HEX.ink, ["Laudos, perícias e ensaios de terceiros", "Escritórios externos e processos judiciais", "Auditoria contábil independente", "Custas cartoriais e registros", "Viagens fora da Grande SP", "Orçados à parte; não alteram a mensalidade"]], ["Papel da administradora — não da DF", HEX.light, HEX.ink, ["Equipe residente e operação diária", "Contas a pagar e a receber, boletos e cobrança", "Elaboração de balancetes e prestação de contas", "Compras, estoque e arquivo físico", "A DF analisa, valida e fiscaliza esses processos"]]];
  col3.forEach((c, i) => {
    const x = 0.6 + i * 4.1, y = 1.35;
    card(s, x, y, 3.85, 5.4, c[1], "escopo-" + i);
    s.addText(c[0], { x: x + 0.3, y: y + 0.25, w: 3.3, h: 0.7, fontSize: 17, bold: true, color: c[2], margin: 0, isTextBox: true, valign: "top" });
    s.addText(c[3].map((it, k) => ({ text: it, options: { bullet: true, breakLine: k < c[3].length - 1 } })), { x: x + 0.3, y: y + 1.05, w: 3.3, h: 4.15, fontSize: 13.5, color: c[2], paraSpaceAfter: 6, margin: 0, isTextBox: true, valign: "top" });
  });
  s.addNotes("DENISE: responde o item 6 do e-mail de 30/09 (deslocamentos, especialistas externos, pareceres jurídicos especializados, laudos). Terceira coluna: reforça a separação governança × operação, sem atacar concorrentes. Se perguntarem de preço: a proposta comercial já foi enviada; não discutir valores nesta reunião.");

  // ================= POR QUE A DF (3 slides) =================
  sec("Por que a DF");
  // --- D: modelo independente x acumulado ---
  s = content("Por que a DF", "Por que um subsíndico independente");
  kicker(s, "A diferença entre ter quem fiscalize a operação e deixar a operação se fiscalizar");
  const cmpH = (t, fill, fg) => ({ text: t, options: { bold: true, color: fg, fill: { color: fill }, fontSize: 15, valign: "middle", align: "center" } });
  const cmpRows = [
    ["Quem fiscaliza a administradora", "A DF, em nome do Einstein", "Fica sem fiscalização independente"],
    ["Conflito de interesse", "Nenhum — declarado por escrito", "A mesma empresa executa e avalia o próprio trabalho"],
    ["A quem a análise de rateio e contratos serve", "Exclusivamente ao Einstein", "Também ao contrato da própria administradora"],
    ["Voto e posicionamento", "Só com autorização escrita do Einstein", "Depende de como a função for contratada"],
  ];
  s.addTable([
    [cmpH("", "FFFFFF", HEX.navy), cmpH("Subsíndico independente (DF)", HEX.navy, "FFFFFF"), cmpH("Administradora acumulando a função", "E5E7EB", HEX.ink)],
    ...cmpRows.map((r, i) => {
      const f = i % 2 ? "F6F7F9" : "FFFFFF";
      return [
        { text: r[0], options: { bold: true, color: HEX.navy, fill: { color: f } } },
        { text: r[1], options: { bold: true, color: HEX.ink, fill: { color: "EEF1F6" } } },
        { text: r[2], options: { color: HEX.muted, fill: { color: f } } },
      ];
    }),
  ], { x: 0.6, y: 1.75, w: 12.15, colW: [3.55, 4.3, 4.3], fontSize: 15, fontFace: "Calibri", border: { type: "solid", pt: 0.75, color: "E5E7EB" }, rowH: [0.65, 0.85, 0.85, 0.85, 0.85], valign: "middle", margin: 0.12, objectName: "tabela-comparativo" });
  card(s, 0.6, 6.0, 12.15, 0.78, HEX.sand, "nota-comparativo");
  s.addText("Comparamos modelos de atuação, não empresas. A separação entre governança e operação é a premissa da própria RFP.", { x: 0.85, y: 6.03, w: 11.7, h: 0.72, fontSize: 13.5, italic: true, color: C.text2, margin: 0, isTextBox: true, valign: "middle" });
  s.addNotes("DENISE: comparar MODELOS, nunca empresas — não citar nenhum concorrente nem administradora. Tom de explicação, não de ataque: 'quem executa não deve fiscalizar a si mesmo'. A RFP diz que o subsíndico deve acompanhar a atuação da administradora e avaliar processos e controles.");

  // --- B: três unidades, três respostas ---
  s = content("Por que a DF", "Três unidades, três respostas — com prova");
  kicker(s, "Para cada desafio que identificamos, uma resposta que a DF já entregou em outro empreendimento");
  const tr = [
    [fa.FaCity, "Parque Global", "Governança setorial e segregação de despesas", "Rateio por subcondomínio e setor, com despesas comuns e específicas separadas", "SPHQ I", "Coeficiente de Rateio de Despesas aprovado em assembleia — cada subcondomínio paga só o que é seu"],
    [fa.FaHospital, "Unidade Hospitalar Pinheiros", "Sistemas críticos e implantação", "Critério para os sistemas que o Einstein opera e que atendem outros setores; acompanhamento da implantação", "17007 Nações + O Parque", "Garagem deixou de subsidiar as torres; implantação de hospital em complexo multiuso"],
    [fa.FaBuilding, "Artur de Azevedo", "Condômino minoritário", "Matriz de critérios e conferência mensal para que o Einstein pague só o que lhe cabe", "Metodologia DF", "Gatilho de ±5% e parecer a cada desvio relevante"],
  ];
  for (let i = 0; i < 3; i++) {
    const [Ic, t, des, resp, prova, provaTxt] = tr[i];
    const x = 0.6 + i * 4.1, y = 1.75;
    card(s, x, y, 3.85, 3.3, HEX.light, "resposta-" + i);
    await circleIcon(s, Ic, x + 0.3, y + 0.3, 0.6);
    s.addText(t, { x: x + 1.05, y: y + 0.3, w: 2.65, h: 0.6, fontSize: 17, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: "middle" });
    s.addText(des.toUpperCase(), { x: x + 0.3, y: y + 1.1, w: 3.3, h: 0.5, fontSize: 11, bold: true, color: C.accent3, charSpacing: 1, margin: 0, isTextBox: true, valign: "top" });
    s.addText(resp, { x: x + 0.3, y: y + 1.65, w: 3.3, h: 1.5, fontSize: 14, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
    card(s, x, 5.2, 3.85, 1.55, HEX.navy, "prova-" + i);
    s.addText("PROVA: " + prova.toUpperCase(), { x: x + 0.3, y: 5.32, w: 3.3, h: 0.32, fontSize: 11.5, bold: true, color: C.accent2, charSpacing: 1, margin: 0, isTextBox: true });
    s.addText(provaTxt, { x: x + 0.3, y: 5.66, w: 3.3, h: 1.0, fontSize: 13, color: "FFFFFF", margin: 0, isTextBox: true, valign: "top" });
  }
  s.addNotes("CAIO: fecha o raciocínio aberto no slide 3. Para cada unidade, o desafio, a resposta e um caso real em que a DF já fez isso.");

  // --- C: primeiros 90 dias ---
  s = content("Por que a DF", "O que o Einstein ganha nos primeiros 90 dias");
  kicker(s, "Resultados concretos, com data, desde o primeiro mês de contrato");
  const g = [
    ["Início", "Previsão Orçamentária 2027", "Revisada com prioridade, se ainda não aprovada em assembleia — o primeiro posicionamento técnico do Einstein", HEX.gold],
    ["D+30", "Primeiro relatório executivo", "Situação financeira, rateio e riscos de cada unidade, na mesa do Einstein", HEX.navy],
    ["D+60", "Diagnóstico do rateio", "Situação atual × situação correta, subsídios cruzados identificados, matriz de riscos e plano de ação", HEX.navy],
    ["D+90", "Controle mensal completo", "Dashboard em relatório mensal e rotina de conferência rodando nas três unidades", HEX.navy],
  ];
  s.addShape(pres.shapes.LINE, { x: 1.0, y: 2.25, w: 11.3, h: 0, line: { color: HEX.line, width: 2 }, objectName: "linha-ganhos" });
  g.forEach((m, i) => {
    const x = 0.6 + i * 3.08;
    s.addShape(pres.shapes.OVAL, { x: x + 0.15, y: 1.95, w: 0.6, h: 0.6, fill: { color: m[3] }, line: { color: "FFFFFF", width: 2 }, objectName: "marco-ganho-" + i });
    s.addText(m[0], { x: x + 0.85, y: 1.95, w: i === 0 ? 1.0 : 0.95, h: 0.6, fontSize: 20, bold: true, color: i === 0 ? C.accent2 : C.text2, valign: "middle", align: "center", fill: { color: "FFFFFF" }, margin: 0, isTextBox: true });
    card(s, x, 2.85, 2.85, 3.0, HEX.light, "ganho-" + i);
    s.addText(m[1], { x: x + 0.25, y: 3.05, w: 2.4, h: 0.8, fontSize: 17, bold: true, color: C.text2, margin: 0, isTextBox: true, valign: "top" });
    s.addText(m[2], { x: x + 0.25, y: 3.9, w: 2.4, h: 1.85, fontSize: 13.5, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  });
  card(s, 0.6, 6.05, 12.15, 0.72, HEX.navy, "fecho-ganhos");
  s.addText([{ text: "Em 90 dias, o Einstein sabe exatamente quanto paga, por quê, e o que corrigir", options: { bold: true, color: "FFFFFF" } }, { text: " — nas três unidades.", options: { color: HEX.gold, bold: true } }], { x: 0.85, y: 6.08, w: 11.7, h: 0.66, fontSize: 16, margin: 0, isTextBox: true, valign: "middle" });
  s.addNotes("DENISE fecha a exposição com o resultado: o que o Einstein tem em mãos em 90 dias. Pausa e passa para o slide de encerramento e as perguntas.");

  // ================= 18. ENCERRAMENTO =================
  s = pres.addSlide({ masterName: "CAPA", sectionTitle: "Por que a DF" });
  s.addText("Obrigado", { x: 0.8, y: 2.3, w: 11, h: 1.0, fontSize: 48, bold: true, color: "FFFFFF", margin: 0, isTextBox: true });
  s.addText("Estamos à disposição para as dúvidas do Einstein", { x: 0.8, y: 3.3, w: 11, h: 0.5, fontSize: 20, color: "CBD5E4", margin: 0, isTextBox: true });
  s.addText([
    { text: "PRÓXIMOS PASSOS", options: { bold: true, color: HEX.gold, breakLine: true } },
    { text: "Formalizamos por escrito os ajustes de SLA apresentados", options: { bullet: true, breakLine: true } },
    { text: "Enviamos o relatório executivo da apresentação", options: { bullet: true, breakLine: true } },
    { text: "Kick-off em até 5 dias úteis após a contratação", options: { bullet: true } },
  ], { x: 0.8, y: 4.3, w: 7.2, h: 1.8, fontSize: 15, color: "FFFFFF", paraSpaceAfter: 4, margin: 0, isTextBox: true, valign: "top" });
  s.addText([
    { text: "Denise Ferreira", options: { bold: true, breakLine: true } }, { text: "denise@dfsindicos.com.br · +55 11 97322-5115", options: { breakLine: true } },
    { text: "Caio Gavioli", options: { bold: true, breakLine: true } }, { text: "caio@dfsindicos.com.br · +55 11 98323-1173", options: { breakLine: true } },
    { text: "www.dfsindicos.com.br", options: { color: HEX.gold } },
  ], { x: 8.3, y: 4.3, w: 4.4, h: 1.9, fontSize: 13.5, color: "FFFFFF", margin: 0, isTextBox: true, valign: "top" });
  s.addNotes("DENISE encerra e abre para perguntas. Usar os slides de apoio (anexo) conforme as perguntas.");

  // ================= ANEXOS =================
  sec("Apoio para perguntas");
  s = content("Apoio para perguntas", "Apoio: critérios de criticidade do Einstein");
  const crit = [["Crítica", "Impacto à continuidade da operação, segurança de pessoas, compliance, imagem ou exposição financeira relevante; deliberações que exigem posicionamento imediato", "Telefonema 24x7 · 30 min · plano de ação em 4 h"], ["Urgente", "Prazo definido para análise ou manifestação: assembleias, aprovações extraordinárias, contratos, notificações, demandas regulatórias", "Telefonema · 2 h úteis · 1 dia útil"], ["Ordinária", "Rotina de acompanhamento financeiro, contratual, operacional e de governança", "E-mail / canal oficial · 1 dia útil · 5 dias úteis"], ["Complexa", "Análises aprofundadas, múltiplos stakeholders, estudos financeiros, jurídicos ou de engenharia", "1 dia útil com prazo proposto · até 10 dias úteis (prévia em 5)"]];
  s.addTable([[H("Nível"), H("Critério (e-mail do Einstein, 30/09)"), H("Como a DF atende")], ...crit.map((c, i) => { const f = i % 2 ? "F6F7F9" : "FFFFFF"; return [{ text: c[0], options: { bold: true, color: HEX.navy, fill: { color: f } } }, { text: c[1], options: { color: HEX.ink, fill: { color: f } } }, { text: c[2], options: { bold: true, color: HEX.ink, fill: { color: f } } }]; })], { x: 0.6, y: 1.4, w: 12.15, colW: [1.6, 6.6, 3.95], fontSize: 13, fontFace: "Calibri", border: { type: "solid", pt: 0.75, color: "E5E7EB" }, valign: "middle", margin: 0.1, rowH: [0.5, 1.0, 1.0, 0.8, 1.0], objectName: "tabela-criticidade" });
  s.addNotes("Usar se perguntarem como a DF classifica as demandas.");

  s = content("Apoio para perguntas", "Apoio: insumos que a DF precisa do Einstein no início");
  const ins = [[fa.FaFileSignature, "Ata de eleição e procurações", "Para a DF representar o Einstein formalmente em cada unidade"], [fa.FaBook, "Convenção, especificação e regimento", "Base de todos os critérios de rateio"], [fa.FaFileContract, "Contratos vigentes", "Para validar critérios de rateio e mapear fornecedores (verificação de independência)"], [fa.FaFolderOpen, "Pastas de prestação de contas", "Últimos 12 meses, para o diagnóstico"], [fa.FaAddressBook, "Contatos", "Administradora, síndico geral e representantes designados pelo Einstein"], [fa.FaSitemap, "Alçadas internas", "Quem autoriza cada tipo de voto e posicionamento"]];
  for (let i = 0; i < 6; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 6.15, y = 1.4 + row * 1.8;
    card(s, x, y, 5.9, 1.55, HEX.light, "insumo-" + i);
    await circleIcon(s, ins[i][0], x + 0.3, y + 0.45, 0.6);
    s.addText(ins[i][1], { x: x + 1.15, y: y + 0.25, w: 4.5, h: 0.4, fontSize: 16, bold: true, color: C.text2, margin: 0, isTextBox: true });
    s.addText(ins[i][2], { x: x + 1.15, y: y + 0.68, w: 4.5, h: 0.75, fontSize: 13, color: C.text1, margin: 0, isTextBox: true, valign: "top" });
  }
  s.addNotes("Usar se perguntarem o que a DF precisa para começar.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("ok", OUT);
})().catch((e) => { console.error(e); process.exit(1); });
