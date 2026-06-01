param(
    [Parameter(Mandatory = $true)][string]$Model,
    [string]$ApiKey = '',
    [string]$AuthToken = 'ollama',
    [string]$BaseUrl = 'http://localhost:11434'
)

$env:ANTHROPIC_MODEL = $Model
$env:ANTHROPIC_API_KEY = $ApiKey
$env:ANTHROPIC_AUTH_TOKEN = $AuthToken
$env:ANTHROPIC_BASE_URL = $BaseUrl
Write-Host "[+] Switched to model: $BaseUrl/$Model"
