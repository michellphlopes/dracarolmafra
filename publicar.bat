@echo off
echo Publicando site...
cd /d "C:\Users\miche\Imagens\CLAUDE"
copy /y portfolio-fotografo.html index.html >nul
netlify deploy --dir . --prod
echo.
echo Pronto! Site atualizado em dracarolmafra.com.br
pause
