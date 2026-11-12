<#
  ShopFlow · machine helper for the SCM Startech CN Plus
  ------------------------------------------------------
  Runs on the Startech's Windows PC. When the operator scans a label to open a
  drilling program, this sees the same scan and sends it to ShopFlow, which
  counts the part through the drilling step and shows the Startech working on
  the floor plan (Cecho planas).

  • It listens ONLY to the barcode scanner. The scanner is told apart from the
    keyboard by its device; it is learned from the first scan (or from speed:
    a scanner types a whole code in a few milliseconds, a person cannot).
    Keyboard typing is ignored and never stored or sent.
  • It does not change what the scanner does — the SCM software still gets
    every scan exactly as before.
  • A tray icon (bottom right) shows it is running: today's scans, last code,
    and a menu to re-learn the scanner or stop it.

  First time:  install.cmd   (asks for the ShopFlow password, then scan a label)
  Test view:   powershell -ExecutionPolicy Bypass -File startech-agent.ps1 -Test
#>
param([switch]$Setup, [switch]$Test, [switch]$Relearn)

$ErrorActionPreference = 'Stop'
$Version = '1.0'
$Dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$CfgPath = Join-Path $Dir 'startech-agent.json'
$PwPath = Join-Path $Dir 'startech-agent.key'
$StatePath = Join-Path $Dir 'startech-agent.state.json'
$LogPath = Join-Path $Dir 'startech-agent.log'

function Log([string]$msg) {
  try {
    $line = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '  ' + $msg
    Add-Content -Path $LogPath -Value $line -Encoding UTF8
    if ((Get-Item $LogPath).Length -gt 1MB) { Move-Item $LogPath ($LogPath + '.old') -Force }
  } catch {}
}

# ---------------- settings ----------------
$defaults = [ordered]@{
  url        = 'https://niveinyzkkwtreeeaziv.supabase.co'
  anonKey    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdmVpbnl6a2t3dHJlZWVheml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4Mzc2ODgsImV4cCI6MjEwMTQxMzY4OH0.E2LnA_ClFpE1pe_pVPp28M1zOCkzi1RoAIU3bo9PNxk'
  email      = 'shopflow@dedesbaldai.lt'
  machine    = 'startech'
  name       = 'SCM Startech CN Plus'
  scanner    = ''      # learned device path of the barcode scanner
  minChars   = 3
  maxGapMs   = 90      # a scanner types faster than this between keys
}
$Cfg = $defaults
if (Test-Path $CfgPath) {
  try {
    $j = Get-Content $CfgPath -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($p in $j.PSObject.Properties) { $Cfg[$p.Name] = $p.Value }
  } catch { Log "settings file unreadable: $_" }
}
function Save-Cfg { ($Cfg | ConvertTo-Json) | Set-Content -Path $CfgPath -Encoding UTF8 }

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ---------------- password (kept encrypted for this Windows user only) ----------------
function Get-Password {
  if (-not (Test-Path $PwPath)) { return $null }
  try {
    $txt = ([string](Get-Content $PwPath -Raw)).Trim()   # Set-Content adds a line break, which ConvertTo-SecureString refuses
    if (-not $txt) { return $null }
    $sec = ConvertTo-SecureString -String $txt
    $b = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
    try { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($b) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($b) }
  } catch { Log "saved password unreadable: $($_.Exception.Message)"; return $null }
}
function Ask-Password {
  $f = New-Object Windows.Forms.Form
  $f.Text = 'ShopFlow · Startech'; $f.Width = 420; $f.Height = 190; $f.StartPosition = 'CenterScreen'
  $f.FormBorderStyle = 'FixedDialog'; $f.MaximizeBox = $false; $f.MinimizeBox = $false; $f.TopMost = $true
  $l = New-Object Windows.Forms.Label
  $l.Text = "ShopFlow slaptažodis (paskyra $($Cfg.email)):"; $l.Left = 14; $l.Top = 16; $l.Width = 380
  $t = New-Object Windows.Forms.TextBox
  $t.UseSystemPasswordChar = $true; $t.Left = 14; $t.Top = 44; $t.Width = 375
  $ok = New-Object Windows.Forms.Button
  $ok.Text = 'Išsaugoti'; $ok.Left = 290; $ok.Top = 86; $ok.Width = 100; $ok.DialogResult = 'OK'
  $f.Controls.AddRange(@($l, $t, $ok)); $f.AcceptButton = $ok
  if ($f.ShowDialog() -ne 'OK' -or -not $t.Text) { return $false }
  $enc = ConvertTo-SecureString -String $t.Text -AsPlainText -Force | ConvertFrom-SecureString
  [IO.File]::WriteAllText($PwPath, $enc)   # no trailing line break
  return $true
}

