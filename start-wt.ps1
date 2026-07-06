$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

Set-Location -LiteralPath $PSScriptRoot
& (Join-Path $PSScriptRoot "start-claude.ps1") @args
