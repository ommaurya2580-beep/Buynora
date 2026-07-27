package com.buynora.cart.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemRequest {
    private String productId;
    private int quantity;
    private String color;
    private String size;
    private BigDecimal price;
    private String name;
    private String brand;
    private String imageUrl;
}
