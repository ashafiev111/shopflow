package org.example.magazin.service;

import lombok.RequiredArgsConstructor;
import org.example.magazin.dto.ProductDto;
import org.example.magazin.exception.NotFoundException;
import org.example.magazin.model.Product;
import org.example.magazin.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    @Cacheable(value = "products", key = "#categoryId + '-' + #search + '-' + #sort + '-' + #page + '-' + #size")
    public Page<Product> findAll(Long categoryId, String search, String sort, int page, int size) {
        List<Product> products;
        if (categoryId != null) {
            products = productRepository.findByCategoryId(categoryId);
        } else if (search != null && !search.isBlank()) {
            products = productRepository.findByNameContainingIgnoreCase(search);
        } else {
            products = productRepository.findAll();
        }

        if (search != null && !search.isBlank()) {
            products = products.stream()
                    .filter(p -> p.getName().toLowerCase().contains(search.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (sort != null) {
            switch (sort) {
                case "price-asc" -> products.sort(Comparator.comparing(Product::getPrice));
                case "price-desc" -> products.sort(Comparator.comparing(Product::getPrice).reversed());
                case "rating" -> products.sort(Comparator.comparing(Product::getRating).reversed());
            }
        }

        int start = page * size;
        int end = Math.min(start + size, products.size());
        List<Product> items = start < products.size() ? products.subList(start, end) : List.of();
        return new PageImpl<>(items, PageRequest.of(page, size), products.size());
    }

    @Cacheable(value = "products", key = "'id-' + #id")
    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found: " + id));
    }

    @CacheEvict(value = "products", allEntries = true)
    public Product create(ProductDto dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setCategoryId(dto.getCategoryId());
        product.setPrice(dto.getPrice());
        product.setOldPrice(dto.getOldPrice());
        product.setImageUrl(dto.getImageUrl());
        product.setStock(dto.getStock() != null ? dto.getStock() : 0);
        product.setRating(dto.getRating() != null ? dto.getRating() : java.math.BigDecimal.ZERO);
        product.setSold(dto.getSold() != null ? dto.getSold() : 0);
        return productRepository.save(product);
    }

    @CacheEvict(value = "products", allEntries = true)
    public Product updateImage(Long id, MultipartFile file) {
        Product product = findById(id);
        String ext = getExtension(file.getOriginalFilename());
        String filename = id + "_" + UUID.randomUUID().toString().substring(0, 8) + "." + ext;
        try {
            Path dir = uploadsAbsolutePath();
            Files.createDirectories(dir);
            Path dest = dir.resolve(filename);
            file.transferTo(dest.toFile());
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image", e);
        }
        deleteOldImageFile(product);
        product.setImageUrl("/uploads/" + filename);
        return productRepository.save(product);
    }

    @CacheEvict(value = "products", allEntries = true)
    public Product update(Long id, ProductDto dto) {
        Product product = findById(id);
        product.setName(dto.getName());
        product.setCategoryId(dto.getCategoryId());
        product.setPrice(dto.getPrice());
        product.setOldPrice(dto.getOldPrice());
        product.setImageUrl(dto.getImageUrl());
        product.setStock(dto.getStock() != null ? dto.getStock() : 0);
        product.setRating(dto.getRating() != null ? dto.getRating() : java.math.BigDecimal.ZERO);
        product.setSold(dto.getSold() != null ? dto.getSold() : 0);
        return productRepository.save(product);
    }

    @CacheEvict(value = "products", allEntries = true)
    public void delete(Long id) {
        Product product = findById(id);
        deleteOldImageFile(product);
        productRepository.deleteById(id);
    }

    private Path uploadsAbsolutePath() {
        return new File(uploadDir).getAbsoluteFile().toPath();
    }

    private void deleteOldImageFile(Product product) {
        if (product.getImageUrl() != null && product.getImageUrl().startsWith("/uploads/")) {
            try {
                String filename = product.getImageUrl().substring("/uploads/".length());
                Path file = uploadsAbsolutePath().resolve(filename);
                Files.deleteIfExists(file);
            } catch (IOException ignored) {
            }
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}
