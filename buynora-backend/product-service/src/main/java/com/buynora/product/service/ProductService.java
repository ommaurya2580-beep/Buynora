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
        product.setImageUrls(new ArrayList<>());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        Product savedProduct = productRepository.save(product);

        if (images != null && !images.isEmpty()) {
            List<byte[]> imageBytesList = new ArrayList<>();
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    imageBytesList.add(file.getBytes());
                }
            }

            CompletableFuture.runAsync(() -> {
                try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
                    List<CompletableFuture<String>> uploadFutures = imageBytesList.stream()
                            .map(bytes -> CompletableFuture.supplyAsync(() -> {
                                try {
                                    return cloudinaryService.uploadImage(bytes);
                                } catch (IOException e) {
                                    System.err.println("Failed to upload image: " + e.getMessage());
                                    return null;
                                }
                            }, executor))
                            .collect(Collectors.toList());

                    List<String> imageUrls = uploadFutures.stream()
                            .map(CompletableFuture::join)
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList());

                    savedProduct.setImageUrls(imageUrls);
                    productRepository.save(savedProduct);
                }
            });
        }
        return savedProduct;
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
            return productRepository.searchProducts(name, pageable);
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
        
        existingProduct.setUpdatedAt(LocalDateTime.now());
        Product savedProduct = productRepository.save(existingProduct);
        
        if (newImages != null && !newImages.isEmpty()) {
            List<byte[]> imageBytesList = new ArrayList<>();
            for (MultipartFile file : newImages) {
                if (!file.isEmpty()) {
                    imageBytesList.add(file.getBytes());
                }
            }
            
            CompletableFuture.runAsync(() -> {
                List<String> imageUrls = savedProduct.getImageUrls() != null ? new ArrayList<>(savedProduct.getImageUrls()) : new ArrayList<>();
                
                try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
                    List<CompletableFuture<String>> uploadFutures = imageBytesList.stream()
                            .map(bytes -> CompletableFuture.supplyAsync(() -> {
                                try {
                                    return cloudinaryService.uploadImage(bytes);
                                } catch (IOException e) {
                                    System.err.println("Failed to upload image: " + e.getMessage());
                                    return null;
                                }
                            }, executor))
                            .collect(Collectors.toList());

                    List<String> newUrls = uploadFutures.stream()
                            .map(CompletableFuture::join)
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList());
                            
                    imageUrls.addAll(newUrls);
                }
                savedProduct.setImageUrls(imageUrls);
                productRepository.save(savedProduct);
            });
        }
        
        return savedProduct;
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
