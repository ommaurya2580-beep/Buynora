package com.buynora.product.controller;

import com.buynora.product.entity.Product;
import com.buynora.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product", description = "Product catalog management APIs")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Operation(summary = "Add a new product with images", description = "Creates a new product and uploads images to Cloudinary")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid product data provided")
    })
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Product addProduct(
            @RequestPart("product") String productStr,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Product product = objectMapper.readValue(productStr, Product.class);
        return productService.addProduct(product, images);
    }

    @Operation(summary = "Get all products", description = "Retrieves a paginated list of products, with optional search and filtering")
    @ApiResponse(responseCode = "200", description = "Products retrieved successfully")
    @GetMapping
    public Page<Product> getAllProducts(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "10", required = false) int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir) {
        
        if (name != null || category != null) {
            return productService.searchProducts(name, category, page, size, sortBy, sortDir);
        }
        return productService.getAllProducts(page, size, sortBy, sortDir);
    }

    @Operation(summary = "Get product by ID", description = "Retrieves specific product details by its unique identifier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable String id) {
        return productService.getProductById(id);
    }

    @Operation(summary = "Update product by ID", description = "Updates an existing product's details and/or images")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Product updateProduct(
            @PathVariable String id,
            @RequestPart("product") String productStr,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Product product = objectMapper.readValue(productStr, Product.class);
        return productService.updateProduct(id, product, images);
    }

    @Operation(summary = "Delete product by ID", description = "Deletes a specific product by its unique identifier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product deleted"),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
    }
}
