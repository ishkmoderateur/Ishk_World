# Kill Next.js dev server and remove lock file

Write-Host "🔍 Checking for running Next.js processes on port 3000/3001..." -ForegroundColor Yellow

# Find processes using ports 3000 or 3001
$ports = Get-NetTCPConnection -LocalPort 3000,3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($ports) {
    Write-Host "⚠️  Found processes using ports 3000/3001: $($ports -join ', ')" -ForegroundColor Yellow
    
    foreach ($pid in $ports) {
        try {
            $process = Get-Process -Id $pid -ErrorAction Stop
            Write-Host "🛑 Stopping process $pid ($($process.ProcessName))..." -ForegroundColor Red
            Stop-Process -Id $pid -Force
            Write-Host "✅ Process $pid stopped" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Could not stop process $pid: $_" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "✅ No processes found on ports 3000/3001" -ForegroundColor Green
}

# Remove lock file
Write-Host "`n🧹 Removing lock file..." -ForegroundColor Yellow
if (Test-Path ".next\dev\lock") {
    Remove-Item -Path ".next\dev\lock" -Force
    Write-Host "✅ Lock file removed" -ForegroundColor Green
} else {
    Write-Host "✅ No lock file found" -ForegroundColor Green
}

Write-Host "`nDone! You can now run 'npm run dev' safely." -ForegroundColor Green

