package com.isf6.backend.domain.repository;

import com.isf6.backend.domain.entity.LiveRequest;
import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.entity.User;
import com.isf6.backend.domain.entity.Wish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.List;

public interface LiveRequestRepository extends JpaRepository<LiveRequest, Object> {
    @Query("SELECT COUNT(*) FROM LiveRequest lr WHERE lr.product.id = :productId")
    Long getLiveRequestCnt(@Param("productId") long productId);

    @Query("SELECT lr FROM LiveRequest lr WHERE lr.product.id = :productId and lr.user.userCode = :userCode")
    LiveRequest getLiveRequest(@Param("productId") long productId, @Param("userCode") long userCode);

    @Query("SELECT lr FROM LiveRequest lr WHERE lr.user.userCode = :userCode")
    List<LiveRequest> findByUserId(@Param("userCode") long userCode);

    @Modifying
    @Query("DELETE FROM LiveRequest lr WHERE lr.product.id = :productId")
    void deleteLiveRequest(@Param("productId") long productId);

}
