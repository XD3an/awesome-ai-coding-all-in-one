param(
    [Parameter(Position = 0)]
    [ValidateSet('init', 'start', 'switch', 'status')]
    [string]$Command = 'start',

    [string]$Model = 'claude-opus-4-5-20250514',
    [int]$Port = 4000,
    [switch]$Force,
    [switch]$DebugMode
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$KeysFile = Join-Path $ScriptDir "litellm-keys.env"
$ConfigFile = Join-Path $ScriptDir "copilot-config.yaml"
$ProxyDir = Join-Path $ScriptDir "litellm-proxy"

function Get-MasterKey {
    if (Test-Path $KeysFile) {
        $content = Get-Content $KeysFile -Raw
        if ($content -match 'LITELLM_MASTER_KEY=(.+)') {
            return $matches[1].Trim()
        }
    }
    return $null
}

function Invoke-Init {
    Write-Host "`n===== Init =====" -ForegroundColor Magenta

    if ((Test-Path $KeysFile) -and -not $Force) {
        Write-Host "[!] Keys exist, use -Force to regenerate" -ForegroundColor Yellow
    }
    else {
        $mk = "sk-$([guid]::NewGuid().ToString())"
        "LITELLM_MASTER_KEY=$mk" | Out-File $KeysFile -Encoding UTF8 -NoNewline
        Write-Host "[+] Keys: $KeysFile" -ForegroundColor Green
    }

    if ((Test-Path $ConfigFile) -and -not $Force) {
        Write-Host "[!] Config exists, use -Force to regenerate" -ForegroundColor Yellow
    }
    else {
        @"
model_list:
  - model_name: claude-opus-4-5-20250514
    litellm_params:
      model: github_copilot/claude-opus-4.5
      api_base: https://api.individual.githubcopilot.com
      extra_headers:
        Editor-Version: vscode/1.85.1
  - model_name: claude-sonnet-4-5-20250514
    litellm_params:
      model: github_copilot/claude-sonnet-4.5
      api_base: https://api.individual.githubcopilot.com
      extra_headers:
        Editor-Version: vscode/1.85.1
  - model_name: claude-sonnet-4-20250514
    litellm_params:
      model: github_copilot/claude-sonnet-4
      api_base: https://api.individual.githubcopilot.com
      extra_headers:
        Editor-Version: vscode/1.85.1
  - model_name: claude-haiku-4-5-20250514
    litellm_params:
      model: github_copilot/claude-haiku-4.5
      api_base: https://api.individual.githubcopilot.com
      extra_headers:
        Editor-Version: vscode/1.85.1
  - model_name: gpt-4o
    litellm_params:
      model: github_copilot/gpt-4o
      api_base: https://api.individual.githubcopilot.com
      extra_headers:
        Editor-Version: vscode/1.85.1
  - model_name: gpt-4.1
    litellm_params:
      model: github_copilot/gpt-4.1
      api_base: https://api.individual.githubcopilot.com
      extra_headers:
        Editor-Version: vscode/1.85.1
  - model_name: gpt-5-mini
    litellm_params:
      model: github_copilot/gpt-5-mini
      api_base: https://api.individual.githubcopilot.com
      extra_headers:
        Editor-Version: vscode/1.85.1
  - model_name: gpt-5
    litellm_params:
      model: github_copilot/gpt-5
      api_base: https://api.individual.githubcopilot.com
      extra_headers:
        Editor-Version: vscode/1.85.1
  - model_name: gemini-2.5-pro
    litellm_params:
      model: github_copilot/gemini-2.5-pro
      api_base: https://api.individual.githubcopilot.com
      extra_headers:
        Editor-Version: vscode/1.85.1
  - model_name: gemini-3-flash
    litellm_params:
      model: github_copilot/gemini-3-flash
      api_base: https://api.individual.githubcopilot.com
      extra_headers:
        Editor-Version: vscode/1.85.1
litellm_settings:
  drop_params: true
general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY
  database_url: null
  store_model_in_db: false
"@ | Out-File $ConfigFile -Encoding UTF8 -NoNewline
        Write-Host "[+] Config: $ConfigFile" -ForegroundColor Green
    }

    if (-not (Test-Path $ProxyDir)) {
        Write-Host "[!] Please create litellm-proxy:" -ForegroundColor Yellow
        Write-Host "    cd $ScriptDir && uv init litellm-proxy --no-readme && cd litellm-proxy && uv add 'litellm[proxy]'" -ForegroundColor White
    }
    else {
        Write-Host "[+] Proxy: $ProxyDir" -ForegroundColor Green
    }
}

function Invoke-Start {
    Write-Host "`n===== Start =====" -ForegroundColor Magenta

    if (-not (Test-Path $KeysFile) -or -not (Test-Path $ConfigFile) -or -not (Test-Path $ProxyDir)) {
        Write-Host "[x] Please run first: .\litellm-copilot.ps1 init" -ForegroundColor Red
        return
    }

    Get-Content $KeysFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), 'Process')
        }
    }

    Write-Host "[*] Port: $Port | Config: $ConfigFile" -ForegroundColor Cyan
    Write-Host "[i] First run requires GitHub auth, Ctrl+C to stop`n" -ForegroundColor Yellow

    Push-Location $ProxyDir
    $uvArgs = @("run", "litellm", "--config", $ConfigFile, "--port", $Port)
    if ($DebugMode) { $uvArgs += "--detailed_debug" }
    uv @uvArgs
    Pop-Location
}

function Invoke-Switch {
    Write-Host "`n===== Switch =====" -ForegroundColor Magenta

    $key = Get-MasterKey
    if (-not $key) {
        Write-Host "[x] Key not found, please run: .\litellm-copilot.ps1 init" -ForegroundColor Red
        return
    }

    $env:ANTHROPIC_BASE_URL = "http://localhost:$Port"
    $env:ANTHROPIC_AUTH_TOKEN = $key
    $env:ANTHROPIC_MODEL = $Model

    Write-Host "[+] Switched to LiteLLM" -ForegroundColor Green
    Write-Host "    URL: http://localhost:$Port" -ForegroundColor DarkGray
    Write-Host "    AUTH_TOKEN: $($key.Substring(0,15))..." -ForegroundColor DarkGray
    Write-Host "    Model: $Model" -ForegroundColor DarkGray
}

function Invoke-Status {
    Write-Host "`n===== Status =====" -ForegroundColor Magenta
    Write-Host "Keys:   $(if (Test-Path $KeysFile) { 'OK' } else { 'X' })" -ForegroundColor $(if (Test-Path $KeysFile) { 'Green' } else { 'Red' })
    Write-Host "Config: $(if (Test-Path $ConfigFile) { 'OK' } else { 'X' })" -ForegroundColor $(if (Test-Path $ConfigFile) { 'Green' } else { 'Red' })
    Write-Host "Proxy:  $(if (Test-Path $ProxyDir) { 'OK' } else { 'X' })" -ForegroundColor $(if (Test-Path $ProxyDir) { 'Green' } else { 'Red' })
    try {
        Invoke-WebRequest "http://localhost:$Port/health" -TimeoutSec 2 -EA Stop | Out-Null
        Write-Host "Server: Running (port $Port)" -ForegroundColor Green
    }
    catch { Write-Host "Server: Stopped" -ForegroundColor Red }
}

switch ($Command) {
    'init' { Invoke-Init }
    'start' { Invoke-Start }
    'switch' { Invoke-Switch }
    'status' { Invoke-Status }
}
