package com.buynora.common.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Buynora API Documentation",
                version = "v1.0",
                description = "Enterprise API documentation for Buynora E-Commerce Microservices",
                contact = @Contact(
                        name = "Buynora Tech Support",
                        email = "support@buynora.com",
                        url = "https://www.buynora.com"
                ),
                license = @License(
                        name = "Buynora Proprietary License",
                        url = "https://www.buynora.com/license"
                )
        )
)
@SecurityScheme(
        name = "Bearer Authentication",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer"
)
public class OpenApiConfig {
    // Configuration handled entirely by annotations
}
