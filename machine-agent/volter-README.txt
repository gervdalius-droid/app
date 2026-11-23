ShopFlow · Volter CNC pagalbininkas
===================================

Ką daro: operatorius nuskenuoja Nesting išdėstymo lapo QR kodą (NS-XXXXXX-03).
Pagalbininkas nusiunčia jį į ShopFlow. ShopFlow tada:
  • suranda Nesting projektą ir tos plokštės detales,
  • paleidžia projekto Pjovimo etapą ir įskaito plokštės detales,
  • Cecho plane Volter rodomas dirbantis su tuo projektu.
Jei ShopFlow nežino, kuriam projektui plokštė skirta, stoties ekrane
iššoka langas: operatorius pasirenka projektą ir spaudžia „Pradėti“.
Kitos to paties Nesting projekto plokštės priskiriamos automatiškai.

Klaviatūros rašymas nėra nei saugomas, nei siunčiamas: klausomasi tik skenerio.
Kodai skaitomi pagal US klavišų išdėstymą, todėl lietuviška klaviatūra
skaitmenų nepaverčia į ą č ę ė.

Įdiegimas (CNC operatorių kambario kompiuteryje, kur įjungtas skenerio USB imtuvas):
  1. Išarchyvuokite šį aplanką bet kur (pvz. Darbalaukyje).
  2. Paleiskite install.cmd.
  3. Įveskite ShopFlow slaptažodį (paskyra shopflow@dedesbaldai.lt).
  4. Nuskenuokite bet kurio išdėstymo lapo QR kodą — skeneris atpažįstamas.
Ekrano apačioje dešinėje atsiras piktograma: užvedus pelę matosi šiandienos
skenavimų skaičius ir paskutinis kodas. Dešinys pelės mygtukas → meniu.

Stoties ekranas (iššokančiam langui): tame pačiame kompiuteryje vieną kartą
atidarykite https://app.dedesbaldai.lt/shopflow-app/?station=volter
ir prisijunkite. Kompiuteris tai įsimena.

Patikrinimas: test.cmd atidaro langą, kuriame matosi kiekvienas skenavimas
ir ar jis būtų siunčiamas ("SIŲST").
Pašalinimas: uninstall.cmd.
Žurnalas: %LOCALAPPDATA%\ShopFlow\volter\volter-agent.log
