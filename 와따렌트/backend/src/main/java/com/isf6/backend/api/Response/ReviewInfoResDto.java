package com.isf6.backend.api.Response;

import com.isf6.backend.domain.entity.Bill;
import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.entity.ProductStatus;
import com.isf6.backend.domain.entity.User;
import lombok.Getter;

@Getter
public class ReviewInfoResDto {
    private Long reviewId;
    private String review;
    private User buyer;
    private User seller;
    private String thumbnail;
    private Product product;

    public ReviewInfoResDto(Bill bill) {
        reviewId = bill.getId();
        review = bill.getReview();
        buyer = bill.getBuyer();
        seller = bill.getSeller();
        thumbnail = bill.getProduct().getImgList().get(0).getImgUrl();
        product = bill.getProduct();
    }
}
