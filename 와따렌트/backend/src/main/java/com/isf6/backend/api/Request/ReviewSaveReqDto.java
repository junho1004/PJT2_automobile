package com.isf6.backend.api.Request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReviewSaveReqDto {
    private Long sellerUserCode; //판매자 유저 코드
    private Long buyerUserCode; //구매자 유저 코드
    private String review; //리뷰 내용

}
