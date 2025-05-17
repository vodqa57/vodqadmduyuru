@echo off
title VODQA BOT - Kurulum
color 0A
echo.
echo ========================================
echo         VODQA BOT KURULUM SİSTEMİ
echo             Yapımcı: .vodqa
echo ========================================
echo.

REM Node.js'nin yüklü olup olmadığını kontrol et
where node >nul 2>&1
if errorlevel 1 (
    echo [HATA] Node.js yüklü değil!
    echo Lütfen Node.js'i https://nodejs.org adresinden indirip kurun.
    pause
    exit /b 1
)

echo Node.js bulundu, paketler kuruluyor...
npm install

if %errorlevel% neq 0 (
    echo.
    echo [HATA] Paket kurulumu başarısız oldu!
    echo Lütfen hataları kontrol edin ve tekrar deneyin.
    pause
    exit /b 1
)

echo.
echo [BAŞARILI] Kurulum tamamlandı!
echo Artık botu baslat.bat dosyasını çalıştırarak başlatabilirsiniz.
echo.
pause
exit /b 0
