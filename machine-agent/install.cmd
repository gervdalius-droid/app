@echo off
rem ShopFlow - SCM Startech CN Plus helper: install for this Windows user (no admin needed)
setlocal
set "DEST=%LOCALAPPDATA%\ShopFlow\startech"
if not exist "%DEST%" mkdir "%DEST%"
copy /Y "%~dp0startech-agent.ps1" "%DEST%\startech-agent.ps1" >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -Path '%DEST%\startech-agent.ps1'; Get-CimInstance Win32_Process -Filter \"Name='powershell.exe'\" | Where-Object { $_.CommandLine -like '*startech-agent.ps1*' -and $_.ProcessId -ne $PID } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }; $s=(New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Startup')+'\ShopFlow Startech.lnk'); $s.TargetPath='powershell.exe'; $s.Arguments='-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%DEST%\startech-agent.ps1\"'; $s.WindowStyle=7; $s.Description='ShopFlow: sends Startech scans to ShopFlow'; $s.Save()"
powershell -NoProfile -ExecutionPolicy Bypass -File "%DEST%\startech-agent.ps1" -Setup
if errorlevel 1 (
  echo.
  echo Nepavyko. Paleiskite install.cmd dar karta.
  pause
  exit /b 1
)
start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%DEST%\startech-agent.ps1"
echo Idiegta. Pagalbininkas veikia fone.
timeout /t 4 >nul
