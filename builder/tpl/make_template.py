# Strip a DB_PartList / SWOOD ReportLists report down to a creator template:
# keep every sheet, style, macro, pivot and the logo; keep only the sample rows the
# generator copies formatting from; drop cached QR images, rich values, calc chain, pictures.
import zipfile, re, sys
src, dst = sys.argv[1], sys.argv[2]
zin = zipfile.ZipFile(src)
names = zin.namelist()
def rd(n): return zin.read(n).decode('utf-8')
drop = set(n for n in names if n.startswith('xl/richData/') or n in ('xl/metadata.xml', 'xl/calcChain.xml'))
rich_imgs = set()
if 'xl/richData/_rels/rdRichValueWebImage.xml.rels' in names:
    for t in re.findall(r'Target="([^"]+)"', rd('xl/richData/_rels/rdRichValueWebImage.xml.rels')):
        if t.startswith('../media/'): rich_imgs.add('xl/media/' + t[9:])
drop |= rich_imgs
out = {}
def keep_rows(xml, keep):
    def f(m):
        r = int(m.group(2) or m.group(3))
        return m.group(0) if keep(r) else ''
    xml = re.sub(r'<row r="(?:(\d+)"[^>]*/>|(\d+)"[^>]*>.*?</row>)', lambda m: (m.group(0) if keep(int(m.group(1) or m.group(2))) else ''), xml, flags=re.S)
    return xml
def keep_merges(xml, keep):
    ms = re.findall(r'<mergeCell ref="([^"]+)"/>', xml)
    k = [m for m in ms if keep(int(re.search(r'\d+', m).group()))]
    return re.sub(r'<mergeCells count="\d+">.*?</mergeCells>', '<mergeCells count="%d">%s</mergeCells>' % (len(k), ''.join('<mergeCell ref="%s"/>' % m for m in k)) if k else '', xml, flags=re.S)
def keep_cf(xml, keep):
    def f(m):
        first = int(re.search(r'\d+', m.group(1)).group())
        return m.group(0) if keep(first) else ''
    return re.sub(r'<conditionalFormatting sqref="([^"]+)">.*?</conditionalFormatting>', f, xml, flags=re.S)
wbx = rd('xl/workbook.xml'); rels = rd('xl/_rels/workbook.xml.rels')
sheet_file = {}
for name, rid in re.findall(r'<sheet name="([^"]+)" sheetId="\d+"(?: state="\w+")? r:id="(rId\d+)"/>', wbx):
    sheet_file[name] = 'xl/' + re.search(r'Id="%s"[^>]*Target="([^"]+)"' % rid, rels).group(1) if re.search(r'Id="%s"[^>]*Target="([^"]+)"' % rid, rels) else 'xl/' + re.search(r'Target="([^"]+)"[^>]*Id="%s"' % rid, rels).group(1)
LIMIT = {'PARTLIST': 13, 'LABEL': 20, 'EDGEBAND': 6, 'STOCK_CORE': 6, 'HARDWARE_LIST': 10, 'HARDWARE': 10}
for n in names:
    if n in drop: continue
    data = zin.read(n)
    if n.endswith('.xml') or n.endswith('.rels') or n.endswith('.vml'):
        s = data.decode('utf-8')
        s = re.sub(r' (vm|cm)="\d+"', '', s) if n.startswith('xl/worksheets/sheet') else s
        for sh, lim in LIMIT.items():
            if n == sheet_file.get(sh):
                kp = (lambda L: (lambda r: r <= L))(lim)
                s = keep_rows(s, kp); s = keep_merges(s, kp); s = keep_cf(s, kp)
        if n == 'xl/_rels/workbook.xml.rels':
            s = re.sub(r'<Relationship [^>]*Target="(?:metadata\.xml|calcChain\.xml|richData/[^"]+)"[^>]*/>', '', s)
        if n == '[Content_Types].xml':
            s = re.sub(r'<Override PartName="/xl/(?:metadata\.xml|calcChain\.xml|richData/[^"]+)"[^>]*/>', '', s)
        if n == 'xl/drawings/drawing1.xml' or n == 'xl/drawings/drawing2.xml':
            anchors = re.findall(r'<xdr:twoCellAnchor[^>]*>.*?</xdr:twoCellAnchor>', s, re.S)
            keep = [a for a in anchors if '<xdr:pic>' in a]        # logo only
            head = s[:s.index('<xdr:twoCellAnchor')] if anchors else s
            s = head + ''.join(keep) + '</xdr:wsDr>'
        data = s.encode('utf-8')
    out[n] = data
zout = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED, compresslevel=9)
for n in names:
    if n in out: zout.writestr(n, out[n])
zout.close()
print('dropped', len(drop), 'parts; kept', len(out))
