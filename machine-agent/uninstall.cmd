@echo off
rem Stops the ShopFlow Startech helper and removes it from Windows start-up.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process -Filter \"Name='powershell.exe'\" | Where-Object { $_.CommandLine -like '*startech-agent.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }; Remove-Item ([Environment]::GetFolderPath('Startup')+'\ShopFlow Startech.lnk') -ErrorAction SilentlyContinue"
rmdir /s /q "%LOCALAPPDATA%\ShopFlow\startech" 2>nul
echo Pasalinta.
timeout /t 3 >nul
