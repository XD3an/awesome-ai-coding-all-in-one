# Draws the notify mod's popup on Windows: a borderless card that slides in at
# the bottom-right corner with an animated Claude buddy. Built-in WPF only.
# Everything about it arrives as JSON in $env:CC_NOTIFY_JSON (text is set from
# code, never spliced into XAML):
#   { kind: start|done|fail|error|permission|context, title, body, meta?, launch?, openLabel? }
# Set $env:CC_NOTIFY_PREVIEW to a .png path to render one frame there instead.
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$n = $env:CC_NOTIFY_JSON | ConvertFrom-Json
Add-Type -AssemblyName PresentationFramework, PresentationCore, WindowsBase

$accent = @{ start = '#D97757'; done = '#22C55E'; fail = '#EF4444'; error = '#EF4444'; permission = '#F59E0B'; context = '#8B5CF6' }[[string]$n.kind]
if (-not $accent) { $accent = '#D97757' }

# Layout only: every piece of text is set from code below, never spliced into XAML.
$xaml = @'
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        WindowStyle="None" AllowsTransparency="True" Background="Transparent"
        Topmost="True" ShowInTaskbar="False" ShowActivated="False" ResizeMode="NoResize"
        Width="340" SizeToContent="Height" Opacity="0">
  <Border x:Name="Card" Margin="16" CornerRadius="18" Background="#F21F1E1D" BorderBrush="#33FFFFFF" BorderThickness="1" Padding="20,14,20,18">
    <Border.Effect><DropShadowEffect BlurRadius="24" ShadowDepth="4" Opacity="0.45"/></Border.Effect>
    <StackPanel>
      <DockPanel>
        <TextBlock Text="Claude Code" Foreground="#99FFFFFF" FontSize="11" FontFamily="Segoe UI Semibold" VerticalAlignment="Center"/>
        <TextBlock x:Name="Close" Text="&#xE711;" FontFamily="Segoe MDL2 Assets" FontSize="11" Foreground="#99FFFFFF"
                   HorizontalAlignment="Right" Cursor="Hand" Padding="6,2,0,2"/>
      </DockPanel>

      <Canvas x:Name="Stage" Width="150" Height="150" Margin="0,4,0,6">
        <Ellipse x:Name="Glow" Width="150" Height="150" Opacity="0.35" RenderTransformOrigin="0.5,0.5">
          <Ellipse.Fill>
            <RadialGradientBrush><GradientStop x:Name="GlowStop" Offset="0" Color="#D97757"/><GradientStop Offset="1" Color="#00D97757"/></RadialGradientBrush>
          </Ellipse.Fill>
          <Ellipse.RenderTransform><ScaleTransform x:Name="GlowScale"/></Ellipse.RenderTransform>
        </Ellipse>
        <Grid x:Name="Buddy" Width="150" Height="150" RenderTransformOrigin="0.5,0.5">
          <Grid.RenderTransform>
            <TransformGroup><ScaleTransform x:Name="Breath"/><TranslateTransform x:Name="Hop"/></TransformGroup>
          </Grid.RenderTransform>
          <Canvas x:Name="Rays" Width="150" Height="150" RenderTransformOrigin="0.5,0.5">
            <Canvas.RenderTransform><RotateTransform x:Name="Spin"/></Canvas.RenderTransform>
          </Canvas>
          <Ellipse Width="58" Height="58" Fill="#D97757"/>
          <Canvas Width="58" Height="58">
            <Ellipse x:Name="EyeL" Canvas.Left="17" Canvas.Top="20" Width="7" Height="12" Fill="#1F1E1D" RenderTransformOrigin="0.5,0.5">
              <Ellipse.RenderTransform><ScaleTransform x:Name="BlinkL"/></Ellipse.RenderTransform>
            </Ellipse>
            <Ellipse x:Name="EyeR" Canvas.Left="34" Canvas.Top="20" Width="7" Height="12" Fill="#1F1E1D" RenderTransformOrigin="0.5,0.5">
              <Ellipse.RenderTransform><ScaleTransform x:Name="BlinkR"/></Ellipse.RenderTransform>
            </Ellipse>
            <Path x:Name="Mouth" Stroke="#1F1E1D" StrokeThickness="2.5" StrokeStartLineCap="Round" StrokeEndLineCap="Round"/>
          </Canvas>
        </Grid>
      </Canvas>

      <TextBlock x:Name="Title" Foreground="White" FontSize="16" FontFamily="Segoe UI Semibold" TextTrimming="CharacterEllipsis"/>
      <TextBlock x:Name="Body" Foreground="#D9FFFFFF" FontSize="13" FontFamily="Segoe UI" TextWrapping="Wrap" MaxHeight="38" TextTrimming="CharacterEllipsis" Margin="0,4,0,0"/>
      <Border x:Name="DetailBox" Visibility="Collapsed" Margin="0,8,0,0" Padding="10,7" CornerRadius="8" Background="#14FFFFFF">
        <TextBlock x:Name="Detail" Foreground="#E6FFFFFF" FontSize="12" FontFamily="Cascadia Mono, Consolas"
                   TextWrapping="Wrap" MaxHeight="34" TextTrimming="CharacterEllipsis"/>
      </Border>
      <UniformGrid x:Name="AskRow" Visibility="Collapsed" Columns="2" Margin="0,12,0,0" Opacity="0.4">
        <Border x:Name="Allow" Margin="0,0,5,0" Padding="0,8" CornerRadius="8" Background="#22C55E" Cursor="Hand">
          <TextBlock x:Name="AllowText" Text="Allow" Foreground="White" FontSize="13" FontFamily="Segoe UI Semibold" HorizontalAlignment="Center"/>
        </Border>
        <Border x:Name="Deny" Margin="5,0,0,0" Padding="0,8" CornerRadius="8" Background="#33FFFFFF" Cursor="Hand">
          <TextBlock x:Name="DenyText" Text="Deny" Foreground="White" FontSize="13" FontFamily="Segoe UI Semibold" HorizontalAlignment="Center"/>
        </Border>
      </UniformGrid>
      <DockPanel x:Name="Footer" Margin="0,10,0,0">
        <TextBlock x:Name="Meta" Foreground="#80FFFFFF" FontSize="11" FontFamily="Segoe UI" VerticalAlignment="Center"/>
        <TextBlock x:Name="Open" Text="Open folder" Foreground="#D97757" FontSize="11" FontFamily="Segoe UI Semibold"
                   HorizontalAlignment="Right" Cursor="Hand" VerticalAlignment="Center"/>
      </DockPanel>
    </StackPanel>
  </Border>
