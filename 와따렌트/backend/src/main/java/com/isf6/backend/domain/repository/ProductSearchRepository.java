package com.isf6.backend.domain.repository;

import com.isf6.backend.api.Request.ProductSearchReqDto;
import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.entity.ProductStatus;
import com.isf6.backend.domain.entity.QProduct;
import com.isf6.backend.domain.entity.QUser;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ProductSearchRepository {

    private final EntityManager em;

    public List<Product> findBySearch(ProductSearchReqDto productSearch) {
        JPAQueryFactory query = new JPAQueryFactory(em);
        QProduct product = QProduct.product;
        QUser user = QUser.user;

        return query
                .select(product)
                .from(product)
                .where(product.title.contains(productSearch.getSearchName()).or(product.description.contains(productSearch.getSearchName())))
                .orderBy(product.createdDate.desc())
                .fetch();
    }

    private BooleanExpression nameLike(String searchName) {
        if (StringUtils.hasText(searchName)) {
            return null;
        }
        return QProduct.product.title.like(searchName);
    }

    private BooleanExpression statusEq(ProductStatus statusCond) {
        if (statusCond == null) {
            return null;
        }
        return QProduct.product.status.eq(statusCond);
    }
}
