@echo off
rem ShopFlow - Volter CNC helper: install for this Windows user (no admin needed)
setlocal
set "DEST=%LOCALAPPDATA%\ShopFlow\volter"
if not exist "%DEST%" mkdir "%DEST%"
copy /Y "%~dp0volter-agent.ps1" "%DEST%\volter-agent.ps1" >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "Unblock-File -Path '%DEST%\volter-agent.ps1'; Get-CimInstance Win32_Process -Filter \"Name='powershell.exe'\" | Where-Object { $_.CommandLine -like '*volter-agent.ps1*' -and $_.ProcessId -ne $PID } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }; $s=(New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Startup')+'\ShopFlow Volter.lnk'); $s.TargetPath='powershell.exe'; $s.Arguments='-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%DEST%\volter-agent.ps1\"'; $s.WindowStyle=7; $s.Description='ShopFlow: sends Volter sheet scans to ShopFlow'; $s.Save()"
powershell -NoProfile -ExecutionPolicy Bypass -File "%DEST%\volter-agent.ps1" -Setup
if errorlevel 1 (
  echo.
  echo Nepavyko. Paleiskite install.cmd dar karta.
  pause
  exit /b 1
)
start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%DEST%\volter-agent.ps1"
echo Idiegta. Pagalbininkas veikia fone.
timeout /t 4 >nul
