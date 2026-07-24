package com.buynora.authentication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication(
    scanBasePackages = {"com.buynora.authentication"},
    exclude = { SecurityAutoConfiguration.class }
)
@ComponentScan(
    basePackages = {"com.buynora.authentication"},
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX,
        pattern = "com\\.buynora\\.common\\.config\\..*"
    )
)
@EnableDiscoveryClient
public class AuthenticationApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthenticationApplication.class, args);
    }
}
