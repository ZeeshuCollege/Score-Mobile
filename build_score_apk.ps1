# Build automation script for SCORE
# Compiles the Flutter project and updates Score.apk at the root of the workspace.

Write-Host "Building SCORE APK..." -ForegroundColor Cyan

flutter build apk --debug

if ($LASTEXITCODE -eq 0) {
    $apkPath = "build\app\outputs\flutter-apk\app-debug.apk"
    if (Test-Path $apkPath) {
        Copy-Item -Force $apkPath "Score.apk"
        Write-Host "Successfully updated Score.apk at root!" -ForegroundColor Green
        Get-Item "Score.apk" | Select-Object Name, Length, LastWriteTime | Format-Table
    } else {
        Write-Error "Could not locate built APK at $apkPath"
    }
} else {
    Write-Error "Flutter build failed with exit code $LASTEXITCODE"
}
