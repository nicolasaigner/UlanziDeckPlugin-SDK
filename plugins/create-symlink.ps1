# Script para criar links simbólicos de plugins para o UlanziDeck
# Uso: .\create-symlink.ps1 -PluginName "com.ulanzi.meuplugin.ulanziPlugin"

param(
    [Parameter(Mandatory=$true)]
    [string]$PluginName
)

# Verificar se está executando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Este script precisa ser executado como Administrador!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor, execute o PowerShell como Administrador e tente novamente." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ou execute:" -ForegroundColor Cyan
    Write-Host "Start-Process powershell -Verb RunAs -ArgumentList '-NoExit', '-File', '$PSCommandPath', '-PluginName', '$PluginName'" -ForegroundColor Cyan
    exit 1
}

# Caminhos
$projectRoot = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $projectRoot "plugins\$PluginName"
$targetPath = Join-Path $env:APPDATA "Ulanzi\UlanziDeck\Plugins\$PluginName"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Criar Link Simbólico - Plugin UlanziDeck" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o plugin existe
if (-not (Test-Path $sourcePath)) {
    Write-Host "❌ Erro: Plugin não encontrado!" -ForegroundColor Red
    Write-Host "   Caminho: $sourcePath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Certifique-se de que o plugin existe na pasta plugins/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Plugin encontrado: $PluginName" -ForegroundColor Green
Write-Host ""

# Verificar se já existe um link ou pasta no destino
if (Test-Path $targetPath) {
    $existingItem = Get-Item $targetPath

    if ($existingItem.LinkType -eq "SymbolicLink") {
        Write-Host "⚠️  Link simbólico já existe!" -ForegroundColor Yellow
        Write-Host "   Target atual: $($existingItem.Target)" -ForegroundColor Yellow
        Write-Host ""

        $response = Read-Host "Deseja recriar o link? (S/N)"
        if ($response -ne "S" -and $response -ne "s") {
            Write-Host "Operação cancelada." -ForegroundColor Yellow
            exit 0
        }

        Write-Host "Removendo link antigo..." -ForegroundColor Yellow
        Remove-Item $targetPath -Force
        Write-Host "✓ Link antigo removido" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "❌ Erro: Já existe uma pasta (não link) no destino!" -ForegroundColor Red
        Write-Host "   Caminho: $targetPath" -ForegroundColor Red
        Write-Host ""
        Write-Host "Por favor, remova ou renomeie a pasta existente antes de continuar." -ForegroundColor Yellow
        exit 1
    }
}

# Criar link simbólico
Write-Host "Criando link simbólico..." -ForegroundColor Cyan
Write-Host "  De: $sourcePath" -ForegroundColor Gray
Write-Host "  Para: $targetPath" -ForegroundColor Gray
Write-Host ""

try {
    New-Item -ItemType SymbolicLink -Path $targetPath -Target $sourcePath -ErrorAction Stop | Out-Null

    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ Link simbólico criado com sucesso!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Reinicie o UlanziDeck" -ForegroundColor White
    Write-Host "2. O plugin '$PluginName' deve aparecer na lista de plugins" -ForegroundColor White
    Write-Host "3. Edite os arquivos em: plugins\$PluginName" -ForegroundColor White
    Write-Host "4. As alterações serão refletidas automaticamente!" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host "❌ Erro ao criar link simbólico!" -ForegroundColor Red
    Write-Host "   Mensagem: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possíveis causas:" -ForegroundColor Yellow
    Write-Host "- Permissões insuficientes (execute como Administrador)" -ForegroundColor Yellow
    Write-Host "- Caminho inválido" -ForegroundColor Yellow
    Write-Host "- Sistema de arquivos não suporta links simbólicos" -ForegroundColor Yellow
    exit 1
}

