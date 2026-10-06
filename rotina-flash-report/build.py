#!/usr/bin/env python3
"""Atualiza o artefato Flash Report com uma semana nova.

Uso:
  python3 build.py --base base.html --extracted /tmp/flash --week 2026-10-05 \
      [--exec exec.json] --out novo.html [--today 12/10/2026]
  python3 build.py --base base.html --so-regras --out novo.html   # só reaplica regras e template

- base.html: o artefato publicado (lido com Artifact read). Os dados vivem em `const DATA = {...};`.
- extracted/<slug>.json: saída de cada agente de extração (esquema em prompt-extracao.md).
- week: segunda-feira da semana processada (o período segunda a domingo que acabou de fechar).
- Prazo: o report é "no prazo" se chegou até 12h00 (Brasília) da segunda seguinte à semana (regra da BGRE).
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

def recalc_prazo(data):
    """Regra BGRE: o report da semana (segunda a domingo) deve chegar até 12h00 (America/Sao_Paulo) da segunda seguinte.
    `rec` guarda o recebimento em UTC; Brasília = UTC-3."""
    for ents in data['entries'].values():
        for wk, e in ents.items():
            rec = dt.datetime.strptime(e['rec'][:16], '%Y-%m-%d %H:%M') - dt.timedelta(hours=3)
            limite = dt.datetime.combine(D(wk) + dt.timedelta(days=7), dt.time(12, 0))
            e['no_prazo'] = rec <= limite

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
    ap.add_argument('--so-regras', action='store_true', help='não lê extrações: reaplica regras (prazo) e o template sobre o base')
    a = ap.parse_args()
    data = load_data(a.base)
    if a.faltas:
        lim = a.week or data['weeks'][-1]   # semanas >= lim ainda não venceram (ou são a semana alvo)
        last = lim
        print(json.dumps({c['slug']: [w for w in data['weeks'] if w < lim and w not in data['entries'].get(c['slug'], {}) and w not in data['cobertos'].get(c['slug'], {})] for c in data['condos']}, ensure_ascii=False, indent=1))
        print('semanas antes de', lim, 'sem report e sem consolidado (procurar se chegaram depois)')
        return
    if a.so_regras:
        if not a.out: raise SystemExit('falta --out')
        a.extracted = a.week = None
    elif not (a.extracted and a.week and a.out): raise SystemExit('faltam --extracted, --week e --out')
    data['followups'] = {}   # as cobranças da BGRE não aparecem mais no relatório nem ficam nos dados da página
    W = data['weeks']; first = W[0]
    target = a.week or W[-1]
    if D(target).weekday() != 0: raise SystemExit('--week precisa ser uma segunda-feira')
    # acrescenta semanas até a alvo
    while W[-1] < target:
        W.append((D(W[-1]) + dt.timedelta(days=7)).isoformat())
    for c in data['condos']:
        data['entries'].setdefault(c['slug'], {}); data['cobertos'].setdefault(c['slug'], {})
    for c in ([] if a.so_regras else data['condos']):
        slug = c['slug']; p = os.path.join(a.extracted, slug + '.json')
        data['entries'].setdefault(slug, {}); data['cobertos'].setdefault(slug, {})
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
    recalc_prazo(data)
    if a.exec: data['exec'] = json.load(open(a.exec, encoding='utf-8'))
    hoje = a.today or dt.date.today().strftime('%d/%m/%Y')
    data['geradoEm'] = hoje
    hoje_iso = D('-'.join(reversed(hoje.split('/'))))
    tpl = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read()
    js = json.dumps(data, ensure_ascii=False).replace('</', '<\\/')
    assert '\n' not in js
    open(a.out, 'w', encoding='utf-8').write(tpl.replace('__DATA__', js))
    stats(data, hoje_iso)

def stats(data, hoje):
    W = data['weeks']; last = W[-1]; C = data['condos']
    tot = dict(rec=0, ontime=0, cons=0, miss=0, pend=0); sev = {'alta': 0, 'media': 0, 'baixa': 0}; miss = {}
    for c in C:
        for w in W:
            e = data['entries'][c['slug']].get(w)
            if e: tot['rec'] += 1; tot['ontime'] += e['no_prazo']; sev[e['sev']] += 1
            elif w in data['cobertos'][c['slug']]: tot['cons'] += 1
            elif hoje <= D(w) + dt.timedelta(days=7): tot['pend'] += 1  # prazo é a segunda seguinte (12h)
            else: tot['miss'] += 1; miss.setdefault(c['nome'], []).append(w)
    due = tot['rec'] + tot['cons'] + tot['miss']
    print(f"SEMANAS: {len(W)} ({W[0]} a {last}) | CONDOMÍNIOS: {len(C)}")
    print(f"cobertas={tot['rec']+tot['cons']} de {due} vencidas | recebidos={tot['rec']} na segunda={tot['ontime']} | consolidados={tot['cons']} | sem report={tot['miss']} | prazo hoje={tot['pend']}")
    print('severidade:', sev); print('sem report por condomínio:', miss)
    print('alta na última semana:', [c['nome'] for c in C if (data['entries'][c['slug']].get(last) or {}).get('sev') == 'alta'])

if __name__ == '__main__': main()
