"""Monta os .docx da proposta Einstein a partir do modelo DF (Relatório de Apuração — Passeio Paulista)."""
import copy, re, sys
from xml.sax.saxutils import escape
from docx import Document
from docx.oxml import parse_xml

TEMPLATE = '/root/.claude/uploads/41046cc5-cbd7-5c8f-b648-86ae48c3370d/21b6f0c2-Relatorio_Apuracao_Passeio_Paulista_Vazamento_Diesel.docx'
ENT = '/home/user/Brainstorm/entregas'
NS = ('xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"')

NAVY, GOLD, INK, MUTED, LINE = '2F4162', 'D2AE6D', '1F2A37', '5B6470', 'C9CDD3'
FONT = '<w:rFonts w:ascii="Calibri" w:cs="Calibri" w:eastAsia="Calibri" w:hAnsi="Calibri"/>'


def run(text, sz=21, color=INK, b=False, i=False):
    rpr = FONT + ('<w:b/><w:bCs/>' if b else '') + ('<w:i/><w:iCs/>' if i else '') + \
        f'<w:color w:val="{color}"/><w:sz w:val="{sz}"/><w:szCs w:val="{sz}"/>'
    return f'<w:r><w:rPr>{rpr}</w:rPr><w:t xml:space="preserve">{escape(text)}</w:t></w:r>'


def runs(text, sz=21, color=INK, b=False, i=False):
    out = ''
    for part in re.split(r'(\*\*[^*]+\*\*)', text):
        if not part:
            continue
        if part.startswith('**') and part.endswith('**'):
            out += run(part[2:-2], sz, color, True, i)
        else:
            out += run(part, sz, color, b, i)
    return out


def para(content, ppr=''):
    return f'<w:p><w:pPr>{ppr}</w:pPr>{content}</w:p>'


def body_p(text, sz=21, color=INK, jc='both', after=150, i=False):
    return para(runs(text, sz, color, i=i), f'<w:spacing w:after="{after}" w:line="300"/><w:jc w:val="{jc}"/>')


def h1(text):
    return para(run(text, 26, NAVY, True),
                f'<w:pStyle w:val="Heading1"/><w:keepNext/><w:pBdr><w:bottom w:val="single" w:color="{NAVY}" w:sz="8" w:space="4"/></w:pBdr>'
                '<w:spacing w:after="180" w:before="380"/>')


def h2(text):
    return para(runs(text.replace('**', ''), 23, NAVY, True), '<w:keepNext/><w:spacing w:before="220" w:after="100"/>')


def bullet(text):
    return para(runs(text, 20),
                '<w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>'
                '<w:spacing w:after="110" w:line="290"/><w:ind w:left="360"/><w:jc w:val="both"/>')


def cell(content, w, fill, mar='90', valign=True, extra=''):
    return (f'<w:tc><w:tcPr><w:tcW w:type="dxa" w:w="{w}"/>{extra}<w:shd w:fill="{fill}" w:val="clear"/>'
            f'<w:tcMar><w:top w:type="dxa" w:w="{mar}"/><w:left w:type="dxa" w:w="140"/><w:bottom w:type="dxa" w:w="{mar}"/><w:right w:type="dxa" w:w="140"/></w:tcMar>'
            + ('<w:vAlign w:val="center"/>' if valign else '') + f'</w:tcPr>{content}</w:tc>')


def tbl(rows_xml, widths, inside='single" w:color="C9CDD3" w:sz="4'):
    grid = ''.join(f'<w:gridCol w:w="{w}"/>' for w in widths)
    return (f'<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="{sum(widths)}"/><w:tblBorders>'
            f'<w:top w:val="single" w:color="{LINE}" w:sz="4"/><w:left w:val="single" w:color="{LINE}" w:sz="4"/>'
            f'<w:bottom w:val="single" w:color="{LINE}" w:sz="4"/><w:right w:val="single" w:color="{LINE}" w:sz="4"/>'
            f'<w:insideH w:val="{inside}"/><w:insideV w:val="{inside}"/></w:tblBorders></w:tblPr>'
            f'<w:tblGrid>{grid}</w:tblGrid>{rows_xml}</w:tbl>')


def info_table(pairs):
    rows = ''
    for k, (a, b) in enumerate(pairs):
        fill = 'F5F5F5' if k % 2 == 0 else 'FFFFFF'
        rows += ('<w:tr><w:trPr><w:cantSplit/></w:trPr>' + cell(para(runs(a, 19, MUTED, True)), 3100, fill)
                 + cell(para(runs(b, 19, INK)), 6250, fill) + '</w:tr>')
    return tbl(rows, [3100, 6250])


