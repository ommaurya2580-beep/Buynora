package com.buynora.common.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        
        // Use String serializer for keys
        template.setKeySerializer(new StringRedisSerializer());
        
        // Use JSON serializer for values
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // Default cache configuration
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        // Custom TTL configurations for different cache regions requested by the user
        Map<String, RedisCacheConfiguration> configMap = new HashMap<>();
        
        // OTP Cache: 5 Minutes
        configMap.put("otp_cache", defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Search Cache: 1 Hour
        configMap.put("search_cache", defaultConfig.entryTtl(Duration.ofHours(1)));
        
        // Recommendation Cache: 12 Hours
        configMap.put("recommendation_cache", defaultConfig.entryTtl(Duration.ofHours(12)));
        
        // Session Cache: 24 Hours
        configMap.put("session_cache", defaultConfig.entryTtl(Duration.ofHours(24)));
        
        // Cart Cache: 7 Days
        configMap.put("cart_cache", defaultConfig.entryTtl(Duration.ofDays(7)));
        
        // Wishlist Cache: 30 Days
        configMap.put("wishlist_cache", defaultConfig.entryTtl(Duration.ofDays(30)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(configMap)
                .build();
    }
}
