package com.buynora.common.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestClientConfig {

    /**
     * The @LoadBalanced annotation tells Spring Cloud to create a 
     * LoadBalancerInterceptor and inject it into the RestTemplate.
     * This allows us to use service names (like http://PRODUCT-SERVICE)
     * instead of direct host/IP combinations.
     */
    @Bean
    @LoadBalanced
    public RestTemplate loadBalancedRestTemplate() {
        return new RestTemplate();
    }
}
