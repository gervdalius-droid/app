<#
    XXL Fix - siuntimas i stakliu aplanka
    ------------------------------------------------------------------
    Chrome neleidzia rasyti tiesiai i "C:\Program Files (x86)\..." (sistemine
    vieta), todel programa irasoma i paprasta aplanka, o sis skriptas nukopijuoja
    failus i stakliu aplanka.

    Naudojimas:
      .\cnc-copy.ps1                 - nukopijuoja viska karta ir baigia
      .\cnc-copy.ps1 -Watch          - lieka veikti ir kopijuoja automatiskai
      .\cnc-copy.ps1 -From D:\OUT    - kitas saltinio aplankas

    Kopijuojama tik tada, kai failas naujas arba pasikeites.
#>

[CmdletBinding()]
param(
    [string]$From        = "$env:USERPROFILE\CNC-OUT",
    [string]$To          = "C:\Program Files (x86)\Autech\Hicam2\Works\Taisyti ceche",
    [string]$Filter      = "*.XXL",
    [switch]$Watch,
    [int]   $IntervalSec = 3,
    [switch]$NoElevate
)

$ErrorActionPreference = 'Stop'

function Say($msg, $color = 'Gray') { Write-Host $msg -ForegroundColor $color }

function Test-Writable([string]$path) {
    try {
        $probe = Join-Path $path (".xxlfix_" + [guid]::NewGuid().ToString('N') + ".tmp")
        [IO.File]::WriteAllText($probe, 'x')
        Remove-Item $probe -Force
        return $true
    } catch { return $false }
}

function Test-Admin {
    $id = [Security.Principal.WindowsIdentity]::GetCurrent()
    (New-Object Security.Principal.WindowsPrincipal $id).IsInRole(
        [Security.Principal.WindowsBuiltInRole]::Administrator)
}

# ---- source ---------------------------------------------------------------
if (-not (Test-Path -LiteralPath $From)) {
    New-Item -ItemType Directory -Path $From -Force | Out-Null
    Say "Sukurtas saltinio aplankas: $From" 'Yellow'
}

# ---- destination ----------------------------------------------------------
if (-not (Test-Path -LiteralPath $To)) {
    Say "KLAIDA: nera stakliu aplanko:" 'Red'
    Say "  $To" 'Red'
    Say "Patikrinkite kelia (skripto virsuje, parametras -To)." 'Red'
    if (-not $Watch) { Read-Host "Enter - uzdaryti" }
    exit 1
}

# Program Files paprastai reikalauja administratoriaus teisiu. Pasitikrinam ir
# pasikeliam tik jei is tikruju reikia - kad be reikalo nesokinetu UAC langas.
if (-not (Test-Writable $To)) {
    if (Test-Admin) {
        Say "KLAIDA: net ir su administratoriaus teisemis negalima rasyti i:" 'Red'
        Say "  $To" 'Red'
        Read-Host "Enter - uzdaryti"; exit 1
    }
    if ($NoElevate) { Say "Nera teisiu rasyti i $To" 'Red'; exit 1 }

    Say "Reikia administratoriaus teisiu - prasoma..." 'Yellow'
    $argList = @(
        '-NoProfile','-ExecutionPolicy','Bypass','-File', "`"$PSCommandPath`"",
        '-From', "`"$From`"", '-To', "`"$To`"", '-Filter', "`"$Filter`"",
        '-IntervalSec', $IntervalSec, '-NoElevate'
    )
    if ($Watch) { $argList += '-Watch' }
    try { Start-Process powershell.exe -Verb RunAs -ArgumentList $argList }
    catch { Say "Administratoriaus teisiu negauta." 'Red'; Read-Host "Enter - uzdaryti" }
    exit
}

# ---- copy -----------------------------------------------------------------
function Copy-New {
    $n = 0
    Get-ChildItem -LiteralPath $From -Filter $Filter -File -ErrorAction SilentlyContinue |
    ForEach-Object {
        $src = $_
        $dst = Join-Path $To $src.Name
        $need = $true
        if (Test-Path -LiteralPath $dst) {
            $d = Get-Item -LiteralPath $dst
            # nekopijuojam to paties failo antra karta
            if ($d.Length -eq $src.Length -and $d.LastWriteTimeUtc -ge $src.LastWriteTimeUtc) { $need = $false }
        }
        if ($need) {
            try {
                Copy-Item -LiteralPath $src.FullName -Destination $dst -Force
                Say ("{0}  ->  {1}" -f $src.Name, $To) 'Green'
                $n++
            } catch {
                Say ("KLAIDA kopijuojant {0}: {1}" -f $src.Name, $_.Exception.Message) 'Red'
            }
        }
    }
    return $n
}

Say "Saltinis : $From"
Say "Stakles  : $To"
Say ""

$total = Copy-New
if ($total -eq 0) { Say "Nauju failu nera." 'DarkGray' } else { Say "Nukopijuota: $total" 'Cyan' }

if ($Watch) {
    Say ""
    Say "Stebima kas $IntervalSec s. Uzdaryti - Ctrl+C arba uzdarykite langa." 'Cyan'
    while ($true) {
        Start-Sleep -Seconds $IntervalSec
        [void](Copy-New)
    }
} else {
    Say ""
    Read-Host "Enter - uzdaryti"
}
