package com.example.employee_management.repository;

import com.example.employee_management.entity.PostedPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the {@link PostedPromotion} entity.
 * The primary key for PostedPromotion is of type String.
 */
@Repository
public interface PostedPromotionRepository extends JpaRepository<PostedPromotion, String> {
    // By extending JpaRepository, you automatically get methods for common
    // database operations like:
    // - save(entity)
    // - findById(id)
    // - findAll()
    // - deleteById(id)
    // - and many more.

    // You can define custom query methods here if needed in the future.
    // For example:
    // List<PostedPromotion> findByPreparedBy(String preparedBy);
}