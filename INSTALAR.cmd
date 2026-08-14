@echo off
setlocal
cd /d "%~dp0"

echo.
echo Hunter Platform - instalacao local
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERRO: Node.js nao encontrado.
  exit /b 1
)

where pnpm >nul 2>&1
if errorlevel 1 (
  echo Instalando pnpm...
  corepack enable
  corepack prepare pnpm@10.15.1 --activate
)

call pnpm install
if errorlevel 1 exit /b 1

call pnpm setup
if errorlevel 1 exit /b 1

call pnpm build
if errorlevel 1 exit /b 1

echo.
echo Instalacao concluida.
echo Execute: pnpm dev
echo.
endlocal
