# PowerShell script to scaffold the Spring Boot modules for Buynora
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BaseDir = Split-Path -Parent $ScriptDir

# Helper: Create file and directory if they don't exist
function Create-File {
    param(
        [string]$Path,
        [string]$Content
    )
    $ParentDir = Split-Path -Parent $Path
    if (-not (Test-Path $ParentDir)) {
        New-Item -ItemType Directory -Path $ParentDir -Force | Out-Null
    }
    Set-Content -Path $Path -Value $Content -Encoding utf8
    Write-Host "Created file: $Path"
}

# 1. Scaffold common-library
$CommonDir = Join-Path $BaseDir "common-library"

# Common Library pom.xml
$CommonPom = @"
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.buynora</groupId>
        <artifactId>buynora-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../pom.xml</relativePath>
    </parent>

    <artifactId>common-library</artifactId>
    <name>common-library</name>
    <description>Buynora Common Library for shared utilities and exception handling</description>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
        </dependency>
    </dependencies>
</project>
"@
Create-File (Join-Path $CommonDir "pom.xml") $CommonPom

# Common library classes: ApiResponse, ErrorResponse, BusinessException, GlobalExceptionHandler
$ApiResponseClass = @"
package com.buynora.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
"@
Create-File (Join-Path $CommonDir "src/main/java/com/buynora/common/dto/ApiResponse.java") $ApiResponseClass

$ErrorResponseClass = @"
package com.buynora.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private boolean success;
    private String message;
    private List<String> details;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
"@
Create-File (Join-Path $CommonDir "src/main/java/com/buynora/common/dto/ErrorResponse.java") $ErrorResponseClass

$BusinessExceptionClass = @"
package com.buynora.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BusinessException extends RuntimeException {
    private final HttpStatus status;

    public BusinessException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
}
"@
Create-File (Join-Path $CommonDir "src/main/java/com/buynora/common/exception/BusinessException.java") $BusinessExceptionClass

$GlobalExceptionHandlerClass = @"
package com.buynora.common.exception;

