@echo off
setlocal
rem ===================================================================
rem  NEBUTINA, bet patogiausia.
rem  Sukuria virtualu diska X:, rodanti i Hicam2 "Works" aplanka.
rem  Chrome tokio kelio nebelaiko sistemine vieta, todel programa gali
rem  rasyti TIESIAI i stakles - jokio kopijavimo skripto nereikia.
rem
rem  Salyga: pries tai turi buti paleistas
rem          "1 - Leisti rasyti (administratorius).bat"
rem ===================================================================

set "WORKS=C:\Program Files (x86)\Autech\Hicam2\Works"
set "LETTER=X:"

if exist "%WORKS%\" goto :ok
echo KLAIDA: nera aplanko %WORKS%
pause
exit /b 1

:ok
subst %LETTER% >nul 2>&1 && subst %LETTER% /d >nul 2>&1
subst %LETTER% "%WORKS%"
if %errorlevel% neq 0 goto :failed

echo.
echo Sukurta: %LETTER%  ->  %WORKS%
echo.
echo Dabar programoje (index.html) spauskite "Pasirinkti aplanka"
echo ir nurodykite:   %LETTER%\Taisyti ceche
echo.
echo DEMESIO: po kompiuterio perkrovimo si nuoroda dingsta.
echo.
choice /C TN /M "Ideti i Startup, kad butu kuriama automatiskai? (T=taip, N=ne)"
if errorlevel 2 goto :done

set "SU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\xxlfix-subst.bat"
echo @echo off> "%SU%"
echo subst %LETTER% "%WORKS%">> "%SU%"
echo Ideta: %SU%
echo.

:done
pause
exit /b 0

:failed
echo.
echo NEPAVYKO sukurti %LETTER% (gal jis jau naudojamas).
echo Pabandykite pakeisti raide sio failo eiluteje: set "LETTER=X:"
echo.
pause
exit /b 1
