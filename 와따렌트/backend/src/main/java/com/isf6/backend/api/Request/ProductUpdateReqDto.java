package com.isf6.backend.api.Request;

import com.isf6.backend.domain.entity.ProductStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Getter
@NoArgsConstructor
public class ProductUpdateReqDto {
    private String title;
    private int price;
    private String description;
    private String availableTime;
    private Timestamp reserve;
    private ProductStatus status; // ONSALE, BOOKING, SOLDOUT

    @Builder
    public ProductUpdateReqDto(String title, int price, String description, String availableTime, Timestamp reserve, ProductStatus status) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.availableTime = availableTime;
        this.reserve = reserve;
        this.status = status;
    }
}

