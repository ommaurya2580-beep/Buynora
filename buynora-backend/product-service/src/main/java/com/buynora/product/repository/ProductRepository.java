package com.buynora.product.repository;

import com.buynora.product.entity.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    @org.springframework.data.mongodb.repository.Query("{ $text: { $search: ?0 } }")
    Page<Product> searchProducts(String name, Pageable pageable);
    
    Page<Product> findByCategory(String category, Pageable pageable);
}
