package com.isf6.backend.api.Response;

import com.isf6.backend.domain.entity.Img;
import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.entity.ProductStatus;
import com.isf6.backend.domain.entity.QImg;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class IndexProductsResDto {

    private Long productId;
    private String title;
    private int price;
    private ProductStatus status;
    private LocalDateTime createdDate;
    private int wishSize;
    private int liveReqSize;
    private String thumbnail;
    private String review;


    public IndexProductsResDto(Product product) {
        productId = product.getId();
        title = product.getTitle();
        price = product.getPrice();
        status = product.getStatus();
        createdDate = product.getCreatedDate();
        wishSize = product.getWishes().size();
        liveReqSize = product.getLiveRequests().size();
        thumbnail = product.getImgList().get(0).getImgUrl();
        if(product.getBill() == null) {
            review = "";
        } else {
            review = product.getBill().getReview();
        }

    }
}
