# Script para listar todos os links simbólicos de plugins do UlanziDeck
# Uso: .\list-symlinks.ps1

$pluginsPath = Join-Path $env:APPDATA "Ulanzi\UlanziDeck\Plugins"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Links Simbólicos - Plugins UlanziDeck" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $pluginsPath)) {
    Write-Host "❌ Pasta de plugins do UlanziDeck não encontrada!" -ForegroundColor Red
    Write-Host "   Caminho: $pluginsPath" -ForegroundColor Red
    exit 1
}

Write-Host "Pasta de plugins: $pluginsPath" -ForegroundColor Gray
Write-Host ""

# Obter todos os itens na pasta de plugins
$allItems = Get-ChildItem $pluginsPath -Directory

# Separar em links simbólicos e pastas normais
$symlinks = $allItems | Where-Object {$_.LinkType -eq "SymbolicLink"}
$normalDirs = $allItems | Where-Object {$_.LinkType -ne "SymbolicLink"}

# Exibir links simbólicos
if ($symlinks.Count -gt 0) {
    Write-Host "🔗 Links Simbólicos ($($symlinks.Count)):" -ForegroundColor Green
    Write-Host ""

    foreach ($link in $symlinks) {
        $target = $link.Target
        $exists = Test-Path $target

        Write-Host "  📦 $($link.Name)" -ForegroundColor Cyan
        Write-Host "     Target: $target" -ForegroundColor Gray

        if ($exists) {
            Write-Host "     Status: ✅ OK" -ForegroundColor Green
        } else {
            Write-Host "     Status: ❌ Quebrado (target não existe)" -ForegroundColor Red
        }
        Write-Host ""
    }
} else {
    Write-Host "⚠️  Nenhum link simbólico encontrado." -ForegroundColor Yellow
    Write-Host ""
}

# Exibir pastas normais
if ($normalDirs.Count -gt 0) {
    Write-Host "📁 Pastas Normais ($($normalDirs.Count)):" -ForegroundColor White
    Write-Host ""

    foreach ($dir in $normalDirs) {
        Write-Host "  📂 $($dir.Name)" -ForegroundColor White
    }
    Write-Host ""
}

# Resumo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Resumo:" -ForegroundColor Cyan
Write-Host "  Total de plugins: $($allItems.Count)" -ForegroundColor White
Write-Host "  Links simbólicos: $($symlinks.Count)" -ForegroundColor Green
Write-Host "  Pastas normais: $($normalDirs.Count)" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

