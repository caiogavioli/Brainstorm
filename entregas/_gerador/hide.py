import sys, zipfile, shutil, re
src=sys.argv[1]; n=int(sys.argv[2]); tmp=src+'.tmp'
zin=zipfile.ZipFile(src); zout=zipfile.ZipFile(tmp,'w',zipfile.ZIP_DEFLATED)
targets={f'ppt/slides/slide{i}.xml' for i in range(n-1, n+1)}
for it in zin.infolist():
    data=zin.read(it.filename)
    if it.filename in targets:
        x=data.decode('utf8'); x=re.sub(r'<p:sld (?![^>]*show=)', '<p:sld show="0" ', x, count=1); data=x.encode('utf8')
    zout.writestr(it, data)
zout.close(); shutil.move(tmp, src); print('ocultos', sorted(targets))
