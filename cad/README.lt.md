# Braižyklė · 2.5D CAD

Vienos bylos CAD detalėms: tiksliai nubraižai 2D kontūrą, jis pats virsta detale su storiu,
pasisuki 3D peržiūroje ir išsiveži DXF į frezavimą. Be diegimo, be licencijų, veikia naršyklėje.

## Paleidimas

```bash
python3 serve.py          # http://localhost:8752/
python3 serve.py 9000     # kitas prievadas
```

Testai: <http://localhost:8752/test.html> (72 patikros – geometrija, kontūrai, eksportas ir pati sąsaja).

## Ką moka

**Braižymas** — linija (grandine), stačiakampis, apskritimas, lankas (centras→pradžia→pabaiga),
matmenys. Braižant galima **įvesti skaičių**: pradėk vesti ilgį, Tab – kampas, Enter – padėta.
Shift – statmenai / 45°.

**Trauka** — galai, vidurys, centras, ketvirčiai, sankirtos, taškas ant linijos ir tinklelis.
Statuso juostoje matai, prie ko prilipo.

**Redagavimas** — suapvalinimas (fillet), nuožulna (chamfer), apkirpimas (trim) pagal realias
sankirtas, ekvidistantė (offset) su aštriais kampais, perkėlimas, kopijavimas, veidrodis,
sukimas, stačiakampis ir apskritas masyvas. Savybių lange kiekvieną liniją/apskritimą gali
redaguoti **skaičiais** (X1, Y1, ilgis, kampas, R, Ø).

**Detalės** — uždari kontūrai aptinkami automatiškai, vidiniai tampa skylėmis. Programa rodo
plotą, perimetrą, pjovimo ilgį, tūrį ir **raudonai pažymi laisvus galus** – neuždarytą kontūrą,
kurio CAM nepriims.

**3D peržiūra** — kontūras išspaudžiamas iki nurodyto storio (skirtingoms detalėms galima
skirtingą), sukama pele. 2D / 3D / abu vaizdai.

**Eksportas** — DXF (R12: LINE, ARC, CIRCLE + sluoksnių lentelė, mm), SVG, PNG, projektas į JSON.
Pagalbinės linijos ir matmenys į DXF **neeksportuojami**, kad frezavimo programa jų nepriimtų
už geometriją.

## Klavišai

`S` žymėti · `L` linija · `R` stačiakampis · `C` apskritimas · `A` lankas · `D` matmuo
`F` suapvalinti · `H` nuožulna · `T` apkirpti · `O` ekvidistantė
`M` perkelti · `K` kopijuoti · `X` veidrodis · `W` sukti · `E` matuoti · `N` pagalbinė linija
`Esc` atšaukti · `Del` trinti · `Ctrl/⌘+Z` atgal · `Ctrl/⌘+A` viską · tarpas+tempimas arba
vidurinis klavišas – slinkti · ratukas – artinti

## Ko nėra (sąmoningai)

Tai ne SolidWorks: nėra ryšių (constraint) sprendiklio, nėra tikro 3D kūnų modeliavimo,
Bulio operacijų, sriegių ar surinkimų. Yra tiksli 2D geometrija + storis — būtent tai, ką
suėda staklės. Sudėtingesnėms mechaninėms detalėms — FreeCAD.

## Failai

| | |
|---|---|
| `index.html` | visa programa (be priklausomybių) |
| `serve.py` | vietinis serveris, 8752 |
| `test.html` | 72 testai |

Paskutinis brėžinys išsaugomas naršyklėje automatiškai.

## Draft v3.0 — DXF redaktorius ir peržiūra (`draft.html`)

Atidaro esamą DXF/DWG (arba STEP/IGES/STL/OBJ modelį), leidžia jį redaguoti ir vėl įrašyti DXF.
Gyvai: <https://app.dedesbaldai.lt/cad/draft.html>

- Redagavimas: perkelti, kopijuoti, pasukti, mastelis, veidrodis, ištempti, lygiagreti kopija, nukirpti, nuožula, apvalinimas (pakeičia ir esamus; R0 – status kampas), tikslūs dydžiai skydelyje.
- Lapas su detalėmis: randa lapą ir detales (ir esančias išpjovose), tempimas su pritraukimu, R – pasukti, F – apversti, persidengimo / už lapo / tarpo įspėjimai, automatinis išdėstymas.
- Peržiūra: matmenys ir kampai, skylės pagal skersmenį, pjovimo ilgis, 3D STEP/IGES/STL/OBJ su matavimu ir projekcija į DXF.
- Failai: DXF (bet kokia versija) ir DWG (su blokais, splainais, elipsėmis); brėžiniai coliais / cm / m perskaičiuojami į mm. Įrašo DXF R12 arba pilną DXF 2000 (LWPOLYLINE), kurį priima ir griežtos CAD programos.
- Patikra prieš pjovimą: dubliuotos / uždengtos linijos (būtų pjaunamos du kartus) su pašalinimu vienu mygtuku, neuždari kontūrai, persidengiančios ar per arti esančios detalės.
- Kaip CAD programoje: reikšmės vedamos prie žymeklio (`50`, `600,400`, `#0,0`, `100<45`), Tab – kitas pritraukimo taškas, Ctrl+C/X/V (ir tarp skirtukų), Ctrl+D, rodyklės stumia, pakartotinis spustelėjimas paima apačioje esantį objektą, dešinio mygtuko meniu, `?` – visi klavišai. Veikia sklandžiai ir lapuose su tūkstančiais detalių.
