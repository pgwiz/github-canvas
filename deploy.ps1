# Deploy Supabase Edge Functions
$ErrorActionPreference = "Stop"

# Load environment variables from .env
if (Test-Path .env) {
    Get-Content .env | Where-Object { $_ -match '=' -and $_ -notmatch '^#' } | ForEach-Object {
        $key, $value = $_.Split('=', 2)
        $value = $value.Trim('"').Trim("'")
        [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
    }
}

$AccessToken = "sbp_c1fdd05cf76cbdb7891766d9f72531884e0495ab"
$env:SUPABASE_ACCESS_TOKEN = $AccessToken
$env:SUPABASE_DB_PASSWORD = "your-db-password-here" # Replace with actual if needed or let link generate one
if ([string]::IsNullOrEmpty($AccessToken)) {
    Write-Warning "SUPABASE_ACCESS_TOKEN is not set. Assuming you are logged in via CLI."
}
elseif (-not $AccessToken.StartsWith("sbp_")) {
    Write-Warning "Detected POTENTIALLY INVALID SUPABASE_ACCESS_TOKEN (does not start with 'sbp_')."
    Write-Warning "Current token: $($AccessToken.Substring(0, [Math]::Min(10, $AccessToken.Length)))..."
    Write-Warning "Unsetting invalid token for this session to force usage of CLI login or valid fallback."
    $env:SUPABASE_ACCESS_TOKEN = $null
    [System.Environment]::SetEnvironmentVariable("SUPABASE_ACCESS_TOKEN", $null, [System.EnvironmentVariableTarget]::Process)
}
else {
    Write-Host "Using valid SUPABASE_ACCESS_TOKEN from environment." -ForegroundColor Green
}

$ProjectId = $env:VITE_SUPABASE_PROJECT_ID
if ([string]::IsNullOrEmpty($ProjectId)) {
    Write-Error "VITE_SUPABASE_PROJECT_ID is not set in .env."
}

Write-Host "Verifying Supabase connection..." -ForegroundColor Cyan
cmd /c npx --yes supabase projects list --debug
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to connect to Supabase. Check your SUPABASE_ACCESS_TOKEN and internet connection."
}
Write-Host "Connection verified." -ForegroundColor Green

Write-Host "Syncing secrets to Supabase project $ProjectId..." -ForegroundColor Cyan

# Construct secrets
$secrets = @()
if ($env:GEMINI_API_KEY) { $secrets += "GEMINI_API_KEY=$env:GEMINI_API_KEY" }
if ($env:GITHUB_TOKEN) { $secrets += "GITHUB_TOKEN=$env:GITHUB_TOKEN" }
if ($env:SUPABASE_SERVICE_ROLE_KEY) { $secrets += "SERVICE_ROLE_KEY=$env:SUPABASE_SERVICE_ROLE_KEY" }
# SUPABASE_URL is automatically provided by Supabase Edge Functions environment

if ($secrets.Count -gt 0) {
    $secretsArgs = $secrets -join ","
    # Using specific handling for secrets might be tricky with commas in values, but standard keys should be fine
    # npx supabase secrets set --project-ref $ProjectId $secrets
    # Better to run one by one or careful parsing if values have spaces/commas.
    # For now assuming standard keys.
    
    # We will try setting them one by one to avoid parsing issues or limits
    foreach ($secret in $secrets) {
        $name = $secret.Split('=')[0]
        Write-Host "Setting secret: $name" -ForegroundColor Gray
        
        # We use cmd /c to ensure npx works correctly in PS environments sometimes
        cmd /c npx supabase secrets set --project-ref $ProjectId "$secret"
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to set secret $name. Exit code: $LASTEXITCODE"
        }
    }
    Write-Host "Secrets synced." -ForegroundColor Green
}
else {
    Write-Warning "No relevant secrets found in .env (GEMINI_API_KEY, GITHUB_TOKEN, SERVICE_ROLE_KEY)."
}

Write-Host "Deploying Supabase Edge Functions..." -ForegroundColor Cyan

$functions = Get-ChildItem -Path "supabase\functions" -Directory | Select-Object -ExpandProperty Name

foreach ($func in $functions) {
    Write-Host "Deploying $func..." -ForegroundColor Yellow
    # Using --yes to avoid 'Need to install the following packages' prompts which cause hangs
    cmd /c npx --yes supabase functions deploy $func --project-ref $ProjectId --no-verify-jwt --legacy-bundle --debug
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to deploy function $func. Exit code: $LASTEXITCODE"
    }
}

Write-Host "All functions deployed successfully!" -ForegroundColor Green
