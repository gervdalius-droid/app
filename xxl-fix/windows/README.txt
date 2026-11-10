XXL Fix - kaip siusti programas i stakles
=========================================

PROBLEMA

Stakliu aplankas yra
    C:\Program Files (x86)\Autech\Hicam2\Works\Taisyti ceche

Cia susideda du apribojimai:

  1. Chrome is principo neleidzia narsyklei rasyti i sistemines vietas
     (disko saknis, Windows, Program Files, ProgramData). Rodo klaida
     "can't open this folder because it contains system files".
     Apeiti to narsykles nustatymais negalima.

  2. Windows i Program Files be administratoriaus teisiu irasyti neleidzia.

Zemiau - ka su tuo daryti. Pradekite nuo 1 zingsnio, jis butinas abiem keliams.


-------------------------------------------------------------------
1 ZINGSNIS (butinas, atliekamas viena karta)
-------------------------------------------------------------------

Paleiskite:

    1 - Leisti rasyti (administratorius).bat

Jis papraso administratoriaus teisiu ir suteikia visiems kompiuterio
naudotojams teise rasyti i TA VIENA aplanka "Taisyti ceche".
Daugiau niekas nekeiciama.

Po sito UAC langas nebesikartos.


-------------------------------------------------------------------
2 ZINGSNIS - pasirinkite viena is dvieju budu
-------------------------------------------------------------------

BUDAS A - virtualus diskas (paprasciausias, jei suveiks)

    Paleiskite:  2 - Sukurti X diska (nebutina).bat

    Jis sukuria diska X:, rodanti i Hicam2 "Works" aplanka. Chrome tokio
    kelio nebelaiko sistemine vieta, todel programoje galima pasirinkti

        X:\Taisyti ceche

    ir spaudziant "Irasyti i aplanka" failas atsiranda tiesiai staklese.
    Jokio kopijavimo skripto nereikia.

    Skriptas pasiulys ideti nuoroda i Startup, kad po perkrovimo diskas
    atsirastu automatiskai.

    PASTABA: ar Chrome priims X: diska, imanoma patikrinti tik pabandzius.
    Jei vis tiek rodys "contains system files" - naudokite buda B.


BUDAS B - kopijavimo skriptas (visada veikia)

    Programoje pasirinkite paprasta aplanka, pvz.

        C:\Users\<jusu vardas>\CNC-OUT

    (jei tokio nera - ji sukurs "Siusti i stakles.bat" pirma karta)

    Tada:
      - programoje spaudziate "Irasyti i aplanka"  -> failas atsiranda CNC-OUT
      - paleidziate "Siusti i stakles.bat"         -> failas nukeliauja i stakles

    Kad butu automatiskai: ryte paleiskite

        Siusti i stakles - STEBETI.bat

    ir palikite langa atidaryta. Kiekvienas naujas failas nukopijuojamas
    per kelias sekundes. Atlikus 1 zingsni sis langas UAC nebeprasys, todel
    ji galima ideti ir i Startup.


-------------------------------------------------------------------
KA SKRIPTAS DARO IR KO NEDARO
-------------------------------------------------------------------

  - kopijuoja tik *.XXL failus
  - kopijuoja tik naujus arba pasikeitusius (to paties nekartoja)
  - originalu is CNC-OUT netrina - jie lieka kaip archyvas
  - nieko netrina stakliu aplanke


-------------------------------------------------------------------
JEI KELIAS KITOKS
-------------------------------------------------------------------

Kelias irasytas kiekvieno .bat failo virsuje (eilute TARGET= arba WORKS=).
Pakeiskite ji uzrasineje. Arba is komandines eilutes:

    powershell -ExecutionPolicy Bypass -File cnc-copy.ps1 -To "D:\kitas\kelias"