def data_table(lines):
    hdr = [c.strip() for c in lines[0].strip().strip('|').split('|')]
    body = [[c.strip() for c in l.strip().strip('|').split('|')] for l in lines[2:]]
    n = len(hdr)
    import statistics
    lens = []
    for c in range(n):
        vals = [len(hdr[c])] + [len(r[c]) if c < len(r) else 0 for r in body]
        lens.append(max(6, min(60, statistics.mean(vals) * 0.6 + max(vals) * 0.4)))
    tot = sum(lens)
    def longest_word(c):
        txt = ' '.join([hdr[c]] + [r[c] for r in body if c < len(r)]).replace('**', '')
        return max((len(w) for w in txt.split()), default=4)
    mins = [longest_word(c) * 105 + 320 for c in range(n)]
    widths = [int(9350 * l / tot) for l in lens]
    for _ in range(5):
        short = [c for c in range(n) if widths[c] < mins[c]]
        if not short: break
        deficit = sum(mins[c] - widths[c] for c in short)
        for c in short: widths[c] = mins[c]
        big = [c for c in range(n) if c not in short]
        pool = sum(widths[c] for c in big)
        for c in big: widths[c] -= int(deficit * widths[c] / pool)
    widths[-1] += 9350 - sum(widths)
    rows = '<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>' + ''.join(
        cell(para(run(h.replace('**', ''), 17, 'FFFFFF', True), '<w:spacing w:after="0"/>'), widths[i], NAVY)
        for i, h in enumerate(hdr)) + '</w:tr>'
    for k, r in enumerate(body):
        fill = 'FFFFFF' if k % 2 == 0 else 'F5F5F5'
        rows += '<w:tr><w:trPr><w:cantSplit/></w:trPr>' + ''.join(
            cell(para(runs(v, 18, INK), '<w:spacing w:after="0" w:line="260"/>'), widths[i], fill)
            for i, v in enumerate(r[:n])) + '</w:tr>'
    return tbl(rows, widths) + para('', '<w:spacing w:after="120"/>')


def md_to_xml(md):
    out, lines, i = [], md.split('\n'), 0
    while i < len(lines):
        s = lines[i].strip()
        if s.startswith('|'):
            block = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                block.append(lines[i]); i += 1
            out.append(data_table(block)); continue
        if not s or s == '---':
            pass
        elif s.startswith('## '):
            out.append(h1(s[3:]))
        elif s.startswith('### '):
            out.append(h2(s[4:]))
        elif re.fullmatch(r'\*\*[^*]+\*\*', s):
            out.append(h2(s))
        elif s.startswith('- '):
            out.append(bullet(s[2:]))
        elif re.match(r'^[a-e]\) ', s):
            out.append(para(runs(s, 21), '<w:spacing w:after="80" w:line="300"/><w:ind w:left="720"/><w:jc w:val="both"/>'))
        elif re.match(r'^\d+\. ', s):
            out.append(para(runs(s, 21), '<w:spacing w:after="110" w:line="300"/><w:ind w:left="360"/><w:jc w:val="both"/>'))
        else:
            out.append(body_p(s))
        i += 1
    return out


def page_break():
    return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'


def signature(name, role):
    return [para('', '<w:keepNext/><w:spacing w:before="480" w:after="0"/>'),
            para(run('_' * 42, 21, MUTED), '<w:keepNext/><w:spacing w:after="40"/>'),
            para(run(name, 21, NAVY, True), '<w:keepNext/><w:spacing w:after="0"/>'),
            para(run(role, 19, MUTED), '<w:spacing w:after="0"/>')]


def build(out_path, footer_label, cover_xml, body_xml_list):
    doc = Document(TEMPLATE)
    body = doc.element.body
    logo_p = copy.deepcopy(body[0])          # parágrafo do logo
    sect = body[-1]
    for el in list(body)[:-1]:
        body.remove(el)
    # remove imagens não usadas (fotos do relatório original)
    part = doc.part
    for rid, rel in list(part.rels.items()):
        if rel.reltype.endswith('/image') and rid != 'rId8':
            del part.rels[rid]
    # rodapé
    ftr = doc.sections[0].footer._element
    for t in ftr.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
        if 'Relatório de Apuração' in (t.text or ''):
            t.text = f'  ·  {footer_label}  —  Confidencial  ·  www.dfsindicos.com.br'
    body.insert(len(body) - 1, logo_p)
    for x in cover_xml + body_xml_list:
        el = parse_xml(f'<w:body {NS}>{x}</w:body>')
        for child in list(el):
            body.insert(len(body) - 1, child)
    doc.save(out_path)


def cover(title1, title2, tagline, pairs, page_after=True):
    x = [para('', f'<w:pBdr><w:bottom w:val="single" w:color="{GOLD}" w:sz="10" w:space="6"/></w:pBdr><w:spacing w:after="260"/>'),
         para(run(title1, 32, NAVY, True), '<w:spacing w:after="40"/><w:jc w:val="center"/>')]
    if title2:
        x.append(para(run(title2, 28, NAVY, True), '<w:spacing w:after="8"/><w:jc w:val="center"/>'))
    x.append(para(run(tagline, 20, MUTED, i=True),
                  f'<w:pBdr><w:bottom w:val="single" w:color="{LINE}" w:sz="6" w:space="8"/></w:pBdr><w:spacing w:after="260" w:before="100"/><w:jc w:val="center"/>'))
    x.append(info_table(pairs))
    if page_after:
        x.append(page_break())
    else:
        x.append(para('', '<w:spacing w:after="200"/>'))
    return x


