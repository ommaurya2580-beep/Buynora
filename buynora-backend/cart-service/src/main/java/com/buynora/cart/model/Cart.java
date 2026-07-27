package com.buynora.cart.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@RedisHash(value = "Cart", timeToLive = 2592000)
public class Cart {
    @Id
    private String userId;
    
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();
    
    private BigDecimal subtotal;
}
