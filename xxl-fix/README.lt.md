# XXL Ašių taisyklė — SCM Startech CN Plus

Pasuka SWOOD CAM sugeneruotas `.XXL` programas 90°, kad ilgoji detalės pusė
gultų ant staklių **X** ašies. Nebereikia sukti rankomis.

*Rotates SWOOD CAM `.XXL` part programs by 90° so the long side runs along X.*

---

## Problema

SWOOD išveda detalę tokia orientacija, kokia ji yra gaminio modelyje, o ne tokia,
kokią priima staklės. Pavyzdys — `DESINE_SPORTO_RUBINE_LENKTAS_1OP.XXL`:

```
H DX=684 DY=2200 DZ=18 ...        <-- DY 2200 mm netelpa į Y eigą
```

1284 realiai apdirbtų programų analizė šiose staklėse:

| | reikšmė |
|---|---|
| didžiausias naudotas `DX` | **2746 mm** |
| didžiausias naudotas `DY` | **1015 mm** |
| programų, kur `DY > DX` | 125 (9,7 %) — visos telpa į Y |
| programų su `DY > 1300` | **0** |

Taigi Y ašis yra trumpoji. `DY=2200` fiziškai neįmanoma — detalę privaloma pasukti.

## Naudojimas

Keturi žingsniai, viskas viename ekrane:

1. **Įkelti** — nuvilkti `.XXL` failą. Jei detalė gulsčia (`DY > DX`),
   programa **iš karto pasuka** — būtent dėl to ji ir atidaroma.
2. **Pasukti** — mygtukas `⟳ Pasukti 90°`. Spausti, kol atrodo teisingai
   (0° → 90° → 180° → 270° → 0°). Šalia matyti kampas ir naujas dydis.
3. **Pataisyti gręžinius** *(jei reikia)* — spustelėti gręžinį brėžinyje,
   pastumti mygtukais arba įrašyti tikslią reikšmę, arba praleisti.
4. **Atsisiųsti** — arba `Į stakles`, jei nurodytas aplankas.

`2D` / `3D` mygtukai perjungia vaizdą. 3D rodinyje po brėžiniu yra
**atkūrimo juosta**: `▶ Leisti` paleidžia suklio judesio simuliaciją,
slankiklis leidžia sustoti bet kuriame taške, šalia matyti nueitas kelias. Viskas telpa į 19" (1280×1024) ekraną
be slinkimo.

Retesni dalykai — medžiagos storis, failo vardo priešdėlis, CNC aplankas —
paslėpti po **`Daugiau nustatymų`**.

Užtenka **vieno failo** — `index.html` (95 KB). Jokio diegimo, jokio interneto,
jokio Python. Atidaryti dvigubu spustelėjimu naršyklėje.

```bash
python3 serve.py            # tik jei norisi per http://localhost:8748/
```

## Nauja detalė (programa be SolidWorks)

Mygtukas **`＋ Nauja detalė`** viršuje dešinėje atidaro detalės kūrimo langą — dirbtuvėse
galima pasidaryti programą be inžinieriaus ir be SolidWorks.

1. **Plokštė** — ilgis X, plotis Y, storis (16 / 18 / 19 / 22 / 25 arba savas).
2. **Pridėti operaciją** — skylė (Ø5 / 8 / 15 / 35, aklina arba kiaurai), lentynų skylių eilės,
   vyrių lizdai Ø35, briaunos skylė, griovelis, kampo išpjova, išpjova viduje, apvali kiaurymė.
3. **Nustatymai** dešinėje — kiekviena vieta įvedama **nuo tos briaunos, nuo kurios matavote**
   (nuo kairės / centre / nuo dešinės, nuo priekio / centre / nuo galo). Pakeitus plokštės dydį,
   skylė lieka toje pačioje vietoje nuo tos briaunos. Kartojimas (kiekis + žingsnis) ir
   veidrodinės kopijos. Operaciją galima vilkti brėžinyje; rodyklės ±1 mm (Shift ±10).
4. **Programos** apačioje — kiek jų reikia ir ką daryti su plokšte:
   `1OP` plokštė kaip brėžinyje; `2OP` apversta (apatinės pusės skylės ir grioveliai);
   pasukta 90° programa (Ø5 ilgosiose briaunose). `3D`, `Kodas`, `Atsisiųsti`, `Įrašyti į stakles`.

Programos rašomos lygiai taip pat, kaip jas rašo **step2xxl** (tos pačios eilutės, tie patys
veidų numeriai, `_1OP` / `_2OP` / `_3OP` vardai), su tomis pačiomis taisyklėmis:
frezuojant paliekama 2 mm, freza niekada nesminga vertikaliai (įeina nuožulniai ≤ 30 mm),
niekada daugiau kaip 20 mm už plokštės (Maestro NC17050). Klaidos rodomos iškart —
kol jų yra, atsisiųsti negalima. Detalės išsaugomos šiame kompiuteryje (**`Mano detalės`**),
o neužbaigta detalė lieka atidarius langą iš naujo.

## Ką daro transformacija

Vienas žingsnis (90° prieš laikrodį): `(x, y) → (DY − y, x)`, `DX' = DY`, `DY' = DX`.
Mygtukas taiko šį žingsnį 1–3 kartus, todėl gaunami 90°, 180° ir 270°.

- `H` antraštė — sukeičiami `DX`/`DY` (ir `BX`/`BY`, jei yra); `DZ`, `BZ` nekeičiami
  (nebent atskirai įjungtas storio keitimas).
