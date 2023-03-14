package com.isf6.backend.domain.repository;

import com.isf6.backend.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.persistence.EntityManager;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.status LIKE '%ONSALE%' ORDER BY p.createdDate DESC")
    List<Product> findAllDesc();

    @Query("select distinct p from Product p " +
            "join LiveRequest lr on lr.product.id = p.id " +
            "join User u on u.userCode = lr.user.userCode " +
            "where u.userCode = :userCode")
    List<Product> getMyLiveRequestList(@Param("userCode") long userCode);

    @Query("select p from Product p " +
            "join LiveRequest lr on lr.product.id = p.id " +
            "where p.status LIKE '%ONSALE%' and p.user.userCode = :userCode " +
            "group by p.id having count(*) >= 1")
    List<Product> getSellLiveRequestList(@Param("userCode") long userCode);

    @Query("SELECT p FROM Product p WHERE p.user.userCode = :id")
    List<Product> findSellUserCode(@Param("id") long id);

    //select p.* from products p join bill b on b.buyer_id = 9 where p.product_id = b.product_id;
    @Query("SELECT p FROM Product p join Bill b on b.buyer.userCode = :id where p.id = b.product.id")
    List<Product> findBuyUserCode(@Param("id") long id);

    // subquery가 2번 이상 호출되면 에러가 발생 = -> in 으로 해결..
    @Query("SELECT p FROM Product p WHERE p.id in (SELECT w.product.id FROM Wish w WHERE w.user.userCode = :id)")
    List<Product> findWishUserCode(@Param("id") long id);
}