import com.buynora.common.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
        log.error("Business validation error: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .build();
        return new ResponseEntity<>(error, ex.getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        log.error("Validation failed: {}", ex.getMessage());
        List<String> details = ex.getBindingResult().getAllErrors().stream()
                .map(ObjectError::getDefaultMessage)
                .collect(Collectors.toList());
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message("Validation failed")
                .details(details)
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Internal server error: ", ex);
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message("An unexpected error occurred")
                .details(List.of(ex.getMessage() != null ? ex.getMessage() : "Unknown error"))
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
"@
Create-File (Join-Path $CommonDir "src/main/java/com/buynora/common/exception/GlobalExceptionHandler.java") $GlobalExceptionHandlerClass
Create-File (Join-Path $CommonDir "README.md") "# Common Library`n`nContains core DTOs, custom exception wrappers, and RestControllerAdvice global exception handlers shared across Buynora microservices."

# 2. Scaffold eureka-server
$EurekaDir = Join-Path $BaseDir "eureka-server"
$EurekaPom = @"
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.buynora</groupId>
        <artifactId>buynora-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../pom.xml</relativePath>
    </parent>

    <artifactId>eureka-server</artifactId>
    <name>eureka-server</name>
    <description>Buynora Service Discovery (Netflix Eureka Server)</description>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
"@
Create-File (Join-Path $EurekaDir "pom.xml") $EurekaPom

$EurekaApp = @"
package com.buynora.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
"@
Create-File (Join-Path $EurekaDir "src/main/java/com/buynora/eureka/EurekaServerApplication.java") $EurekaApp

$EurekaYml = @"
server:
  port: 8761

eureka:
  client:
    registerWithEureka: false
    fetchRegistry: false
  server:
    waitTimeInMsWhenSyncEmpty: 0
"@
Create-File (Join-Path $EurekaDir "src/main/resources/application.yml") $EurekaYml

$EurekaTest = @"
package com.buynora.eureka;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class EurekaServerApplicationTests {
    @Test
    void contextLoads() {
    }
}
"@
Create-File (Join-Path $EurekaDir "src/test/java/com/buynora/eureka/EurekaServerApplicationTests.java") $EurekaTest
Create-File (Join-Path $EurekaDir "README.md") "# Eureka Server`n`nBuynora Netflix Eureka discovery server running on port 8761."

# 3. Scaffold config-server
$ConfigDir = Join-Path $BaseDir "config-server"
$ConfigPom = @"
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.buynora</groupId>
        <artifactId>buynora-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../pom.xml</relativePath>
    </parent>

    <artifactId>config-server</artifactId>
    <name>config-server</name>
    <description>Buynora Centralized Config Server (Spring Cloud Config Server)</description>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-config-server</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
"@
Create-File (Join-Path $ConfigDir "pom.xml") $ConfigPom

$ConfigApp = @"
package com.buynora.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableConfigServer
@EnableDiscoveryClient
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
"@
Create-File (Join-Path $ConfigDir "src/main/java/com/buynora/config/ConfigServerApplication.java") $ConfigApp

$ConfigYml = @"
server:
  port: 8888

spring:
  application:
    name: config-server
  profiles:
    active: native
  cloud:
    config:
      server:
        native:
          search-locations: classpath:/shared-configs

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
"@
Create-File (Join-Path $ConfigDir "src/main/resources/application.yml") $ConfigYml
Create-File (Join-Path $ConfigDir "src/main/resources/shared-configs/application.properties") "# Shared configuration properties"

$ConfigTest = @"
package com.buynora.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "spring.profiles.active=native")
class ConfigServerApplicationTests {
    @Test
    void contextLoads() {
    }
}
"@
Create-File (Join-Path $ConfigDir "src/test/java/com/buynora/config/ConfigServerApplicationTests.java") $ConfigTest
Create-File (Join-Path $ConfigDir "README.md") "# Config Server`n`nSpring Cloud Config Server running on port 8888."

# 4. Scaffold gateway
$GatewayDir = Join-Path $BaseDir "gateway"
$GatewayPom = @"
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.buynora</groupId>
        <artifactId>buynora-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../pom.xml</relativePath>
    </parent>

    <artifactId>gateway</artifactId>
    <name>gateway</name>
    <description>Buynora API Gateway (Spring Cloud Gateway)</description>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
"@
Create-File (Join-Path $GatewayDir "pom.xml") $GatewayPom

$GatewayApp = @"
package com.buynora.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
"@
Create-File (Join-Path $GatewayDir "src/main/java/com/buynora/gateway/GatewayApplication.java") $GatewayApp

$GatewayYml = @"
server:
  port: 8080

spring:
  application:
    name: gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
"@
Create-File (Join-Path $GatewayDir "src/main/resources/application.yml") $GatewayYml

$GatewayTest = @"
package com.buynora.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class GatewayApplicationTests {
    @Test
    void contextLoads() {
    }
}
"@
Create-File (Join-Path $GatewayDir "src/test/java/com/buynora/gateway/GatewayApplicationTests.java") $GatewayTest
Create-File (Join-Path $GatewayDir "README.md") "# API Gateway`n`nSpring Cloud Gateway running on port 8080."

# 5. Scaffold all 23 Business microservices
$BusinessServices = @(
    @{ name = "authentication-service"; port = 8081; package = "authentication"; class = "Authentication" },
    @{ name = "user-service"; port = 8082; package = "user"; class = "User" },
    @{ name = "seller-service"; port = 8083; package = "seller"; class = "Seller" },
    @{ name = "admin-service"; port = 8084; package = "admin"; class = "Admin" },
    @{ name = "product-service"; port = 8085; package = "product"; class = "Product" },
    @{ name = "category-service"; port = 8086; package = "category"; class = "Category" },
    @{ name = "brand-service"; port = 8087; package = "brand"; class = "Brand" },
    @{ name = "inventory-service"; port = 8088; package = "inventory"; class = "Inventory" },
    @{ name = "cart-service"; port = 8089; package = "cart"; class = "Cart" },
    @{ name = "wishlist-service"; port = 8090; package = "wishlist"; class = "Wishlist" },
    @{ name = "order-service"; port = 8091; package = "order"; class = "Order" },
    @{ name = "payment-service"; port = 8092; package = "payment"; class = "Payment" },
    @{ name = "coupon-service"; port = 8093; package = "coupon"; class = "Coupon" },
    @{ name = "offer-service"; port = 8094; package = "offer"; class = "Offer" },
    @{ name = "review-service"; port = 8095; package = "review"; class = "Review" },
    @{ name = "notification-service"; port = 8096; package = "notification"; class = "Notification" },
    @{ name = "search-service"; port = 8097; package = "search"; class = "Search" },
    @{ name = "recommendation-service"; port = 8098; package = "recommendation"; class = "Recommendation" },
    @{ name = "campaign-service"; port = 8099; package = "campaign"; class = "Campaign" },
    @{ name = "delivery-service"; port = 8100; package = "delivery"; class = "Delivery" },
    @{ name = "media-service"; port = 8101; package = "media"; class = "Media" },
    @{ name = "analytics-service"; port = 8102; package = "analytics"; class = "Analytics" },
    @{ name = "support-service"; port = 8103; package = "support"; class = "Support" }
)

foreach ($service in $BusinessServices) {
    $sDir = Join-Path $BaseDir $service.name
    
    # pom.xml
    $pomContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.buynora</groupId>
        <artifactId>buynora-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
        <relativePath>../pom.xml</relativePath>
    </parent>

    <artifactId>$($service.name)</artifactId>
    <name>$($service.name)</name>
    <description>Buynora $($service.class) Microservice</description>

    <dependencies>
        <!-- Spring Boot Starter Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Boot Starter Actuator -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- Spring Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Spring Cloud Discovery Client -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>

        <!-- Shared Library -->
        <dependency>
            <groupId>com.buynora</groupId>
            <artifactId>common-library</artifactId>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <scope>provided</scope>
        </dependency>

        <!-- MapStruct -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
        </dependency>

        <!-- OpenAPI Documentation -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        </dependency>

        <!-- DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
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
        </plugins>
    </build>
</project>
"@
    Create-File (Join-Path $sDir "pom.xml") $pomContent

    # Application.java
    $appContent = @"
package com.buynora.$($service.package);

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class $($service.class)Application {
    public static void main(String[] args) {
        SpringApplication.run($($service.class)Application.class, args);
    }
}
"@
    Create-File (Join-Path $sDir "src/main/java/com/buynora/$($service.package)/$($service.class)Application.java") $appContent

    # application.yml
    $ymlContent = @"
server:
  port: $($service.port)

spring:
  application:
    name: $($service.name)
  config:
    import: "optional:configserver:http://localhost:8888"

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
  instance:
    preferIpAddress: true

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
"@
    Create-File (Join-Path $sDir "src/main/resources/application.yml") $ymlContent

    # Test
    $testContent = @"
package com.buynora.$($service.package);

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class $($service.class)ApplicationTests {
    @Test
    void contextLoads() {
    }
}
"@
    Create-File (Join-Path $sDir "src/test/java/com/buynora/$($service.package)/$($service.class)ApplicationTests.java") $testContent

    # README.md
    $readmeContent = "# $($service.class) Service`n`nBuynora $($service.class) Microservice running on port $($service.port)."
    Create-File (Join-Path $sDir "README.md") $readmeContent
}

Write-Host "Scaffolding of all modules successfully completed."
