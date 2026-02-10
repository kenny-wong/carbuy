$images = @{
    "xo.png" = "https://placehold.co/400x400/000000/FFD700/png?text=XO";
    "pochacco.png" = "https://placehold.co/400x400/2ed573/ffffff/png?text=Pochacco";
    "kuromi.png" = "https://placehold.co/400x400/130f40/e056fd/png?text=Kuromi";
    "hello-kitty.png" = "https://upload.wikimedia.org/wikipedia/en/0/05/Hello_kitty_character_portrait.png" 
}

# hello-kitty.png already exists and is good, but if it was missing we'd want a placeholder. 
# However, the script below only downloads if missing.

foreach ($name in $images.Keys) {
    if (-not (Test-Path "images\$name")) {
        Write-Host "Downloading $name..."
        try {
            Invoke-WebRequest $images[$name] -OutFile "images\$name" -UserAgent "Mozilla/5.0"
        } catch {
            Write-Host "Failed to download $name"
        }
    } else {
        Write-Host "$name already exists."
    }
}
