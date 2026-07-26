package com.buynora.product.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    private String id;

    @org.springframework.data.mongodb.core.index.TextIndexed
    private String name;
    
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    
    @org.springframework.data.mongodb.core.index.Indexed
    private String category;
    
    @org.springframework.data.mongodb.core.index.Indexed
    private String brand;
    private List<String> imageUrls; // Cloudinary CDN links

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
