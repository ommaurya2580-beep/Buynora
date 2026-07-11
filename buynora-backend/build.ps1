# Maven build wrapper for portable tools
$ErrorActionPreference = "Stop"

$ScriptDir = $PSScriptRoot
$ToolsDir = Join-Path $ScriptDir "tools"
$JdkHome = Join-Path $ToolsDir "jdk-21"
$MvnHome = Join-Path $ToolsDir "maven"

if (-not (Test-Path $JdkHome) -or -not (Test-Path $MvnHome)) {
    Write-Error "Local Java 21 or Maven is missing. Please run scripts/setup-tools.ps1 first."
}

# Set environment variables for this process only
$env:JAVA_HOME = $JdkHome
$env:PATH = "$JdkHome\bin;$MvnHome\bin;" + $env:PATH

# Define Maven properties for stable downloads on unstable connections
$MvnOpts = @("-Dhttp.keepAlive=false", "-Dmaven.wagon.http.pool=false", "-Dmaven.wagon.http.retryHandler.count=5")

# Execute maven with provided arguments
if ($args.Count -eq 0) {
    Write-Host "Running default build: mvn clean install with network optimizations"
    mvn @MvnOpts clean install
} else {
    Write-Host "Running: mvn with network optimizations and args: $args"
    mvn @MvnOpts @args
}
