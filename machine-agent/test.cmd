@echo off
rem Shows every scan the helper sees, and whether it would send it.
powershell -NoProfile -ExecutionPolicy Bypass -File "%LOCALAPPDATA%\ShopFlow\startech\startech-agent.ps1" -Test
