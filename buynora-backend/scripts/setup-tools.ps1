# Setup portable JDK 21 and Maven 3.9.6 in the workspace tools folder
$ErrorActionPreference = "Stop"

# Define directories
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BaseDir = Split-Path -Parent $ScriptDir
$ToolsDir = Join-Path $BaseDir "tools"

if (-not (Test-Path $ToolsDir)) {
    New-Item -ItemType Directory -Path $ToolsDir | Out-Null
    Write-Host "Created tools directory at: $ToolsDir"
}

# Download & Extract JDK 21
$JdkZip = Join-Path $ToolsDir "jdk21.zip"
$JdkFolder = Join-Path $ToolsDir "jdk-21"

if (-not (Test-Path $JdkFolder)) {
    $JdkUrl = "https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse"
    Write-Host "Downloading JDK 21 from $JdkUrl using curl..."
    curl.exe -L $JdkUrl -o $JdkZip
    
    Write-Host "Extracting JDK 21..."
    Expand-Archive -Path $JdkZip -DestinationPath $ToolsDir
    
    # Locate the extracted folder (it might have a name like jdk-21.0.4+8)
    $ExtractedJdkDir = Get-ChildItem -Path $ToolsDir -Directory | Where-Object { $_.Name -like "*jdk-21*" } | Select-Object -First 1
    if ($ExtractedJdkDir) {
        Rename-Item -Path $ExtractedJdkDir.FullName -NewName "jdk-21"
        Write-Host "JDK 21 installed at: $JdkFolder"
    } else {
        Write-Error "Could not find extracted JDK directory."
    }
    
    # Clean up zip
    Remove-Item $JdkZip -Force
} else {
    Write-Host "JDK 21 already exists at: $JdkFolder"
}

# Download & Extract Maven 3.9.6
$MavenZip = Join-Path $ToolsDir "maven3.zip"
$MavenFolder = Join-Path $ToolsDir "maven"

if (-not (Test-Path $MavenFolder)) {
    $MavenUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
    Write-Host "Downloading Apache Maven 3.9.6 from $MavenUrl using curl..."
    curl.exe -L $MavenUrl -o $MavenZip
    
    Write-Host "Extracting Maven..."
    Expand-Archive -Path $MavenZip -DestinationPath $ToolsDir
    
    # Locate extracted folder (it will be apache-maven-3.9.6)
    $ExtractedMavenDir = Get-ChildItem -Path $ToolsDir -Directory | Where-Object { $_.Name -like "*apache-maven*" } | Select-Object -First 1
    if ($ExtractedMavenDir) {
        Rename-Item -Path $ExtractedMavenDir.FullName -NewName "maven"
        Write-Host "Maven installed at: $MavenFolder"
    } else {
        Write-Error "Could not find extracted Maven directory."
    }
    
    # Clean up zip
    Remove-Item $MavenZip -Force
} else {
    Write-Host "Maven already exists at: $MavenFolder"
}

Write-Host "Tool setup complete."
