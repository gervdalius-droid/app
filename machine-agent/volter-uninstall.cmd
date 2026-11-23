@echo off
rem Stops the ShopFlow Volter helper and removes it from Windows start-up.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process -Filter \"Name='powershell.exe'\" | Where-Object { $_.CommandLine -like '*volter-agent.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }; Remove-Item ([Environment]::GetFolderPath('Startup')+'\ShopFlow Volter.lnk') -ErrorAction SilentlyContinue"
rmdir /s /q "%LOCALAPPDATA%\ShopFlow\volter" 2>nul
echo Pasalinta.
timeout /t 3 >nul
