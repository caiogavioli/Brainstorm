#!/usr/bin/env python3
"""Atualiza o artefato Flash Report com uma semana nova.

Uso:
  python3 build.py --base base.html --extracted /tmp/flash --week 2026-10-05 \
      [--exec exec.json] --out novo.html [--today 12/10/2026]

- base.html: o artefato publicado (lido com Artifact read). Os dados vivem em `const DATA = {...};`.
- extracted/<slug>.json: saída de cada agente de extração (esquema em prompt-extracao.md).
- week: segunda-feira da semana processada (o período segunda a domingo que acabou de fechar).
- exec.json: opcional; substitui o bloco `exec` (lead, prioridades, temas, datas, metodo).
Também refaz semanas antigas que estavam sem report e chegaram depois (back-fill).
Imprime estatísticas para escrever o texto do bloco `exec`.
"""
import argparse, json, re, datetime as dt, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
D = dt.date.fromisoformat
noise = re.compile(r'(sem novos registros|não causou impacto)', re.I)

def monday(d): return d - dt.timedelta(days=d.weekday())
def clean(t): return re.sub(r'\s+', ' ', t or '').strip()
def cut(t, n=230):
    t = clean(t)
    if len(t) <= n: return t
    return t[:n].rsplit(' ', 1)[0].rstrip(',;:.') + '…'

def load_data(path):
    for line in open(path, encoding='utf-8'):
        if line.startswith('const DATA = '):
            return json.loads(line[len('const DATA = '):].rstrip().rstrip(';'))
    raise SystemExit('Não achei "const DATA = " no arquivo base. Pare e avise o usuário.')

def build_entry(s):
    seg = [x for x in (s.get('seguranca') or []) if x.get('tipo') != 'atendimento_medico']
    nmed = sum(1 for x in (s.get('seguranca') or []) if x.get('tipo') == 'atendimento_medico')
    def el(x):
        t = (x.get('equipamento') or '') + ': ' + (x.get('descricao') or '') if x.get('equipamento') else x.get('descricao')
        return dict(d=x.get('data') or '', t=cut(t), ret=bool(x.get('passageiro_retido')))
    return dict(
        ini=s['inicio'], fim=s['fim'], bgre=bool(s.get('padrao_bgre')),
        rec=s['recebido_em'][:16].replace('T', ' ') + ' UTC', no_prazo=bool(s['no_prazo']),
        sev=s['severidade_semana'], resumo=clean(s['resumo']), motivo=clean(s['motivo_severidade']),
        atencao=[clean(x) for x in (s.get('pontos_de_atencao_para_diretoria') or [])][:3],
        pend=[cut(x, 180) for x in (s.get('pendencias_abertas') or [])][:6],
        energia=[dict(d=x.get('data') or '', t=cut(x.get('descricao'))) for x in (s.get('energia') or [])],
        elevadores=[el(x) for x in (s.get('elevadores') or [])],
        seguranca=[dict(d=x.get('data') or '', t=cut(x.get('descricao'))) for x in seg],
        n_medico=nmed,
        chuvas=[dict(d=x.get('data') or '', t=cut(x.get('descricao'))) for x in (s.get('chuvas_alagamento') or [])
                if not noise.search(x.get('descricao') or '')],
    )