</Window>
'@
$w = [Windows.Markup.XamlReader]::Parse($xaml)
function F($name) { $w.FindName($name) }
$brush = { param($hex) [Windows.Media.BrushConverter]::new().ConvertFromString($hex) }

(F 'Title').Text = [string]$n.title
(F 'Body').Text = [string]$n.body
(F 'Meta').Text = [string]$n.meta
(F 'GlowStop').Color = [Windows.Media.ColorConverter]::ConvertFromString($accent)
if ($n.openLabel) { (F 'Open').Text = [string]$n.openLabel }

# A permission question: what Claude wants to run, and Allow / Deny. It takes
# the place of the body and footer, and a smaller buddy, to keep the card short.
$asking = [bool]$n.ask
if ($asking) {
  (F 'Detail').Text = [string]$n.ask.detail
  (F 'AllowText').Text = [string]$n.ask.allow
  (F 'DenyText').Text = [string]$n.ask.deny
  (F 'DetailBox').Visibility = 'Visible'
  (F 'AskRow').Visibility = 'Visible'
  (F 'Footer').Visibility = 'Collapsed'
  (F 'Body').Visibility = 'Collapsed'
  (F 'Stage').LayoutTransform = [Windows.Media.ScaleTransform]::new(0.72, 0.72)
}
if (-not $n.launch) { (F 'Open').Visibility = 'Collapsed' }

