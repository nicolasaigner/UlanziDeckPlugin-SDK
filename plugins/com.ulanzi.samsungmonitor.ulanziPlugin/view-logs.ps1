# Script para ver logs do plugin em tempo real

$logFile = Join-Path $PSScriptRoot "plugin-debug.log"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Logs do Plugin Samsung Monitor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Arquivo: $logFile" -ForegroundColor Gray
Write-Host ""

if (-not (Test-Path $logFile)) {
    Write-Host "⚠️  Arquivo de log não encontrado!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "O arquivo será criado quando o plugin iniciar." -ForegroundColor Gray
    Write-Host "Aguardando..." -ForegroundColor Gray
    Write-Host ""

    # Aguardar o arquivo ser criado
    while (-not (Test-Path $logFile)) {
        Start-Sleep -Seconds 1
    }

    Write-Host "✅ Arquivo criado! Mostrando logs..." -ForegroundColor Green
    Write-Host ""
}

Write-Host "📝 Mostrando logs em tempo real..." -ForegroundColor Green
Write-Host "   Pressione Ctrl+C para parar" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Mostrar logs em tempo real
Get-Content $logFile -Wait -Tail 50

