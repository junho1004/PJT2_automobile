package com.isf6.backend.domain.repository;

import com.isf6.backend.domain.entity.Img;
import com.isf6.backend.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImgRepository extends JpaRepository<Img, Long> {
    List<Img> findAllByProduct(Product productId);
}