def place(s):
    """Devolve (semana_da_entrada, [semanas_cobertas_alem_dela]).
    Relatório normal: semana que contém o ponto médio do período.
    Consolidado (13+ dias): entra na última semana coberta; as outras viram 'consolidado'."""
    a, b = D(s['inicio']), D(s['fim'])
    if (b - a).days >= 13:
        mons, m = [], monday(a)
        while m <= monday(b - dt.timedelta(days=1)):
            mons.append(m.isoformat()); m += dt.timedelta(days=7)
        return mons[-1], mons[:-1]
    mid = a + (b - a) / 2
    return monday(mid).isoformat(), []

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', required=True); ap.add_argument('--extracted')
    ap.add_argument('--week'); ap.add_argument('--out')
    ap.add_argument('--exec'); ap.add_argument('--today')
    ap.add_argument('--faltas', action='store_true', help='lista as semanas sem report de cada condomínio e sai')
    a = ap.parse_args()
    data = load_data(a.base)
    if a.faltas:
        lim = a.week or data['weeks'][-1]   # semanas >= lim ainda não venceram (ou são a semana alvo)
        last = lim
        print(json.dumps({c['slug']: [w for w in data['weeks'] if w < lim and w not in data['entries'].get(c['slug'], {}) and w not in data['cobertos'].get(c['slug'], {})] for c in data['condos']}, ensure_ascii=False, indent=1))
        print('semanas antes de', lim, 'sem report e sem consolidado (procurar se chegaram depois)')
        return
    if not (a.extracted and a.week and a.out): raise SystemExit('faltam --extracted, --week e --out')
    W = data['weeks']; first = W[0]
    target = a.week
    if D(target).weekday() != 0: raise SystemExit('--week precisa ser uma segunda-feira')
    # acrescenta semanas até a alvo
    while W[-1] < target:
        W.append((D(W[-1]) + dt.timedelta(days=7)).isoformat())
    for c in data['condos']:
        slug = c['slug']; p = os.path.join(a.extracted, slug + '.json')
        data['entries'].setdefault(slug, {}); data['followups'].setdefault(slug, []); data['cobertos'].setdefault(slug, {})
        if not os.path.exists(p):
            print('AVISO: sem arquivo de extração para', slug); continue
        src = json.load(open(p, encoding='utf-8'))
        for s in src.get('semanas', []):
            if s['inicio'] < '2026-08-01': continue
            wk, extra = place(s)
            if wk < first or wk > target: continue
            data['entries'][slug][wk] = build_entry(s)
            for w in extra:
                if w >= first and w not in data['entries'][slug]: data['cobertos'][slug][w] = wk
            for w in list(data['cobertos'][slug]):          # semana ganhou report próprio
                if w in data['entries'][slug]: del data['cobertos'][slug][w]
        seen = {(f['data'], f['pergunta'][:60]) for f in data['followups'][slug]}
        for f in src.get('followups_bgre', []):
            if f['data'] < first: continue
            item = dict(data=f['data'], de=re.sub(r'\s*\(.*?\)', '', f['de']).strip(), pergunta=cut(f['pergunta']), status=f['status'])
            if (item['data'], item['pergunta'][:60]) not in seen:
                data['followups'][slug].append(item); seen.add((item['data'], item['pergunta'][:60]))
            else:  # atualiza status (ex.: passou a ter resposta)
                for old in data['followups'][slug]:
                    if (old['data'], old['pergunta'][:60]) == (item['data'], item['pergunta'][:60]): old['status'] = item['status']
    if a.exec: data['exec'] = json.load(open(a.exec, encoding='utf-8'))
    hoje = a.today or dt.date.today().strftime('%d/%m/%Y')
    data['geradoEm'] = hoje
    tpl = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read()
    js = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
    assert '\n' not in js
    open(a.out, 'w', encoding='utf-8').write(tpl.replace('__DATA__', js))
    stats(data)

def stats(data):
    W = data['weeks']; last = W[-1]; C = data['condos']
    tot = dict(rec=0, ontime=0, cons=0, miss=0, pend=0); sev = {'alta': 0, 'media': 0, 'baixa': 0}; miss = {}
    for c in C:
        for w in W:
            e = data['entries'][c['slug']].get(w)
            if e: tot['rec'] += 1; tot['ontime'] += e['no_prazo']; sev[e['sev']] += 1
            elif w in data['cobertos'][c['slug']]: tot['cons'] += 1
            elif w == last: tot['pend'] += 1
            else: tot['miss'] += 1; miss.setdefault(c['nome'], []).append(w)
    due = tot['rec'] + tot['cons'] + tot['miss']
    print(f"SEMANAS: {len(W)} ({W[0]} a {last}) | CONDOMÍNIOS: {len(C)}")
    print(f"cobertas={tot['rec']+tot['cons']} de {due} vencidas | recebidos={tot['rec']} na segunda={tot['ontime']} | consolidados={tot['cons']} | sem report={tot['miss']} | prazo hoje={tot['pend']}")
    print('severidade:', sev); print('sem report por condomínio:', miss)
    print('alta na última semana:', [c['nome'] for c in C if (data['entries'][c['slug']].get(last) or {}).get('sev') == 'alta'])

if __name__ == '__main__': main()