# The rays: eight rounded spokes, alternating long and short, in the accent color.
$rays = F 'Rays'
for ($i = 0; $i -lt 8; $i++) {
  $len = if ($i % 2) { 26 } else { 40 }
  $r = [Windows.Shapes.Rectangle]@{ Width = 9; Height = $len; RadiusX = 4.5; RadiusY = 4.5; Fill = (& $brush '#D97757') }
  [Windows.Controls.Canvas]::SetLeft($r, 75 - 4.5)
  [Windows.Controls.Canvas]::SetTop($r, 75 - 29 - $len)
  $r.RenderTransformOrigin = [Windows.Point]::new(0.5, (29 + $len) / $len)
  $r.RenderTransform = [Windows.Media.RotateTransform]::new($i * 45)
  [void]$rays.Children.Add($r)
}

# Mood per kind: the mouth, and how the buddy moves.
$mouth = switch ($n.kind) {
  'done' { 'M 20,38 Q 29,47 38,38' }        # smile
  'fail' { 'M 20,43 Q 29,35 38,43' }        # frown
  'error' { 'M 20,43 Q 29,35 38,43' }
  'permission' { 'M 23,40 L 35,40' }        # waiting
  'context' { 'M 21,42 Q 29,37 37,42' }     # worried
  default { 'M 21,39 Q 29,45 37,39' }
}
(F 'Mouth').Data = [Windows.Media.Geometry]::Parse($mouth)

function Anim($from, $to, $ms, [switch]$Forever, [switch]$Reverse, $begin = 0) {
  $a = [Windows.Media.Animation.DoubleAnimation]::new($from, $to, [Windows.Duration]::new([TimeSpan]::FromMilliseconds($ms)))
  if ($Forever) { $a.RepeatBehavior = [Windows.Media.Animation.RepeatBehavior]::Forever }
  $a.AutoReverse = [bool]$Reverse
  $a.BeginTime = [TimeSpan]::FromMilliseconds($begin)
  $a.EasingFunction = [Windows.Media.Animation.SineEase]@{ EasingMode = 'EaseInOut' }
  $a
}
$S = [Windows.Media.ScaleTransform]; $T = [Windows.Media.TranslateTransform]; $R = [Windows.Media.RotateTransform]

$spinMs = if ($n.kind -eq 'permission') { 2500 } else { 9000 }
$spin = [Windows.Media.Animation.DoubleAnimation]::new(0, 360, [Windows.Duration]::new([TimeSpan]::FromMilliseconds($spinMs)))
$spin.RepeatBehavior = [Windows.Media.Animation.RepeatBehavior]::Forever
(F 'Spin').BeginAnimation($R::AngleProperty, $spin)
(F 'Breath').BeginAnimation($S::ScaleXProperty, (Anim 0.92 1.06 1400 -Forever -Reverse))
(F 'Breath').BeginAnimation($S::ScaleYProperty, (Anim 0.92 1.06 1400 -Forever -Reverse))
(F 'GlowScale').BeginAnimation($S::ScaleXProperty, (Anim 0.8 1.15 1400 -Forever -Reverse))
(F 'GlowScale').BeginAnimation($S::ScaleYProperty, (Anim 0.8 1.15 1400 -Forever -Reverse))

# Blink every few seconds.
$blink = [Windows.Media.Animation.DoubleAnimationUsingKeyFrames]::new()
$blink.Duration = [Windows.Duration]::new([TimeSpan]::FromMilliseconds(3200))
$blink.RepeatBehavior = [Windows.Media.Animation.RepeatBehavior]::Forever
foreach ($k in @(@(0, 1), @(2900, 1), @(3000, 0.1), @(3100, 1))) {
  [void]$blink.KeyFrames.Add([Windows.Media.Animation.LinearDoubleKeyFrame]::new($k[1], [Windows.Media.Animation.KeyTime]::FromTimeSpan([TimeSpan]::FromMilliseconds($k[0]))))
}
(F 'BlinkL').BeginAnimation($S::ScaleYProperty, $blink)
(F 'BlinkR').BeginAnimation($S::ScaleYProperty, $blink)

