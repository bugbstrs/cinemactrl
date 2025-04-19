# Check if winget is installed
$wingetExists = $null -ne (Get-Command winget -ErrorAction SilentlyContinue)

if ($wingetExists) {
    Write-Host "Winget is installed."
} else {
    Write-Host "Winget is not installed. Installing Winget..."
    try {
        # Download the msix bundle
        $wingetUrl = "https://github.com/microsoft/winget-cli/releases/download/v1.10.340/Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle"
        $downloadPath = "$env:TEMP\winget.msixbundle"
        Invoke-WebRequest -Uri $wingetUrl -OutFile $downloadPath
        
        # Install the msix bundle
        Add-AppPackage -Path $downloadPath
        
        Write-Host "Winget installed successfully."
        Write-Host "`nWinget has been installed, but you need to restart your terminal/editor for the changes to take effect."
        Write-Host "Please close your editor, reopen it, and run this script again."
    }
    catch {
        Write-Host "Failed to install Winget. Error: $_"
    }
}

# Check if Windows Terminal is installed
$wtExists = $null -ne (Get-Command wt -ErrorAction SilentlyContinue)

if ($wtExists) {
    Write-Host "Windows Terminal is installed."
} else {
    Write-Host "Windows Terminal is not installed."
    if ($wingetExists) {
        Write-Host "Installing Windows Terminal using winget..."
        winget install Microsoft.WindowsTerminal
        Write-Host "Windows Terminal installed successfully."
        
        # Inform user they may need to restart
        Write-Host "Please restart your terminal/editor for Windows Terminal to be available."
        $wtExists = $true  # Assume it was installed successfully
    } else {
        Write-Host "Cannot install Windows Terminal because winget is not available."
    }
}

# Check if Node.js is installed and check version
$nodeExists = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
$nodeVersionOk = $false

if ($nodeExists) {
    $nodeVersion = (node --version).Replace('v', '')
    $nodeVersionMajor = [int]($nodeVersion.Split('.')[0])
    $nodeVersionOk = $nodeVersionMajor -ge 22
    
    if ($nodeVersionOk) {
        Write-Host "Node.js v$nodeVersion is installed and meets the minimum requirement."
    } else {
        Write-Host "Node.js v$nodeVersion is installed but doesn't meet the minimum requirement (v22+)."
    }
}

# Install Node.js if not exists or version is not ok
if ((-not $nodeExists -or -not $nodeVersionOk) -and $wingetExists) {
    Write-Host "Installing Node.js LTS using winget..."
    winget install OpenJS.NodeJS.LTS
    
    Write-Host "`nNode.js has been installed, but you need to restart your terminal/editor for the changes to take effect."
    Write-Host "Please close your editor, reopen it, and run this script again."
    exit
}

# Check if bun command exists
$bunExists = $null -ne (Get-Command bun -ErrorAction SilentlyContinue)

if ($bunExists) {
    # If bun exists, check and install dependencies if needed
    Write-Host "Bun is installed."
    
    # Check frontend dependencies
    if (Test-Path -Path "./frontend/node_modules") {
        Write-Host "Frontend dependencies already installed."
    } else {
        Write-Host "Installing frontend dependencies..."
        Set-Location -Path "./frontend"
        bun i
        Set-Location -Path ".."
    }
    
    # Check backend dependencies
    if (Test-Path -Path "./backend/node_modules") {
        Write-Host "Backend dependencies already installed."
    } else {
        Write-Host "Installing backend dependencies..."
        Set-Location -Path "./backend"
        bun i
        Set-Location -Path ".."
    }

    # Start Windows Terminal with all services
    wt -d "./frontend" --tabColor "#A020F0" powershell -NoExit -Command "bun run start" `; `
    new-tab -d "./backend" --tabColor "#40E0D0" powershell -NoExit -Command "bun run start:dev backend" `; `
    new-tab -d "./backend" --tabColor "#FFBD2E" powershell -NoExit -Command "bun run start:dev booking-service" `; `
    new-tab -d "./backend" --tabColor "#2BBD4C" powershell -NoExit -Command "bun run start:dev logging-service" `; `
    new-tab -d "./backend" --tabColor "#E74856" powershell -NoExit -Command "bun run start:dev user-service"
} else {
    # If bun doesn't exist, install it
    Write-Host "Bun is not installed. Installing Bun..."
    powershell -c "irm bun.sh/install.ps1|iex"
    
    Write-Host "`nBun has been installed, but you need to restart your terminal/editor for the changes to take effect."
    Write-Host "Please close your editor, reopen it, and run this script again to install dependencies and start the services."
}
