package com.buynora.common.config;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.loadbalancer.core.RandomLoadBalancer;
import org.springframework.cloud.loadbalancer.core.ReactorLoadBalancer;
import org.springframework.cloud.loadbalancer.core.RoundRobinLoadBalancer;
import org.springframework.cloud.loadbalancer.core.ServiceInstanceListSupplier;
import org.springframework.cloud.loadbalancer.support.LoadBalancerClientFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

/**
 * Custom Load Balancer Configuration for Spring Cloud.
 * This class shouldn't be annotated with @Configuration in the global scope 
 * if you want to use it dynamically via @LoadBalancerClient, but for demonstration
 * of providing beans to the LoadBalancerClientFactory, it can be passed dynamically.
 */
public class LoadBalancerConfig {

    /**
     * Default Round Robin strategy.
     */
    @Bean
    public ReactorLoadBalancer<ServiceInstance> roundRobinLoadBalancer(Environment environment,
                                                                       LoadBalancerClientFactory loadBalancerClientFactory) {
        String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
        return new RoundRobinLoadBalancer(loadBalancerClientFactory
                .getLazyProvider(name, ServiceInstanceListSupplier.class),
                name);
    }

    /**
     * Alternative Random Load Balancer.
     * To use this instead of RoundRobin, change the returned bean.
     */
    // @Bean
    public ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(Environment environment,
                                                                   LoadBalancerClientFactory loadBalancerClientFactory) {
        String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
        return new RandomLoadBalancer(loadBalancerClientFactory
                .getLazyProvider(name, ServiceInstanceListSupplier.class),
                name);
    }

    // TODO: Future Implementation -> Weighted Load Balancer
    // public ReactorLoadBalancer<ServiceInstance> weightedLoadBalancer(...)

    // TODO: Future Implementation -> Sticky Sessions (HintBasedServiceInstanceListSupplier)
}