switch ($n.kind) {
  'done' { (F 'Hop').BeginAnimation($T::YProperty, (Anim 0 -10 300 -Forever -Reverse)) }      # happy bounce
  'permission' { (F 'Hop').BeginAnimation($T::YProperty, (Anim 0 -6 500 -Forever -Reverse)) }
  { $_ -in 'fail', 'error' } {
    $shake = [Windows.Media.Animation.DoubleAnimation]::new(-6, 6, [Windows.Duration]::new([TimeSpan]::FromMilliseconds(60)))
    $shake.AutoReverse = $true; $shake.RepeatBehavior = [Windows.Media.Animation.RepeatBehavior]::new(6)
    (F 'Hop').BeginAnimation($T::XProperty, $shake)
  }
}

# Preview mode: render one frame to a PNG and stop.
if ($env:CC_NOTIFY_PREVIEW) {
  $w.Left = -2000; $w.Top = -2000; $w.Opacity = 1; $w.Show()
  $w.Dispatcher.Invoke([Action] {}, 'Render')
  $card = F 'Card'
  $bmp = [Windows.Media.Imaging.RenderTargetBitmap]::new([int]$w.ActualWidth, [int]$w.ActualHeight, 96, 96, 'Pbgra32')
  $bmp.Render($w.Content)
  $enc = [Windows.Media.Imaging.PngBitmapEncoder]::new(); $enc.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($bmp))
  $fs = [IO.File]::Create($env:CC_NOTIFY_PREVIEW); $enc.Save($fs); $fs.Close(); $w.Close(); return
}

# Slide in from the bottom-right corner, hold, fade out. A permission prompt stays
# until it is clicked: Claude is blocked until you answer.
$area = [Windows.SystemParameters]::WorkArea
$w.Left = $area.Right - 340

# Popups never overlap: each holds one slot of a column up the right edge, a
# named mutex per slot shared by every Claude Code session of this user. When
# every slot is taken, this popup waits for the first one to free up.
$pitch = 310
$slotCount = [int][Math]::Max(1, [Math]::Min(4, [Math]::Floor($area.Height / $pitch)))
$slotLocks = [Threading.Mutex[]](0..($slotCount - 1) | ForEach-Object { [Threading.Mutex]::new($false, "Local\cc-notify-slot-$_") })
$slot = -1
try {
  $slot = [Threading.WaitHandle]::WaitAny([Threading.WaitHandle[]]$slotLocks, [TimeSpan]::FromMinutes(2))
} catch [Threading.AbandonedMutexException] {
  $slot = $_.Exception.MutexIndex # a popup that crashed left it: ours now
}
$ownsSlot = $slot -ge 0 -and $slot -lt $slotCount
if (-not $ownsSlot) { $slot = 0 } # waited too long: show anyway
$closing = $false
$dismiss = {
  if ($script:closing) { return }
  $script:closing = $true
  $out = Anim 1 0 350
  $out.Add_Completed({ $w.Close() })
  $w.BeginAnimation([Windows.Window]::OpacityProperty, $out)
}