# ---------------- cloud (Supabase, same login as the ShopFlow screens) ----------------
$script:Token = $null; $script:Refresh = $null; $script:TokenExp = [DateTime]::MinValue
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Sign-In {
  $headers = @{ apikey = $Cfg.anonKey }
  if ($script:Refresh) {
    try {
      $r = Invoke-RestMethod -Method Post -Uri ($Cfg.url + '/auth/v1/token?grant_type=refresh_token') -Headers $headers -ContentType 'application/json' -Body (@{ refresh_token = $script:Refresh } | ConvertTo-Json) -TimeoutSec 15
      $script:Token = $r.access_token; $script:Refresh = $r.refresh_token; $script:TokenExp = (Get-Date).AddSeconds([int]$r.expires_in - 120)
      return
    } catch { $script:Refresh = $null }
  }
  $pw = Get-Password
  if (-not $pw) { throw 'No ShopFlow password saved — run install.cmd' }
  $body = @{ email = $Cfg.email; password = $pw } | ConvertTo-Json
  $r = Invoke-RestMethod -Method Post -Uri ($Cfg.url + '/auth/v1/token?grant_type=password') -Headers $headers -ContentType 'application/json' -Body $body -TimeoutSec 15
  $script:Token = $r.access_token; $script:Refresh = $r.refresh_token; $script:TokenExp = (Get-Date).AddSeconds([int]$r.expires_in - 120)
}

function Push-State {
  if (-not $script:Token -or (Get-Date) -gt $script:TokenExp) { Sign-In }
  $now = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
  $S.agentAt = $now
  $row = @{
    id         = 'dedes-machine-' + $Cfg.machine
    data       = $S
    updated_at = (Get-Date).ToUniversalTime().ToString('o')
    updated_by = $Cfg.machine + '-agent'
  }
  $json = $row | ConvertTo-Json -Depth 6 -Compress
  $headers = @{ apikey = $Cfg.anonKey; Authorization = 'Bearer ' + $script:Token; Prefer = 'resolution=merge-duplicates,return=minimal' }
  Invoke-RestMethod -Method Post -Uri ($Cfg.url + '/rest/v1/workspaces') -Headers $headers -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes($json)) -TimeoutSec 15 | Out-Null
}

# ---------------- what is sent: the last scans, kept between restarts ----------------
$S = [ordered]@{ type = $Cfg.machine; name = $Cfg.name; version = $Version; host = $env:COMPUTERNAME; seq = 0; lastAt = $null; last = $null; scans = @(); agentAt = $null; today = 0; day = '' }
if (Test-Path $StatePath) {
  try {
    $old = Get-Content $StatePath -Raw -Encoding UTF8 | ConvertFrom-Json
    $S.seq = [int64]$old.seq; $S.lastAt = $old.lastAt; $S.last = $old.last; $S.today = [int]$old.today; $S.day = [string]$old.day
    $S.scans = @($old.scans | Where-Object { $_ })
  } catch { Log "state file unreadable: $_" }
}
function Save-State { try { ($S | ConvertTo-Json -Depth 5) | Set-Content -Path $StatePath -Encoding UTF8 } catch {} }

function Add-Scan([string]$code) {
  $now = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
  $day = (Get-Date -Format 'yyyy-MM-dd')
  if ($S.day -ne $day) { $S.day = $day; $S.today = 0 }
  $S.seq = [int64]$S.seq + 1
  $S.today = [int]$S.today + 1
  $entry = [ordered]@{ seq = $S.seq; code = $code; at = $now }
  $S.scans = @(@($S.scans) + $entry | Select-Object -Last 100)
  $S.last = $entry; $S.lastAt = $now
  Save-State
  $script:Dirty = $true
  Log "scan #$($S.seq): $code"
}

# ---------------- the scanner: Windows raw input, by device ----------------
$cs = @'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;

public class SfScan { public string Code; public string Device; public bool Fast; }

