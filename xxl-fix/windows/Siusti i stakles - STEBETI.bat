@echo off
rem  Lieka veikti: kas kelias sekundes nukopijuoja naujas .XXL programas.
rem  Palikite si langa atidaryta visa darbo diena.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0cnc-copy.ps1" -Watch
