package com.smartcart.controller;

import com.smartcart.entity.Product;
import com.smartcart.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    // ==========================
    // Add Product
    // ==========================
    @PostMapping
    public Product saveProduct(@Valid @RequestBody Product product) {
        return productService.saveProduct(product);
    }

    // ==========================
    // Get All Products
    // ==========================
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // ==========================
    // Get Product By Id
    // ==========================
    @GetMapping("/{id}")
    public Optional<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // ==========================
    // Update Product
    // ==========================
    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody Product product) {

        return productService.updateProduct(id, product);
    }

    // ==========================
    // Delete Product
    // ==========================
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {

        productService.deleteProduct(id);

        return "Product deleted successfully";
    }

    // ==========================
    // Search Product By Name
    // ==========================
    @GetMapping("/search")
    public List<Product> searchProduct(@RequestParam String name) {

        return productService.searchByName(name);
    }

    // ==========================
    // Search Product By Category
    // ==========================
    @GetMapping("/category/{categoryId}")
    public List<Product> searchByCategory(
            @PathVariable Long categoryId) {

        return productService.searchByCategory(categoryId);
    }

    // ==========================
    // Search Product By Price
    // ==========================
    @GetMapping("/price")
    public List<Product> searchByPrice(
            @RequestParam Double min,
            @RequestParam Double max) {

        return productService.searchByPrice(min, max);
    }

    // ==========================
    // Pagination & Sorting
    // ==========================
    @GetMapping("/all")
    public Page<Product> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        return productService.getProducts(page, size, sortBy);
    }

}