public class SfScanner : NativeWindow {
  [StructLayout(LayoutKind.Sequential)] struct RAWINPUTDEVICE { public ushort UsagePage; public ushort Usage; public uint Flags; public IntPtr Target; }
  [StructLayout(LayoutKind.Sequential)] struct RAWINPUTHEADER { public uint Type; public uint Size; public IntPtr Device; public IntPtr WParam; }
  [StructLayout(LayoutKind.Sequential)] struct RAWKEYBOARD { public ushort MakeCode; public ushort Flags; public ushort Reserved; public ushort VKey; public uint Message; public uint ExtraInformation; }
  [DllImport("user32.dll", SetLastError = true)] static extern bool RegisterRawInputDevices(RAWINPUTDEVICE[] d, uint n, uint size);
  [DllImport("user32.dll")] static extern uint GetRawInputData(IntPtr h, uint cmd, IntPtr data, ref uint size, uint headerSize);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern uint GetRawInputDeviceInfo(IntPtr dev, uint cmd, StringBuilder data, ref uint size);
  [DllImport("user32.dll")] static extern int ToUnicodeEx(uint vk, uint sc, byte[] state, StringBuilder buf, int bufSize, uint flags, IntPtr hkl);
  [DllImport("user32.dll")] static extern IntPtr GetKeyboardLayout(uint thread);
  [DllImport("user32.dll")] static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] static extern uint GetWindowThreadProcessId(IntPtr h, IntPtr pid);
  [DllImport("user32.dll")] static extern short GetKeyState(int vk);

  const int WM_INPUT = 0xFF;
  const uint RIDEV_INPUTSINK = 0x100, RID_INPUT = 0x10000003, RIDI_DEVICENAME = 0x20000007, RIM_TYPEKEYBOARD = 1, RI_KEY_BREAK = 1;

  class Buf { public StringBuilder Text = new StringBuilder(); public bool Shift, Ctrl, Alt; public DateTime Last = DateTime.MinValue; public double MaxGap; public int Keys; }
  readonly Dictionary<IntPtr, Buf> bufs = new Dictionary<IntPtr, Buf>();
  readonly Dictionary<IntPtr, string> names = new Dictionary<IntPtr, string>();
  public readonly Queue<SfScan> Scans = new Queue<SfScan>();
  public int MinChars = 3;
  public double MaxGapMs = 60;

  public SfScanner() {
    CreateHandle(new CreateParams());
    var d = new RAWINPUTDEVICE[1];
    d[0].UsagePage = 1; d[0].Usage = 6; d[0].Flags = RIDEV_INPUTSINK; d[0].Target = Handle;
    if (!RegisterRawInputDevices(d, 1, (uint)Marshal.SizeOf(typeof(RAWINPUTDEVICE))))
      throw new Exception("RegisterRawInputDevices failed: " + Marshal.GetLastWin32Error());
  }

  string NameOf(IntPtr dev) {
    string n;
    if (names.TryGetValue(dev, out n)) return n;
    uint size = 0;
    GetRawInputDeviceInfo(dev, RIDI_DEVICENAME, null, ref size);
    var sb = new StringBuilder((int)size + 2);
    GetRawInputDeviceInfo(dev, RIDI_DEVICENAME, sb, ref size);
    n = sb.ToString();
    names[dev] = n;
    return n;
  }

  protected override void WndProc(ref Message m) {
    if (m.Msg == WM_INPUT) {
      try { OnRaw(m.LParam); } catch { }
    }
    base.WndProc(ref m);
  }

  void OnRaw(IntPtr lParam) {
    uint hs = (uint)Marshal.SizeOf(typeof(RAWINPUTHEADER));
    uint size = 0;
    GetRawInputData(lParam, RID_INPUT, IntPtr.Zero, ref size, hs);
    if (size == 0) return;
    IntPtr p = Marshal.AllocHGlobal((int)size);
    try {
      if (GetRawInputData(lParam, RID_INPUT, p, ref size, hs) != size) return;
      var h = (RAWINPUTHEADER)Marshal.PtrToStructure(p, typeof(RAWINPUTHEADER));
      if (h.Type != RIM_TYPEKEYBOARD) return;
      var k = (RAWKEYBOARD)Marshal.PtrToStructure(new IntPtr(p.ToInt64() + hs), typeof(RAWKEYBOARD));
      Key(h.Device, k);
    } finally { Marshal.FreeHGlobal(p); }
  }

  void Key(IntPtr dev, RAWKEYBOARD k) {
    Buf b;
    if (!bufs.TryGetValue(dev, out b)) { b = new Buf(); bufs[dev] = b; }
    bool up = (k.Flags & RI_KEY_BREAK) != 0;
    ushort vk = k.VKey;
    if (vk == 0x10 || vk == 0xA0 || vk == 0xA1) { b.Shift = !up; return; }
    if (vk == 0x11 || vk == 0xA2 || vk == 0xA3) { b.Ctrl = !up; return; }
    if (vk == 0x12 || vk == 0xA4 || vk == 0xA5) { b.Alt = !up; return; }
    if (up) return;
    var now = DateTime.UtcNow;
    double gap = b.Last == DateTime.MinValue ? 0 : (now - b.Last).TotalMilliseconds;
    if (gap > 1500) { b.Text.Length = 0; b.MaxGap = 0; b.Keys = 0; gap = 0; }
    b.Last = now;
    if (vk == 0x0D || vk == 0x09) {               // Enter / Tab ends a scan
      string code = b.Text.ToString().Trim();
      bool fast = b.Keys >= MinChars && b.MaxGap <= MaxGapMs;
      b.Text.Length = 0; b.MaxGap = 0; b.Keys = 0;
      if (code.Length >= MinChars) Scans.Enqueue(new SfScan { Code = code, Device = NameOf(dev), Fast = fast });
      return;
    }
    if (b.Ctrl || b.Alt) return;
    var state = new byte[256];
    if (b.Shift) state[0x10] = 0x80;
    if ((GetKeyState(0x14) & 1) != 0) state[0x14] = 0x01; // Caps Lock
    var sb = new StringBuilder(8);
    IntPtr hkl = GetKeyboardLayout(GetWindowThreadProcessId(GetForegroundWindow(), IntPtr.Zero));
    int n = ToUnicodeEx(vk, k.MakeCode, state, sb, sb.Capacity, 4, hkl);
    if (n > 0) {
      for (int i = 0; i < n; i++) { char c = sb[i]; if (!char.IsControl(c)) b.Text.Append(c); }
      if (b.Keys > 0 && gap > b.MaxGap) b.MaxGap = gap;
      b.Keys++;
      if (b.Text.Length > 300) { b.Text.Length = 0; b.Keys = 0; b.MaxGap = 0; }
    }
  }
}
'@
Add-Type -TypeDefinition $cs -ReferencedAssemblies System.Windows.Forms -IgnoreWarnings

