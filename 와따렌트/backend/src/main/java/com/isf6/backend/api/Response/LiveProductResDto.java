package com.isf6.backend.api.Response;

import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.entity.ProductStatus;
import com.isf6.backend.domain.entity.User;
import lombok.Data;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Data
public class LiveProductResDto {

    private Long productId;
    private String title;
    private int price;
    private String description;
    private String availableTime;
    private Timestamp reserve;
    private ProductStatus status;
    private long userCode;

    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private String thumbnail;

    public LiveProductResDto(Product product) {
        productId = product.getId();
        title = product.getTitle();
        price = product.getPrice();
        description = product.getDescription();
        availableTime = product.getAvailableTime();
        reserve = product.getReserve();
        userCode = product.getUser().getUserCode();
        status = product.getStatus();
        createdDate = product.getCreatedDate();
        modifiedDate = product.getModifiedDate();
        thumbnail = product.getImgList().get(0).getImgUrl();

    }
}
