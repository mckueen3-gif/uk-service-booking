Add-Type -AssemblyName System.Drawing
$imagePath = "C:\Users\MCQueen\.gemini\antigravity\scratch\uk_service_booking\public\images\logo_concierge_ai.png"
$outputPath = "C:\Users\MCQueen\.gemini\antigravity\scratch\uk_service_booking\public\images\logo_concierge_ai_clean.png"

$bmp = [System.Drawing.Bitmap]::FromFile($imagePath)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        
        # Checkerboard detection: usually very light gray and white
        # We target the specific checkerboard pattern found in the uploaded image
        # If the pixel is close to white or light gray AND not part of the gold logo
        $isWhite = ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240)
        $isGray = ($pixel.R -gt 200 -and $pixel.G -gt 200 -and $pixel.B -gt 200 -and $pixel.R -lt 210) # Adjust for common grid
        
        # Gold logo usually has lower Blue values or specific YCbCr balance
        # We need to be careful not to remove the gold
        if ($isWhite -or $isGray) {
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        } else {
            $newBmp.SetPixel($x, $y, $pixel)
        }
    }
}

$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()

Move-Item -Path $outputPath -Destination $imagePath -Force
Write-Host "Logo cleaned successfully."