UNI = {
    'parque-global': ('Parque Global', 'Marginal Pinheiros, 14.500 – Jardim Fonte do Morumbi, São Paulo/SP'),
    'pinheiros': ('Unidade Hospitalar Pinheiros', 'Rua João Moura, 740 – Pinheiros, São Paulo/SP'),
    'artur-de-azevedo': ('Espaço Einstein Bem-Estar & Saúde Mental (Artur de Azevedo)', 'Rua Artur de Azevedo, 411 – Pinheiros, São Paulo/SP'),
}
CLIENTE = 'Sociedade Beneficente Israelita Brasileira Albert Einstein'
PROC = 'RFP 2026 – Representante Condominial – Unidades Artur de Azevedo, Pinheiros e Parque Global'
PROP = 'DF Síndicos Profissionais Ltda. — CNPJ 20.330.326/0001-94'


def strip_head(md):
    # descarta o bloco de título do .md (até o primeiro ---); a capa substitui
    return md.split('\n---\n', 1)[1]


def main():
    for slug, (nome, end) in UNI.items():
        short = 'Pinheiros' if slug == 'pinheiros' else ('Parque Global' if slug == 'parque-global' else 'Artur de Azevedo')
        # técnica
        md = strip_head(open(f'{ENT}/proposta-tecnica-{slug}.md').read())
        md = md.split('\n**DF Síndicos Profissionais Ltda.**')[0]   # rodapé do md vira assinatura
        anexos = 'Anexos: Declaração de independência e inexistência de conflito de interesses · Atestados de capacidade técnica emitidos por clientes da DF · Certificados das apólices de Responsabilidade Civil.'
        cv = cover('PROPOSTA TÉCNICA', 'REPRESENTANTE CONDOMINIAL — SUBSÍNDICO PROFISSIONAL',
                   f'Einstein  ·  {short}  ·  DF Síndicos Profissionais — Gestão Condominial',
                   [('Cliente', CLIENTE), ('Processo', PROC), ('Unidade', nome), ('Endereço', end),
                    ('Proponente', PROP), ('Profissional titular', 'Denise Ferreira — CEO'),
                    ('Substitutos', 'Amanda Tigre — Sócia Diretora · Caio Gavioli — Diretor de Operações'),
                    ('Data', '01/10/2026'), ('Versão', 'Revisada, conforme solicitação do Einstein de 29/09/2026')])
        bx = md_to_xml(md) + [para(runs(anexos, 19, MUTED, i=True), '<w:keepNext/><w:spacing w:after="150" w:line="300"/><w:jc w:val="both"/>')] + signature('Denise Ferreira', 'Sócia-diretora — DF Síndicos Profissionais Ltda.')
        build(f'{ENT}/DF_Proposta_Tecnica_Einstein_{short.replace(" ", "_")}.docx', f'Proposta Técnica — Einstein {short}', cv, bx)
        # comercial
        md = strip_head(open(f'{ENT}/proposta-comercial-{slug}.md').read())
        md = md.split('\n**DF Síndicos Profissionais Ltda.**')[0]
        cv = cover('PROPOSTA COMERCIAL', 'REPRESENTANTE CONDOMINIAL — SUBSÍNDICO PROFISSIONAL',
                   f'Einstein  ·  {short}  ·  DF Síndicos Profissionais — Gestão Condominial',
                   [('Cliente', CLIENTE), ('Processo', PROC), ('Unidade', nome), ('Endereço', end),
                    ('Proponente', PROP), ('Data', '01/10/2026')], page_after=False)
        bx = [h1('Condições comerciais')] + md_to_xml(md) + signature('Denise Ferreira', 'Sócia-diretora — DF Síndicos Profissionais Ltda.')
        build(f'{ENT}/DF_Proposta_Comercial_Einstein_{short.replace(" ", "_")}.docx', f'Proposta Comercial — Einstein {short}', cv, bx)
    # declaração
    md = open(f'{ENT}/declaracao-independencia.md').read()
    lines = [l for l in md.split('\n')]
    body_lines = []
    for l in lines:
        s = l.strip()
        if s.startswith('**DECLARAÇÃO') or s.startswith('_____') or s.startswith('Denise de Fátima') or s.startswith('Sócia-diretora'):
            continue
        body_lines.append(l)
    cv = [para('', f'<w:pBdr><w:bottom w:val="single" w:color="{GOLD}" w:sz="10" w:space="6"/></w:pBdr><w:spacing w:after="360"/>'),
          para(run('DECLARAÇÃO DE INDEPENDÊNCIA E', 28, NAVY, True), '<w:spacing w:after="0"/><w:jc w:val="center"/>'),
          para(run('INEXISTÊNCIA DE CONFLITO DE INTERESSES', 28, NAVY, True), '<w:spacing w:after="360"/><w:jc w:val="center"/>')]
    bx = md_to_xml('\n'.join(body_lines)) + signature('Denise de Fátima Ferreira', 'Sócia-diretora — DF Síndicos Profissionais Ltda.')
    build(f'{ENT}/DF_Declaracao_Independencia_Einstein.docx', 'Declaração de Independência — Einstein', cv, bx)
    print('ok')


main()
