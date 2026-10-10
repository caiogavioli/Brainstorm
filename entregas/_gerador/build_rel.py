import re
src = open('build_df.py').read()
src = src[:src.rstrip().rfind('\nmain()')]
exec(src)
A = '/home/user/Brainstorm/entregas/apresentacao-13-10'
def doc(md_path, out, footer, t1, t2, tag, pairs, sig=True):
    md = open(md_path).read()
    cv = cover(t1, t2, tag, pairs)
    bx = md_to_xml(md) + (signature('Denise Ferreira', 'Sócia-diretora · DF Síndicos Profissionais Ltda.') if sig else [])
    build(out, footer, cv, bx)
doc(f'{A}/relatorio-executivo-einstein.md', f'{A}/DF_Relatorio_Executivo_Einstein.docx', 'Relatório Executivo · Einstein',
    'RELATÓRIO EXECUTIVO', 'DEFESA TÉCNICA · REPRESENTANTE CONDOMINIAL', 'Einstein  ·  Parque Global, Pinheiros e Artur de Azevedo  ·  DF Síndicos Profissionais',
    [('Cliente', CLIENTE), ('Processo', PROC), ('Apresentação', '13/10/2026 · Microsoft Teams'), ('Proponente', PROP), ('Profissional titular', 'Denise Ferreira · CEO'), ('Data', '13/10/2026')])
doc(f'{A}/dossie-interno-preparacao.md', f'{A}/DF_Dossie_Interno_Apresentacao_Einstein.docx', 'Dossiê interno · uso exclusivo DF',
    'DOSSIÊ DE PREPARAÇÃO', 'APRESENTAÇÃO TÉCNICA AO EINSTEIN · 13/10/2026', 'Uso interno  ·  Não enviar ao cliente',
    [('Reunião', 'Terça, 13/10/2026, 10h–12h, Microsoft Teams'), ('Condução', 'Denise Ferreira e Caio Gavioli'), ('Apoio', 'Amanda Tigre, Marco Murino, Cláudia De Santi, André Ferreira da Silva'), ('Documento', 'Roteiro, pontos de atenção, perguntas prováveis e checklist'), ('Classificação', 'Confidencial · uso exclusivo DF')], sig=False)
print('ok')
