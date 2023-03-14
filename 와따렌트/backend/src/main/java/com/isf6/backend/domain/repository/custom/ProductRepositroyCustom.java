package com.isf6.backend.domain.repository.custom;

import com.isf6.backend.api.Response.IndexProductsResDto;
import com.isf6.backend.domain.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface ProductRepositroyCustom {

    //public Page<IndexProductsResDto> findAllByCategoryOrderBySort(String sort, String category, Pageable pageable);
    List<IndexProductsResDto> findAllNoOffset(Long productId, int pageSize);

    List<IndexProductsResDto> findAllOffSet(int pageNo, int pageSize);
}
