@echo off
setlocal
rem ===================================================================
rem  Vienkartinis veiksmas.
rem  Suteikia visiems kompiuterio naudotojams teise rasyti i stakliu
rem  aplanka, kad kaskart nebereiketu administratoriaus (UAC) lango.
rem
rem  Keiciamas TIK sis vienas aplankas - niekas kitas neliesiamas.
rem ===================================================================

set "TARGET=C:\Program Files (x86)\Autech\Hicam2\Works\Taisyti ceche"

net session >nul 2>&1
if %errorlevel% equ 0 goto :admin
echo Reikia administratoriaus teisiu - prasoma...
powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
exit /b

:admin
echo.
echo Aplankas:
echo   %TARGET%
echo.

if exist "%TARGET%\" goto :grant
echo KLAIDA: tokio aplanko nera.
echo Patikrinkite kelia ir pataisykite si faila (eilute su TARGET=).
echo.
pause
exit /b 1

:grant
rem  *S-1-5-32-545 = vietine "Users" grupe. Naudojamas SID, o ne vardas,
rem  nes lietuviskoje Windows grupes vardas yra isverstas.
icacls "%TARGET%" /grant *S-1-5-32-545:(OI)(CI)M
if %errorlevel% neq 0 goto :failed

echo.
echo PAVYKO. Nuo siol "Siusti i stakles.bat" veiks be UAC lango.
echo.
echo Jei norite - dabar galite isbandyti ir "2 - Sukurti X diska.bat":
echo tada programa ras tiesiai i stakles ir skripto visai nereikes.
echo.
pause
exit /b 0

:failed
echo.
echo NEPAVYKO suteikti teisiu (icacls klaida %errorlevel%).
echo Gali buti, kad politika to neleidzia - tada naudokite
echo "Siusti i stakles.bat" su UAC langu.
echo.
pause
exit /b 1