- `XBO` gręžimai — koordinatės ir plokštuma.
- `XG0` / `XL2P` / `XA2P` frezavimas — taškai ir lankų centrai `I`/`J`.
  Sukimas nėra veidrodis, todėl lanko kryptis `G=2/G=3` ir korekcija `C=` nekeičiamos.
- `O … ;ChangePlane` ir atskiros `F=n` eilutės — perrašomos į naują plokštumą.
- Po antraštės įrašomas žymuo `;*** XXL Fix: pasukta 90 … ***`.

Nekeičiama nieko kito: `Z` gyliai, `D`, `N`, `G`, įrankių parametrai, komentarai,
tarpai, dešimtainių skaičius ir CRLF eilučių pabaigos lieka identiški.

### Plokštumų modelis

Nustatytas iš 1284 programų (ne iš dokumentacijos):

**Atskaitos taškas briaunoje** imamas iš aktyvios `O …;ChangePlane` eilutės, o
**ne** iš plokštumos numerio. Maestro tą tašką perkelia į tolimąjį galą (todėl
F3/F5 koordinatės neigiamos), o SWOOD `ChangePlane` eilučių iš viso nerašo —
tada atskaita yra 0 ir visos plokštumos skaičiuojamos teigiamai nuo artimojo
kampo. Abu variantai tvarkomi vienodai.

| F | briauna | vietinis X | vietinis Y |
|---|---|---|---|
| 1 | viršus | staklių X | staklių Y |
| 2 | kairė `X=0` | storis | `+Y` nuo 0 |
| 3 | dešinė `X=DX` | storis | `Y − DY` (neigiamas) |
| 4 | priekis `Y=0` | `+X` nuo 0 | storis |
| 5 | galas `Y=DY` | `X − DX` (neigiamas) | storis |

Perskaičiavimas: CCW `2→4, 3→5, 4→3, 5→2` · CW `2→5, 3→4, 4→2, 5→3`

## Patikra

```bash
python3 serve.py            # tada http://localhost:8748/test.html
```

- **306 testai** — skaitymas, geometrija, grįžtamumas, plokštumos, formato išsaugojimas,
  lankų spindulių nekintamumas, storio perskaičiavimas, visos storio parinktys,
  operacijų praleidimas, gręžinių koregavimas visose plokštumose, operacijų
  tapatybės stabilumas, visų veiksmų derinys, sprendimo taisyklės,
  3D scena ir suklio judesys, **taip pat paties lango patikra** — index.html
  užkraunamas rėmelyje, įkeliamas failas, pasukama, spustelimas gręžinys ir
  tikrinama, ar kortelė tikrai atsiranda ir telpa į 1024 px aukštį.
- **Regresija per visas 1285 realias programas**: kiekvieno gręžimo fizinė padėtis po
  pasukimo sutampa su matematiškai pasukta pradine padėtimi, abiem kryptimis;
  `CCW→CW` ir `4×CCW` grąžina originalą. **0 klaidų.**
- **Storio regresija per tas pačias 1285 programas** (`DZ → DZ−2`): X/Y padėtys nejuda,
  centruoti briaunų gręžiniai atsiduria naujame centre, kiauri gylai išlaiko užleidimą,
  aklini nepakinta, o rezultatas nepriklauso nuo veiksmų eilės
  (sukti→storis = storis→sukti). **0 klaidų.**
- **3D regresija per tas pačias 1285 programas** (originalas, pasukta, pakeisto storio):
  nė vienos `NaN` koordinatės, judesių grandinė nenutrūksta, `total = greitoji + darbinė`,
  o kiekvienas gręžinys prasideda tiksliai ant tikro plokštės paviršiaus. **0 klaidų.**
- **Praleidimo regresija per tas pačias 1285 programas** (išjungus kas antrą operaciją,
  atskirai ir kartu su sukimu bei storio keitimu): eilučių skaičius nepakinta, lieka
  tiksliai tiek operacijų, kiek turi likti, užkomentuojamos **tik** `XBO`/`XG0`/`XL2P`/`XA2P`
  eilutės, antraštė ir `.END` nepaliesti, o išjungus viską programa vis tiek galioja.
  **0 klaidų.**
- **Tapatybės ir koregavimo regresija per 1285 programas**: operacijų indeksai
  nepasislenka po jokios transformacijos, o praleidus ar pataisius tą operaciją,
  kurią mato naudotojas, pasikeičia **tiksliai** jos eilutė ir nieko daugiau.
  **0 klaidų.**
- 3 ranka rašyti failai su `REFERENCE=UPPERLEFT` **sąmoningai atmetami** (pažymimi
  klaida, o ne tyliai sugadinami) — jų atskaitos kampas kitoks.

## Pastabos apie SWOOD išvestį

Palyginus su 1284 veikiančiomis programomis, SWOOD failas skiriasi:

| | veikiančios | SWOOD |
|---|---|---|
| staklių konfigūracija | `/"StartechCNPlus"` | `/"DEF"` |
| antraštės vėliava | `-B C=0` | `-EH`, papildomai `BX BY BZ` |
| struktūra | `.OP1…`, `REFERENCE=`, `SET ZFAST=` | plokščias `XBO` sąrašas |

`/"DEF"` reiškia, kad poprocesoriuje neparinkta staklių konfigūracija. Verta
paprašyti SWOOD atstovo perkonfigūruoti poprocesorių — ten sprendžiama ir detalės
orientacija (pagal pluošto kryptį / detalės lokalią koordinačių sistemą), ir
staklių profilis. Tai ilgalaikis sprendimas; ši programėlė sutvarko tai, kas
išeina dabar.

`Z=-24.559` prie `DZ=18` (gilesnis nei plokštė) — verta atskirai pasitikrinti
SWOOD pusėje; sukimas šio dydžio nekeičia.
