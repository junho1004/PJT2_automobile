package com.isf6.backend.api.Request;

import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.entity.ProductStatus;
import lombok.*;

import javax.validation.constraints.NotEmpty;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSaveReqDto {

    @NotEmpty
    private String title;
    @NotEmpty
    private int price;
    private String description;
    private String availableTime;
    private ProductStatus status = ProductStatus.ONSALE;
    private Long userId;


    public Product toEntity() {
        return Product.builder()
                .title(title)
                .price(price)
                .description(description)
                .availableTime(availableTime)
                .status(status)
                .userId(userId)
                .build();
    }
}
