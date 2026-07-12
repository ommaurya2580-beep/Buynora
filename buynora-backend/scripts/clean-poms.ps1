$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BaseDir = Split-Path -Parent $ScriptDir

# Let's list the 23 services we want to clean up
$BusinessServices = @(
    "authentication-service", "user-service", "seller-service", "admin-service",
    "product-service", "category-service", "brand-service", "inventory-service",
    "cart-service", "wishlist-service", "order-service", "payment-service",
    "coupon-service", "offer-service", "review-service", "notification-service",
    "search-service", "recommendation-service", "campaign-service", "delivery-service",
    "media-service", "analytics-service", "support-service"
)

# Target configuration string to remove
$TargetText = @"
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
"@

$ReplacementText = @"
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
"@

foreach ($service in $BusinessServices) {
    $pomPath = Join-Path $BaseDir "$service\pom.xml"
    if (Test-Path $pomPath) {
        $content = Get-Content -Path $pomPath -Raw
        
        # Normalize line endings to LF for consistent matching/replacing
        $normalizedContent = $content -replace "`r`n", "`n"
        $normalizedTarget = $TargetText -replace "`r`n", "`n"
        $normalizedReplacement = $ReplacementText -replace "`r`n", "`n"
        
        if ($normalizedContent.Contains($normalizedTarget)) {
            $newContent = $normalizedContent.Replace($normalizedTarget, $normalizedReplacement)
            # Restore Windows line endings
            $newContent = $newContent -replace "`n", "`r`n"
            Set-Content -Path $pomPath -Value $newContent -Encoding utf8
            Write-Host "Cleaned up pom.xml for: $service"
        } else {
            Write-Warning "Could not find target configuration in pom.xml for: $service"
        }
    } else {
        Write-Error "Could not find pom.xml for: $service at $pomPath"
    }
}

Write-Host "Cleanup of all microservice POMs complete!"
