@echo off
title VODQA BOT - Başlatma
color 0B
echo.
echo ========================================
echo         VODQA BOT BAŞLATMA SİSTEMİ
echo             Yapımcı: .vodqa
echo ========================================
echo.

REM Node.js'nin yüklü olup olmadığını kontrol et
where node >nul 2>&1
if errorlevel 1 (
    echo [HATA] Node.js bulunamadı!
    echo Lütfen Node.js'in kurulu olduğundan emin olun.
    pause
    exit /b 1
)

echo Bot başlatılıyor, lütfen bekleyin...
node index.js

echo.
echo ========================================
echo Bot kapandı veya hata oluştu.
echo Konsol çıktısını kontrol edin.
echo.
pause
exit /b 0
