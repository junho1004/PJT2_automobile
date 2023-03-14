package com.isf6.backend.domain.repository;

import com.isf6.backend.domain.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Object> {

    @Query("select b from Bill b where b.buyer.userCode = :userCode")
    List<Bill> findByBuyerUserCode(@Param("userCode") Long userCode);

    @Query("select b from Bill b where b.seller.userCode = :userCode")
    List<Bill> findBySellerUserCode(@Param("userCode") Long userCode);

    public Bill findByProductId(long productId);
}
