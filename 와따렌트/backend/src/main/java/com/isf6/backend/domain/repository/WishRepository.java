package com.isf6.backend.domain.repository;

import com.isf6.backend.domain.entity.Wish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface WishRepository extends JpaRepository<Wish, Object> {

    @Query("SELECT COUNT(*) FROM Wish w WHERE w.product.id = :productId")
    Long getWishCnt(@Param("productId") long productId);

    @Query("SELECT w FROM Wish w WHERE w.product.id = :productId")
    Wish findByProductId(@Param("productId") long productId);

    @Query("SELECT w FROM Wish w WHERE w.product.id = :productId")
    List<Wish> getWishList(@Param("productId") long productId);
    
    @Query("SELECT w FROM Wish w WHERE w.product.id = :productId and w.user.userCode = :userCode")
    Wish getWish(@Param("productId") long productId, @Param("userCode") long userCode);


    @Transactional
    @Modifying
    @Query("delete from Wish w where w.user.userCode = :userCode and w.product.id = :productId")
    void deleteWish(@Param("productId") long productId, @Param("userCode") long userCode);
}
