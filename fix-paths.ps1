# PowerShell script to fix asset paths in all HTML files
Write-Host "Fixing asset paths for Netlify compatibility..."

# Function to process a single HTML file
function Fix-Html-File {
    param (
        [string]$filePath
    )
    
    # Read file content
    $content = Get-Content -Path $filePath -Raw
    
    # All assets are now at root level with flat file structure
    $prefix = "./"
    
    # Fix the paths for all assets
    $content = $content -replace 'src="/assets/', "src=`"$prefix`assets/"
    $content = $content -replace 'href="/assets/', "href=`"$prefix`assets/"
    
    # Fix any links to other pages (important for navigation)
    $content = $content -replace 'href="/([\w\-]+)"', "href=`"$prefix`$1.html`""
    
    # Fix the main.js script tag more thoroughly
    $mainJsPattern = '<script[^>]*src="[^"]*main\.js"[^>]*>'
    $hasMainJs = $content -match $mainJsPattern
    
    if (-not $hasMainJs) {
        Write-Host "Adding missing main.js script tag to $filePath"
        $content = $content -replace '</body>', "  <script type=`"module`" crossorigin src=`"$prefix`assets/main.js`"></script>`n  </body>"
    } else {
        # If main.js exists but has incorrect path, fix it
        $content = $content -replace $mainJsPattern, "<script type=`"module`" crossorigin src=`"$prefix`assets/main.js`"></script>"
        Write-Host "Fixed main.js script path in $filePath"
    }
    
    # Fix the index.css link
    $cssPattern = '<link[^>]*href="[^"]*index\.css"[^>]*>'
    $hasIndexCss = $content -match $cssPattern
    
    if ($hasIndexCss) {
        $content = $content -replace $cssPattern, "<link rel=`"stylesheet`" href=`"$prefix`assets/index.css`">"
        Write-Host "Fixed index.css link in $filePath"
    }
    
    # Ensure window.__INITIAL_DATA__ is properly set
    if (-not ($content -match 'window.__INITIAL_DATA__')) {
        Write-Host "WARNING: No initial data found in $filePath"
    }
    
    # Write the content back
    Set-Content -Path $filePath -Value $content -NoNewline
    
    Write-Host "Fixed paths in $filePath"
}

# Process all HTML files in dist directory
$distPath = Join-Path $PSScriptRoot "dist"
$htmlFiles = Get-ChildItem -Path $distPath -Filter "*.html"

foreach ($file in $htmlFiles) {
    Fix-Html-File -filePath $file.FullName
}

Write-Host "Path fixing complete! All HTML files have been updated with correct asset paths."
Write-Host "IMPORTANT: The JavaScript should now work properly when deployed to Netlify."
