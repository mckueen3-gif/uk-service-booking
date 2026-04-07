Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\MCQueen\.gemini\antigravity\scratch\uk_service_booking\public\images\logo_concierge_ai.png"
$outputPath = "C:\Users\MCQueen\.gemini\antigravity\scratch\uk_service_booking\public\images\logo_concierge_ai_final.png"

$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $p = $bmp.GetPixel($x, $y)
        
        # Checkerboard patterns in screenshot/previews usually are:
        # High Brightness (White/Gray) AND Low Saturation (R~G~B)
        $diff1 = [Math]::Abs($p.R - $p.G)
        $diff2 = [Math]::Abs($p.G - $p.B)
        $diff3 = [Math]::Abs($p.R - $p.B)
        
        # Gold is distinct because R > G > B usually (e.g., 200, 160, 50)
        # Grid is neutral: R~G~B (e.g., 204, 204, 204 or 255, 255, 255)
        $isNeutral = ($diff1 -lt 15 -and $diff2 -lt 15 -and $diff3 -lt 15)
        $isBright = ($p.R -gt 150)
        
        # Final safety: Gold texture has high Green and Red compared to Blue
        $isGold = ($p.R -gt ($p.B + 30))
        
        if ($isNeutral -and $isBright -and -not $isGold) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        } else {
            $newBmp.SetPixel($x, $y, $p)
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()

Move-Item -Path $outputPath -Destination $imagePath -Force
Write-Host "Logo optimized with Neutral-Color-Detection successfully."
