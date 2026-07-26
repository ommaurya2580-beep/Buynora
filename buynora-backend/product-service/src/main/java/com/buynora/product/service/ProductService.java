package com.buynora.product.service;

import com.buynora.product.entity.Product;
import com.buynora.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.CacheEvict;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public Product addProduct(Product product, List<MultipartFile> images) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
                List<CompletableFuture<String>> uploadFutures = images.stream()
                        .filter(file -> !file.isEmpty())
                        .map(file -> CompletableFuture.supplyAsync(() -> {
                            try {
                                return cloudinaryService.uploadImage(file);
                            } catch (IOException e) {
                                throw new RuntimeException("Failed to upload image", e);
                            }
                        }, executor))
                        .collect(Collectors.toList());

                imageUrls = uploadFutures.stream()
                        .map(CompletableFuture::join)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
            }
        }
        product.setImageUrls(imageUrls);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    public Page<Product> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findAll(pageable);
    }

    public Page<Product> searchProducts(String name, String category, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        if (name != null && !name.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(name, pageable);
        } else if (category != null && !category.isEmpty()) {
            return productRepository.findByCategory(category, pageable);
        }
        return productRepository.findAll(pageable);
    }

    @CachePut(value = "products", key = "#id")
    public Product updateProduct(String id, Product updatedProduct, List<MultipartFile> newImages) throws IOException {
        Product existingProduct = getProductById(id);
        
        if (updatedProduct.getName() != null) existingProduct.setName(updatedProduct.getName());
        if (updatedProduct.getDescription() != null) existingProduct.setDescription(updatedProduct.getDescription());
        if (updatedProduct.getPrice() != null) existingProduct.setPrice(updatedProduct.getPrice());
        if (updatedProduct.getCategory() != null) existingProduct.setCategory(updatedProduct.getCategory());
        if (updatedProduct.getBrand() != null) existingProduct.setBrand(updatedProduct.getBrand());
        if (updatedProduct.getStockQuantity() != null) existingProduct.setStockQuantity(updatedProduct.getStockQuantity());
        
        if (newImages != null && !newImages.isEmpty()) {
            List<String> imageUrls = existingProduct.getImageUrls() != null ? new ArrayList<>(existingProduct.getImageUrls()) : new ArrayList<>();
            
            try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
                List<CompletableFuture<String>> uploadFutures = newImages.stream()
                        .filter(file -> !file.isEmpty())
                        .map(file -> CompletableFuture.supplyAsync(() -> {
                            try {
                                return cloudinaryService.uploadImage(file);
                            } catch (IOException e) {
                                throw new RuntimeException("Failed to upload image", e);
                            }
                        }, executor))
                        .collect(Collectors.toList());

                List<String> newUrls = uploadFutures.stream()
                        .map(CompletableFuture::join)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                        
                imageUrls.addAll(newUrls);
            }
            existingProduct.setImageUrls(imageUrls);
        }
        
        existingProduct.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(existingProduct);
    }

    @Cacheable(value = "products", key = "#id")
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