# Clicking the card brings back the window Claude Code runs in. The popup was
# started by Claude Code, so walking up its parent processes reaches the first
# one that owns a visible window: Windows Terminal, VS Code or the console.
Add-Type -Namespace CcNotify -Name Win -MemberDefinition @'
[DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
[DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
[DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
[DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
'@

function Find-ClaudeWindow {
  $parents = @{}
  Get-CimInstance Win32_Process -Property ProcessId, ParentProcessId |
    ForEach-Object { $parents[[int]$_.ProcessId] = [int]$_.ParentProcessId }
  $id = $parents[$PID]
  for ($hop = 0; $hop -lt 12 -and $id; $hop++) {
    $p = Get-Process -Id $id -ErrorAction SilentlyContinue
    if (-not $p) { break }
    if ($p.MainWindowHandle -ne [IntPtr]::Zero) { return $p.MainWindowHandle }
    $id = $parents[$id]
  }
  [IntPtr]::Zero
}

$claudeWindow = [IntPtr]::Zero
$outcome = 'timeout'
$decision = $null
$armed = $false
try { $claudeWindow = Find-ClaudeWindow } catch {}

$focusClaude = {
  $script:outcome = 'clicked, no Claude Code window found'
  if ($claudeWindow -eq [IntPtr]::Zero) { return }
  try {
    if ([CcNotify.Win]::IsIconic($claudeWindow)) { [void][CcNotify.Win]::ShowWindow($claudeWindow, 9) } # SW_RESTORE
    if (-not [CcNotify.Win]::SetForegroundWindow($claudeWindow)) {
      # Windows only lets the foreground process hand focus on; a tap of Alt counts as input.
      [CcNotify.Win]::keybd_event(0x12, 0, 0, [UIntPtr]::Zero)
      [CcNotify.Win]::keybd_event(0x12, 0, 2, [UIntPtr]::Zero)
      [void][CcNotify.Win]::SetForegroundWindow($claudeWindow)
    }
    $script:outcome = 'clicked, focused window ' + $claudeWindow
  } catch { $script:outcome = 'clicked, focus failed: ' + $_ }
}

$w.Add_MouseLeftButtonUp({ & $focusClaude; & $dismiss })
(F 'Close').Add_MouseLeftButtonUp({ param($s, $e) $e.Handled = $true; $script:outcome = 'closed'; & $dismiss })
(F 'Open').Add_MouseLeftButtonUp({ param($s, $e) $e.Handled = $true; Start-Process ([string]$n.launch); & $dismiss })
foreach ($choice in 'Allow', 'Deny') {
  (F $choice).Add_MouseLeftButtonUp({
      param($s, $e)
      $e.Handled = $true
      if (-not $script:armed) { return } # too soon: the card may have slid under the pointer
      $script:decision = $s.Name.ToLower()
      $script:outcome = 'answered ' + $script:decision
      & $dismiss
    })
}
$w.Add_ContentRendered({
  $top = $area.Bottom - $w.ActualHeight - $slot * $pitch
  $w.BeginAnimation([Windows.Window]::TopProperty, (Anim ($top + 40) $top 420))
  $w.BeginAnimation([Windows.Window]::OpacityProperty, (Anim 0 1 300))
  $holdMs = if ($n.kind -eq 'permission') { 90000 } else { 6500 }
  $timer = [Windows.Threading.DispatcherTimer]@{ Interval = [TimeSpan]::FromMilliseconds($holdMs) }
  $timer.Add_Tick({ param($sender) $sender.Stop(); & $dismiss })
  $timer.Start()
  if ($asking) {
    # The buttons wake up after a second, so a click meant for whatever was under
    # the pointer never answers for you.
    $arm = [Windows.Threading.DispatcherTimer]@{ Interval = [TimeSpan]::FromMilliseconds(1000) }
    $arm.Add_Tick({
        param($sender)
        $sender.Stop()
        $script:armed = $true
        (F 'AskRow').BeginAnimation([Windows.UIElement]::OpacityProperty, (Anim 0.4 1 200))
      })
    $arm.Start()
  }
})
$w.Top = $area.Bottom - $slot * $pitch

$wav = @{ done = 'Windows Notify Messaging.wav'; permission = 'Windows Notify Calendar.wav'; fail = 'Windows Critical Stop.wav'; error = 'Windows Critical Stop.wav'; context = 'Windows Notify System Generic.wav' }[[string]$n.kind]
if ($wav -and (Test-Path "$env:WINDIR\Media\$wav")) {
  try { [Media.SoundPlayer]::new("$env:WINDIR\Media\$wav").Play() } catch {}
}

[void]$w.ShowDialog()
if ($ownsSlot) { $slotLocks[$slot].ReleaseMutex() }
# One line for the debug log: how the popup ended.
# What the mod reads back: the person's answer to a permission question.
if ($decision) { "decision: $decision" }
"popup: $outcome (slot $slot of $slotCount, top-left $([int]$w.Left),$([int]$w.Top), height $([int]$w.ActualHeight))"