# ---------------- one copy only ----------------
$mutex = New-Object Threading.Mutex($false, 'Global\ShopFlowStartechAgent')
if (-not $Test -and -not $mutex.WaitOne(0)) { exit 0 }

if ($Setup -or -not (Test-Path $PwPath)) {
  if (-not (Ask-Password)) { exit 1 }
  try { Sign-In; Log 'signed in'; Push-State } catch {
    [Windows.Forms.MessageBox]::Show("Nepavyko prisijungti prie ShopFlow: $($_.Exception.Message)`n`nPatikrinkite slaptažodį ir paleiskite install.cmd dar kartą.", 'ShopFlow · Startech', 'OK', 'Error') | Out-Null
    Remove-Item $PwPath -ErrorAction SilentlyContinue
    exit 1
  }
}
if ($Setup) {
  $Cfg.scanner = ''; Save-Cfg
  [Windows.Forms.MessageBox]::Show("Prisijungta prie ShopFlow.`n`nPagalbininkas dabar veiks fone (piktograma ekrano apačioje dešinėje) ir pasileis kartu su Windows.`nNuskenuokite bet kurį lipduką — skeneris bus atpažintas.", 'ShopFlow · Startech', 'OK', 'Information') | Out-Null
  exit 0
}
if ($Relearn) { $Cfg.scanner = ''; Save-Cfg }

$Scanner = New-Object SfScanner
$Scanner.MinChars = [int]$Cfg.minChars
$Scanner.MaxGapMs = [double]$Cfg.maxGapMs
$script:Dirty = $true
$script:LastPush = [DateTime]::MinValue
$script:LastErr = ''
$script:Learning = -not $Cfg.scanner

