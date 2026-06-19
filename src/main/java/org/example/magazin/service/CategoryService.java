package org.example.magazin.service;

import lombok.RequiredArgsConstructor;
import org.example.magazin.dto.CategoryDto;
import org.example.magazin.exception.NotFoundException;
import org.example.magazin.model.Category;
import org.example.magazin.repository.CategoryRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Cacheable("categories")
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Cacheable(value = "categories", key = "#id")
    public Category findById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found: " + id));
    }

    @CacheEvict(value = "categories", allEntries = true)
    public Category create(CategoryDto dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setIcon(dto.getIcon());
        return categoryRepository.save(category);
    }

    @CacheEvict(value = "categories", allEntries = true)
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new NotFoundException("Category not found: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
