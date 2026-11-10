import zipfile, re, sys
def shapes(path, dn):
    z=zipfile.ZipFile(path); dx=z.read(f'xl/drawings/{dn}.xml').decode(); by={}
    for a in re.findall(r'<xdr:twoCellAnchor[^>]*>(.*?)</xdr:twoCellAnchor>',dx,re.S):
        n=re.search(r'name="([^"]+)"',a).group(1)
        if not n.startswith('PIC_'): continue
        k,i=n.rsplit('_',1)
        g=[int(x) for x in re.findall(r'<xdr:(?:col|colOff|row|rowOff)>(-?\d+)<',a)]
        prst=re.search(r'prst="(\w+)"',a).group(1); w=re.search(r'<a:ln w="(\d+)"',a); w=int(w.group(1)) if w else None
        by.setdefault(k,[]).append((int(i),prst,w,'dash' in a,g))
    return {k:sorted(v) for k,v in by.items()}
for dn in ('drawing1','drawing2'):
    A=shapes('/home/claude/rep/ref.xlsm',dn); B=shapes(sys.argv[1] if len(sys.argv)>1 else 'test/rep/rebuilt.xlsm',dn)
    simple=[k for k,v in A.items() if all(s[1] in ('rect','line') and not s[3] for s in v) and sum(1 for s in v if s[1]=='line' and s[2]==9525)==4]
    ok=bad=0; maxd=0; worst=None
    for k in simple:
        a,b=A[k],B.get(k)
        if not b or len(a)!=len(b) or [s[1:4] for s in a]!=[s[1:4] for s in b]: bad+=1; print('  shape set differs',k,len(a),len(b or [])); continue
        d=max(abs(x-y) for s,t in zip(a,b) for x,y in zip(s[4],t[4]))
        if d>maxd: maxd,worst=d,k
        ok+=1
    print(f'{dn}: {len(A)} pictures in v18, {len(simple)} plain rectangles compared: {ok} same shapes, {bad} different; largest anchor difference {maxd} EMU ({maxd/12700:.3f} pt) at {worst}')
