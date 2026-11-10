@echo off
rem  Nukopijuoja naujas .XXL programas is CNC-OUT i stakliu aplanka ir baigia.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0cnc-copy.ps1"
