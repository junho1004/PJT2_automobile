package com.isf6.backend.domain.repository.custom;

import com.isf6.backend.api.Response.IndexProductsResDto;
import com.isf6.backend.domain.entity.Img;
import com.isf6.backend.domain.entity.ProductStatus;
import com.isf6.backend.domain.entity.QImg;
import com.isf6.backend.domain.entity.QProduct;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryCustomImpl implements ProductRepositroyCustom {
    private final JPAQueryFactory queryFactory;
    QProduct product = QProduct.product;
    QImg img = QImg.img;


//    @Override
//    public Page<IndexProductsResDto> findAllByCategoryOrderBySort(String sort, String category, Pageable pageable) {
//        List<IndexProductsResDto> returnPost = queryFactory.select(Projections.fields(
//                        IndexProductsResDto.class,
//                        product.id,
//                        product.title,
//                        product.price,
//                        product.status,
//                        product.createdDate,
//                        product.wishes.size().as("wishSize"),
//                        product.liveRequests.size().as("liveReqSize")
//                ))
//                .from(product)
//                .fetch();
//
//        return new PageImpl<>(returnPost, pageable, returnPost.size());
//    }

    //no-offset 방식
    @Override
    public List<IndexProductsResDto> findAllNoOffset(Long productId, int pageSize) {
        BooleanBuilder dynamicLtId = new BooleanBuilder();

        if(productId != null) {
            dynamicLtId.and(product.id.lt(productId));
        }

        return queryFactory
                .select(Projections.fields(IndexProductsResDto.class,
                        product.id.as("productId"),
                        product.title,
                        product.price,
                        product.status,
                        product.createdDate,
                        product.wishes.size().as("wishSize"),
                        product.liveRequests.size().as("liveReqSize")
                ))
                .from(product)
                .where(dynamicLtId)
                .orderBy(product.id.desc())
                .limit(pageSize)
                .fetch();
    }

    //offset 방식
    @Override
    public List<IndexProductsResDto> findAllOffSet(int pageNo, int pageSize) {
        return queryFactory
                .selectDistinct(Projections.fields(IndexProductsResDto.class,
                        product.id.as("productId"),
                        product.title,
                        product.price,
                        product.status,
                        product.createdDate,
                        product.wishes.size().as("wishSize"),
                        product.liveRequests.size().as("liveReqSize"),
                        img.imgUrl.as("thumbnail")
                ))
                .from(product)
                .join(img).on(product.id.eq(img.product.id))
                .where(product.status.eq(ProductStatus.valueOf("ONSALE")))
                .groupBy(img.product.id)
                .orderBy(product.id.desc())
                .limit(pageSize)
                .offset(pageNo * pageSize)
                .distinct()
                .fetch();
    }

}