# ---------------- tray icon ----------------
$tray = New-Object Windows.Forms.NotifyIcon
$tray.Icon = [Drawing.SystemIcons]::Information
$tray.Visible = $true
$menu = New-Object Windows.Forms.ContextMenuStrip
$miStatus = $menu.Items.Add('ShopFlow · Startech')
$miStatus.Enabled = $false
$miLog = $menu.Items.Add('Atidaryti žurnalą')
$miLog.add_Click({ if (Test-Path $LogPath) { Start-Process notepad.exe $LogPath } })
$miLearn = $menu.Items.Add('Išmokti skenerį iš naujo')
$miLearn.add_Click({
  $Cfg.scanner = ''; Save-Cfg; $script:Learning = $true
  $tray.ShowBalloonTip(5000, 'ShopFlow · Startech', 'Nuskenuokite bet kurį lipduką — skeneris bus atpažintas.', 'Info')
})
$miQuit = $menu.Items.Add('Išjungti')
$miQuit.add_Click({ $tray.Visible = $false; [Windows.Forms.Application]::Exit() })
$tray.ContextMenuStrip = $menu

function Update-Tray {
  $t = "ShopFlow · Startech — šiandien: $($S.today)"
  if ($S.last) { $t += "`npaskutinis: " + [string]$S.last.code }
  if ($script:LastErr) { $t += "`n! " + $script:LastErr }
  if ($t.Length -gt 63) { $t = $t.Substring(0, 63) }
  $tray.Text = $t
  $miStatus.Text = "Šiandien: $($S.today) · " + $(if ($script:LastErr) { 'nėra ryšio' } else { 'prisijungta' })
}

# ---------------- test window ----------------
$testBox = $null
if ($Test) {
  $tf = New-Object Windows.Forms.Form
  $tf.Text = 'ShopFlow · Startech — testas'; $tf.Width = 640; $tf.Height = 360; $tf.TopMost = $true
  $testBox = New-Object Windows.Forms.TextBox
  $testBox.Multiline = $true; $testBox.ReadOnly = $true; $testBox.Dock = 'Fill'; $testBox.ScrollBars = 'Vertical'
  $testBox.Font = New-Object Drawing.Font('Consolas', 10)
  $tf.Controls.Add($testBox)
  $tf.add_FormClosed({ $tray.Visible = $false; [Windows.Forms.Application]::Exit() })
  $tf.Show()
  $testBox.AppendText("Nuskenuokite lipduką. Skeneris: " + $(if ($Cfg.scanner) { $Cfg.scanner } else { '(dar neišmoktas)' }) + "`r`n")
}

# ---------------- main loop ----------------
$timer = New-Object Windows.Forms.Timer
$timer.Interval = 400
$timer.add_Tick({
  while ($Scanner.Scans.Count -gt 0) {
    $sc = $Scanner.Scans.Dequeue()
    $mine = $false
    if ($Cfg.scanner) { $mine = ($sc.Device -eq $Cfg.scanner) }
    elseif ($sc.Fast) {
      $mine = $true
      $Cfg.scanner = $sc.Device; Save-Cfg; $script:Learning = $false
      Log "scanner learned: $($sc.Device)"
      $tray.ShowBalloonTip(4000, 'ShopFlow · Startech', 'Skeneris atpažintas. Skenavimai siunčiami į ShopFlow.', 'Info')
    }
    if ($testBox) { $testBox.AppendText(("{0}  {1,-5} {2}  [{3}]`r`n" -f (Get-Date -Format 'HH:mm:ss'), $(if ($mine) { 'SIŲST' } else { 'ne' }), $(if ($mine) { $sc.Code } else { '(klaviatūra / kitas įrenginys)' }), $(if ($sc.Fast) { 'greitas' } else { 'lėtas' }))) }
    if ($mine) { Add-Scan $sc.Code }
  }
  $due = $script:Dirty -or ((Get-Date) - $script:LastPush).TotalSeconds -ge 60
  $retryWait = $script:LastErr -and ((Get-Date) - $script:LastPush).TotalSeconds -lt 20
  if ($due -and -not $retryWait) {
    $script:LastPush = Get-Date
    try {
      Push-State
      $script:Dirty = $false
      if ($script:LastErr) { Log 'connection back' }
      $script:LastErr = ''
    } catch {
      $msg = $_.Exception.Message
      if ($msg -match '401|JWT|expired') { $script:Token = $null }
      if ($script:LastErr -ne $msg) { Log "send failed: $msg" }
      $script:LastErr = $msg
    }
    Update-Tray
  }
})
$timer.Start()
Update-Tray
Log "started v$Version on $env:COMPUTERNAME"
if ($script:Learning -and -not $Test) { $tray.ShowBalloonTip(6000, 'ShopFlow · Startech', 'Veikia. Nuskenuokite bet kurį lipduką — skeneris bus atpažintas.', 'Info') }
[Windows.Forms.Application]::Run()
$timer.Stop(); $tray.Dispose()
Log 'stopped'
