/* =====================================================================
   app.js — Dėdės Baldai spintelių kūrėjas (cabinet creator).
   Cabinet settings as in the offer app → offer-app sketch → part list,
   .XXL programs (engine.js) and the nesting-app workbook (export.js).
   ===================================================================== */
(function () {
"use strict";
var E = window.DBEngine, X = window.DBExport, Z = window.DBZip, SK = window.OfferSketch, ISO = window.DBIso, RM = window.DBRoom;
var VERSION = '2.1';
var IN_ARTIFACT = !!(window.claude && typeof window.claude.use === 'function');

/* ----------------------------------------------------------------- texts */
var T = {
lt:{
 app:'Spintelių kūrėjas', sub:'Dėdės Baldai · detalės ir CNC be inžinieriaus',
 project:'Projektas', projPh:'PROJEKTO_KODAS',
 tCab:'Spintelės', tRes:'Detalės ir CNC', tSet:'Nustatymai', projects:'Projektai',
 cabs:'Spintelės', newCab:'＋ Nauja spintelė', dup:'Kopijuoti', del:'Ištrinti', delSure:'Tikrai ištrinti?',
 pickTitle:'Kokią spintelę kuriame?', pickLead:'Pasirinkite panašiausią — viską galėsite pakeisti.', cancel:'Atšaukti',
 pDrawers:'Stalčių spintelė', pDoors:'Durų spintelė', pDrDoors:'Stalčius + durys', pWall:'Pakabinama', pTall:'Aukšta su orkaite', pDish:'Indaplovės fasadas', pEmpty:'Tuščia (lentynos)',
 s1:'Matmenys', s1l:'Karkaso išoriniai matmenys milimetrais, be kojelių. Galima rašyti 600-18.',
 name:'Pavadinimas', type:'Tipas', tBase:'Pastatoma', tWall:'Pakabinama', tTall:'Aukšta', W:'Plotis', H:'Aukštis', D:'Gylis', thick:'Plokštė', facT:'Fasadas', dishW:'Indaplovės plotis',
 s2:'Sekcijos', s2l:'Viršus sąrašo viršuje. „Likęs“ — užima likusį aukštį.',
 zone:'Fasadų zona', used:'užimta', left:'liko', over:'viršyta',
 kDrawers:'Stalčiai', kDoors:'Durys', kOpen:'Lentynos', kOven:'Orkaitė',
 secH:'Aukštis', fill:'Likęs', nDr:'Stalčių', runner:'Bėgeliai', rail:'Bėgelio ilgis', nDoors:'Durų', split:'Išdėstymas', sSide:'Šalia', sStack:'Viena virš kitos',
 hinge:'Lankstai', hside:'Lankstų pusė', hsAuto:'Auto', hsL:'Kairė', hsR:'Dešinė', shelves:'Lentynų', adj:'Kilnojamos', fixed:'Fiksuotos', sup:'Atramų',
 add:'Pridėti viršuje', up:'Aukštyn', down:'Žemyn', rm:'Pašalinti',
 s3:'Konstrukcija', s3l:'Kaip sujungiamas karkasas.',
 jConf:'Konfirmatai', jConfD:'Ø8 kiaurai + Ø5×32 krašte. Juostos ir dugnas per konfirmatus.', jCam:'Ekscentrikai + kaiščiai', jCamD:'Ø15 ekscentrikai šone, Ø8 varžtai ir kaiščiai. Surenkama be klijų.',
 top:'Viršus', topRails:'Juostos', topFull:'Pilnas viršus', topOver:'Viršus dengia fasadus',
 back:'Nugara (18 mm)', bNone:'Nėra', bTop:'Ant galo (prisukama)', bIn:'Viduje',
 jTitle:'Jungtys pagal detales', jLead:'Kiekvienai jungčiai galima parinkti savo tvirtinimą. Kiekis — jungčių vienoje pusėje; nuo krašto — kraštinių jungčių atstumas nuo detalės krašto. Tuščia — standartas.',
 jtConf:'Konfirmatai', jtCam:'Ekscentrikai', jtDowel:'Kaiščiai', jN:'Kiekis', jE:'Nuo krašto', jAuto:'standartas', jMain:'Pagrindinis jungimas', jMainL:'Taikomas visoms jungtims, kurių nekeitėte.',
 jk_bottom:'Dugnas ↔ šonai', jk_top:'Viršus ↔ šonai', jk_railF:'Priekinė juosta', jk_railB:'Galinė juosta', jk_railV:'Stati galinė juosta', jk_railBottom:'Apatinė juosta', jk_railVH:'Stati juosta ↔ gulsčia', jk_railBotB:'Apatinė juosta ↔ dugnas', jk_back:'Nugara', jk_shelf:'Fiksuotos lentynos', jk_oven:'Orkaitės atramos',
 lgConf:'konfirmatas', lgCam:'ekscentrikas', lgDowel:'kaištis', xSideL:'kairysis šonas, žiūrint iš kairės', xSideR:'dešinysis šonas, žiūrint iš dešinės', sideL:'Kairys šonas', sideR:'Dešinys šonas',
 rails:'Surišimo juostos', rFront:'Priekyje', rBack:'Gale', rBottom:'Apačioje gale', rBottomD:'stati juosta ant dugno', rFlat:'Gulsčia', rStand:'Stati', rBoth:'Gulsčia + stati', rNone:'Nėra', rW:'Juostos plotis', rCount:'Juostų',
 bFix:'Nugaros tvirtinimas', bFixIn:'Nugara viduje tvirtinama tuo pačiu būdu kaip karkasas.', xsec:'Šoninis pjūvis', xFront:'priekis', xBack:'galas',
 tbMark:'Žymės Ø5 (varžtams)', tbHole:'Skylės Ø10 (reikia Ø10 grąžto)', oTbDm:'Fasado tvirtinimo vietos pažymimos Ø5 × 2 mm — prisukama varžtais. Ø10 grąžto galvoje nėra.',
 s6:'Papildomos detalės', s6l:'Detalės, kurių nėra konstrukcijoje: cokolis, apdailos plokštė, papildoma lentyna… Tik pjaunamos, be skylių.',
 exName:'Pavadinimas', exAdd:'Detalė', exNone:'Papildomų detalių nėra.', exEdges:'Kraštai', exPlinth:'Cokolis',
 rotHint:'↻ — antra programa su ta pačia puse viršuje, plokštė pasukta 90° prieš laikrodžio rodyklę (priekinis kraštas tampa kairiuoju galu).',
 setRails:'Juostos ir nugara', drillsTop:'Grąžtai galvoje (viršus), mm', drillsTopL:'Iš Maestro konfigūracijos. Skylės, kurių skersmens čia nėra, neprogramuojamos.', tbHoleSet:'TANDEMBOX fasado skylė (jei Ø)', tbDef:'TANDEMBOX fasadai',
 s4:'Papildomos operacijos', s4l:'Pažymėkite, ką gręžti CNC. „Patikrinta“ — sutampa su jūsų SWOOD modeliais.',
 oLegs:'Kojelės ir jų žymės dugne', oLegsD:'4 žymės Ø5 × 2 mm kiekvienai kojelei. Plačiai ar sunkiai spintelei pridėkite daugiau kojelių.', legRow:'Kojelių eilėje', fhTitle:'Fasadų aukščiai, mm', fhNote:'iš viršaus · tuščias = dalijasi likusį aukštį', fhEqual:'Vienodi', legParts:'Po pertvaromis', legRows:'Eilės', legRows2:'2 — priekis, galas', legRows3:'3 — + vidurys', legTotal:'Iš viso kojelių', legFront:'priekis', legDense:'Per tankiai — tarp kojelių būtų mažiau nei 70 mm',
 oRun:'Bėgelių žymės šonuose', oRunD:'Blum TANDEM / TANDEMBOX šablonai pagal stalčių aukštį.',
 oTb:'TANDEMBOX fasadų tvirtinimas', oTbD:'Ø10 × 12 skylės fasado vidinėje pusėje.',
 oHinge:'Lankstų skylės', oHingeD:'Ø35 puodelis duryse + 2 plokštelės žymės šone (Ø5 × 2, kaip post-procesoriuje). Blum katalogo matmenys.',
 hfScrew:'Puodelis prisukamas', hfPress:'Įspaudžiamas (+2 × Ø8)',
 oPins:'Lentynų laikiklių skylės', oPinsD:'Ø5 skylės abiejuose šonuose po kiekviena kilnojama lentyna.',
 pinShelf:'Tik po lentyna', pinRow:'Eilė ±2 kas 32',
 notNeeded:'šiai spintelei nereikia', verified:'patikrinta', unverified:'nepatikrinta',
 s5:'Medžiagos ir kraštai', s5l:'Pavadinimai keliauja į detalių sąrašą ir nesting programą.',
 mCarc:'Karkasas', mFac:'Fasadai', mBack:'Nugara', eCarc:'Karkaso kraštas', eFac:'Fasado kraštas', legH:'Kojelių aukštis',
 sketch:'Eskizas', parts:'Detalių', progs:'Programų', warns:'Pastabos', toRes:'Detalės ir CNC →',
 noCab:'Projekte dar nėra spintelių.', firstCab:'Sukurkite pirmą spintelę',
 rTitle:'Detalių sąrašas ir CNC programos', zipAll:'⤓ Viskas (ZIP)', xlsm:'Sąrašas .xlsm', csv:'Sąrašas .csv', print:'Spausdinti sąrašą', json:'Projektas .json',
 zipNote:'ZIP: visos .XXL programos, .xlsm sąrašas nesting programai (kaip SWOOD ataskaita), .csv ir projekto failas.',
 cDet:'Detalė', cCab:'Sp.', cMat:'Medžiaga', cL:'Ilgis', cW:'Plotis', cT:'Stor.', cQ:'Kiek.', cEdge:'Kraštai', cProg:'Programos',
 noProg:'be CNC', pick:'Pasirinkite detalę — pamatysite brėžinį ir programą.',
 lgA:'iš viršaus', lgB:'iš apačios (2OP)', lgT:'kiaurai', lgM:'žymė', lgE:'krašte', lgEb:'briauna',
 copy:'Kopijuoti', copied:'Nukopijuota', hw:'Furnitūra', hwNote:'Kiekiai iš konstrukcijos — patikrinkite prieš užsakydami.',
 allWarn:'Pastabos', none:'Nėra',
 setTitle:'Nustatymai', setLead:'Taikoma visiems projektams šioje naršyklėje.',
 tplTitle:'ReportLists šablonas', tplLead:'Sąrašas .xlsm pildomas į šį šabloną taip pat, kaip SolidWorks makrokomanda DB_PartList (v18): tie patys lapai, etiketės, QR ir paveikslėliai.',
 tplBuiltIn:'Įdiegtas: DB_PartList v18 ataskaita (DiG_Virtuve)', tplOwn:'Jūsų šablonas: ', tplUpload:'Įkelti kitą ataskaitą (.xlsm)', tplReset:'Grąžinti įdiegtą', tplBad:'Tai ne ReportLists ataskaita — nėra PARTLIST ir LABEL lapų.', tplOk:'Šablonas pakeistas', tplSession:'Šablonas naudojamas tik šiai sesijai (naršyklė neleido išsaugoti).',
 rptFallback:'ReportLists šablono nepavyko užkrauti (reikia interneto JSZip bibliotekai) — sukurtas paprastas sąrašas.', building:'Ruošiama…',
 setMats:'Medžiagų sąrašas', setEdges:'Kraštų sąrašas', setMatsL:'Po vieną eilutėje — bus siūloma pildant.',
 setTypes:'Numatyta konstrukcija pagal tipą', setTypesL:'Naujai spintelei parenkama pagal tipą. Darbuotojui keisti nereikės.',
 setOps:'Numatytos operacijos', setRules:'Lankstų ir lentynų skylių matmenys',
 setRulesL:'Nepatikrinta su jūsų SWOOD modeliu. Patikrinkite pirmas duris ir šoną, pataisykite čia.',
 rCupE:'Puodelio centras nuo durų krašto', rCupD:'Puodelio gylis', rEnd:'Kraštinis lankstas nuo durų galo', rPlF:'Plokštelė nuo šono priekio', rPlS:'Plokštelės skylių atstumas', rPlD:'Plokštelės skylės gylis',
 rPinF:'Laikiklis nuo šono priekio', rPinB:'Laikiklis nuo lentynos galo', rPinBelow:'Skylės centras žemiau lentynos', rPinD:'Laikiklio skylės gylis', rPitch:'Eilės žingsnis',
 resetRules:'Atstatyti katalogo reikšmes',
 prTitle:'Projektai', prSave:'Išsaugoti šį projektą', prNew:'＋ Naujas projektas', prOpen:'Atverti', prNone:'Išsaugotų projektų nėra.',
 prImport:'Įkelti .json', prImportL:'Šio kūrėjo projektas arba pasiūlymo programos (offer) eksportas — spintelės persikels su matmenimis ir sekcijomis.',
 prHint:'Projektai laikomi šioje naršyklėje. Atsarginei kopijai — „Projektas .json“.',
 close:'Uždaryti', saved:'Išsaugota', imported:'Įkelta spintelių: ', badFile:'Nepavyko perskaityti failo — tai ne projekto JSON.',
 dlFail:'Atsisiųsti nepavyko: ', dlDeclined:'Atsisiuntimas atšauktas', newConfirm:'Pradėti naują? Spauskite dar kartą',
 errTag:'klaida', warnTag:'patikrinti', infoTag:'rankomis',
 legs:'kojelės',
 isoTitle:'Jungtys 3D', isoLead:'tempkite jungtis ant karkaso', isoDrag:'Paimkite jungtį ir nutempkite ant punktyrinės jungties linijos 3D vaizde (arba bakstelėkite kortelę, tada liniją):', isoChipT:'Tempkite ant punktyrinės jungties linijos 3D vaizde arba bakstelėkite ir tada bakstelėkite liniją',
 isoT_confirmat:'Konfirmatas', isoT_cam:'Ekscentrikas', isoT_dowel:'Kaištis',
 isoRotL:'Pasukti 90° į kairę', isoRotR:'Pasukti 90° į dešinę', isoHome:'Grąžinti vaizdą iš priekio-kairės', isoHomeS:'Vaizdas', isoUndo:'Atšaukti', isoUndone:'Atšaukta',
 isoFront:'▼ PRIEKIS', isoJoints:'Karkaso jungtys', isoManual:'rankinės vietos', isoManualS:'rankinės', isoEdit:'Keisti 3D',
 isoHint:'Tempkite jungtį iš viršaus ant linijos — pridėsite. „Atskirai“ — keičiasi tik tas šonas, ant kurio tempiate. Tempkite esamą jungtį išilgai — perkelsite, nutempkite toliau nuo linijos — pašalinsite. Tuščią vietą tempiant vaizdas sukasi. Pažymėtą jungtį galima stumdyti rodyklėmis (Shift — po 10 mm), Delete — pašalinti.',
 isoRefFront:'nuo priekio', isoRefBack:'nuo galo', isoRefRail:'nuo juostos apačios', isoRefBottom:'nuo dugno viršaus', isoRefShelf:'nuo lentynos priekio', isoRefLeft:'nuo kairės pusės', isoOneLine:'viena jungtis', isoRefPartF:'nuo juostos priekio', isoRefPartR:'nuo juostos galo',
 isoSnapMid:'vidurys', isoSnapSym:'simetriškai', isoSnapStd:'standartas',
 isoDropRemove:'Paleiskite — jungtis bus pašalinta', isoTooClose:'Per arti kitos jungties (min. {n} mm)', isoTurn:'Pasukite vaizdą — linija matoma galu',
 isoSame:'Šis tipas jau yra — tempkite ant tuščios linijos vietos', isoConvert:'Paleiskite — visa jungtis taps: {t}', isoAdd:'Paleiskite — pridėti jungtį', isoAddConv:'Pridėti; visa jungtis taps: {t}',
 isoMiss:'Paleiskite ant punktyrinės jungties linijos', isoRemoved:'Jungtis pašalinta', isoRm:'Pašalinti jungtį',
 isoPos:'Vietos, mm', isoNone:'Nėra nė vienos jungties — mazgas nesurištas.', isoAddBtn:'Pridėti', isoEven:'Išdėstyti tolygiai',
 isoLen:'Jungties ilgis {w} mm · ne arčiau {e} mm nuo krašto, tarpas ne mažiau {g} mm.', isoCamDw:'Kaiščiai Ø8 prie kraštinių ekscentrikų (±32) dedami automatiškai.', isoMirror:'Kairys ir dešinys šonai keičiasi kartu.',
 isoNoJ:'Šioje spintelėje karkaso jungčių nėra.',
 isoD_confirmat:'Varžtas per šoną į detalės kraštą. Ø8 kiaurai + Ø5×32. Tvirčiausias, bet varžto galva matosi.', isoD_cam:'Ekscentrikas detalėje pasuktas užveržia varžtą šone. Ø15 + Ø8. Nesimato, galima išardyti.', isoD_dowel:'Medinis kaištis Ø8 su klijais — centruoja ir laiko. Nesimato, neišardomas.',
 isoGrab:'⠿ Tempkite ant jungties', isoTapLine:'Bakstelėkite jungties liniją', isoFullOn:'Atidaryti 3D per visą ekraną', isoFullOff:'Uždaryti visą ekraną (Esc)', isoFullOnS:'Visas ekranas', isoFullOffS:'Uždaryti',
 xxlTitle:'CNC programos (.XXL)', xxlLead:'Kiekvieną programą galima atsisiųsti atskirai, be ZIP. ↻ — pasukta programa (5 mm skylės ilgame krašte). Naršyklė gali paklausti, ar leisti atsisiųsti kelis failus — leiskite.',
 xxlAll:'⤓ Visos .XXL atskirai ({n})', xxlAllT:'Kiekviena programa atskiru failu, be ZIP', xxlCab:'⤓ Šios spintelės ({n})', xxlPart:'⤓ Visos šios detalės ({n})', xxlOne:'Atsisiųsti', xxlRot:'pasukta', xxlSaving:'Atsisiunčiama failų: {n}…',
 reqNote:'privaloma — be to detalių sąraše nebus medžiagos', tRoom:'Virtuvė', rmTitle:'Visa virtuvė', rmWall:'Siena', rmWalls:'Sienos', rmVFront:'Iš priekio', rmVPlan:'Planas', rmAllWalls:'Visos sienos',
 rm3Hint:'Tempkite — sukasi. Spustelėkite spintelę — pažymite.', rmAdd:'Pridėti spintelę', rmAddT:'Nutempkite ant sienos (vaizdas „Iš priekio“ arba „Planas“) arba spustelėkite — atsiras po paskutine',
 rmUnplaced:'Nepastatytos', rmPlace:'Pastatyti', rmX:'Nuo sienos pradžios', rmZ:'Apačia nuo grindų', rmHitShort:'Kliūna už kitos spintelės arba išeina už sienos — patraukite arba pakeiskite plotį.',
 rmFill:'Užpildyti tarpą: {w} mm', rmEdit:'Redaguoti spintelę', rmDup:'Kopija šalia', rmUnplace:'Nuimti nuo sienos', rmKeys:'← → stumia po 10 mm (Shift — 100 mm), Delete — nuima nuo sienos.',
 rmUsed:'užstatyta {u} mm', rmWallDel:'Pašalinti paskutinę sieną', rmWallDelDone:'Siena pašalinta — jos spintelės perkeltos į „Nepastatytos“', rmRoom:'Patalpa',
 rmRoomL:'Sienos eina pagal laikrodžio rodyklę, žiūrint iš viršaus: A — į dešinę, B — žemyn, C — į kairę, D — aukštyn. Viena siena — tiesi virtuvė, dvi — L, trys — U.',
 rmWallAdd:'Pridėti sieną', rmWallZ:'Pakabinamų apačia nuo grindų', rmRoomH:'Patalpos aukštis', rmWorktop:'Rodyti stalviršį', rmProbs:'Patikrinkite',
 rmProbOut:'Spintelė {a} išeina už sienos galo', rmProbHit:'Spintelės {a} ir {b} kliūna viena už kitos', rmNoProbs:'Spintelės telpa ir nekliūna viena už kitos',
 rmHint:'Spintelę tempkite išilgai sienos ar į kitą sieną — ji prisitraukia prie sienos galo, kampo ar kaimynės. Spustelėkite spintelę — dešinėje pakeisite plotį, užpildysite tarpą, atidarysite redagavimą.',
 rmFromStart:'{x} mm nuo sienos pradžios', rmLeftRight:'kairėje {l} · dešinėje {r}', rmSnap_wall:'prie sienos galo', rmSnap_corner:'prie kampo', rmSnap_nb:'prie kaimynės',
 rmHit:'Kliūna už kitos spintelės', rmHitDrop:'Pastatyta, bet kliūna — patraukite arba pakeiskite plotį', rmDropAdd:'Paleiskite — pridėti čia', rmFitTo:'Tarpe telpa {w} mm — plotis bus {w} mm',
 rmMiss:'Paleiskite ant sienos', rmNo3dDrop:'Įtempti galima vaizduose „Iš priekio“ arba „Planas“', rmPlanLeg:'Planas iš viršaus · stora linija — spintelės priekis · punktyras — pakabinamos',
 rm3Leg:'3D · fasadai tamsesni · tempkite tuščią vietą — sukasi', rmUnplaced1:'Nuimta nuo sienos', rmAdded:'Pridėta spintelė {n}', rmDeleted:'Spintelė ištrinta',
 parts2:'Pertvaros', part0:'Nėra', part1:'1 pertvara', part2:'2 pertvaros', colWl:'plotis', colWnote:'Plotis — iki pertvaros vidurio. Paskutinė kolona gauna, kas lieka iki spintelės pločio.',
 colOne:'Spintelė', colL:'Kairė', colM:'Vidurinė', colR:'Dešinė', backOf:'Nugara', bHdf:'Plaušas', bSolid:'Kieta 18 mm', backMountL:'Kieta nugara montuojama',
 cmHint:'Paspauskite koloną, kad ją redaguotumėte.', cmEmpty:'tuščia', cmNoBack:'be nugaros', secRemoved:'Sekcija pašalinta', undoBtn:'Atšaukti', colEdit:'Redaguojama kolona', bTopOnlyAll:'„Ant galo“ — kai visose kolonose kieta nugara; kitaip kieta nugara montuojama kolonos viduje.', bPerCol:'Nugara pasirenkama kiekvienai kolonai (2 žingsnis „Sekcijos“).', jk_part:'Pertvara ↔ dugnas/viršus',
 n1:'Matmenys', n2:'Sekcijos', n3:'Konstrukcija', n4:'Operacijos', n5:'Medžiagos', n6:'Papildomos',
 toHome:'Visi projektai', prNew2:'Naujas projektas', autosaved:'išsaugota', autosaveT:'Viskas išsaugoma automatiškai šioje naršyklėje',
 npLead:'Įrašykite pavadinimą — jis bus CNC programų ir sąrašo failų pavadinimuose. Toliau pasirinksite pirmą spintelę.', npName:'Projekto pavadinimas', npPh:'pvz. VIRTUVE_JONAITIS', npCreate:'Sukurti projektą',
 npOr:'arba', npImport:'Įkelti iš pasiūlymo programos (.json)', npSample:'Atidaryti pavyzdį', npNeed:'Įrašykite projekto pavadinimą', npDone:'Sukurtas projektas {n}',
 prSearch:'Ieškoti projekto…', prOpenNow:'atidarytas', prUpdated:'keista', prDup:'Kopija', prDupT:'Sukurti šio projekto kopiją', prJsonT:'Atsisiųsti projekto failą (atsarginė kopija)', prDupDone:'Kopija sukurta',
 prNone2:'Projektų dar nėra — sukurkite pirmą viršuje.', prNoMatch:'Nieko nerasta.', prHint2:'Projektai išsaugomi automatiškai šioje naršyklėje. Atsarginei kopijai ar perkelti į kitą kompiuterį — „.json“.', prDeleted:'Projektas ištrintas',
 noName:'(be pavadinimo)', cabsN:'spint.', copySfx:'(kopija)', agoNow:'ką tik', agoMin:'prieš {n} min.', agoToday:'šiandien',
 firstCabQ:'Pirmoji spintelė — kokią kuriame?', stepsNav:'Spintelės žingsniai', stepNeed:'Reikia užpildyti',
 ckTitleOk:'Paruošta CNC', ckTitleBad:'Prieš siunčiant į CNC — pataisykite', ckFix:'Taisyti', ckName:'Neįrašytas projekto pavadinimas (jis bus failų pavadinimuose)', ckNameOk:'Projektas: <b>{n}</b>',
 ckMat:'Neįrašyta medžiaga — spintelės {c}', ckMatOk:'Medžiagos įrašytos', ckEdge:'Neįrašytas karkaso kraštas — spintelės {c}', ckErr:'Klaidų, dėl kurių dalis skylių negręžiama: {n} (žr. žemiau)', ckProg:'{p} detalės, {n} CNC programų',
 isoSides:'Šonai:', isoModeBoth:'Abu kartu', isoModeSep:'Atskirai', isoModeBothT:'Pakeitimas viename šone pakartojamas kitame (veidrodiškai)', isoModeSepT:'Keičiamas tik tas šonas, ant kurio tempiate',
 isoBoth:'abu šonai', isoBothNote:'Kairys ir dešinys šonai keičiasi kartu. Norėdami keisti tik vieną šoną, viršuje pasirinkite „Atskirai“.', isoDiffer:'šonai skiriasi',
 isoCopyToR:'Taip pat ir dešiniame', isoCopyToL:'Taip pat ir kairiame', isoCopied:'Abu šonai vienodi', isoL1:'K:', isoR1:'D:', isoResetT:'Abiem šonams — standartas', isoArmed:'Bakstelėkite jungties liniją — bus pridėta. Dar kartą bakstelėkite mygtuką — atšaukti.', isoMissTap:'Bakstelėkite tiksliau ant punktyrinės jungties linijos',
},
en:{
 app:'Cabinet creator', sub:'Dėdės Baldai · parts and CNC without the engineer',
 project:'Project', projPh:'PROJECT_CODE',
 tCab:'Cabinets', tRes:'Parts & CNC', tSet:'Settings', projects:'Projects',
 cabs:'Cabinets', newCab:'＋ New cabinet', dup:'Duplicate', del:'Delete', delSure:'Really delete?',
 pickTitle:'What are we building?', pickLead:'Pick the closest one — everything can be changed.', cancel:'Cancel',
 pDrawers:'Drawer cabinet', pDoors:'Door cabinet', pDrDoors:'Drawer + doors', pWall:'Wall cabinet', pTall:'Tall with oven', pDish:'Dishwasher front', pEmpty:'Empty (shelves)',
 s1:'Dimensions', s1l:'Outer carcass size in millimetres, without legs. You can type 600-18.',
 name:'Name', type:'Type', tBase:'Base', tWall:'Wall', tTall:'Tall', W:'Width', H:'Height', D:'Depth', thick:'Board', facT:'Front', dishW:'Dishwasher width',
 s2:'Sections', s2l:'Top of the list is the top of the cabinet. “Fill” takes the remaining height.',
 zone:'Front zone', used:'used', left:'left', over:'exceeded',
 kDrawers:'Drawers', kDoors:'Doors', kOpen:'Shelves', kOven:'Oven',
 secH:'Height', fill:'Fill', nDr:'Drawers', runner:'Runners', rail:'Runner length', nDoors:'Doors', split:'Layout', sSide:'Side by side', sStack:'Stacked',
 hinge:'Hinges', hside:'Hinge side', hsAuto:'Auto', hsL:'Left', hsR:'Right', shelves:'Shelves', adj:'Adjustable', fixed:'Fixed', sup:'Supports',
 add:'Add on top', up:'Up', down:'Down', rm:'Remove',
 s3:'Construction', s3l:'How the carcass is joined.',
 jConf:'Confirmats', jConfD:'Ø8 through + Ø5×32 in the edge. Rails and bottom fixed with confirmats.', jCam:'Cams + dowels', jCamD:'Ø15 cams in the side, Ø8 bolts and dowels. Assembled without glue.',
 top:'Top', topRails:'Rails', topFull:'Full top', topOver:'Top covers the fronts',
 back:'Back (18 mm)', bNone:'None', bTop:'On the back (screwed)', bIn:'Inside',
 jTitle:'Joints by part', jLead:'Each joint can have its own connector. Count — connectors along one end; from edge — distance of the outer ones from the part edge. Empty — standard.',
 jtConf:'Confirmats', jtCam:'Cams', jtDowel:'Dowels', jN:'Count', jE:'From edge', jAuto:'standard', jMain:'Main joinery', jMainL:'Used for every joint you have not changed.',
 jk_bottom:'Bottom ↔ sides', jk_top:'Top ↔ sides', jk_railF:'Front rail', jk_railB:'Back rail', jk_railV:'Standing back rail', jk_railBottom:'Bottom rail', jk_railVH:'Standing rail ↔ flat rail', jk_railBotB:'Bottom rail ↔ bottom', jk_back:'Back', jk_shelf:'Fixed shelves', jk_oven:'Oven supports',
 lgConf:'confirmat', lgCam:'cam', lgDowel:'dowel', xSideL:'left side, seen from the left', xSideR:'right side, seen from the right', sideL:'Left side', sideR:'Right side',
 rails:'Top rails', rFront:'Front', rBack:'Back', rBottom:'Bottom back', rBottomD:'standing rail on the bottom', rFlat:'Flat', rStand:'Standing', rBoth:'Flat + standing', rNone:'None', rW:'Rail width', rCount:'Rails',
 bFix:'Back fixing', bFixIn:'An inside back is fixed the same way as the carcass.', xsec:'Side section', xFront:'front', xBack:'back',
 tbMark:'Ø5 marks (screws)', tbHole:'Ø10 holes (needs a Ø10 drill)', oTbDm:'Front-fixing points marked Ø5 × 2 mm — screwed on. There is no Ø10 drill on the head.',
 s6:'Extra parts', s6l:'Parts that are not in the construction: plinth, cover panel, extra shelf… Cut only, no holes.',
 exName:'Name', exAdd:'Part', exNone:'No extra parts.', exEdges:'Edges', exPlinth:'Plinth',
 rotHint:'↻ — second program with the same face up, panel turned 90° counter-clockwise (the front edge becomes the left end).',
 setRails:'Rails and back', drillsTop:'Drills on the head (top), mm', drillsTopL:'From the Maestro configuration. Holes of a size not listed are not programmed.', tbHoleSet:'TANDEMBOX front hole (if Ø)', tbDef:'TANDEMBOX fronts',
 s4:'Extra operations', s4l:'Tick what the CNC should drill. “Verified” means it matches your SWOOD models.',
 oLegs:'Legs and their marks in the bottom', oLegsD:'4 marks Ø5 × 2 mm per leg. Add more legs for a wide or heavy cabinet.', legRow:'Legs in a row', fhTitle:'Front heights, mm', fhNote:'from the top · empty = shares what is left', fhEqual:'Equal', legParts:'Under partitions', legRows:'Rows', legRows2:'2 — front, back', legRows3:'3 — + middle', legTotal:'Legs in total', legFront:'front', legDense:'Too dense — less than 70 mm between legs',
 oRun:'Runner marks in the sides', oRunD:'Blum TANDEM / TANDEMBOX patterns at each drawer height.',
 oTb:'TANDEMBOX front fixing', oTbD:'Ø10 × 12 holes on the inside of the front.',
 oHinge:'Hinge holes', oHingeD:'Ø35 cup in the door + 2 plate marks in the side (Ø5 × 2, as the post-processor makes them). Blum catalogue values.',
 hfScrew:'Screw-on cup', hfPress:'Press-in (+2 × Ø8)',
 oPins:'Shelf support holes', oPinsD:'Ø5 holes in both sides under every adjustable shelf.',
 pinShelf:'Under the shelf only', pinRow:'Row ±2 at 32',
 notNeeded:'not needed for this cabinet', verified:'verified', unverified:'unverified',
 s5:'Materials and edges', s5l:'Names go to the part list and the nesting app.',
 mCarc:'Carcass', mFac:'Fronts', mBack:'Back', eCarc:'Carcass edge', eFac:'Front edge', legH:'Leg height',
 sketch:'Sketch', parts:'Parts', progs:'Programs', warns:'Notes', toRes:'Parts & CNC →',
 noCab:'No cabinets in this project yet.', firstCab:'Create the first cabinet',
 rTitle:'Part list and CNC programs', zipAll:'⤓ Everything (ZIP)', xlsm:'List .xlsm', csv:'List .csv', print:'Print list', json:'Project .json',
 zipNote:'ZIP: all .XXL programs, the .xlsm list for the nesting app (like a SWOOD report), a .csv and the project file.',
 cDet:'Part', cCab:'Cab.', cMat:'Material', cL:'Length', cW:'Width', cT:'Thk.', cQ:'Qty', cEdge:'Edges', cProg:'Programs',
 noProg:'no CNC', pick:'Pick a part to see its drawing and program.',
 lgA:'from top', lgB:'from below (2OP)', lgT:'through', lgM:'mark', lgE:'in edge', lgEb:'edgeband',
 copy:'Copy', copied:'Copied', hw:'Hardware', hwNote:'Quantities come from the construction — check before ordering.',
 allWarn:'Notes', none:'None',
 setTitle:'Settings', setLead:'Applies to every project in this browser.',
 tplTitle:'ReportLists template', tplLead:'The .xlsm list is filled into this template the same way the SolidWorks macro DB_PartList (v18) does: same sheets, labels, QR and pictures.',
 tplBuiltIn:'Built in: DB_PartList v18 report (DiG_Virtuve)', tplOwn:'Your template: ', tplUpload:'Load another report (.xlsm)', tplReset:'Back to built-in', tplBad:'This is not a ReportLists report — there are no PARTLIST and LABEL sheets.', tplOk:'Template changed', tplSession:'Template used for this session only (the browser would not store it).',
 rptFallback:'The ReportLists template could not be loaded (JSZip needs internet) — a plain list was made instead.', building:'Preparing…',
 setMats:'Material list', setEdges:'Edgeband list', setMatsL:'One per line — offered while filling in.',
 setTypes:'Default construction per type', setTypesL:'A new cabinet gets these by type. The workshop does not need to change them.',
 setOps:'Default operations', setRules:'Hinge and shelf hole dimensions',
 setRulesL:'Not verified against your SWOOD model. Check the first door and side, then correct here.',
 rCupE:'Cup centre from the door edge', rCupD:'Cup depth', rEnd:'Outer hinge from the door end', rPlF:'Plate from the side front', rPlS:'Plate hole spacing', rPlD:'Plate hole depth',
 rPinF:'Support from the side front', rPinB:'Support from the shelf back', rPinBelow:'Hole centre below the shelf', rPinD:'Support hole depth', rPitch:'Row pitch',
 resetRules:'Reset to catalogue values',
 prTitle:'Projects', prSave:'Save this project', prNew:'＋ New project', prOpen:'Open', prNone:'No saved projects.',
 prImport:'Import .json', prImportL:'A project from this creator or an export from the offer app — cabinets come across with sizes and sections.',
 prHint:'Projects are stored in this browser. For a backup use “Project .json”.',
 close:'Close', saved:'Saved', imported:'Cabinets imported: ', badFile:'Could not read the file — it is not a project JSON.',
 dlFail:'Download failed: ', dlDeclined:'Download cancelled', newConfirm:'Start new? Click again',
 errTag:'error', warnTag:'check', infoTag:'by hand',
 legs:'legs',
 isoTitle:'Joints in 3D', isoLead:'drag connectors onto the carcass', isoDrag:'Pick up a connector and drop it on a dashed joint line in the 3D view (or tap the card, then the line):', isoChipT:'Drag onto a dashed joint line in the 3D view, or tap it and then tap the line',
 isoT_confirmat:'Confirmat', isoT_cam:'Cam', isoT_dowel:'Dowel',
 isoRotL:'Turn 90° left', isoRotR:'Turn 90° right', isoHome:'Back to the front-left view', isoHomeS:'View', isoUndo:'Undo', isoUndone:'Undone',
 isoFront:'▼ FRONT', isoJoints:'Carcass joints', isoManual:'placed by hand', isoManualS:'by hand', isoEdit:'Edit in 3D',
 isoHint:'Drag a connector from the bar onto a line to add it. “Separately” — only the side you drag on changes. Drag a connector along its line to move it, far off the line to remove it. Dragging empty space turns the view. A selected connector moves with the arrow keys (Shift — 10 mm), Delete removes it.',
 isoRefFront:'from the front', isoRefBack:'from the back', isoRefRail:'from the rail bottom', isoRefBottom:'from the bottom top face', isoRefShelf:'from the shelf front', isoRefLeft:'from the left end', isoOneLine:'one joint', isoRefPartF:'from the rail front', isoRefPartR:'from the rail back',
 isoSnapMid:'centre', isoSnapSym:'symmetric', isoSnapStd:'standard',
 isoDropRemove:'Release to remove this connector', isoTooClose:'Too close to another connector (min. {n} mm)', isoTurn:'Turn the view — this line is seen end-on',
 isoSame:'Already this type — drop on an empty part of the line', isoConvert:'Release — the whole joint becomes: {t}', isoAdd:'Release to add a connector', isoAddConv:'Add; the whole joint becomes: {t}',
 isoMiss:'Release on a dashed joint line', isoRemoved:'Connector removed', isoRm:'Remove connector',
 isoPos:'Positions, mm', isoNone:'No connectors — this joint is not held.', isoAddBtn:'Add', isoEven:'Spread evenly',
 isoLen:'Joint length {w} mm · at least {e} mm from the edge, gap at least {g} mm.', isoCamDw:'Ø8 dowels next to the outer cams (±32) are added automatically.', isoMirror:'Left and right sides change together.',
 isoNoJ:'This cabinet has no carcass joints.',
 isoD_confirmat:'Screw through the side into the part edge. Ø8 through + Ø5×32. Strongest, the head shows.', isoD_cam:'A cam in the part, turned, pulls the bolt in the side tight. Ø15 + Ø8. Hidden, can be taken apart.', isoD_dowel:'Ø8 wooden dowel with glue — aligns and holds. Hidden, not taken apart.',
 isoGrab:'⠿ Drag onto a joint', isoTapLine:'Tap a joint line', isoFullOn:'Open the 3D view full screen', isoFullOff:'Close full screen (Esc)', isoFullOnS:'Full screen', isoFullOffS:'Close',
 xxlTitle:'CNC programs (.XXL)', xxlLead:'Every program can be downloaded on its own, without a ZIP. ↻ — turned program (5 mm holes in a long edge). The browser may ask whether to allow several downloads — allow it.',
 xxlAll:'⤓ All .XXL separately ({n})', xxlAllT:'Each program as its own file, no ZIP', xxlCab:'⤓ This cabinet ({n})', xxlPart:'⤓ All of this part ({n})', xxlOne:'Download', xxlRot:'turned', xxlSaving:'Downloading {n} files…',
 reqNote:'required — otherwise the part list has no material', tRoom:'Kitchen', rmTitle:'Whole kitchen', rmWall:'Wall', rmWalls:'Walls', rmVFront:'Front', rmVPlan:'Plan', rmAllWalls:'All walls',
 rm3Hint:'Drag to turn. Click a cabinet to select it.', rmAdd:'Add a cabinet', rmAddT:'Drag onto a wall (Front or Plan view) or click — it goes after the last one',
 rmUnplaced:'Not placed', rmPlace:'Place', rmX:'From the wall start', rmZ:'Bottom from the floor', rmHitShort:'Hits another cabinet or runs past the wall — move it or change the width.',
 rmFill:'Fill the gap: {w} mm', rmEdit:'Edit cabinet', rmDup:'Copy next to it', rmUnplace:'Take off the wall', rmKeys:'← → move 10 mm (Shift — 100 mm), Delete takes it off the wall.',
 rmUsed:'{u} mm used', rmWallDel:'Remove the last wall', rmWallDelDone:'Wall removed — its cabinets moved to “Not placed”', rmRoom:'Room',
 rmRoomL:'Walls run clockwise seen from above: A to the right, B down, C to the left, D up. One wall — a straight kitchen, two — L, three — U.',
 rmWallAdd:'Add a wall', rmWallZ:'Wall cabinets bottom from the floor', rmRoomH:'Room height', rmWorktop:'Show the worktop', rmProbs:'Check',
 rmProbOut:'Cabinet {a} runs past the wall end', rmProbHit:'Cabinets {a} and {b} hit each other', rmNoProbs:'Cabinets fit and do not hit each other',
 rmHint:'Drag a cabinet along a wall or to another wall — it snaps to the wall end, corner or neighbour. Click a cabinet to change its width, fill a gap or open it for editing on the right.',
 rmFromStart:'{x} mm from the wall start', rmLeftRight:'left {l} · right {r}', rmSnap_wall:'at the wall end', rmSnap_corner:'at the corner', rmSnap_nb:'at the neighbour',
 rmHit:'Hits another cabinet', rmHitDrop:'Placed, but it hits — move it or change the width', rmDropAdd:'Release to add here', rmFitTo:'The gap is {w} mm — width will be {w} mm',
 rmMiss:'Release on a wall', rmNo3dDrop:'Drop in the Front or Plan view', rmPlanLeg:'Plan from above · thick line — cabinet front · dashed — wall cabinets',
 rm3Leg:'3D · fronts darker · drag empty space to turn', rmUnplaced1:'Taken off the wall', rmAdded:'Cabinet {n} added', rmDeleted:'Cabinet deleted',
 parts2:'Partitions', part0:'None', part1:'1 partition', part2:'2 partitions', colWl:'width', colWnote:'Width — to the middle of the partition. The last column takes what is left of the cabinet width.',
 colOne:'Cabinet', colL:'Left', colM:'Middle', colR:'Right', backOf:'Back', bHdf:'Fibreboard', bSolid:'Solid 18 mm', backMountL:'Solid back mounted',
 cmHint:'Click a column to edit it.', cmEmpty:'empty', cmNoBack:'no back', secRemoved:'Section removed', undoBtn:'Undo', colEdit:'Editing column', bTopOnlyAll:'“On the back” — when every column has a solid back; otherwise a solid back goes inside its column.', bPerCol:'The back is chosen per column (step 2 “Sections”).', jk_part:'Partition ↔ bottom/top',
 n1:'Size', n2:'Sections', n3:'Construction', n4:'Operations', n5:'Materials', n6:'Extras',
 toHome:'All projects', prNew2:'New project', autosaved:'saved', autosaveT:'Everything is saved automatically in this browser',
 npLead:'Type a name — it goes into the CNC program and list file names. Next you pick the first cabinet.', npName:'Project name', npPh:'e.g. KITCHEN_SMITH', npCreate:'Create project',
 npOr:'or', npImport:'Import from the offer app (.json)', npSample:'Open the example', npNeed:'Type a project name', npDone:'Project {n} created',
 prSearch:'Search projects…', prOpenNow:'open', prUpdated:'changed', prDup:'Copy', prDupT:'Make a copy of this project', prJsonT:'Download the project file (backup)', prDupDone:'Copy made',
 prNone2:'No projects yet — create the first one above.', prNoMatch:'Nothing found.', prHint2:'Projects are saved automatically in this browser. For a backup or another computer — “.json”.', prDeleted:'Project deleted',
 noName:'(no name)', cabsN:'cab.', copySfx:'(copy)', agoNow:'just now', agoMin:'{n} min ago', agoToday:'today',
 firstCabQ:'First cabinet — what are we building?', stepsNav:'Cabinet steps', stepNeed:'Needs filling in',
 ckTitleOk:'Ready for CNC', ckTitleBad:'Before sending to CNC — fix these', ckFix:'Fix', ckName:'No project name (it goes into the file names)', ckNameOk:'Project: <b>{n}</b>',
 ckMat:'No material — cabinets {c}', ckMatOk:'Materials filled in', ckEdge:'No carcass edging — cabinets {c}', ckErr:'Errors that leave holes undrilled: {n} (see below)', ckProg:'{p} parts, {n} CNC programs',
 isoSides:'Sides:', isoModeBoth:'Both', isoModeSep:'Separately', isoModeBothT:'A change on one side is mirrored on the other', isoModeSepT:'Only the side you drag on changes',
 isoBoth:'both sides', isoBothNote:'Left and right sides change together. To change only one side, pick “Separately” above.', isoDiffer:'sides differ',
 isoCopyToR:'Same on the right', isoCopyToL:'Same on the left', isoCopied:'Both sides now match', isoL1:'L:', isoR1:'R:', isoResetT:'Standard on both sides', isoArmed:'Tap a joint line to add it there. Tap the button again to stop.', isoMissTap:'Tap closer to a dashed joint line',
}};
/* joints that come one per partition: labels for partitions 1–3 */
(function () {
  var L = { lt:{ partB:'Pertvara {n} ↔ dugnas', partT:'Pertvara {n} ↔ viršus', partF:'Pertvara {n} ↔ priekinė juosta', partR:'Pertvara {n} ↔ galinė juosta', backP:'Nugara ↔ pertvara {n}' },
            en:{ partB:'Partition {n} ↔ bottom', partT:'Partition {n} ↔ top', partF:'Partition {n} ↔ front rail', partR:'Partition {n} ↔ back rail', backP:'Back ↔ partition {n}' } };
  ['lt', 'en'].forEach(function (lg) { if (!T[lg]) return; for (var n = 1; n <= 3; n++) Object.keys(L[lg]).forEach(function (b) { T[lg]['jk_' + b + n] = L[lg][b].replace('{n}', n); }); });
})();
function t(k) { return (T[S.lang] && T[S.lang][k] !== undefined) ? T[S.lang][k] : (T.lt[k] !== undefined ? T.lt[k] : k); }

/* ----------------------------------------------------------------- helpers */
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function uid() { return Math.random().toString(36).slice(2, 9); }
/* numbers: decimal comma and simple maths like the offer app (600-18, 2*300) */
function num(v) {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  if (v == null || v === '') return 0;
  var s = String(v).replace(/\s+/g, '').replace(/,/g, '.');
  if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s);
  if (/^[\d.+\-*/()]+$/.test(s) && /\d/.test(s)) { try { var r = Function('"use strict";return (' + s.replace(/\b0+(\d)/g, '$1') + ')')(); if (typeof r === 'number' && isFinite(r)) return r; } catch (e) {} }
  var n = parseFloat(s); return isFinite(n) ? n : 0;
}
var fmt = function (v) { return E.num(Math.round(num(v) * 10) / 10); };
function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
function getPath(o, p) { return p.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
function setPath(o, p, v) { var ks = p.split('.'), last = ks.pop(); var tg = ks.reduce(function (a, k) { if (a[k] == null) a[k] = {}; return a[k]; }, o); tg[last] = v; }

/* ----------------------------------------------------------------- defaults */
var RULE_DEF = { hinge:clone(E.R.hinge), pins:clone(E.R.pins), drillsTop:E.R.drills.top.join(', '), tbHole:{ d:10, depth:12 } };
var TYPES = ['PASTATOMOS', 'PAKABINAMOS', 'ŪKINĖ'];
function defSettings() {
  return {
    materials:[], edges:[],
    types:{
      'PASTATOMOS':  { joinery:'confirmat', top:'rails', back:'none', backFix:'confirmat', topOverFacade:false, legs:true,  railFront:'h', railBack:'h', railBottom:false },
      'PAKABINAMOS': { joinery:'confirmat', top:'full',  back:'top',  backFix:'confirmat', topOverFacade:false, legs:false, railFront:'h', railBack:'h', railBottom:false },
      'ŪKINĖ':       { joinery:'confirmat', top:'full',  back:'top',  backFix:'cam',       topOverFacade:false, legs:true,  railFront:'h', railBack:'h', railBottom:false }
    },
    railW:100,
    ops:{ runnerMarks:true, tbFront:'mark', hinges:true, hingeFix:'screw', pins:'shelf' },
    rules:clone(RULE_DEF)
  };
}
function newSection(kind) {
  return { id:uid(), kind:kind, col:0, fill:kind !== 'drawers' && kind !== 'oven', height:kind === 'drawers' ? 540 : kind === 'oven' ? 595 : 400,
           nDrawers:3, hw:'BLUM TANDEMBOX', rail:500, nDoors:kind === 'doors' ? 2 : 1, hinge:'BLUM LANKSTAI', doorSplit:'v', hingeSide:'auto',
           shelves:kind === 'oven' ? 2 : kind === 'open' ? 2 : 1, shelfAdj:true, shelfMode:'even', shelfPos:[] };
}
/* ---- columns (pertvaros) and a back per column */
function colsOf(c) { return c.dishwasher ? 1 : Math.max(1, Math.min(3, Math.floor(num(c.cols) || 1))); }
function colOf(c, s) { return Math.min(colsOf(c) - 1, Math.max(0, Math.floor(num(s.col) || 0))); }
function colWidths(c) {   // outer widths (to partition centres), last one takes the rest
  var n = colsOf(c), W = num(c.W), w = Array.isArray(c.colW) && c.colW.length === n ? c.colW.map(num) : null;
  if (!w || w.slice(0, n - 1).some(function (v) { return !(v > 0); })) { w = []; for (var k = 0; k < n; k++) w.push(Math.round(W / n)); }
  var rest = W - w.slice(0, n - 1).reduce(function (a, b) { return a + b; }, 0); w[n - 1] = rest;
  return w;
}
function legacyBack(cnc) { return !cnc.back || cnc.back === 'none' ? 'none' : 'solid'; }
function fixCols(c) {   // keep colW / backs / section columns consistent with the column count
  var n = colsOf(c); c.cols = n; c.colW = n > 1 ? colWidths(c) : [];
  var b = Array.isArray(c.cnc.backs) ? c.cnc.backs.slice(0, n) : [];
  while (b.length < n) b.push(b.length ? b[b.length - 1] : legacyBack(c.cnc));
  c.cnc.backs = b; if (!c.cnc.backMount) c.cnc.backMount = c.cnc.back === 'inside' ? 'inside' : 'top';
  c.sections.forEach(function (s) { s.col = colOf(c, s); });
}
function colName(n, k) { return n === 1 ? t('colOne') : k === 0 ? t('colL') : k === n - 1 ? t('colR') : t('colM'); }
function cncFor(type) {
  var ty = S.settings.types[type] || S.settings.types.PASTATOMOS, op = S.settings.ops;
  return { joinery:ty.joinery, top:ty.top, back:ty.back, backFix:ty.backFix || 'confirmat', topOverFacade:!!ty.topOverFacade, legs:!!ty.legs, facadeT:18,
           rails:{ front:ty.railFront || 'h', back:ty.railBack || 'h', bottom:!!ty.railBottom }, railW:num(S.settings.railW) || 100, joints:{},
           runnerMarks:op.runnerMarks, tbFront:op.tbFront, hinges:op.hinges, hingeFix:op.hingeFix, pins:op.pins,
           backs:[!ty.back || ty.back === 'none' ? 'none' : 'solid'], backMount:ty.back === 'inside' ? 'inside' : 'top' };
}
function newCabinet(type) {
  var last = S.proj.cabinets[S.proj.cabinets.length - 1];
  return { id:uid(), name:'', type:type || 'PASTATOMOS', W:600, H:720, D:560, thick:18, cols:1, colW:[], dishwasher:false, dishWidth:600, legH:100,
           mat:last ? clone(last.mat) : { carc:'', facade:'', back:'' }, edge:last ? clone(last.edge) : { carc:'', facade:'' },
           cnc:cncFor(type || 'PASTATOMOS'), sections:[], extras:[] };
}
var PRESETS = [
  { k:'pDrawers', type:'PASTATOMOS', W:600, H:720, D:560, secs:[['drawers', { fill:true, nDrawers:3 }]] },
  { k:'pDoors',   type:'PASTATOMOS', W:600, H:720, D:560, secs:[['doors', { fill:true, nDoors:2, shelves:1 }]] },
  { k:'pDrDoors', type:'PASTATOMOS', W:600, H:720, D:560, secs:[['doors', { fill:true, nDoors:2, shelves:1 }], ['drawers', { fill:false, height:180, nDrawers:1 }]] },
  { k:'pWall',    type:'PAKABINAMOS', W:600, H:720, D:330, secs:[['doors', { fill:true, nDoors:2, shelves:2 }]] },
  { k:'pTall',    type:'ŪKINĖ', W:600, H:2100, D:580, secs:[['drawers', { fill:false, height:560, nDrawers:2 }], ['oven', { fill:false, height:595, shelves:2 }], ['doors', { fill:true, nDoors:1, shelves:2, hingeSide:'right' }]] },
  { k:'pDish',    type:'PASTATOMOS', W:600, H:720, D:560, dish:true, secs:[] },
  { k:'pEmpty',   type:'PASTATOMOS', W:600, H:720, D:560, secs:[['open', { fill:true, shelves:2 }]] }
];
function fromPreset(pr) {
  var c = newCabinet(pr.type); c.W = pr.W; c.H = pr.H; c.D = pr.D; c.dishWidth = pr.W;
  if (pr.dish) { c.dishwasher = true; c.name = S.lang === 'lt' ? 'Indaplovė' : 'Dishwasher'; }
  c.sections = pr.secs.map(function (s) { return Object.assign(newSection(s[0]), s[1]); });
  return c;
}

/* ----------------------------------------------------------------- state */
var S = {
  lang:(store('dbKurejas.lang') || 'lt'), tab:'cab', sel:0, picking:false, part:null, ptab:0, drawer:false, confirm:null,
  settings:Object.assign(defSettings(), store('dbKurejas.settings') || {}),
  proj:store('dbKurejas.current') || null
};
(function normSettings() { var d = defSettings(), s = S.settings;
  s.types = Object.assign(d.types, s.types || {}); TYPES.forEach(function (k) { s.types[k] = Object.assign(defSettings().types[k], s.types[k] || {}); });
  s.ops = Object.assign(d.ops, s.ops || {}); if (typeof s.ops.tbFront === 'boolean') s.ops.tbFront = s.ops.tbFront ? 'mark' : 'off';
  var sr = s.rules || {};
  s.rules = { hinge:Object.assign(clone(RULE_DEF.hinge), sr.hinge || {}), pins:Object.assign(clone(RULE_DEF.pins), sr.pins || {}),
              drillsTop:sr.drillsTop || RULE_DEF.drillsTop, tbHole:Object.assign(clone(RULE_DEF.tbHole), sr.tbHole || {}) };
  delete s.rules.hinge.plateDepth; s.rules.hinge.plateDepth = RULE_DEF.hinge.plateDepth;   // plate holes are markings now (post: Ø5 × 2), not a setting
  if (!(num(s.railW) > 0)) s.railW = 100;
  s.materials = s.materials || []; s.edges = s.edges || []; })();
function drillList(txt) { return String(txt || '').split(/[^\d.]+/).map(num).filter(function (v) { return v > 0; }); }
function applyRules() {
  var r = S.settings.rules, tb = { d:num(r.tbHole.d) || 10, depth:num(r.tbHole.depth) || 12 };
  E.setRules({ hinge:clone(RULE_DEF.hinge), pins:clone(RULE_DEF.pins), drills:{ top:drillList(RULE_DEF.drillsTop) }, runner:{ 'BLUM TANDEMBOX':{ facade:{ d:10, depth:12 } } } });
  E.setRules({ hinge:r.hinge, pins:r.pins, drills:{ top:drillList(r.drillsTop).length ? drillList(r.drillsTop) : drillList(RULE_DEF.drillsTop) }, runner:{ 'BLUM TANDEMBOX':{ facade:tb } } });
}
applyRules();
function normCab(c) {
  var d = { id:uid(), name:'', type:'PASTATOMOS', W:600, H:720, D:560, thick:18, cols:1, colW:[], dishwasher:false, dishWidth:600, legH:100, mat:{ carc:'', facade:'', back:'' }, edge:{ carc:'', facade:'' }, sections:[] };
  c = Object.assign(d, c); var base = cncFor(c.type), had = c.cnc || {};
  c.cnc = Object.assign(base, had);
  if (typeof had.tbFront === 'boolean') c.cnc.tbFront = had.tbFront ? S.settings.ops.tbFront : 'off';
  c.cnc.rails = Object.assign(base.rails, had.rails || {});
  c.extras = Array.isArray(c.extras) ? c.extras : [];
  c.cnc.joints = (c.cnc.joints && typeof c.cnc.joints === 'object') ? c.cnc.joints : {};
  c.sections = (c.sections || []).map(function (s) { return Object.assign(newSection(s.kind || 'doors'), s); });
  fixCols(c);
  return c;
}
function sample() {   // first run: a realistic small project so the tool opens working
  var p = { app:'db-kurejas', v:1, id:uid(), name:'PAVYZDYS', cabinets:[] }; S.proj = p;
  var a = fromPreset(PRESETS[0]); a.name = 'Stalčiai'; p.cabinets.push(a);
  var b = fromPreset(PRESETS[2]); b.name = 'Kriauklė'; p.cabinets.push(b);
  var c = fromPreset(PRESETS[3]); c.name = 'Viršutinė'; p.cabinets.push(c);
  p.cabinets.forEach(function (k) { k.mat = { carc:'LMDP balta 18 (pavyzdys)', facade:'LMDP antracitas 18 (pavyzdys)', back:'LMDP balta 18 (pavyzdys)' }; k.edge = { carc:'ABS balta 0.8 (pavyzdys)', facade:'ABS antracitas 1 (pavyzdys)' }; });
  return p;
}
(function migrate() {   // older versions: a separate 'saved projects' list and one current project → one library
  if (store('dbKurejas.lib')) return;
  var l = [], seen = {};
  var add = function (p, when) { if (!p || !Array.isArray(p.cabinets)) return; p.id = p.id || uid(); if (seen[p.id]) return; seen[p.id] = 1; p.updated = p.updated || when || new Date().toISOString(); l.push(libRec(p)); };
  add(S.proj); (store('dbKurejas.projects') || []).forEach(function (r) { add(r.data, r.saved); });
  libSet(l);
})();
if (!S.proj || !Array.isArray(S.proj.cabinets)) { S.proj = null; S.home = true; }
else { S.proj.cabinets = S.proj.cabinets.map(normCab); S.home = false; }
/* ---- projects: every project is kept in the library and saved automatically; 'dbKurejas.current' is the open one */
function lib() { var l = store('dbKurejas.lib'); return Array.isArray(l) ? l : []; }
function libSet(l) { store('dbKurejas.lib', l); }
function libRec(p) { return { id:p.id, name:p.name || '', updated:p.updated || new Date().toISOString(), n:(p.cabinets || []).length, data:clone(p) }; }
var libTimer = null;
function libSave() { if (!S.proj) return; var p = S.proj; libSet([libRec(p)].concat(lib().filter(function (r) { return r.id !== p.id; }))); }
function save() {
  if (!S.proj) return;
  S.proj.updated = new Date().toISOString();
  store('dbKurejas.current', S.proj);
  clearTimeout(libTimer); libTimer = setTimeout(libSave, 250);
  var sv = document.getElementById('saved'); if (sv) { sv.classList.remove('flash'); void sv.offsetWidth; sv.classList.add('flash'); }
}
function openProject(p) {
  S.proj = clone(p); S.proj.id = S.proj.id || uid(); S.proj.cabinets = (S.proj.cabinets || []).map(normCab);
  S.home = false; S.tab = 'cab'; S.sel = 0; S.part = null; S.iso = null; S.undo = []; S.roomUndo = []; S.roomSel = null; S.picking = !S.proj.cabinets.length; S.confirm = null;
  store('dbKurejas.current', S.proj); window.scrollTo(0, 0);
}
function newProject(name) { openProject({ app:'db-kurejas', v:1, id:uid(), name:name, cabinets:[], updated:new Date().toISOString() }); libSave(); }
(function () { var tp = store('dbKurejas.reportTpl'); if (tp && tp.b64) { S.tplB64 = tp.b64; S.tplName = tp.name; } })();
function b64ToBytes(b64) { var bin = atob(b64), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
function bytesToB64(u) { var s = '', CH = 0x8000; for (var i = 0; i < u.length; i += CH) s += String.fromCharCode.apply(null, u.subarray(i, i + CH)); return btoa(s); }
function loadTemplateFile(file) {
  if (!file) return;
  var rd = new FileReader();
  rd.onload = function () {
    var u = new Uint8Array(rd.result);
    if (!window.JSZip) { toast(t('rptFallback'), true); return; }
    window.JSZip.loadAsync(u).then(function (z) { return z.file('xl/workbook.xml').async('string'); }).then(function (wb) {
      if (!/name="PARTLIST"/.test(wb) || !/name="LABEL"/.test(wb)) { toast(t('tplBad'), true); return; }
      S.tplB64 = bytesToB64(u); S.tplName = file.name;
      var ok = true; try { localStorage.setItem('dbKurejas.reportTpl', JSON.stringify({ name:file.name, b64:S.tplB64 })); } catch (e) { ok = false; }
      toast(ok ? t('tplOk') : t('tplSession')); render();
    }).catch(function () { toast(t('tplBad'), true); });
  };
  rd.readAsArrayBuffer(file);
}
function cur() { return S.proj ? S.proj.cabinets[S.sel] : null; }

/* ----------------------------------------------------------------- engine bridge */
function projName() { return E.safeName(S.proj.name || 'PROJEKTAS') || 'PROJEKTAS'; }
function engineDef(c) {
  var d = clone(c);
  ['W', 'H', 'D', 'thick', 'dishWidth', 'legH'].forEach(function (k) { d[k] = num(d[k]); });
  if (d.dishwasher) d.W = d.dishWidth || d.W;
  d.cnc.facadeT = num(d.cnc.facadeT) || 18;
  d.sections.forEach(function (s) { ['height', 'nDrawers', 'rail', 'nDoors', 'shelves'].forEach(function (k) { s[k] = num(s[k]); }); s.shelfPos = (s.shelfPos || []).map(num); });
  d.cols = colsOf(c); d.colW = d.cols > 1 ? colWidths(c) : [];
  return d;
}
function buildOne(i) {
  var c = S.proj.cabinets[i], r = E.buildCabinet(engineDef(c), i, projName());
  var w = r.warnings.slice(), nProg = 0;
  r.panels.forEach(function (p) { var pr = E.programs(p); nProg += pr.files.length; pr.warnings.forEach(function (x) { var m = p.short + ': ' + (x.indexOf(p.name + ': ') === 0 ? x.slice(p.name.length + 2) : x); if (w.indexOf(m) < 0) w.push(m); }); });
  return { r:r, warnings:dedupe(w), nProg:nProg };
}
function dedupe(list) {   // the same note on several panels → one line with the panel names
  var m = {}, order = [];
  list.forEach(function (x) { var k = x.replace(/^[^:]+: /, ''); var who = x === k ? '' : x.slice(0, x.length - k.length - 2); if (!m[k]) { m[k] = []; order.push(k); } if (who && m[k].indexOf(who) < 0) m[k].push(who); });
  return order.map(function (k) { return (m[k].length ? m[k].join(', ') + ': ' : '') + k; });
}
function level(w) {
  if (/NEPROGRAMUOTA|didesnė už|netinkami|praleista|nepalaikom|nepridėtos|ne prie šono|negali būti gręžiamos|netelpa|nesurištas|persidengia|susitinka|nepritvirtinta/i.test(w)) return 'bad';
  if (/NEPATIKRINTA|nepatikrintos|patikrinti|perkeltas|patikrinkite|šablono nėra|patenka į|prispaudimą/i.test(w)) return 'warn';
  return 'info';
}
function buildProjectAll() {
  var loose = [];
  S.proj.cabinets.forEach(function (c, i) { (c.extras || []).forEach(function (x) {
    if (!(num(x.L) > 0 && num(x.W) > 0)) return;
    var em = x.edgeMat || (x.mat && x.mat === c.mat.facade ? c.edge.facade : c.edge.carc) || '';
    loose.push({ name:x.name || 'DETALE', cab:i + 1, mat:x.mat || c.mat.carc || '', L:num(x.L), W:num(x.W), T:num(x.T) || num(c.thick) || 18, qty:Math.max(1, Math.round(num(x.qty) || 1)),
                 eb:{ eb1:x.e1 ? em : '', eb2:x.e2 ? em : '', eb3:x.e3 ? em : '', eb4:x.e4 ? em : '' } });
  }); });
  return X.buildProject({ cabinets:S.proj.cabinets.map(function (c, i) { return { nr:i + 1, def:engineDef(c) }; }), loose:loose }, { project:projName(), date:new Date().toISOString().slice(0, 10) });
}

/* ----------------------------------------------------------------- icons (simple line pictograms) */
function ico(kind) {
  var st = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"';
  var box = '<rect x="8" y="6" width="38" height="42" rx="1.5" ' + st + '/>';
  var hd = function (y) { return '<line x1="22" y1="' + y + '" x2="32" y2="' + y + '" ' + st + '/>'; };
  var m = {
    pDrawers:box + '<line x1="8" y1="20" x2="46" y2="20" ' + st + '/><line x1="8" y1="34" x2="46" y2="34" ' + st + '/>' + hd(13) + hd(27) + hd(41),
    pDoors:box + '<line x1="27" y1="6" x2="27" y2="48" ' + st + '/><line x1="23" y1="22" x2="23" y2="32" ' + st + '/><line x1="31" y1="22" x2="31" y2="32" ' + st + '/>',
    pDrDoors:box + '<line x1="8" y1="17" x2="46" y2="17" ' + st + '/><line x1="27" y1="17" x2="27" y2="48" ' + st + '/>' + hd(11.5),
    pWall:'<rect x="8" y="10" width="38" height="28" rx="1.5" ' + st + '/><line x1="27" y1="10" x2="27" y2="38" ' + st + '/><line x1="4" y1="6" x2="50" y2="6" ' + st + ' stroke-dasharray="3 3"/>',
    pTall:'<rect x="15" y="2" width="24" height="50" rx="1.5" ' + st + '/><rect x="18" y="20" width="18" height="14" ' + st + '/><line x1="15" y1="38" x2="39" y2="38" ' + st + '/><line x1="15" y1="45" x2="39" y2="45" ' + st + '/>',
    pDish:box + '<line x1="14" y1="12" x2="40" y2="12" ' + st + '/><circle cx="18" cy="9" r="0.5" ' + st + '/>',
    pEmpty:box + '<line x1="8" y1="20" x2="46" y2="20" ' + st + '/><line x1="8" y1="34" x2="46" y2="34" ' + st + '/>',
    conf:'<rect x="4" y="22" width="36" height="9" ' + st + '/><rect x="31" y="4" width="9" height="36" ' + st + '/><line x1="35.5" y1="2" x2="35.5" y2="30" stroke="currentColor" stroke-width="3"/>',
    cam:'<rect x="4" y="22" width="36" height="9" ' + st + '/><rect x="31" y="4" width="9" height="36" ' + st + '/><circle cx="35.5" cy="26.5" r="5" ' + st + '/><line x1="14" y1="26.5" x2="31" y2="26.5" stroke="currentColor" stroke-width="2.5"/>'
  };
  return '<svg viewBox="0 0 54 54" aria-hidden="true">' + (m[kind] || '') + '</svg>';
}

/* ----------------------------------------------------------------- render: shell */
var app = document.getElementById('app');
function langBtns() { return '<span class="lang"><button data-act="lang" data-v="lt" class="' + (S.lang === 'lt' ? 'on' : '') + '">LT</button><button data-act="lang" data-v="en" class="' + (S.lang === 'en' ? 'on' : '') + '">EN</button></span>'; }
function render() {
  if (!S.proj) S.home = true;
  if (S.home) {
    app.innerHTML = '<header class="top"><div class="wrap"><div class="brand"><div class="logo">DB</div><div><h1>' + t('app') + '</h1><div class="sub">' + t('sub') + '</div></div></div>' +
      '<div class="hbtns">' + langBtns() + '</div></div></header><main class="wrap">' + viewHome() + '</main>';
    if (S.focusNew) { S.focusNew = false; var nf = document.getElementById('np-name'); if (nf) { nf.focus(); nf.select(); } }
    return;
  }
  var pj = null, cabInfo = S.proj.cabinets.map(function (c, i) { return buildOne(i); });
  S._info = cabInfo;
  var nParts = cabInfo.reduce(function (a, x) { return a + x.r.panels.length; }, 0);
  var h = '<header class="top"><div class="wrap">' +
    '<button class="brand brandbtn" data-act="home" title="' + t('toHome') + '"><div class="logo">DB</div><div><h1>' + t('app') + '</h1><div class="sub">' + t('sub') + '</div></div></button>' +
    '<button class="btn projbtn" data-act="home" title="' + t('toHome') + '">☰ ' + t('projects') + '</button>' +
    '<label class="projname"><span class="unit">' + t('project') + '</span><input id="projname" type="text" data-bind="p.name" value="' + esc(S.proj.name) + '" placeholder="' + t('projPh') + '" autocomplete="off"' + (S.proj.name ? '' : ' aria-invalid="true"') + '><span class="saved" id="saved" title="' + t('autosaveT') + '">✓ ' + t('autosaved') + '</span></label>' +
    '<nav class="tabs" aria-label="tabs">' +
      tabBtn('cab', t('tCab'), S.proj.cabinets.length) + tabBtn('room', t('tRoom')) + tabBtn('res', t('tRes'), nParts) + tabBtn('set', t('tSet')) + '</nav>' +
    '<div class="hbtns"><button class="btn newbtn" data-act="pnew">＋ ' + t('prNew2') + '</button>' + langBtns() + '</div>' +
    '</div></header><main class="wrap">';
  if (S.tab === 'cab') h += viewCab(cabInfo);
  else if (S.tab === 'res') h += viewRes(buildProjectAll());
  else if (S.tab === 'room') h += '<div class="room" id="room"></div>';
  else h += viewSet();
  h += '</main><datalist id="dl-mat">' + listOpts('mat') + '</datalist><datalist id="dl-edge">' + listOpts('edge') + '</datalist>';
  var fx = document.activeElement && document.activeElement.id, ss = fx && document.activeElement.selectionStart;
  app.innerHTML = h;
  mountIso(); mountRoom();
  if (fx) { var el = document.getElementById(fx); if (el) { el.focus(); try { if (ss != null) el.setSelectionRange(ss, ss); } catch (e) {} } }
}
function tabBtn(k, label, cnt) { return '<button data-act="tab" data-v="' + k + '" class="' + (S.tab === k ? 'on' : '') + '">' + label + (cnt != null ? '<span class="cnt">' + cnt + '</span>' : '') + '</button>'; }
function listOpts(kind) {
  var set = {}, add = function (v) { if (v) set[v] = 1; };
  (kind === 'mat' ? S.settings.materials : S.settings.edges).forEach(add);
  S.proj.cabinets.forEach(function (c) { if (kind === 'mat') { add(c.mat.carc); add(c.mat.facade); add(c.mat.back); } else { add(c.edge.carc); add(c.edge.facade); } });
  return Object.keys(set).map(function (v) { return '<option value="' + esc(v) + '">'; }).join('');
}

/* ----------------------------------------------------------------- render: cabinets tab */
function viewCab(info) {
  var cabs = S.proj.cabinets;
  var rail = '<aside class="rail"><h2>' + t('cabs') + '</h2><div class="cablist">' + cabs.map(function (c, i) {
    var lv = info[i].warnings.map(level), dot = lv.indexOf('bad') >= 0 ? '<span class="dot bad"></span>' : lv.indexOf('warn') >= 0 ? '<span class="dot warn"></span>' : '';
    return '<button class="cab' + (i === S.sel && !S.picking ? ' on' : '') + '" data-act="sel" data-i="' + i + '"><span class="nr">' + (i + 1) + '</span><span><b>' + esc(c.name || typeName(c)) + dot + '</b><small>' +
      fmt(c.dishwasher ? c.dishWidth : c.W) + '×' + fmt(c.H) + '×' + fmt(c.D) + '</small></span></button>';
  }).join('') + '</div><button class="btn pri" data-act="pick">' + t('newCab') + '</button></aside>';
  if (S.picking || !cabs.length) return '<div class="ws">' + rail + '<section class="editor" style="grid-column:span 2">' + viewPick() + '</section></div>';
  var c = cur(), inf = info[S.sel];
  return '<div class="ws">' + rail + '<section class="editor">' + stepNav(c, inf) + viewEditor(c) + '</section>' + viewSheet(c, inf) + '</div>';
}
/* where am I / what is left: the steps of this cabinet, with a mark where something needs attention */
function needsMats(c) { if (c.dishwasher) return !c.mat.facade; return !c.mat.carc || (c.sections.some(function (s) { return s.kind === 'drawers' || s.kind === 'doors'; }) && !c.mat.facade); }
function stepNav(c, inf) {
  var z = c.dishwasher ? null : zoneInfo(c), bad = inf.warnings.some(function (w) { return level(w) === 'bad'; });
  var st = c.dishwasher ? [['dims', 1, t('n1')], ['mats', 2, t('n5'), needsMats(c)]]
    : [['dims', 1, t('n1')], ['secs', 2, t('n2'), z.over || !c.sections.length], ['constr', 3, t('n3'), bad], ['ops', 4, t('n4')], ['mats', 5, t('n5'), needsMats(c)], ['extra', 6, t('n6')]];
  return '<nav class="stepnav" aria-label="' + t('stepsNav') + '">' + st.map(function (x, i) {
    return '<button type="button" class="' + (i === 0 ? 'on' : '') + (x[3] ? ' need' : '') + '" data-act="goto" data-v="st-' + x[0] + '"' + (x[3] ? ' title="' + t('stepNeed') + '"' : '') + '><span class="sn">' + x[1] + '</span><span class="sl">' + esc(x[2]) + '</span>' + (x[3] ? '<i class="sdot" aria-label="' + t('stepNeed') + '"></i>' : '') + '</button>';
  }).join('') + '</nav>';
}
function gotoStep(id) {
  var el = document.getElementById(id); if (!el) return;
  var nav = document.querySelector('.stepnav'), top = document.querySelector('.top');
  var off = (top && getComputedStyle(top).position === 'sticky' ? top.offsetHeight : 0) + (nav ? nav.offsetHeight : 0) + 12;
  window.scrollTo({ top:el.getBoundingClientRect().top + window.scrollY - off, behavior:'smooth' });
  S.gotoAt = Date.now();   // keep the clicked step lit while the page scrolls (the last steps may not reach the top)
  if (nav) nav.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-v') === id); });
}
window.addEventListener('scroll', function () {   // highlight the step being read
  var nav = document.querySelector('.stepnav'); if (!nav || Date.now() - (S.gotoAt || 0) < 1200) return;
  var bs = nav.querySelectorAll('button'), y = (document.querySelector('.top') || {}).offsetHeight + nav.offsetHeight + 40, act = 0;
  bs.forEach(function (b, i) { var el = document.getElementById(b.getAttribute('data-v')); if (el && el.getBoundingClientRect().top < y) act = i; });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) act = bs.length - 1;
  bs.forEach(function (b, i) { b.classList.toggle('on', i === act); });
}, { passive:true });
function typeName(c) { return c.dishwasher ? t('pDish') : ({ 'PASTATOMOS':t('tBase'), 'PAKABINAMOS':t('tWall'), 'ŪKINĖ':t('tTall') })[c.type] || c.type; }
function viewPick() {
  return '<div class="card"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:12px"><div><h3 style="margin:0;font:600 24px var(--f-display)">' + (S.proj.cabinets.length ? t('pickTitle') : t('firstCabQ')) + '</h3><p class="note" style="margin:2px 0 0">' + t('pickLead') + '</p></div>' +
    (S.proj.cabinets.length ? '<button class="btn ghost" data-act="unpick">' + t('cancel') + '</button>' : '') + '</div><div class="presets">' +
    PRESETS.map(function (p, i) { return '<button class="preset" data-act="preset" data-i="' + i + '">' + ico(p.k) + '<b>' + t(p.k) + '</b><small>' + p.W + '×' + p.H + '×' + p.D + '</small></button>'; }).join('') + '</div></div>';
}
function fN(label, bind, val, cls) { var id = 'f-' + bind.replace(/\./g, '-'); return '<label class="f n ' + (cls || '') + '" for="' + id + '"><span>' + label + '</span><input id="' + id + '" inputmode="decimal" type="text" data-bind="' + bind + '" data-num="1" value="' + esc(val) + '" autocomplete="off"></label>'; }
function fT(label, bind, val, list, cls) { var id = 'f-' + bind.replace(/\./g, '-'); return '<label class="f ' + (cls || 'grow') + '" for="' + id + '"><span>' + label + '</span><input id="' + id + '" type="text" data-bind="' + bind + '" value="' + esc(val) + '"' + (list ? ' list="' + list + '"' : '') + ' autocomplete="off"></label>'; }
function fS(label, bind, val, opts) { var id = 'f-' + bind.replace(/\./g, '-'); return '<label class="f" for="' + id + '"><span>' + label + '</span><select id="' + id + '" data-bind="' + bind + '">' + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(val) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>'; }
function segI(bind, val, opts) { var sym = ISO && ISO.sym ? ISO.sym : function () { return ''; }; return seg(bind, val, opts).replace(/(data-v="(confirmat|cam|dowel)"[^>]*>)/g, function (m, a, ty) { return a + sym(ty); }); }
function seg(bind, val, opts) { return '<div class="seg" role="group">' + opts.map(function (o) { return '<button type="button" data-act="set" data-bind="' + bind + '" data-v="' + esc(o[0]) + '" class="' + (String(val) === String(o[0]) ? 'on' : '') + '" aria-pressed="' + (String(val) === String(o[0])) + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>'; }
function chk(bind, val, label) { var id = 'f-' + bind.replace(/\./g, '-'); return '<label class="chk" for="' + id + '"><input id="' + id + '" type="checkbox" data-bind="' + bind + '"' + (val ? ' checked' : '') + '>' + label + '</label>'; }
function step(no, title, lead, body, key) { return '<div class="card step"' + (key ? ' id="st-' + key + '"' : '') + '><div class="no">' + no + '</div><div><h3>' + title + '</h3>' + (lead ? '<p class="lead">' + lead + '</p>' : '') + body + '</div></div>'; }

function zoneInfo(c, col) {
  var o = c.cnc, H = num(c.H), t_ = num(c.thick) || 18, topFull = o.top === 'full';
  var Hz = H - (topFull && o.topOverFacade ? t_ : (topFull ? 0 : E.R.facade.zoneGapRails));
  var exp = 0, nFill = 0; c.sections.forEach(function (s) { if (col != null && colOf(c, s) !== col) return; if (s.fill) nFill++; else exp += Math.max(0, num(s.height)); });
  return { Hz:Hz, exp:exp, nFill:nFill, fillH:nFill ? Math.max(0, Hz - exp) / nFill : 0, over:exp > Hz + 0.5 };
}
function activeCol(c) { var n = colsOf(c); return Math.min(n - 1, Math.max(0, S.colSel || 0)); }
/* front view of the cabinet, drawn from its real parts (DBFront): click a column to edit it */
function colMapInner(c) {
  var nC = colsOf(c), cw = colWidths(c), ac = activeCol(c), bs = c.cnc.backs || [], inf = S._info && S._info[S.sel], r = inf && inf.r;
  var W = num(c.W), H = num(c.H), t_ = num(c.thick) || 18, bnd = [0]; cw.forEach(function (w, k) { bnd.push(bnd[k] + w); }); bnd[nC] = W;
  var over = [], ovens = [];
  for (var k = 0; k < nC; k++) {
    var z = zoneInfo(c, k), zc = 0, x0 = k === 0 ? t_ : bnd[k] + t_ / 2, x1 = k === nC - 1 ? W - t_ : bnd[k + 1] - t_ / 2; over.push(z.over);
    c.sections.forEach(function (s) { if (colOf(c, s) !== k) return; var h = s.fill ? z.fillH : num(s.height); if (s.kind === 'oven') ovens.push({ x0:x0, x1:x1, z0:Math.max(zc, t_), z1:Math.min(zc + h, H - t_) }); zc += h; });
  }
  var legH = c.cnc.legs ? num(c.legH) || 100 : 0, ratio = W / (H + legH + 14);
  var art = r && window.DBFront ? window.DBFront.svg(c, r, { bnd:bnd, sel:ac, over:over, ovens:ovens, legs:!!c.cnc.legs, legH:legH, type:c.type, label:t('colEdit') }) : '';
  var row = function (fn, cls) { return '<div class="fr-row ' + cls + '">' + cw.map(function (w, k) { return fn(w, k); }).join('') + '</div>'; };
  return '<div class="fr-wrap" style="width:clamp(240px,' + Math.round(340 * ratio) + 'px,100%)">' +
    (nC < 2 ? '' : row(function (w, k) { return '<button type="button" role="tab" class="fr-tab' + (k === ac ? ' on' : '') + (over[k] ? ' over' : '') + '" style="flex:' + w.toFixed(0) + ' 1 0" data-act="colsel" data-v="' + k + '" aria-selected="' + (k === ac) + '"><b>' + colName(nC, k) + '</b><span>' + fmt(w) + '</span></button>'; }, 'fr-tabs')) +
    '<div class="fr-stage">' + art + '</div>' +
    row(function (w, k) { var bk = bs[k] || 'none'; return '<span class="fr-back b-' + bk + (k === ac && nC > 1 ? ' on' : '') + '" style="flex:' + w.toFixed(0) + ' 1 0"><i aria-hidden="true"></i>' + (bk === 'none' ? t('cmNoBack') : bk === 'hdf' ? t('bHdf') : t('bSolid')) + '</span>'; }, 'fr-backs') +
    '</div>';
}
function zoneHtml(z) { return t('zone') + ' <b>' + fmt(z.Hz) + '</b> mm · ' + t('used') + ' <b>' + fmt(z.exp + z.fillH * z.nFill) + '</b>' + (z.over ? ' · <b>' + t('over') + ' ' + fmt(z.exp - z.Hz) + '</b>' : ''); }
function viewEditor(c) {
  var b = 'c.', o = c.cnc, h = '';
  /* 1 — dimensions */
  var dims = '<div class="row">' + fT(t('name'), b + 'name', c.name, null, 'grow') + '<div class="f"><span>' + t('type') + '</span>' +
    seg(b + 'type', c.type, [['PASTATOMOS', t('tBase')], ['PAKABINAMOS', t('tWall')], ['ŪKINĖ', t('tTall')]]) + '</div></div><div class="row" style="margin-top:10px">' +
    (c.dishwasher ? fN(t('dishW'), b + 'dishWidth', c.dishWidth) : fN(t('W'), b + 'W', c.W)) + fN(t('H'), b + 'H', c.H) + fN(t('D'), b + 'D', c.D) +
    fN(t('thick'), b + 'thick', c.thick, 's') + fN(t('facT'), b + 'cnc.facadeT', o.facadeT, 's') +
    '<span class="row" style="margin-left:auto;gap:6px"><button class="btn ghost" data-act="dup">' + t('dup') + '</button><button class="btn ghost danger" data-act="del">' + (S.confirm === 'del' ? t('delSure') : t('del')) + '</button></span></div>';
  h += step(1, t('s1'), t('s1l'), dims, 'dims');
  if (c.dishwasher) { h += step(2, t('s5'), t('s5l'), matsBlock(c), 'mats'); return h; }
  /* 2 — sections, by column (pertvaros), each column with its own back */
  var nC = colsOf(c), cw = colWidths(c);
  var secs = '<div class="colbar"><div class="f"><span>' + t('parts2') + '</span>' + seg(b + 'cols', nC, [[1, t('part0')], [2, t('part1')], [3, t('part2')]]) + '</div>' +
    (nC > 1 ? '<div class="colw">' + cw.slice(0, nC - 1).map(function (w, k) { return fN(colName(nC, k) + ' ' + t('colWl'), b + 'colW.' + k, fmt(w), 's'); }).join('') +
      '<div class="f s"><span>' + colName(nC, nC - 1) + ' ' + t('colWl') + '</span><b class="colrest" id="colw-last">' + fmt(cw[nC - 1]) + ' mm</b></div></div><p class="note" style="margin:0">' + t('colWnote') + '</p>' : '') + '</div>' +
    '<div class="colmap" id="colmap"' + (nC > 1 ? ' role="tablist" aria-label="' + esc(t('colEdit')) + '"' : '') + '>' + colMapInner(c) + '</div>' + (nC > 1 ? '<p class="note cmhint">' + t('cmHint') + '</p>' : '<div style="height:12px"></div>') +
    '<div class="colgrid cols' + (nC > 1 ? 'one' : '1') + '">';
  var ac = activeCol(c);
  for (var k = 0; k < nC; k++) {
    if (nC > 1 && k !== ac) continue;   // one column at a time, at full width; the map above shows them all
    var z = zoneInfo(c, k), bk = (c.cnc.backs || [])[k] || 'none';
    secs += '<div class="colblk" role="tabpanel">' + (nC > 1 ? '<div class="colh"><span class="unit">' + t('colEdit') + '</span><b>' + colName(nC, k) + '</b><span class="unit">' + fmt(cw[k]) + ' mm</span></div>' : '') +
      '<div class="backsel"><span>' + t('backOf') + '</span>' + seg(b + 'cnc.backs.' + k, bk, [['none', t('bNone')], ['hdf', t('bHdf')], ['solid', t('bSolid')]]) + '</div>' +
      '<div class="zone" data-col="' + k + '">' + zoneHtml(z) + '</div><div class="secs">';
    for (var i = c.sections.length - 1; i >= 0; i--) if (colOf(c, c.sections[i]) === k) secs += viewSection(c, c.sections[i], i, z);
    secs += '</div><div class="addsec"><span class="unit" style="align-self:center">' + t('add') + ':</span>' +
      ['drawers', 'doors', 'open', 'oven'].map(function (kd) { return '<button class="btn addk k-' + kd + '" data-act="addsec" data-v="' + kd + '" data-i="' + k + '"><i class="kdot" aria-hidden="true"></i>＋ ' + t({ drawers:'kDrawers', doors:'kDoors', open:'kOpen', oven:'kOven' }[kd]) + '</button>'; }).join('') + '</div></div>';
  }
  secs += '</div>';
  h += step(2, t('s2'), t('s2l'), secs, 'secs');
  /* 3 — construction */
  var jo = '<div class="lbl">' + t('jMain') + ' <span class="unit">· ' + t('jMainL') + '</span></div><div class="choices">' +
    choice(b + 'cnc.joinery', o.joinery, 'confirmat', artOf('confirmat'), t('jConf'), t('jConfD')) +
    choice(b + 'cnc.joinery', o.joinery, 'cam', artOf('cam'), t('jCam'), t('jCamD')) + '</div><div class="sub">' +
    '<div><div class="lbl">' + t('top') + '</div><div class="row">' + seg(b + 'cnc.top', o.top, [['rails', t('topRails')], ['full', t('topFull')]]) +
      (o.top === 'full' ? chk(b + 'cnc.topOverFacade', o.topOverFacade, t('topOver')) : '') + '</div></div>' +
    (o.top === 'rails' ? railsEditor(c) : '') +
    (function () { var bs = o.backs || [], anyS = bs.indexOf('solid') >= 0, allS = bs.length && bs.every(function (x) { return x === 'solid'; });
      return '<div><div class="lbl">' + t('backMountL') + '</div>' + (anyS ? seg(b + 'cnc.backMount', o.backMount || 'top', [['top', t('bTop')], ['inside', t('bIn')]]) +
        (o.backMount !== 'inside' && !allS ? '<p class="note" style="margin:4px 0 0">' + t('bTopOnlyAll') + '</p>' : '') : '<p class="note" style="margin:0">' + t('bPerCol') + '</p>') + '</div>'; })() +
    '</div>';
  var rInfo = S._info && S._info[S.sel] ? S._info[S.sel].r : null;
  var xs = S.xside === 'R' ? 'R' : 'L';
  jo = '<div class="constr"><div style="min-width:0">' + jo + '</div><figure class="xsec"><div class="seg xsw" role="group">' +
    '<button type="button" data-act="xside" data-v="L" class="' + (xs === 'L' ? 'on' : '') + '" aria-pressed="' + (xs === 'L') + '">' + t('sideL') + '</button>' +
    '<button type="button" data-act="xside" data-v="R" class="' + (xs === 'R' ? 'on' : '') + '" aria-pressed="' + (xs === 'R') + '">' + t('sideR') + '</button></div>' +
    '<div id="xsec">' + sectionSVG(c, rInfo, xs) + '</div><figcaption id="xcap">' + t('xsec') + ' · ' + t(xs === 'R' ? 'xSideR' : 'xSideL') + '</figcaption>' +
    '<div class="xleg"><span><i class="lc"></i>' + t('lgConf') + '</span><span><i class="lk"></i>' + t('lgCam') + '</span><span><i class="ld"></i>' + t('lgDowel') + '</span></div></figure></div>' +
    '<div class="iso3dwrap"><div class="lbl">' + t('isoTitle') + ' <span class="unit">· ' + t('isoLead') + '</span></div><div class="iso3d" id="iso3d"></div></div>' +
    '<div class="jtable" id="jtable">' + jointsBlock(c, rInfo) + '</div>';
  h += step(3, t('s3'), t('s3l'), jo, 'constr');
  /* 4 — operations */
  var has = function (f) { return c.sections.some(f); };
  var hasDr = has(function (s) { return s.kind === 'drawers' && E.R.runner[s.hw]; }), hasTb = has(function (s) { return s.kind === 'drawers' && s.hw === 'BLUM TANDEMBOX'; });
  var hasDoor = has(function (s) { return s.kind === 'doors' && s.hinge !== 'BE FURNITŪROS'; }), hasSh = has(function (s) { return (s.kind === 'doors' || s.kind === 'open') && num(s.shelves) > 0 && s.shelfAdj !== false; });
  var ops = '<div class="ops">' +
    opRow(b + 'cnc.legs', o.legs, t('oLegs'), t('oLegsD'), true, true, o.legs ? legsEditor(c, rInfo) : '') +
    opRow(b + 'cnc.runnerMarks', o.runnerMarks, t('oRun'), t('oRunD'), true, hasDr) +
    opRow(b + 'cnc.tbOn', o.tbFront !== 'off', t('oTb'), o.tbFront === 'hole' ? t('oTbD') : t('oTbDm'), true, hasTb, seg(b + 'cnc.tbFront', o.tbFront === 'off' ? 'mark' : o.tbFront, [['mark', t('tbMark')], ['hole', t('tbHole')]])) +
    opRow(b + 'cnc.hinges', o.hinges, t('oHinge'), t('oHingeD'), false, hasDoor, seg(b + 'cnc.hingeFix', o.hingeFix, [['screw', t('hfScrew')], ['press', t('hfPress')]])) +
    opRow(b + 'cnc.pinsOn', o.pins !== 'off', t('oPins'), t('oPinsD'), false, hasSh, seg(b + 'cnc.pins', o.pins, [['shelf', t('pinShelf')], ['row', t('pinRow')]])) +
    '</div>';
  h += step(4, t('s4'), t('s4l'), ops, 'ops');
  h += step(5, t('s5'), t('s5l'), matsBlock(c), 'mats');
  h += step(6, t('s6'), t('s6l'), extrasBlock(c), 'extra');
  return h;
}
function jointsBlock(c, r) {
  var ORDER = ['bottom', 'top', 'railF', 'railB', 'railV', 'railVH', 'railBottom', 'railBotB', 'back', 'partB', 'partT', 'partF', 'partR', 'backP', 'shelf', 'oven'];
  var oi = function (k) { var m = /^(\D+)(\d)$/.exec(k); return m ? ORDER.indexOf(m[1]) * 10 + +m[2] : ORDER.indexOf(k) * 10; };   // partitions in order: 1, 2, …
  var js = ((r && r.joints) || []).slice().sort(function (a, b) { return oi(a.key) - oi(b.key); }); if (!js.length) return '';
  var rows = js.map(function (j) {
    var b = 'c.cnc.joints.' + j.key + '.', own = (c.cnc.joints || {})[j.key] || {}, id = 'f-j-' + j.key;
    var sideTxt = function (x) { return '<b>' + esc(t('isoT_' + x.type)) + '</b> ' + (x.pos.length ? x.pos.map(function (a) { return E.num(Math.round(a * 10) / 10); }).join(' · ') : '—') + ' <span class="unit">mm</span>'; };
    if (j.split) return '<div class="jrow custom"><span class="jl">' + t('jk_' + j.key) + '</span><span class="jnums jman jsplit"><span><span class="unit">' + t('sideL') + ':</span> ' + sideTxt(j.sides.L) + '</span><span><span class="unit">' + t('sideR') + ':</span> ' + sideTxt(j.sides.R) + '</span>' +
      '<button type="button" class="btn ghost" data-act="isosel" data-v="' + j.key + '">' + t('isoEdit') + '</button></span><button class="btn ghost jreset" data-act="jreset" data-v="' + j.key + '" title="' + t('jAuto') + '">↺ ' + t('jAuto') + '</button></div>';
    return '<div class="jrow' + (j.custom ? ' custom' : '') + '"><span class="jl">' + t('jk_' + j.key) + '</span>' +
      segI(b + 'type', j.type, [['confirmat', t('jtConf')], ['cam', t('jtCam')], ['dowel', t('jtDowel')]]) +
      (j.manual ? '<span class="jnums jman"><span class="unit">' + t('isoManual') + ':</span> <b>' + (j.pos.length ? j.pos.map(function (a) { return E.num(Math.round(a * 10) / 10); }).join(' · ') : '—') + '</b> <span class="unit">mm</span> <button type="button" class="btn ghost" data-act="isosel" data-v="' + j.key + '">' + t('isoEdit') + '</button></span>' :
      '<span class="jnums"><label for="' + id + '-n">' + t('jN') + '</label><input id="' + id + '-n" type="text" inputmode="numeric" data-bind="' + b + 'n" data-num="1" data-empty="1" value="' + esc(own.n || '') + '" placeholder="' + j.defN + '">' +
      '<label for="' + id + '-e">' + t('jE') + '</label><input id="' + id + '-e" type="text" inputmode="decimal" data-bind="' + b + 'e" data-num="1" data-empty="1" value="' + esc(own.e || '') + '" placeholder="' + E.num(j.defE) + '"><span class="unit">mm</span></span>') +
      (j.custom ? '<button class="btn ghost jreset" data-act="jreset" data-v="' + j.key + '" title="' + t('jAuto') + '">↺ ' + t('jAuto') + '</button>' : '<span class="badge mut">' + t('jAuto') + '</span>') + '</div>';
  }).join('');
  return '<div class="lbl" style="margin-top:4px">' + t('jTitle') + '</div><p class="note" style="margin:0 0 8px">' + t('jLead') + '</p><div class="jrows">' + rows + '</div>';
}
function railsEditor(c) {
  var b = 'c.cnc.', r = c.cnc.rails;
  var n = (r.front !== 'none' ? 1 : 0) + (r.back === 'hv' ? 2 : r.back !== 'none' ? 1 : 0) + (r.bottom ? 1 : 0);
  return '<div><div class="lbl">' + t('rails') + ' <span class="unit">· ' + t('rCount') + ': ' + n + '</span></div><div class="rgrid">' +
    '<span>' + t('rFront') + '</span>' + seg(b + 'rails.front', r.front, [['h', t('rFlat')], ['v', t('rStand')], ['none', t('rNone')]]) +
    '<span>' + t('rBack') + '</span>' + seg(b + 'rails.back', r.back, [['h', t('rFlat')], ['v', t('rStand')], ['hv', t('rBoth')], ['none', t('rNone')]]) +
    '<span>' + t('rBottom') + '</span>' + chk(b + 'rails.bottom', r.bottom, t('rBottomD')) +
    '<span>' + t('rW') + '</span><span class="row" style="gap:6px;align-items:center">' + fN('', b + 'railW', c.cnc.railW, 's') + '<span class="unit">mm</span></span>' +
    '</div></div>';
}
/* side section seen from the left (front on the left): carcass parts in their real proportions — mirrors the engine's layout */
function sectionSVG(c, res, side) {
  var o = c.cnc, t_ = num(c.thick) || 18, H = num(c.H), D = num(c.D);
  if (!(H > 0 && D > 0)) return '';
  var bs = o.backs || [], allS = bs.length && bs.every(function (x) { return x === 'solid'; }), bk = bs[side === 'R' ? bs.length - 1 : 0] || 'none';
  var eb = allS && o.backMount !== 'inside' ? 'top' : bk === 'solid' ? 'inside' : bk;   // what this side sees: top / inside / hdf / none
  var full = o.top === 'full', tb = eb === 'top' ? t_ : bs.indexOf('hdf') >= 0 && eb !== 'top' ? E.R.hdf.t : 0, Ds = D - tb, rw = num(o.railW) || 100, r = Object.assign({}, o.rails);
  if (full) r = { front:'none', back:'none', bottom:false };
  if (bs.some(function (x) { return x === 'solid'; }) && !(allS && o.backMount !== 'inside') && (r.back === 'v' || r.back === 'hv' || r.bottom)) { r.back = r.back === 'hv' ? 'h' : r.back === 'v' ? 'none' : r.back; r.bottom = false; }
  var bH = r.back === 'h' || r.back === 'hv', bV = r.back === 'v' || r.back === 'hv';
  var off = full && o.topOverFacade ? (num(o.facadeT) || 18) : 0;
  var k = Math.min(230 / H, 240 / (D + off)), pad = 14, legs = o.legs ? 10 : 0;
  var W_ = (D + off) * k + 2 * pad, H_ = H * k + 2 * pad + legs + 12;
  var flip = side === 'R';   // right side seen from the right: front on the right
  var X = function (y) { return flip ? pad + (D - y) * k : pad + (y + off) * k; }, Y = function (z) { return pad + (H - z) * k; };
  var rect = function (y0, z0, y1, z1, cls) { return '<rect class="' + cls + '" x="' + Math.min(X(y0), X(y1)).toFixed(1) + '" y="' + Y(z1).toFixed(1) + '" width="' + ((y1 - y0) * k).toFixed(1) + '" height="' + ((z1 - z0) * k).toFixed(1) + '"/>'; };
  var sv = '<svg viewBox="0 0 ' + W_.toFixed(0) + ' ' + H_.toFixed(0) + '" width="' + W_.toFixed(0) + '" xmlns="http://www.w3.org/2000/svg">';
  sv += rect(0, t_, Ds, full ? H - t_ : H, 'xs-side');
  sv += rect(0, 0, Ds, t_, 'xs-p');
  if (full) sv += rect(-off, H - t_, Ds + tb, H, 'xs-p');
  if (r.front === 'h') sv += rect(0, H - t_, rw, H, 'xs-r'); else if (r.front === 'v') sv += rect(0, H - rw, t_, H, 'xs-r');
  if (bH) sv += rect(Ds - rw, H - t_, Ds, H, 'xs-r');
  if (bV) { var zv = bH ? H - t_ - rw : H - rw; sv += rect(Ds - t_, zv, Ds, zv + rw, 'xs-r'); }
  if (r.bottom) sv += rect(Ds - t_, t_, Ds, t_ + rw, 'xs-r');
  if (eb === 'top') sv += rect(Ds, 0, D, full ? H - t_ : H, 'xs-b');
  else if (eb === 'inside') sv += rect(Ds - t_, t_, Ds, full || bH ? H - t_ : H, 'xs-b');
  else if (eb === 'hdf') sv += rect(Ds, 0, D, H, 'xs-hdf');
  var legYs = res && res.legs && res.legs.length ? res.legs.map(function (l) { return l.y; }).filter(function (y, i, a) { return a.indexOf(y) === i; }) : [E.R.legs.fromFront, Ds - E.R.legs.fromBack];
  if (o.legs) legYs.forEach(function (y) { sv += '<rect class="xs-leg" x="' + (X(y) - 3).toFixed(1) + '" y="' + Y(0).toFixed(1) + '" width="6" height="' + legs + '"/>'; });
  sv += connectorMarks(res, X, Y, flip ? 'DESINE' : 'KAIRE');
  sv += flip ? '<text class="xs-t" x="' + pad + '" y="' + (H_ - 3).toFixed(0) + '">' + t('xBack') + '</text><text class="xs-t" text-anchor="end" x="' + (W_ - pad).toFixed(0) + '" y="' + (H_ - 3).toFixed(0) + '">' + t('xFront') + ' ▸</text>'
             : '<text class="xs-t" x="' + pad + '" y="' + (H_ - 3).toFixed(0) + '">◂ ' + t('xFront') + '</text><text class="xs-t" text-anchor="end" x="' + (W_ - pad).toFixed(0) + '" y="' + (H_ - 3).toFixed(0) + '">' + t('xBack') + '</text>';
  return sv + '</svg>';
}
/* connectors of the left side panel, drawn where they are: face holes as dots/rings, edge bores as short strokes */
function connectorMarks(r, X, Y, role) {
  var side = r && r.panels.filter(function (p) { return p.role === role; })[0]; if (!side || !side.place) return '';
  var Pw = function (p, a, b, c) { var q = p.place; return [0, 1, 2].map(function (i) { return q.o[i] + a*q.u[i] + b*q.v[i] - c*q.n[i]; }); };
  var o = '';
  side.holes.forEach(function (h) {
    if (h.mark || h.op) return;
    var w = Pw(side, h.x, h.y, 0), cx = X(w[1]).toFixed(1), cy = Y(w[2]).toFixed(1);
    if (h.d === 15) o += '<circle class="mk-cam" cx="' + cx + '" cy="' + cy + '" r="4.6"/>';
    else if (h.through) o += '<circle class="mk-conf" cx="' + cx + '" cy="' + cy + '" r="3.2"/>';
    else if (h.d === 8 && h.depth === E.R.cam.bolt.depthFace) o += '<circle class="mk-camb" cx="' + cx + '" cy="' + cy + '" r="2.6"/>';
    else o += '<circle class="mk-dow" cx="' + cx + '" cy="' + cy + '" r="2.6"/>';
  });
  side.edges.forEach(function (e) {
    var a, b, dir, u = side.place.u, v = side.place.v;
    if (e.edge === 'x0') { a = 0; b = e.pos; dir = u; } else if (e.edge === 'x1') { a = side.L; b = e.pos; dir = u.map(function (x) { return -x; }); }
    else if (e.edge === 'y0') { a = e.pos; b = 0; dir = v; } else { a = e.pos; b = side.W; dir = v.map(function (x) { return -x; }); }
    var p0 = Pw(side, a, b, side.T/2), L = Math.max(e.depth, 20), p1 = p0.map(function (x, i) { return x + L*dir[i]; });
    var cls = e.d === 5 ? 'mk-conf' : e.depth === E.R.cam.cam.fromEdge ? 'mk-cam' : 'mk-dow';
    o += '<line class="' + cls + ' mk-l" x1="' + X(p0[1]).toFixed(1) + '" y1="' + Y(p0[2]).toFixed(1) + '" x2="' + X(p1[1]).toFixed(1) + '" y2="' + Y(p1[2]).toFixed(1) + '"/>';
  });
  return o;
}
function extrasBlock(c) {
  var rows = c.extras.map(function (x, i) {
    var b = 'c.extras.' + i + '.';
    var eb = ['e1', 'e2', 'e3', 'e4'].map(function (e, j) { var id = 'f-x-' + i + '-' + e; return '<label class="ebx" for="' + id + '"><input id="' + id + '" type="checkbox" data-bind="' + b + e + '"' + (x[e] ? ' checked' : '') + '>' + ['L1', 'L2', 'W1', 'W2'][j] + '</label>'; }).join('');
    var cell = function (k, cls, list) { var id = 'f-x-' + i + '-' + k; return '<td><input id="' + id + '" class="' + cls + '" type="text" data-bind="' + b + k + '"' + (cls === 'xn' ? ' data-num="1" inputmode="decimal"' : '') + (list ? ' list="' + list + '"' : '') + ' value="' + esc(x[k]) + '" aria-label="' + k + '" autocomplete="off"></td>'; };
    return '<tr>' + cell('name', 'xt') + cell('L', 'xn') + cell('W', 'xn') + cell('T', 'xn') + cell('qty', 'xn') + cell('mat', 'xt', 'dl-mat') + '<td><span class="ebs">' + eb + '</span></td><td><button class="xbtn" data-act="rmx" data-i="' + i + '" aria-label="' + t('rm') + '" title="' + t('rm') + '">✕</button></td></tr>';
  }).join('');
  return (c.extras.length ? '<div class="tablewrap xtab"><table><thead><tr><th>' + t('exName') + '</th><th class="n">' + t('cL') + '</th><th class="n">' + t('cW') + '</th><th class="n">' + t('cT') + '</th><th class="n">' + t('cQ') + '</th><th>' + t('cMat') + '</th><th>' + t('exEdges') + '</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<p class="note" style="margin:0 0 8px">' + t('exNone') + '</p>') +
    '<div class="row" style="margin-top:10px"><button class="btn" data-act="addx" data-v="part">＋ ' + t('exAdd') + '</button><button class="btn" data-act="addx" data-v="plinth">＋ ' + t('exPlinth') + '</button></div>';
}
/* legs: how many in a row across the width, how many rows, and where they land (plan view, front at the bottom) */
function legsEditor(c, r) {
  var o = c.cnc, b = 'c.cnc.', nC = colsOf(c), W = num(c.W), fs = E.R.legs.fromSide, lx = o.legsX || 2, ly = +o.legsY === 3 ? 3 : 2;
  var opts = [2, 3, 4, 5, 6].map(function (n) { return [n, String(n), (W - 2 * fs) / (n - 1) < 70]; });
  var segX = '<div class="seg" role="group">' + opts.map(function (q) { var on = String(lx) === String(q[0]);
      return '<button type="button" data-act="set" data-bind="' + b + 'legsX" data-v="' + q[0] + '" class="' + (on ? 'on' : '') + '" aria-pressed="' + on + '"' + (q[2] && !on ? ' disabled title="' + esc(t('legDense')) + '"' : '') + '>' + q[1] + '</button>'; }).join('') +
    (nC > 1 ? '<button type="button" data-act="set" data-bind="' + b + 'legsX" data-v="parts" class="' + (lx === 'parts' ? 'on' : '') + '" aria-pressed="' + (lx === 'parts') + '">' + t('legParts') + '</button>' : '') + '</div>';
  var n = r && r.legs ? r.legs.length : 0;
  return '<div class="legs-ed"><div class="legs-f"><div class="f"><span>' + t('legRow') + '</span>' + segX + '</div>' +
    '<div class="f"><span>' + t('legRows') + '</span>' + seg(b + 'legsY', ly, [[2, t('legRows2')], [3, t('legRows3')]]) + '</div>' +
    fN(t('legH'), 'c.legH', c.legH, 's') + '</div>' +
    '<figure class="legplan">' + legPlanSVG(c, r) + '<figcaption>' + t('legTotal') + ': <b>' + n + '</b> ' + (S.lang === 'lt' ? 'vnt.' : 'pcs') + '</figcaption></figure></div>';
}
function legPlanSVG(c, r) {
  if (!r || !r.dims) return '';
  var W = r.dims.W, bot = (r.panels || []).filter(function (p) { return p.role === 'DUGNAS'; })[0], Dd = bot ? (Math.abs(bot.L - W) < 0.01 ? bot.W : bot.L) : r.dims.D;
  var k = Math.min(260 / W, 120 / Dd), pad = 8, w = W * k + 2 * pad, h = Dd * k + 2 * pad + 14;
  var X = function (x) { return pad + x * k; }, Y = function (y) { return pad + (Dd - y) * k; };   // plan view, the front at the bottom
  var sv = '<svg viewBox="0 0 ' + w.toFixed(0) + ' ' + h.toFixed(0) + '" width="' + w.toFixed(0) + '" xmlns="http://www.w3.org/2000/svg">' +
    '<rect class="lp-bot" x="' + pad + '" y="' + pad + '" width="' + (W * k).toFixed(1) + '" height="' + (Dd * k).toFixed(1) + '" rx="2"/>';
  var nC = colsOf(c), cw = colWidths(c), x = 0;
  for (var q = 0; q < nC - 1; q++) { x += cw[q]; sv += '<line class="lp-part" x1="' + X(x).toFixed(1) + '" y1="' + pad + '" x2="' + X(x).toFixed(1) + '" y2="' + (pad + Dd * k).toFixed(1) + '"/>'; }
  (r.legs || []).forEach(function (l) { sv += '<circle class="lp-plate" cx="' + X(l.x).toFixed(1) + '" cy="' + Y(l.y).toFixed(1) + '" r="' + Math.max(3, 30 * k).toFixed(1) + '"/><circle class="lp-leg" cx="' + X(l.x).toFixed(1) + '" cy="' + Y(l.y).toFixed(1) + '" r="' + Math.max(2.2, 20 * k).toFixed(1) + '"/>'; });
  sv += '<text class="lp-t" x="' + (w / 2).toFixed(0) + '" y="' + (h - 3).toFixed(0) + '" text-anchor="middle">▼ ' + t('legFront') + '</text>';
  return sv + '</svg>';
}
function artOf(type) { return window.DBArt ? '<span class="cart">' + window.DBArt.pic(type, t('isoT_' + type)) + '</span>' : ico(type === 'cam' ? 'cam' : 'conf'); }
function choice(bind, val, v, icon, title, desc) { return '<button type="button" class="choice' + (val === v ? ' on' : '') + '" data-act="set" data-bind="' + bind + '" data-v="' + v + '" aria-pressed="' + (val === v) + '">' + icon + '<span><b>' + title + '</b><small>' + desc + '</small></span></button>'; }
function opRow(bind, on, title, desc, verified, applies, more) {
  var id = 'f-' + bind.replace(/\./g, '-');
  return '<div class="op' + (on ? '' : ' off') + (applies ? '' : ' na') + '"><input id="' + id + '" type="checkbox" data-bind="' + bind + '"' + (on ? ' checked' : '') + '>' +
    '<label for="' + id + '" style="cursor:pointer"><b>' + title + '</b><small>' + desc + (applies ? '' : ' · <i>' + t('notNeeded') + '</i>') + '</small>' + (on && more && applies ? '<div class="more">' + more + '</div>' : '') + '</label>' +
    '<span class="badge ' + (verified ? 'ok' : 'warn') + '">' + (verified ? t('verified') : t('unverified')) + '</span></div>';
}
function matsBlock(c) {
  var b = 'c.', hasFront = c.dishwasher || c.sections.some(function (s) { return s.kind === 'drawers' || s.kind === 'doors'; });
  var req = function (html, val) { return html.replace('<span>', '<span>').replace('</span>', ' <i class="req" aria-hidden="true">*</i></span>').replace('type="text"', 'type="text" required' + (val ? '' : ' aria-invalid="true"')); };
  return '<p class="note reqnote"><i class="req">*</i> ' + t('reqNote') + '</p><div class="row">' + (c.dishwasher ? fT(t('mCarc'), b + 'mat.carc', c.mat.carc, 'dl-mat') : req(fT(t('mCarc'), b + 'mat.carc', c.mat.carc, 'dl-mat'), c.mat.carc)) + (hasFront ? req(fT(t('mFac'), b + 'mat.facade', c.mat.facade, 'dl-mat'), c.mat.facade) : fT(t('mFac'), b + 'mat.facade', c.mat.facade, 'dl-mat')) + (c.dishwasher ? '' : fT(t('mBack'), b + 'mat.back', c.mat.back, 'dl-mat')) + '</div>' +
    '<div class="row" style="margin-top:10px">' + fT(t('eCarc'), b + 'edge.carc', c.edge.carc, 'dl-edge') + fT(t('eFac'), b + 'edge.facade', c.edge.facade, 'dl-edge') + '</div>';
}
function sameCol(c, i) { var cl = colOf(c, c.sections[i]); return c.sections.map(function (s, q) { return q; }).filter(function (q) { return colOf(c, c.sections[q]) === cl; }); }
function firstInCol(c, i) { return sameCol(c, i)[0] === i; }
function lastInCol(c, i) { var a = sameCol(c, i); return a[a.length - 1] === i; }
function viewSection(c, s, i, z) {
  var b = 'c.sections.' + i + '.', kn = { drawers:'kDrawers', doors:'kDoors', open:'kOpen', oven:'kOven' }[s.kind];
  var secH = s.fill ? z.fillH : num(s.height);
  var head = '<div class="sh"><span class="kind">' + t(kn) + '</span>' + chk(b + 'fill', s.fill, t('fill')) +
    (s.fill ? '<span class="h">' + fmt(secH) + ' mm</span>' : fN(t('secH'), b + 'height', s.height)) + '</div>';
  var body = '<div class="row">';
  if (s.kind === 'drawers') {
    body += fN(t('nDr'), b + 'nDrawers', s.nDrawers, 's') + fS(t('runner'), b + 'hw', s.hw, [['BLUM TANDEMBOX', 'Blum TANDEMBOX'], ['BLUM TANDEM', 'Blum TANDEM']].concat(E.R.runner[s.hw] ? [] : [[s.hw, s.hw]])) +
      fS(t('rail'), b + 'rail', s.rail, [270, 300, 350, 400, 450, 500, 550, 600, 650].map(function (v) { return [v, v + ' mm']; })) +
      (num(s.nDrawers) > 1 ? '' : '<span class="h">' + fmt(secH - E.R.facade.gap) + ' mm</span>');
  } else if (s.kind === 'doors') {
    body += fN(t('nDoors'), b + 'nDoors', s.nDoors, 's') + '<div class="f"><span>' + t('split') + '</span>' + seg(b + 'doorSplit', s.doorSplit, [['v', t('sSide')], ['h', t('sStack')]]) + '</div>' +
      fS(t('hinge'), b + 'hinge', s.hinge, E.DOOR_HW.map(function (v) { return [v, v]; }).concat(E.DOOR_HW.indexOf(s.hinge) < 0 ? [[s.hinge, s.hinge]] : [])) +
      '<div class="f"><span>' + t('hside') + '</span>' + seg(b + 'hingeSide', s.hingeSide || 'auto', [['auto', t('hsAuto')], ['left', t('hsL')], ['right', t('hsR')]]) + '</div>' +
      fN(t('shelves'), b + 'shelves', s.shelves, 's') + (num(s.shelves) > 0 ? '<div class="f"><span>&nbsp;</span>' + seg(b + 'shelfAdj', s.shelfAdj !== false, [['true', t('adj')], ['false', t('fixed')]]) + '</div>' : '');
  } else if (s.kind === 'open') {
    body += fN(t('shelves'), b + 'shelves', s.shelves, 's') + (num(s.shelves) > 0 ? '<div class="f"><span>&nbsp;</span>' + seg(b + 'shelfAdj', s.shelfAdj !== false, [['true', t('adj')], ['false', t('fixed')]]) + '</div>' : '');
  } else {
    body += fS(t('sup'), b + 'shelves', Math.min(2, num(s.shelves)), [[0, '0'], [1, '1 — ' + (S.lang === 'lt' ? 'apačioje' : 'below')], [2, '2 — ' + (S.lang === 'lt' ? 'apačioje ir viršuje' : 'below and above')]]);
  }
  body += '</div>';
  var nStack = s.kind === 'drawers' ? num(s.nDrawers) : s.kind === 'doors' && s.doorSplit === 'h' ? num(s.nDoors) : 0;
  if (nStack > 1) body += frontsEditor(s, i, secH, Math.round(nStack));
  return '<div class="sec k-' + s.kind + '"><div>' + head + body + '</div><div class="tools">' +
    '<button title="' + t('up') + '" aria-label="' + t('up') + '" data-act="mv" data-i="' + i + '" data-v="1"' + (lastInCol(c, i) ? ' disabled' : '') + '>▲</button>' +
    '<button title="' + t('down') + '" aria-label="' + t('down') + '" data-act="mv" data-i="' + i + '" data-v="-1"' + (firstInCol(c, i) ? ' disabled' : '') + '>▼</button>' +
    '<button class="xbtn" title="' + t('rm') + '" aria-label="' + t('rm') + '" data-act="rmsec" data-i="' + i + '">✕</button></div></div>';
}
/* stacked fronts, top first: type a height for any of them, the empty ones share what is left */
function frontsEditor(s, i, secH, n) {
  var g = E.R.facade.gap, sp = E.splitFronts(secH, n, s.frontH, g), top = sp.mods.slice().reverse(), fh = s.frontH || {}, any = false;
  var rows = top.map(function (m, q) {
    var own = fh[q] != null && String(fh[q]).trim() !== '' && +fh[q] > 0; if (own) any = true;
    var id = 'f-c-sections-' + i + '-frontH-' + q;
    return '<label class="fh' + (own ? ' own' : '') + '" for="' + id + '"><span class="fh-no">' + (q === 0 ? '↑ ' : q === n - 1 ? '↓ ' : '') + (q + 1) + '</span>' +
      '<input id="' + id + '" type="text" inputmode="decimal" data-bind="c.sections.' + i + '.frontH.' + q + '" data-num="1" data-empty="1" value="' + (own ? esc(fmt(fh[q])) : '') + '" placeholder="' + fmt(m - g) + '">' +
      '<span class="fh-bar" style="--h:' + Math.max(6, Math.min(40, (m / Math.max(1, secH)) * 64)).toFixed(0) + 'px"></span></label>';
  }).join('');
  return '<div class="fronts"><div class="fh-head"><b>' + t('fhTitle') + '</b><span class="unit">' + t('fhNote') + '</span>' +
    (any ? '<button type="button" class="btn ghost fh-reset" data-act="fhreset" data-i="' + i + '">↺ ' + t('fhEqual') + '</button>' : '') + '</div>' +
    '<div class="fh-list">' + rows + '</div>' + (sp.note ? '<p class="fh-warn">' + esc(sp.note) + '</p>' : '') + '</div>';
}
function viewSheet(c, inf) {
  var nParts = inf.r.panels.length;
  var w = inf.warnings.map(function (x) { var lv = level(x); return '<div class="w ' + lv + '"><span class="tag">' + t(lv === 'bad' ? 'errTag' : lv === 'warn' ? 'warnTag' : 'infoTag') + '</span><span>' + esc(x) + '</span></div>'; }).join('');
  var j = c.dishwasher ? '—' : (c.cnc.joinery === 'cam' ? t('jCam') : t('jConf'));
  return '<aside class="sheet"><div class="paper"><div class="tb"><b>' + (S.sel + 1) + ' · ' + esc(c.name || typeName(c)) + '</b><span>' + fmt(c.dishwasher ? c.dishWidth : c.W) + '×' + fmt(c.H) + '×' + fmt(c.D) + '</span></div>' +
    '<div class="draw" id="sketch">' + sketchOf(c) + '</div><div class="titleblk"><div>' + t('parts') + '<b>' + nParts + '</b></div><div>' + t('progs') + '<b>' + inf.nProg + '</b></div><div>' + (S.lang === 'lt' ? 'Jungtys' : 'Joinery') + '<b style="font-size:11px">' + esc(j) + '</b></div></div></div>' +
    (w ? '<div class="warns" id="warns">' + w + '</div>' : '<div class="warns" id="warns"></div>') +
    '<button class="btn pri big go" data-act="tab" data-v="res">' + t('toRes') + '</button></aside>';
}
function sketchOf(c) { try { var d = engineDef(c); d.colW = colsOf(c) > 1 ? colWidths(c) : []; var bs = c.cnc.backs || []; d.hasBack = bs.some(function (x) { return x !== 'none'; }); d.backs = colsOf(c) > 1 && bs.length === colsOf(c) ? bs.slice() : null; d.backType = bs.indexOf('hdf') >= 0 ? 'hdf' : 'carcass'; return SK.svg(d, S.lang); } catch (e) { return '<div class="empty">' + esc(e.message) + '</div>'; } }

/* ----------------------------------------------------------------- render: results */
function viewRes(pj) {
  if (!pj.parts.length) return '<div class="card empty">' + t('noCab') + '</div>';
  var parts = pj.parts.slice().sort(function (a, b) { return (b.T - a.T) || String(a.mat).localeCompare(String(b.mat)) || (a.cab - b.cab) || a.name.localeCompare(b.name); });
  var ebM = parts.reduce(function (a, p) { return a + p.ebLen; }, 0) / 1000;
  var area = parts.reduce(function (a, p) { return a + p.L * p.W * p.qty / 1e6; }, 0);
  var h = '<div class="res"><div class="reshead"><div><h2 style="margin:0 0 8px;font:600 26px var(--f-display)">' + t('rTitle') + '</h2><div class="stats">' +
    stat(S.proj.cabinets.length, t('cabs')) + stat(parts.length, t('parts')) + stat(pj.files.length, t('progs')) + stat(fmt(area) + ' m²', S.lang === 'lt' ? 'plokštės' : 'board') + stat(fmt(ebM) + ' m', S.lang === 'lt' ? 'kraštų' : 'edging') +
    '</div></div><div><div class="dl"><button class="btn pri big" data-act="dl" data-v="zip">' + t('zipAll') + '</button>' +
    '<button class="btn" data-act="dlall" title="' + t('xxlAllT') + '">' + t('xxlAll').replace('{n}', pj.files.length) + '</button>' +
    '<button class="btn" data-act="dl" data-v="xlsm">' + t('xlsm') + '</button><button class="btn" data-act="dl" data-v="csv">' + t('csv') + '</button>' + (IN_ARTIFACT ? '' : '<button class="btn" data-act="print">' + t('print') + '</button>') +
    '</div><p class="note" style="margin:6px 0 0">' + t('zipNote') + '</p></div></div>';
  h += readyCheck(pj);
  var bad = pj.warnings.filter(function (w) { return level(w) === 'bad'; });
  if (bad.length) h += '<div class="warns">' + bad.map(function (x) { return '<div class="w bad"><span class="tag">' + t('errTag') + '</span><span>' + esc(x) + '</span></div>'; }).join('') + '</div>';
  var rows = '', curG = null, nr = 0;
  parts.forEach(function (p) {
    var g = p.mat + ' · ' + E.num(p.T) + ' mm';
    if (g !== curG) { curG = g; rows += '<tr class="grp"><td colspan="9">' + esc(p.mat || (S.lang === 'lt' ? 'be medžiagos' : 'no material')) + ' · ' + E.num(p.T) + ' mm</td></tr>'; }
    rows += '<tr class="part' + (S.part === p.name ? ' on' : '') + '" data-act="part" data-v="' + esc(p.name) + '" tabindex="0"><td class="n">' + (++nr) + '</td><td><b>' + esc(p.short) + '</b><br><span class="unit">' + esc(p.name) + '</span></td><td class="n">' + p.cab + '</td>' +
      '<td class="n">' + fmt(p.L) + '</td><td class="n">' + fmt(p.W) + '</td><td class="n">' + E.num(p.T) + '</td><td class="n">' + p.qty + '</td><td class="mono">' + esc(X.edgeText(p.eb) || '—') + '</td><td>' +
      ((p.progs || []).length ? p.progs.map(function (f, k) { return '<button type="button" class="prog dlp' + (f.kind === 'rot' ? ' rot' : '') + '" data-act="dlprog" data-v="' + esc(f.file) + '" title="' + esc(t('xxlOne') + ' ' + f.file) + '">⤓ ' + (f.kind === 'rot' ? '↻ ' : '') + (k + 1) + 'OP</button>'; }).join('') : '<span class="prog none">' + t('noProg') + '</span>') + '</td></tr>';
  });
  var table = '<div class="tablewrap"><table><thead><tr><th class="n">Nr</th><th>' + t('cDet') + '</th><th class="n">' + t('cCab') + '</th><th class="n">' + t('cL') + '</th><th class="n">' + t('cW') + '</th><th class="n">' + t('cT') + '</th><th class="n">' + t('cQ') + '</th><th>' + t('cEdge') + '</th><th>' + t('cProg') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  var hw = '<div class="card"><h3 style="margin:0 0 4px;font:600 20px var(--f-display)">' + t('hw') + '</h3><p class="note" style="margin:0 0 8px">' + t('hwNote') + '</p><div class="tablewrap"><table class="hwtable"><tbody>' +
    pj.hardware.map(function (x) { return '<tr><td>' + esc(x.item) + '</td><td class="n">' + x.qty + '</td><td>' + esc(x.unit) + '</td><td class="unit">' + (S.lang === 'lt' ? 'sp. ' : 'cab. ') + x.cabs.join(', ') + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
  var other = pj.warnings.filter(function (w) { return level(w) !== 'bad'; });
  var wl = '<div class="card noprint"><h3 style="margin:0 0 8px;font:600 20px var(--f-display)">' + t('allWarn') + '</h3><div class="warns">' + (other.length ? dedupe(other).map(function (x) { var lv = level(x); return '<div class="w ' + lv + '"><span class="tag">' + t(lv === 'warn' ? 'warnTag' : 'infoTag') + '</span><span>' + esc(x) + '</span></div>'; }).join('') : '<span class="note">' + t('none') + '</span>') + '</div></div>';
  var byCab = {}; pj.parts.forEach(function (p) { (p.progs || []).forEach(function (f, k) { (byCab[p.cab] = byCab[p.cab] || []).push({ f:f, k:k, p:p }); }); });
  var plist = '<div class="card noprint" id="proglist"><div class="plhead"><h3 style="margin:0;font:600 20px var(--f-display)">' + t('xxlTitle') + ' <span class="unit">· ' + pj.files.length + '</span></h3>' +
    '<button class="btn" data-act="dlall">' + t('xxlAll').replace('{n}', pj.files.length) + '</button></div><p class="note" style="margin:4px 0 10px">' + t('xxlLead') + '</p>' +
    Object.keys(byCab).sort(function (a, b) { return a - b; }).map(function (cn) {
      var cab = S.proj.cabinets[cn - 1] || {};
      return '<div class="plcab"><div class="plct"><b>' + cn + ' · ' + esc(cab.name || typeName(cab)) + '</b><button class="btn ghost" data-act="dlcab" data-v="' + cn + '">' + t('xxlCab').replace('{n}', byCab[cn].length) + '</button></div>' +
        byCab[cn].map(function (x) { return '<div class="plrow"><span class="plf mono">' + esc(x.f.file) + '</span><span class="unit">' + esc(x.p.short) + ' · ' + (x.f.kind === 'rot' ? '↻ ' + t('xxlRot') : (x.k + 1) + 'OP') + '</span>' +
          '<button class="btn" data-act="dlprog" data-v="' + esc(x.f.file) + '" aria-label="' + esc(t('xxlOne') + ' ' + x.f.file) + '">⤓ .XXL</button></div>'; }).join('') + '</div>';
    }).join('') + '</div>';
  h += '<div class="split"><div style="display:flex;flex-direction:column;gap:16px;min-width:0">' + table + plist + hw + wl + '</div><aside class="pview">' + viewPart() + '</aside></div></div>';
  return h;
}
/* before it goes to the machine: what is missing, with a direct way to fix it */
function readyCheck(pj) {
  var items = [], cabs = S.proj.cabinets;
  if (!String(S.proj.name || '').trim()) items.push(['bad', t('ckName'), '<button class="btn" data-act="fixname">' + t('ckFix') + '</button>']);
  else items.push(['ok', t('ckNameOk').replace('{n}', projName())]);
  var noMat = [], noEdge = [];
  cabs.forEach(function (c, i) { if (needsMats(c)) noMat.push(i); if (!c.edge.carc && !c.dishwasher) noEdge.push(i); });
  var nums = function (a) { return a.map(function (i) { return i + 1; }).join(', '); };
  if (noMat.length) items.push(['bad', t('ckMat').replace('{c}', nums(noMat)), '<button class="btn" data-act="fixcab" data-i="' + noMat[0] + '" data-v="mats">' + t('ckFix') + '</button>']);
  else items.push(['ok', t('ckMatOk')]);
  if (noEdge.length) items.push(['warn', t('ckEdge').replace('{c}', nums(noEdge)), '<button class="btn ghost" data-act="fixcab" data-i="' + noEdge[0] + '" data-v="mats">' + t('ckFix') + '</button>']);
  var errs = pj.warnings.filter(function (w) { return level(w) === 'bad'; }).length;
  if (errs) items.push(['bad', t('ckErr').replace('{n}', errs)]);
  items.push(['ok', t('ckProg').replace('{n}', pj.files.length).replace('{p}', pj.parts.length)]);
  var badN = items.filter(function (x) { return x[0] === 'bad'; }).length;
  return '<div class="card ready ' + (badN ? 'bad' : 'ok') + ' noprint"><div class="ready-h"><b>' + (badN ? t('ckTitleBad') : t('ckTitleOk')) + '</b></div><ul>' + items.map(function (x) {
    return '<li class="' + x[0] + '"><span class="ic" aria-hidden="true">' + (x[0] === 'ok' ? '✓' : x[0] === 'warn' ? '!' : '✕') + '</span><span class="tx">' + x[1] + '</span>' + (x[2] || '') + '</li>'; }).join('') + '</ul></div>';
}
function stat(v, l) { return '<div class="stat"><b>' + v + '</b><span>' + l + '</span></div>'; }
function findPanel(name) {
  for (var i = 0; i < S.proj.cabinets.length; i++) {
    var r = (S._info && S._info[i]) ? S._info[i].r : E.buildCabinet(engineDef(S.proj.cabinets[i]), i, projName());
    for (var j = 0; j < r.panels.length; j++) if (r.panels[j].name === name) return r.panels[j];
  }
  return null;
}
function viewPart() {
  var p = S.part && findPanel(S.part);
  if (!p) return '<div class="card empty">' + t('pick') + '</div>';
  var pr = E.programs(p), f = pr.files[Math.min(S.ptab, pr.files.length - 1)];
  var tabs = pr.files.map(function (x, i) { return '<button class="btn' + (i === S.ptab ? ' pri' : '') + '" data-act="ptab" data-v="' + i + '">' + (x.kind === 'rot' ? '↻ ' : '') + (i + 1) + 'OP</button>'; }).join('');
  return '<div class="paper"><div class="tb"><b>' + esc(p.short) + '</b><span>' + fmt(p.L) + ' × ' + fmt(p.W) + ' × ' + E.num(p.T) + '</span></div><div class="draw">' + panelSVG(p, pr.files[0] ? pr.files[0].up : 'A') + '</div>' +
    '<div class="legend"><span><i style="border:1.5px solid #2448c9;background:#dfe6fb"></i>' + t('lgA') + '</span><span><i style="border:1.5px dashed #b4291f"></i>' + t('lgB') + '</span><span><i style="background:#1b211e"></i>' + t('lgT') + '</span><span><i style="background:#9a6a00;width:7px;height:7px"></i>' + t('lgM') + '</span><span><i style="border-radius:1px;background:#2f7d55;height:5px"></i>' + t('lgE') + '</span><span><i style="border-radius:0;background:#f2b705;height:4px"></i>' + t('lgEb') + '</span></div>' +
    '<div class="note" style="margin-top:6px;color:#5f6a64">' + esc(p.note) + '</div></div>' +
    (f && f.kind === 'rot' ? '<p class="note" style="margin:0">' + t('rotHint') + '</p>' : '') +
    (f ? '<div class="ptabs">' + tabs + '<span class="unit">' + esc(f.file) + '</span><span class="pdl"><button class="btn ghost" data-act="copy">' + t('copy') + '</button><button class="btn pri" data-act="dlprog" data-v="' + esc(f.file) + '">⤓ .XXL</button>' +
      (pr.files.length > 1 ? '<button class="btn" data-act="dlpart" data-v="' + esc(p.name) + '">' + t('xxlPart').replace('{n}', pr.files.length) + '</button>' : '') + '</span></div><pre class="code" id="progtext">' + esc(f.text) + '</pre>' : '<div class="card empty">' + t('noProg') + '</div>');
}
/* panel as the operator sees it in 1OP: X to the right from the left end, Y up from the front edge */
function panelSVG(p, up) {
  var L = p.L, W = p.W, maxW = 420, maxH = 300, k = Math.min(maxW / L, maxH / W), pad = 26;
  var sw = L * k + 2 * pad, sh = W * k + 2 * pad;
  var X = function (x) { return pad + x * k; }, Y = function (y) { return pad + (W - y) * k; };
  var my = function (y) { return up === 'A' ? y : W - y; };
  var s = '<svg viewBox="0 0 ' + sw.toFixed(0) + ' ' + sh.toFixed(0) + '" width="100%" style="max-width:' + sw.toFixed(0) + 'px" xmlns="http://www.w3.org/2000/svg" font-family="IBM Plex Mono,monospace">';
  s += '<rect x="' + pad + '" y="' + pad + '" width="' + (L * k).toFixed(1) + '" height="' + (W * k).toFixed(1) + '" fill="#ffffff" stroke="#1b211e" stroke-width="1.4"/>';
  var ebMap = { y0:[0, 0, L, 0], y1:[0, W, L, W], x0:[0, 0, 0, W], x1:[L, 0, L, W] };
  Object.keys(p.eb || {}).forEach(function (e) { if (!p.eb[e]) return; var a = ebMap[e]; var ya = my(a[1]), yb = my(a[3]); s += '<line x1="' + X(a[0]).toFixed(1) + '" y1="' + Y(ya).toFixed(1) + '" x2="' + X(a[2]).toFixed(1) + '" y2="' + Y(yb).toFixed(1) + '" stroke="#f2b705" stroke-width="4"/>'; });
  p.edges.forEach(function (e) {
    var dpx = Math.max(6, e.depth * k), r = Math.max(1.6, e.d * k / 2), x1, y1, x2, y2;
    if (e.edge === 'x0') { x1 = X(0); x2 = X(0) + dpx; y1 = y2 = Y(my(e.pos)); }
    else if (e.edge === 'x1') { x1 = X(L); x2 = X(L) - dpx; y1 = y2 = Y(my(e.pos)); }
    else { var yy = my(e.edge === 'y0' ? 0 : W); x1 = x2 = X(e.pos); y1 = Y(yy); y2 = yy === 0 ? y1 - dpx : y1 + dpx; }
    s += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#2f7d55" stroke-width="' + (2 * r).toFixed(1) + '" stroke-opacity="0.8"/>';
  });
  p.holes.forEach(function (h) {
    var cx = X(h.x), cy = Y(my(h.y)), r = Math.max(h.mark ? 1.6 : 2, h.d * k / 2);
    if (h.mark) s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="#9a6a00"/>';
    else if (h.through) s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="#1b211e"/>';
    else if (h.face === up) s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="#dfe6fb" stroke="#2448c9" stroke-width="1.3"/>';
    else s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="none" stroke="#b4291f" stroke-width="1.3" stroke-dasharray="2.5 2"/>';
  });
  s += '<text x="' + (pad + L * k / 2).toFixed(0) + '" y="' + (sh - 7).toFixed(0) + '" font-size="11" text-anchor="middle" fill="#1b211e">' + fmt(L) + '</text>';
  s += '<text x="' + (pad - 7).toFixed(0) + '" y="' + (pad + W * k / 2).toFixed(0) + '" font-size="11" text-anchor="middle" fill="#1b211e" transform="rotate(-90 ' + (pad - 7).toFixed(0) + ' ' + (pad + W * k / 2).toFixed(0) + ')">' + fmt(W) + '</text>';
  s += '<circle cx="' + pad + '" cy="' + (pad + W * k) + '" r="3.5" fill="#b4291f"/><text x="' + (pad + 5) + '" y="' + (pad + W * k + 14) + '" font-size="9.5" fill="#b4291f">X0 Y0</text>';
  return s + '</svg>';
}

/* ----------------------------------------------------------------- render: settings */
function viewSet() {
  var st = S.settings, b = 's.';
  var tsel = function (ty, k, opts) { var id = 'f-s-' + ty + '-' + k; return '<select id="' + id + '" data-bind="' + b + 'types.' + ty + '.' + k + '" aria-label="' + ty + ' ' + k + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (String(st.types[ty][k]) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>'; };
  var types = '<div class="typecfg"><span></span>' + TYPES.map(function (ty) { return '<span class="th">' + ({ 'PASTATOMOS':t('tBase'), 'PAKABINAMOS':t('tWall'), 'ŪKINĖ':t('tTall') })[ty] + '</span>'; }).join('') +
    [['joinery', S.lang === 'lt' ? 'Jungtys' : 'Joinery', [['confirmat', t('jConf')], ['cam', t('jCam')]]], ['top', t('top'), [['rails', t('topRails')], ['full', t('topFull')]]], ['back', t('back'), [['none', t('bNone')], ['top', t('bTop')], ['inside', t('bIn')]]],
     ['backFix', t('bFix'), [['confirmat', t('jConf')], ['cam', t('jCam')]]],
     ['railFront', t('rails') + ': ' + t('rFront').toLowerCase(), [['h', t('rFlat')], ['v', t('rStand')], ['none', t('rNone')]]],
     ['railBack', t('rails') + ': ' + t('rBack').toLowerCase(), [['h', t('rFlat')], ['v', t('rStand')], ['hv', t('rBoth')], ['none', t('rNone')]]],
     ['railBottom', t('rBottom'), [['false', '—'], ['true', '✓']]],
     ['topOverFacade', t('topOver'), [['false', '—'], ['true', '✓']]], ['legs', t('oLegs'), [['true', '✓'], ['false', '—']]]].map(function (r) {
      return '<span>' + r[1] + '</span>' + TYPES.map(function (ty) { return tsel(ty, r[0], r[2]); }).join('');
    }).join('') + '</div>';
  var kv = function (grp, k, label) { var id = 'f-s-r-' + grp + '-' + k; return '<label for="' + id + '">' + label + '</label><input id="' + id + '" type="text" inputmode="decimal" data-bind="' + b + 'rules.' + grp + '.' + k + '" data-num="1" value="' + esc(st.rules[grp][k]) + '">'; };
  var rules = '<div class="kv">' + kv('hinge', 'cupFromEdge', t('rCupE')) + kv('hinge', 'cupDepth', t('rCupD')) + kv('hinge', 'fromEnd', t('rEnd')) + kv('hinge', 'plateFromFront', t('rPlF')) + kv('hinge', 'plateSpacing', t('rPlS')) +
    kv('pins', 'fromFront', t('rPinF')) + kv('pins', 'fromBack', t('rPinB')) + kv('pins', 'below', t('rPinBelow')) + kv('pins', 'depth', t('rPinD')) + kv('pins', 'pitch', t('rPitch')) + '</div>';
  var ops = '<div class="sub" style="margin-top:0">' + chk(b + 'ops.runnerMarks', st.ops.runnerMarks, t('oRun')) +
    '<div class="row"><span class="unit">' + t('tbDef') + ':</span>' + seg(b + 'ops.tbFront', st.ops.tbFront, [['off', '—'], ['mark', t('tbMark')], ['hole', t('tbHole')]]) + '</div>' +
    chk(b + 'ops.hinges', st.ops.hinges, t('oHinge')) +
    '<div class="row">' + seg(b + 'ops.hingeFix', st.ops.hingeFix, [['screw', t('hfScrew')], ['press', t('hfPress')]]) + '</div>' +
    '<div class="row"><span class="unit">' + t('oPins') + ':</span>' + seg(b + 'ops.pins', st.ops.pins, [['off', '—'], ['shelf', t('pinShelf')], ['row', t('pinRow')]]) + '</div>' +
    '<div class="row" style="align-items:center"><span class="unit">' + t('rW') + ':</span>' + '<input id="f-s-railW" class="sin" type="text" inputmode="decimal" data-bind="s.railW" data-num="1" value="' + esc(st.railW) + '" aria-label="' + t('rW') + '"><span class="unit">mm</span></div></div>';
  var mach = '<div class="kv"><label for="f-s-drills">' + t('drillsTop') + '</label><input id="f-s-drills" type="text" style="width:140px" data-bind="s.rules.drillsTop" value="' + esc(st.rules.drillsTop) + '">' +
    '<label for="f-s-tbd">' + t('tbHoleSet') + ' Ø</label><input id="f-s-tbd" type="text" inputmode="decimal" data-bind="s.rules.tbHole.d" data-num="1" value="' + esc(st.rules.tbHole.d) + '">' +
    '<label for="f-s-tbz">' + t('tbHoleSet') + ' ' + (S.lang === 'lt' ? 'gylis' : 'depth') + '</label><input id="f-s-tbz" type="text" inputmode="decimal" data-bind="s.rules.tbHole.depth" data-num="1" value="' + esc(st.rules.tbHole.depth) + '"></div>' +
    '<p class="note" style="margin:8px 0 0">' + t('drillsTopL') + '</p>';
  return '<div style="display:flex;flex-direction:column;gap:16px"><div><h2 style="margin:0;font:600 26px var(--f-display)">' + t('setTitle') + '</h2><p class="note" style="margin:2px 0 0">' + t('setLead') + '</p></div><div class="setgrid">' +
    '<div class="card"><h3 style="margin:0 0 4px;font:600 19px var(--f-display)">' + t('setTypes') + '</h3><p class="note" style="margin:0 0 10px">' + t('setTypesL') + '</p>' + types + '</div>' +
    '<div class="card"><h3 style="margin:0 0 10px;font:600 19px var(--f-display)">' + t('setOps') + '</h3>' + ops + '</div>' +
    '<div class="card"><h3 style="margin:0 0 10px;font:600 19px var(--f-display)">' + (S.lang === 'lt' ? 'Staklės' : 'Machine') + '</h3>' + mach + '</div>' +
    '<div class="card"><div class="row" style="justify-content:space-between;align-items:center"><h3 style="margin:0;font:600 19px var(--f-display)">' + t('setRules') + '</h3><span class="badge warn">' + t('unverified') + '</span></div><p class="note" style="margin:4px 0 10px">' + t('setRulesL') + '</p>' + rules +
      '<button class="btn" style="margin-top:12px" data-act="resetrules">' + t('resetRules') + '</button></div>' +
    '<div class="card"><h3 style="margin:0 0 4px;font:600 19px var(--f-display)">' + t('tplTitle') + '</h3><p class="note" style="margin:0 0 8px">' + t('tplLead') + '</p>' +
      '<p style="margin:0 0 10px"><b>' + esc(S.tplName ? t('tplOwn') + S.tplName : t('tplBuiltIn')) + '</b></p>' +
      '<div class="row"><label class="btn" for="f-tpl">' + t('tplUpload') + '</label><input id="f-tpl" type="file" accept=".xlsm,.xlsx" data-act-change="tpl" hidden>' +
      (S.tplName ? '<button class="btn ghost" data-act="tplreset">' + t('tplReset') + '</button>' : '') + '</div></div>' +
    '<div class="card"><h3 style="margin:0 0 4px;font:600 19px var(--f-display)">' + t('setMats') + '</h3><p class="note" style="margin:0 0 8px">' + t('setMatsL') + '</p><textarea id="f-s-materials" data-bind="s.materials" data-lines="1">' + esc(st.materials.join('\n')) + '</textarea>' +
      '<h3 style="margin:12px 0 8px;font:600 19px var(--f-display)">' + t('setEdges') + '</h3><textarea id="f-s-edges" data-bind="s.edges" data-lines="1">' + esc(st.edges.join('\n')) + '</textarea></div>' +
    '</div><p class="note">v' + VERSION + ' · ' + (S.lang === 'lt' ? 'taisyklės: offer CNC modulis (patikrinta su Spintele_su_tandem / _su_tandembox), lankstai ir lentynos — Blum katalogas' : 'rules: offer CNC module (verified on Spintele_su_tandem / _su_tandembox), hinges and shelves — Blum catalogue') + '</p></div>';
}

/* ----------------------------------------------------------------- render: projects drawer */
/* ---- start screen: new project first, then the saved ones */
function ago(iso) {
  if (!iso) return '';
  var d = new Date(iso), now = new Date(), min = Math.round((now - d) / 60000);
  if (min < 1) return t('agoNow'); if (min < 60) return t('agoMin').replace('{n}', min);
  var sameDay = d.toDateString() === now.toDateString(), pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var hm = pad(d.getHours()) + ':' + pad(d.getMinutes());
  if (sameDay) return t('agoToday') + ' ' + hm;
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + hm;
}
function viewHome() {
  var l = lib(), q = (S.homeQ || '').toLowerCase();
  var shown = l.filter(function (r) { return !q || String(r.name || '').toLowerCase().indexOf(q) >= 0; });
  var hero = '<section class="card hero"><div class="hero-t"><h2>＋ ' + t('prNew2') + '</h2><p class="note">' + t('npLead') + '</p></div>' +
    '<div class="np"><label class="f grow" for="np-name"><span>' + t('npName') + '</span><input id="np-name" type="text" autocomplete="off" placeholder="' + t('npPh') + '" value="' + esc(S.npName || '') + '"></label>' +
    '<button class="btn pri big" data-act="pcreate">' + t('npCreate') + ' →</button></div>' +
    '<div class="hero-alt"><span class="unit">' + t('npOr') + '</span><button class="btn" data-act="pimport">⤒ ' + t('npImport') + '</button><button class="btn ghost" data-act="psample">' + t('npSample') + '</button>' +
    '<input id="f-import" type="file" accept=".json,application/json" data-act-change="import" hidden></div></section>';
  var list = '<section class="card plib"><div class="plib-h"><h2>' + t('prTitle') + ' <span class="cnt">' + l.length + '</span></h2>' +
    (l.length > 5 ? '<input id="home-q" type="search" placeholder="' + t('prSearch') + '" value="' + esc(S.homeQ || '') + '" aria-label="' + t('prSearch') + '">' : '') + '</div>' +
    (shown.length ? '<div class="plib-list">' + shown.map(function (r) {
      var isCur = S.proj && S.proj.id === r.id, del = S.confirm === 'pdel' + r.id;
      return '<div class="prow' + (isCur ? ' cur' : '') + '"><button class="prow-main" data-act="popen" data-v="' + esc(r.id) + '"><b>' + esc(r.name || t('noName')) + (isCur ? ' <span class="badge ok">' + t('prOpenNow') + '</span>' : '') + '</b>' +
        '<small>' + r.n + ' ' + t('cabsN') + ' · ' + t('prUpdated') + ' ' + esc(ago(r.updated)) + '</small></button>' +
        '<span class="prow-act"><button class="btn ghost" data-act="pdup" data-v="' + esc(r.id) + '" title="' + t('prDupT') + '">' + t('prDup') + '</button>' +
        '<button class="btn ghost" data-act="pjson" data-v="' + esc(r.id) + '" title="' + t('prJsonT') + '">.json</button>' +
        '<button class="btn ghost danger" data-act="pdel" data-v="' + esc(r.id) + '">' + (del ? t('delSure') : t('del')) + '</button></span>' +
        '<button class="btn pri prow-open" data-act="popen" data-v="' + esc(r.id) + '">' + t('prOpen') + '</button></div>';
    }).join('') + '</div>' : '<p class="note empty">' + (l.length ? t('prNoMatch') : t('prNone2')) + '</p>') +
    '<p class="note" style="margin:10px 0 0">' + t('prHint2') + '</p></section>';
  return '<div class="home">' + hero + list + '</div>';
}

/* ----------------------------------------------------------------- live refresh while typing (no full re-render → focus stays) */
function refreshLive() {
  if (S.home) return;
  if (S.tab !== 'cab' || S.picking || !cur()) { if (S.tab === 'set') return; return; }
  var inf = buildOne(S.sel); S._info[S.sel] = inf;
  var sk = document.getElementById('sketch'); if (sk) sk.innerHTML = sketchOf(cur());
  var xs = document.getElementById('xsec'); if (xs) xs.innerHTML = sectionSVG(cur(), inf.r, S.xside === 'R' ? 'R' : 'L');
  mountIso();
  var wr = document.getElementById('warns'); if (wr) wr.innerHTML = inf.warnings.map(function (x) { var lv = level(x); return '<div class="w ' + lv + '"><span class="tag">' + t(lv === 'bad' ? 'errTag' : lv === 'warn' ? 'warnTag' : 'infoTag') + '</span><span>' + esc(x) + '</span></div>'; }).join('');
  var tb = document.querySelector('.paper .tb'); var c = cur();
  if (tb) tb.innerHTML = '<b>' + (S.sel + 1) + ' · ' + esc(c.name || typeName(c)) + '</b><span>' + fmt(c.dishwasher ? c.dishWidth : c.W) + '×' + fmt(c.H) + '×' + fmt(c.D) + '</span>';
  var cmap = document.getElementById('colmap'); if (cmap && !c.dishwasher) cmap.innerHTML = colMapInner(c);
  if (!c.dishwasher) document.querySelectorAll('.zone[data-col]').forEach(function (zn) { var z2 = zoneInfo(c, +zn.getAttribute('data-col')); zn.className = 'zone' + (z2.over ? ' over' : ''); zn.innerHTML = zoneHtml(z2); });
  var zone = null; if (zone && !c.dishwasher) { var z = zoneInfo(c); zone.className = 'zone' + (z.over ? ' over' : ''); zone.innerHTML = t('zone') + ' <b>' + fmt(z.Hz) + '</b> mm · ' + t('used') + ' <b>' + fmt(z.exp + z.fillH * z.nFill) + '</b>' + (z.over ? ' · <b>' + t('over') + ' ' + fmt(z.exp - z.Hz) + '</b>' : ''); }
}

/* ----------------------------------------------------------------- 3D connector editor (iso.js) */
S.iso = null; S.undo = [];
function pushUndo() { var c = cur(); if (!c) return; S.undo.push({ id:c.id, joints:clone(c.cnc.joints || {}) }); if (S.undo.length > 40) S.undo.shift(); }
function canUndo() { var c = cur(); return !!c && S.undo.some(function (u) { return u.id === c.id; }); }
function undoJoints() {
  var c = cur(); if (!c) return false;
  for (var i = S.undo.length - 1; i >= 0; i--) if (S.undo[i].id === c.id) { c.cnc.joints = S.undo[i].joints; S.undo.splice(i, 1); save(); render(); toast(t('isoUndone')); return true; }
  return false;
}
/* patch from the 3D editor: { side:null|'L'|'R', type, pos|null }. side null → both sides; otherwise only that side
   changes and the other keeps what it had. Two identical sides collapse back into one entry. */
function setJoint(c, key, patch) {
  var J = c.cnc.joints = c.cnc.joints || {};
  var spec = function (p) { return p.pos ? { type:p.type, pos:p.pos.map(function (a) { return Math.round(a * 10) / 10; }) } : { type:p.type }; };
  if (!patch.side) { J[key] = spec(patch); return; }
  var old = J[key] || {}, split = !!(old.L || old.R), other = patch.side === 'L' ? 'R' : 'L', nj = {};
  nj[other] = clone(split ? (old[other] || {}) : old);
  nj[patch.side] = spec(patch);
  J[key] = JSON.stringify(nj.L) === JSON.stringify(nj.R) ? nj.L : nj;
}
function syncXsec() {
  var r = S._info && S._info[S.sel] ? S._info[S.sel].r : null, xs = document.getElementById('xsec'); if (!xs || !r) return;
  xs.innerHTML = sectionSVG(cur(), r, S.xside === 'R' ? 'R' : 'L');
  var cap = document.getElementById('xcap'); if (cap) cap.textContent = t('xsec') + ' · ' + t(S.xside === 'R' ? 'xSideR' : 'xSideL');
  document.querySelectorAll('[data-act=xside]').forEach(function (b) { var on = b.getAttribute('data-v') === (S.xside === 'R' ? 'R' : 'L'); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
}
function mountIso(focus) {
  var el = document.getElementById('iso3d'), c = cur();
  if (!el || !ISO || !c || c.dishwasher || !S._info || !S._info[S.sel]) return;
  var r = S._info[S.sel].r; if (!r.seams || !r.seams.length) { el.innerHTML = '<p class="note">' + t('isoNoJ') + '</p>'; return; }
  if (S.iso && !(r.joints || []).some(function (j) { return j.key === S.iso.key; })) S.iso = null;
  ISO.attach(el, { r:r, sel:S.iso, t:t, legH:c.cnc.legs ? num(c.legH) || 0 : 0, canUndo:canUndo(), focusStage:!!focus, toast:toast, mode:store('dbKurejas.isoMode') || 'both',
    onMode:function (m) { store('dbKurejas.isoMode', m); },
    onSelect:function (sel) { S.iso = sel; if (sel && sel.side && S.xside !== sel.side) { S.xside = sel.side; syncXsec(); } mountIso(true); },
    onCommit:function (key, patch, meta) {
      pushUndo(); setJoint(cur(), key, patch);
      S.iso = meta && meta.sel !== undefined ? meta.sel : S.iso; if (S.iso && S.iso.side) S.xside = S.iso.side; save(); render(); mountIso(true);
      if (meta && meta.msg) toast(meta.msg);
    },
    onReset:function (key) { pushUndo(); var cc = cur(); if (cc.cnc.joints) delete cc.cnc.joints[key]; S.iso = { key:key, idx:null }; save(); render(); },
    onUndo:function () { undoJoints(); } });
}

/* ----------------------------------------------------------------- whole kitchen (room.js) */
S.roomSel = null; S.roomUndo = [];
function roomPresets() {
  return PRESETS.map(function (p, i) { var ty = S.settings.types[p.type] || {}; return { i:i, name:t(p.k), icon:ico(p.k), W:p.W, H:p.H, D:p.D, type:p.type, dish:!!p.dish, legs:!!ty.legs, legH:100 }; });
}
function roomUndoPush() { S.roomUndo.push(clone(S.proj)); if (S.roomUndo.length > 40) S.roomUndo.shift(); }
function roomUndo() { var p = S.roomUndo.pop(); if (!p) return false; S.proj = p; S.proj.cabinets = S.proj.cabinets.map(normCab); if (S.roomSel != null && S.roomSel >= S.proj.cabinets.length) S.roomSel = null; save(); render(); toast(t('isoUndone')); return true; }
function mountRoom(focus) {
  var el = document.getElementById('room'); if (!el || !RM || !S.proj) return;
  if (RM.ensure(S.proj)) save();
  if (S.roomSel != null && !S.proj.cabinets[S.roomSel]) S.roomSel = null;
  RM.attach(el, { proj:S.proj, infos:S._info || [], sel:S.roomSel, t:t, toast:toast, presets:roomPresets(), canUndo:S.roomUndo.length > 0, focusStage:!!focus, confirmDel:S.confirm === 'rmdel' + S.roomSel,
    onSelect:function (i) { S.roomSel = i; S.confirm = null; if (i != null) S.sel = i; mountRoom(true); },
    onLayout:function (fn, o) { o = o || {}; roomUndoPush(); fn(S.proj); if (o.sel !== undefined) S.roomSel = o.sel; save(); render(); if (o.focus) mountRoom(true); if (o.msg) toast(o.msg); },
    onCab:function (i, patch, after) { roomUndoPush(); Object.assign(S.proj.cabinets[i], patch); if (patch.W && S.proj.cabinets[i].dishwasher) S.proj.cabinets[i].dishWidth = patch.W; if (after) after(S.proj); save(); render(); },
    onAdd:function (k, wall, x, fitW) {
      roomUndoPush(); var c = fromPreset(PRESETS[k]); if (fitW) { c.W = fitW; c.dishWidth = fitW; }
      S.proj.cabinets.push(c); var i = S.proj.cabinets.length - 1;
      if (wall != null) S.proj.layout.items[c.id] = { wall:wall, x:x };
      S.roomSel = i; S.sel = i; save(); render(); toast(t('rmAdded').replace('{n}', i + 1));
    },
    onDup:function (i) {
      roomUndoPush(); var src = S.proj.cabinets[i], cp = clone(src); cp.id = uid(); cp.name = src.name ? src.name + ' (2)' : '';
      S.proj.cabinets.splice(i + 1, 0, cp); var it = S.proj.layout.items[src.id];
      if (it && it.wall >= 0) S.proj.layout.items[cp.id] = { wall:it.wall, x:it.x + RM.cabW(src), z:it.z };
      S.roomSel = i + 1; S.sel = i + 1; save(); render();
    },
    onDelete:function (i) {
      if (S.confirm !== 'rmdel' + i) { S.confirm = 'rmdel' + i; mountRoom(); return; }
      S.confirm = null; roomUndoPush(); var c = S.proj.cabinets[i]; S.proj.cabinets.splice(i, 1); delete S.proj.layout.items[c.id];
      S.roomSel = null; S.sel = Math.max(0, Math.min(S.sel, S.proj.cabinets.length - 1)); save(); render(); toast(t('rmDeleted'));
    },
    onEdit:function (i) { S.sel = i; S.tab = 'cab'; S.picking = false; S.iso = null; render(); window.scrollTo(0, 0); },
    onUndo:function () { roomUndo(); } });
}

/* ----------------------------------------------------------------- events */
function target(bind) {
  if (bind.indexOf('c.') === 0) return { obj:cur(), path:bind.slice(2) };
  if (bind.indexOf('s.') === 0) return { obj:S.settings, path:bind.slice(2) };
  if (bind.indexOf('p.') === 0) return { obj:S.proj, path:bind.slice(2) };
  return null;
}
function after(bind, full) {
  if (bind.indexOf('s.') === 0) { store('dbKurejas.settings', S.settings); applyRules(); }
  else save();
  if (full) render(); else refreshLive();
}
function assign(bind, raw) {
  var tg = target(bind); if (!tg) return;
  var v = raw;
  if (raw === 'true') v = true; else if (raw === 'false') v = false;
  if (bind === 'c.cnc.tbOn') { setPath(tg.obj, 'cnc.tbFront', raw ? (S.settings.ops.tbFront !== 'off' ? S.settings.ops.tbFront : 'mark') : 'off'); return; }
  if (bind === 'c.cnc.pinsOn') { setPath(tg.obj, 'cnc.pins', raw ? (S.settings.ops.pins !== 'off' ? S.settings.ops.pins : 'shelf') : 'off'); return; }
  if (bind === 'c.type') { setPath(tg.obj, 'type', v); var ty = S.settings.types[v]; ['joinery', 'top', 'back', 'backFix', 'topOverFacade', 'legs'].forEach(function (k) { tg.obj.cnc[k] = ty[k]; });
    tg.obj.cnc.rails = { front:ty.railFront, back:ty.railBack, bottom:!!ty.railBottom };
    tg.obj.cnc.backs = tg.obj.cnc.backs.map(function () { return legacyBack(ty); }); tg.obj.cnc.backMount = ty.back === 'inside' ? 'inside' : 'top'; return; }
  if (bind === 'c.cols') { tg.obj.cols = +v; tg.obj.colW = []; fixCols(tg.obj); return; }
  if (/^c\.sections\.\d+\.(shelves|rail)$/.test(bind) && typeof v === 'string' && /^\d+$/.test(v)) v = +v;
  setPath(tg.obj, tg.path, v);
  if (/^c\.(colW\.\d+|W)$/.test(bind) && tg.obj.cols > 1) { tg.obj.colW = colWidths(tg.obj); var last = document.getElementById('colw-last'); if (last) last.textContent = fmt(tg.obj.colW[tg.obj.colW.length - 1]) + ' mm'; }
}
app.addEventListener('input', function (e) {
  if (e.target.id === 'np-name') { S.npName = e.target.value; e.target.removeAttribute('aria-invalid'); return; }
  if (e.target.id === 'home-q') { S.homeQ = e.target.value; var pos = e.target.selectionStart; render(); var q = document.getElementById('home-q'); if (q) { q.focus(); try { q.setSelectionRange(pos, pos); } catch (er) {} } return; }
  var el = e.target, bind = el.getAttribute('data-bind'); if (!bind || el.type === 'checkbox' || el.tagName === 'SELECT') return;
  if (el.getAttribute('data-lines')) { setPath(S.settings, bind.slice(2), el.value.split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean)); store('dbKurejas.settings', S.settings); return; }
  assign(bind, (el.getAttribute('data-num') && bind.indexOf('s.') === 0) ? num(el.value) : el.value);
  if (el.required) { if (el.value.trim()) el.removeAttribute('aria-invalid'); else el.setAttribute('aria-invalid', 'true'); }
  if (bind === 'p.name') { if (el.value.trim()) el.removeAttribute('aria-invalid'); else el.setAttribute('aria-invalid', 'true'); }
  if (bind === 'c.name') { var b = document.querySelector('.cab.on b'); if (b) b.firstChild.textContent = el.value || typeName(cur()); }
  if (/^c\.(W|H|D|dishWidth)$/.test(bind)) { var sm = document.querySelector('.cab.on small'); var c = cur(); if (sm) sm.textContent = fmt(c.dishwasher ? c.dishWidth : c.W) + '×' + fmt(c.H) + '×' + fmt(c.D); }
  after(bind, false);
});
app.addEventListener('change', function (e) {
  var el = e.target;
  if (el.getAttribute('data-act-change') === 'import') { importFile(el.files && el.files[0]); return; }
  if (el.getAttribute('data-act-change') === 'tpl') { loadTemplateFile(el.files && el.files[0]); el.value = ''; return; }
  var bind = el.getAttribute('data-bind'); if (!bind || el.getAttribute('data-lines')) return;
  if (el.type === 'checkbox') assign(bind, el.checked);
  else if (el.getAttribute('data-num') && el.getAttribute('data-empty') && !String(el.value).trim()) assign(bind, '');
  else if (el.getAttribute('data-num')) { var n = num(el.value); assign(bind, n); el.value = E.num(n); }
  else assign(bind, el.value);
  var full = el.type === 'checkbox' || el.tagName === 'SELECT' || /\.(nDrawers|nDoors|shelves|height|frontH\.\d+|doorSplit)$/.test(bind) || /cnc\.joints\./.test(bind) || /^c\.(colW\.|W$)/.test(bind) || bind === 'p.name';
  if (full) { if (bind.indexOf('s.') === 0) { store('dbKurejas.settings', S.settings); applyRules(); } else save(); setTimeout(render, 0); }   // after focus has moved, so it is restored
  else after(bind, false);
});
app.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type === 'text') {   // Enter → next field (as in the offer app)
    var all = Array.prototype.slice.call(app.querySelectorAll('input[type=text]')), i = all.indexOf(e.target);
    e.target.blur(); if (all[i + 1]) { var nx = document.getElementById(all[i + 1].id) || all[i + 1]; nx.focus(); if (nx.select) nx.select(); }
    e.preventDefault();
  }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute && e.target.getAttribute('data-act') === 'part') { e.preventDefault(); e.target.click(); }
  if (e.key === 'Enter' && e.target.id === 'np-name') { e.preventDefault(); var b = document.querySelector('[data-act=pcreate]'); if (b) b.click(); return; }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z') && S.tab === 'cab' && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && undoJoints()) e.preventDefault();
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z') && S.tab === 'room' && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) && roomUndo()) e.preventDefault();
});
app.addEventListener('click', function (e) {
  var el = e.target.closest('[data-act]'); if (!el) return;
  var act = el.getAttribute('data-act'), v = el.getAttribute('data-v'), i = +el.getAttribute('data-i');
  if (act === 'closeDrawer' && e.target.closest('[data-stop]') && el.classList.contains('overlay')) return;
  if (act !== 'del' && act !== 'pnew' && act !== 'pdel') S.confirm = null;
  switch (act) {
    case 'tab': S.tab = v; S.picking = false; window.scrollTo(0, 0); break;
    case 'lang': S.lang = v; store('dbKurejas.lang', v); break;
    case 'sel': S.sel = i; S.picking = false; S.iso = null; S.colSel = 0; break;
    case 'pick': S.picking = true; break;
    case 'unpick': S.picking = false; break;
    case 'preset': S.proj.cabinets.push(fromPreset(PRESETS[i])); S.sel = S.proj.cabinets.length - 1; S.picking = false; save(); break;
    case 'dup': { var cp = clone(cur()); cp.id = uid(); cp.name = cp.name ? cp.name + ' (2)' : ''; S.proj.cabinets.splice(S.sel + 1, 0, cp); S.sel++; save(); break; }
    case 'del': if (S.confirm !== 'del') { S.confirm = 'del'; break; } S.confirm = null; S.proj.cabinets.splice(S.sel, 1); S.sel = Math.max(0, S.sel - 1); save(); break;
    case 'set': assign(el.getAttribute('data-bind'), v); after(el.getAttribute('data-bind'), true); return;
    case 'addsec': { var ns = newSection(v); ns.col = isNaN(i) ? 0 : i; S.colSel = ns.col; cur().sections.push(ns); save(); break; }
    case 'colsel': S.colSel = +v; break;
    case 'mv': { var cc0 = cur(), a = cc0.sections, cl = colOf(cc0, a[i]), idx = a.map(function (s, q) { return q; }).filter(function (q) { return colOf(cc0, a[q]) === cl; }), p0 = idx.indexOf(i), j = idx[p0 + (+v)];
      if (j == null) return; var tmp = a[i]; a[i] = a[j]; a[j] = tmp; save(); break; }
    case 'fhreset': delete cur().sections[i].frontH; save(); break;
    case 'rmsec': { var rc = cur(), gone = rc.sections.splice(i, 1)[0]; save(); render();
      toast(t('secRemoved'), false, t('undoBtn'), function () { var c2 = S.proj && S.proj.cabinets.filter(function (x) { return x.id === rc.id; })[0]; if (!c2) return; c2.sections.splice(Math.min(i, c2.sections.length), 0, gone); save(); render(); });
      return; }
    case 'addx': { var cc = cur(); cc.extras.push(v === 'plinth' ? { name:t('exPlinth'), L:num(cc.W), W:Math.max(40, num(cc.legH) - 2), T:num(cc.thick) || 18, qty:1, mat:cc.mat.facade || cc.mat.carc, e1:true }
                                                   : { name:t('exAdd'), L:num(cc.W), W:100, T:num(cc.thick) || 18, qty:1, mat:cc.mat.carc }); save(); break; }
    case 'rmx': cur().extras.splice(i, 1); save(); break;
    case 'xside': S.xside = v; break;
    case 'jreset': pushUndo(); if (cur().cnc.joints) delete cur().cnc.joints[v]; save(); break;
    case 'isosel': S.iso = { key:v, side:'L', idx:null }; render(); var ie = document.getElementById('iso3d'); if (ie && ie.scrollIntoView) ie.scrollIntoView({ block:'center', behavior:'smooth' }); return;
    case 'part': S.part = v; S.ptab = 0; break;
    case 'ptab': S.ptab = +v; break;
    case 'copy': { var txt = (document.getElementById('progtext') || {}).textContent || ''; var ok = function () { toast(t('copied')); }; var fb = function () { var r = document.createRange(); r.selectNodeContents(document.getElementById('progtext')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
      try { navigator.clipboard.writeText(txt).then(ok, fb); } catch (er) { fb(); } return; }
    case 'dl': download(v); return;
    case 'dlprog': e.stopPropagation(); saveProgs([v]); return;
    case 'dlpart': saveProgs(buildProjectAll().parts.filter(function (p) { return p.name === v; }).reduce(function (a, p) { return a.concat((p.progs || []).map(function (f) { return f.file; })); }, [])); return;
    case 'dlcab': saveProgs(buildProjectAll().parts.filter(function (p) { return String(p.cab) === v; }).reduce(function (a, p) { return a.concat((p.progs || []).map(function (f) { return f.file; })); }, [])); return;
    case 'dlall': saveProgs(buildProjectAll().files.map(function (f) { return f.name; })); return;
    case 'tplreset': S.tplB64 = null; S.tplName = ''; try { localStorage.removeItem('dbKurejas.reportTpl'); } catch (e) {} break;
    case 'print': try { window.print(); } catch (er) {} return;
    case 'resetrules': S.settings.rules = clone(RULE_DEF); store('dbKurejas.settings', S.settings); applyRules(); break;
    case 'goto': gotoStep(v); return;
    case 'fixcab': S.home = false; S.tab = 'cab'; S.sel = i; S.picking = false; render(); setTimeout(function () { gotoStep('st-' + (v || 'mats')); }, 30); return;
    case 'fixname': { var pn = document.getElementById('projname'); if (pn) { pn.focus(); pn.scrollIntoView({ block:'center' }); } return; }
    case 'home': if (S.proj) { clearTimeout(libTimer); libSave(); } S.home = true; S.confirm = null; window.scrollTo(0, 0); break;
    case 'pcreate': { var nm = ((document.getElementById('np-name') || {}).value || '').trim();
      if (!nm) { toast(t('npNeed'), true); var nf = document.getElementById('np-name'); if (nf) { nf.focus(); nf.setAttribute('aria-invalid', 'true'); } return; }
      S.npName = ''; newProject(nm); toast(t('npDone').replace('{n}', nm)); break; }
    case 'pimport': { var fi = document.getElementById('f-import'); if (fi) fi.click(); return; }
    case 'psample': { var sp = sample(); sp.id = uid(); openProject(sp); libSave(); break; }
    case 'pdup': { var src = lib().filter(function (r) { return r.id === v; })[0]; if (!src) break; var cp2 = clone(src.data); cp2.id = uid(); cp2.name = (cp2.name || '') + ' ' + t('copySfx'); cp2.updated = new Date().toISOString();
      libSet([libRec(cp2)].concat(lib())); toast(t('prDupDone')); break; }
    case 'pjson': { var rj = lib().filter(function (r) { return r.id === v; })[0]; if (rj) saveFile(E.safeName(rj.name || 'PROJEKTAS') + '_projektas.json', JSON.stringify(rj.data, null, 1)); return; }
    case 'pnew': if (S.proj) { clearTimeout(libTimer); libSave(); } S.home = true; S.focusNew = true; S.confirm = null; window.scrollTo(0, 0); break;
    case 'popen': { var rec = lib().filter(function (r) { return r.id === v; })[0]; if (rec) { if (S.proj && S.proj.id !== rec.id) { clearTimeout(libTimer); libSave(); } openProject(rec.data); } break; }
    case 'pdel': { if (S.confirm !== 'pdel' + v) { S.confirm = 'pdel' + v; break; } S.confirm = null; libSet(lib().filter(function (r) { return r.id !== v; }));
      if (S.proj && S.proj.id === v) { S.proj = null; try { localStorage.removeItem('dbKurejas.current'); } catch (er) {} } toast(t('prDeleted')); break; }
  }
  render();
});
var tTimer;
function toast(msg, err, actLabel, actFn) {
  var d = document.getElementById('toast'); if (!d) { d = document.createElement('div'); d.id = 'toast'; d.setAttribute('role', 'status'); document.body.appendChild(d); }
  d.className = 'toast' + (err ? ' err' : ''); d.textContent = msg;
  if (actLabel && actFn) { var bt = document.createElement('button'); bt.type = 'button'; bt.className = 'toast-act'; bt.textContent = '↶ ' + actLabel;
    bt.addEventListener('click', function () { d.hidden = true; clearTimeout(tTimer); actFn(); }); d.appendChild(bt); }
  d.hidden = false; clearTimeout(tTimer); tTimer = setTimeout(function () { d.hidden = true; }, actFn ? 6000 : 2600);
}

/* ----------------------------------------------------------------- import (own JSON or the offer app's export) */
function importFile(file) {
  if (!file) return;
  var rd = new FileReader();
  rd.onload = function () {
    try {
      var d = JSON.parse(rd.result), p;
      if (d && d.app === 'db-kurejas' && Array.isArray(d.cabinets)) { p = d; p.id = p.id || uid(); }
      else if (d && Array.isArray(d.cabinets)) p = fromOffer(d);
      else throw new Error('format');
      if (lib().some(function (r) { return r.id === p.id; })) p.id = uid();   // importing the same file twice gives two projects, not an overwrite
      openProject(p); save(); clearTimeout(libTimer); libSave(); render();
      toast(t('imported') + p.cabinets.length);
    } catch (er) { toast(t('badFile'), true); }
  };
  rd.readAsText(file);
}
function fromOffer(d) {
  var mats = {}; (d.materials || []).forEach(function (m) { mats[m.id] = m.name; });
  var mname = function (v) { return mats[v] || v || ''; };
  return { app:'db-kurejas', v:1, id:uid(), name:E.safeName(d.projectName || '') || '', cabinets:d.cabinets.map(function (c) {
    var type = TYPES.indexOf(c.type) >= 0 ? c.type : 'PASTATOMOS';
    var cab = { name:c.name || '', type:type, W:num(c.W), H:num(c.H), D:num(c.D), thick:num(c.thick) || 18, cols:num(c.cols) || 1, colW:c.colW || [], dishwasher:!!c.dishwasher, dishWidth:num(c.dishWidth) || 600,
      mat:{ carc:mname(c.carcMat), facade:mname(c.defFacadeMat), back:mname(c.carcMat) }, edge:{ carc:'', facade:'' }, cnc:(function () { var o2 = cncFor(type);
        if (c.hasBack === false) o2.backs = ['none']; else if (c.backType === 'hdf' || !c.backType) o2.backs = ['hdf']; else o2.backs = ['solid']; return o2; })(),
      sections:(c.sections || []).map(function (s) { var o = {}; ['kind', 'col', 'fill', 'height', 'nDrawers', 'hw', 'rail', 'nDoors', 'hinge', 'doorSplit', 'hingeSide', 'shelves', 'shelfAdj', 'shelfMode', 'shelfPos', 'innerDrawers'].forEach(function (k) { if (s[k] !== undefined) o[k] = s[k]; }); return o; }) };
    return cab;
  }) };
}

/* ----------------------------------------------------------------- downloads */
function csvOf(pj) {
  var q = function (v) { v = String(v == null ? '' : v); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  var rows = [['Nr', 'Part', 'Detale', 'Spintele', 'Medziaga', 'Ilgis', 'Plotis', 'Storis', 'Kiekis', 'Krastai', 'Krasto medziaga', '1OP', '2OP']];
  pj.parts.forEach(function (p, i) { rows.push([i + 1, p.name, p.short, p.cab, p.mat, E.num(p.L), E.num(p.W), E.num(p.T), p.qty, X.edgeText(p.eb), [p.eb.eb1, p.eb.eb2, p.eb.eb3, p.eb.eb4].filter(function (x, k, a) { return x && a.indexOf(x) === k; }).join(', '), p.op1, p.op2]); });
  return '﻿' + rows.map(function (r) { return r.map(q).join(';'); }).join('\r\n') + '\r\n';
}
function plainXlsm(pj) { return Z.zip(Z.fromEntries(X.workbookEntries(X.sheets(pj)))); }
/* ReportLists exactly as DB_PartList v18 writes it (report.js on the built-in or the user's template) */
function xlsmBytes(pj) {
  var b64 = S.tplB64 || window.DB_REPORT_TEMPLATE_B64;
  if (!window.DBReport || !window.JSZip || !b64) { toast(t('rptFallback'), true); return Promise.resolve(plainXlsm(pj)); }
  return window.DBReport.buildReport(b64ToBytes(b64), X.reportInput(pj), { version:'v18-kurejas-' + VERSION })
    .catch(function (e) { console.error(e); toast(t('rptFallback'), true); return plainXlsm(pj); });
}
function zipAll(pj) {
  return xlsmBytes(pj).then(function (xl) { return zipFiles(pj, xl); });
}
function zipFiles(pj, xl) {
  var base = pj.project, files = [];
  pj.files.forEach(function (f) { files.push({ name:base + '_XXL/' + f.name, data:f.text }); });
  files.push({ name:base + '_ReportLists_to_Excel.xlsm', data:xl });
  files.push({ name:base + '_detales.csv', data:csvOf(pj) });
  files.push({ name:base + '_projektas.json', data:JSON.stringify(S.proj, null, 1) });
  if (pj.warnings.length) files.push({ name:base + '_pastabos.txt', data:pj.warnings.join('\r\n') + '\r\n' });
  return Z.zip(files);
}
function download(kind) {
  var pj = buildProjectAll(), base = pj.project, name, data;
  if (kind === 'zip' || kind === 'xlsm') {
    toast(t('building'));
    (kind === 'zip' ? zipAll(pj) : xlsmBytes(pj)).then(function (u) { saveFile(kind === 'zip' ? base + '_CNC.zip' : base + '_ReportLists_to_Excel.xlsm', u); });
    return;
  }
  if (kind === 'csv') { name = base + '_detales.csv'; data = csvOf(pj); }
  else { name = base + '_projektas.json'; data = JSON.stringify(S.proj, null, 1); }
  saveFile(name, data);
}
/* separate .XXL files (no ZIP): one download each, spaced so the browser lets them all through */
function saveProgs(names) {
  var pj = buildProjectAll(), map = {}; pj.files.forEach(function (f) { map[f.name] = f.text; });
  names = names.filter(function (n) { return map[n] != null; });
  if (!names.length) { toast(t('noProg'), true); return; }
  if (names.length > 1) toast(t('xxlSaving').replace('{n}', names.length));
  names.forEach(function (n, i) { setTimeout(function () { saveFile(n, map[n], 'application/octet-stream'); }, i * (IN_ARTIFACT ? 450 : 300)); });
}
function saveFile(name, data, type) {
  var blob = data instanceof Uint8Array ? new Blob([data]) : new Blob([data], { type:type || 'text/plain;charset=utf-8' });
  if (IN_ARTIFACT) {
    window.claude.use('downloads').then(function (dl) {
      if (!dl) { toast(t('dlFail') + 'unavailable', true); return; }
      return dl.save({ filename:name, data:blob }).catch(function (er) { toast(er && er.code === 'declined' ? t('dlDeclined') : t('dlFail') + (er && er.code || ''), er && er.code !== 'declined'); });
    });
    return;
  }
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}

document.documentElement.lang = S.lang;
render();
window.__dbk = { S:S, render:render, buildProjectAll:buildProjectAll, zipAll:zipAll, xlsmBytes:xlsmBytes, csvOf:csvOf, fromOffer:fromOffer, normCab:normCab, PRESETS:PRESETS, fromPreset:fromPreset };
})();
