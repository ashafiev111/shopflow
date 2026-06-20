package org.example.magazin.controller;

import lombok.RequiredArgsConstructor;
import org.example.magazin.dto.ReviewDto;
import org.example.magazin.model.Review;
import org.example.magazin.model.User;
import org.example.magazin.repository.ProductRepository;
import org.example.magazin.repository.ReviewRepository;
import org.example.magazin.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @GetMapping("/api/products/{productId}/reviews")
    @Transactional(readOnly = true)
    public List<ReviewDto> getReviews(@PathVariable Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PostMapping("/api/products/{productId}/reviews")
    @Transactional
    public ResponseEntity<?> createReview(@PathVariable Long productId,
                                           @RequestBody Map<String, Object> body,
                                           Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!productRepository.existsById(productId)) {
            return ResponseEntity.status(404).body(Map.of("error", "Product not found"));
        }

        Object ratingObj = body.get("rating");
        if (ratingObj == null) {
            return ResponseEntity.status(400).body(Map.of("error", "Rating is required"));
        }
        int rating = ((Number) ratingObj).intValue();
        if (rating < 1 || rating > 5) {
            return ResponseEntity.status(400).body(Map.of("error", "Rating must be between 1 and 5"));
        }

        String comment = (String) body.get("comment");

        Review review = new Review();
        review.setUser(user);
        review.setProductId(productId);
        review.setRating(rating);
        review.setComment(comment);
        reviewRepository.save(review);

        recalcProductRating(productId);

        return ResponseEntity.ok(toDto(review));
    }

    @DeleteMapping("/api/reviews/{id}")
    @Transactional
    public ResponseEntity<?> deleteReview(@PathVariable Long id, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = "ADMIN".equals(user.getRole());
        if (!review.getUser().getId().equals(user.getId()) && !isAdmin) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }

        Long productId = review.getProductId();
        reviewRepository.delete(review);

        recalcProductRating(productId);

        return ResponseEntity.ok(Map.of("ok", true));
    }

    private void recalcProductRating(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        if (reviews.isEmpty()) {
            productRepository.findById(productId).ifPresent(p -> {
                p.setRating(BigDecimal.ZERO);
                productRepository.save(p);
            });
        } else {
            double avg = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0);
            BigDecimal rating = BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP);
            productRepository.findById(productId).ifPresent(p -> {
                p.setRating(rating);
                productRepository.save(p);
            });
        }
    }

    private ReviewDto toDto(Review r) {
        return new ReviewDto(r.getId(), r.getUser().getId(), r.getUser().getUsername(),
                r.getProductId(), r.getRating(), r.getComment(), r.getCreatedAt());
    }
}
