package com.isf6.backend.api.controller;

import com.isf6.backend.api.Request.ReviewSaveReqDto;
import com.isf6.backend.api.Response.ReviewInfoResDto;
import com.isf6.backend.domain.entity.Bill;
import com.isf6.backend.service.ProductService;
import com.isf6.backend.service.ReviewService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/review")
public class ReviewController {

    private final ReviewService reviewService;
    private final ProductService productService;

    @ApiOperation(value = "리뷰 저장", notes = "작성된 리뷰를 저장")
    @PostMapping("/{productId}")
    public ResponseEntity saveReview(@ApiParam(value = "거래한 상품의 ID", required = true) @PathVariable Long productId,
                                     @ApiParam(value = "리뷰 정보", required = true) @RequestBody ReviewSaveReqDto reviewSaveReqDto) {
        Map<String, Object> response = new HashMap<>();
        Bill bill;

        //해당 상품에 리뷰가 없는지, 상품 상태가 SOLDOUT 인지 확인
        if(reviewService.checkReview(productId)) {
            response.put("result", "FAIL");
            response.put("reason", "해당 상품의 리뷰가 존재");
            return ResponseEntity.status(200).body(response);
        } else if (productService.checkProductStatus(productId)) {
            response.put("result", "FAIL");
            response.put("reason", "해당 상품 상태가 SOLDOUT이 아님");
            return ResponseEntity.status(200).body(response);
        }

        try{
            bill = reviewService.createReview(productId, reviewSaveReqDto);
        } catch (Exception e) {
            e.printStackTrace();

            response.put("result", "FAIL");
            response.put("reason", "리뷰 등록 실패");
            return ResponseEntity.status(200).body(response);
        }

        response.put("result", "SUCCESS");
        response.put("reason", "리뷰 등록 성공");
        return ResponseEntity.status(200).body(response);
    }

    //로그인한 유저가 쓴 리뷰 전체 목록
    @ApiOperation(value = "내가 작성한 리뷰 조회", notes = "로그인한 유저가 작성한 리뷰 전체 목록 조회")
    @GetMapping("/buyer/{userCode}")
    public ResponseEntity getMyReviewAll(@ApiParam(value = "유저 정보", required = true) @PathVariable Long userCode) {
        log.info("userCode : {}", userCode);
        Map<String, Object> response = new HashMap<>();
        List<ReviewInfoResDto> reviewList;

        try {
            reviewList = reviewService.getMyReviewAll(userCode);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("result", "FAIL");
            response.put("reason", "리뷰 조회 실패");
            return ResponseEntity.status(200).body(response);
        }

        response.put("result", "SUCCESS");
        response.put("MyReview", reviewList);
        return ResponseEntity.status(200).body(response);
    }

    @ApiOperation(value = "나에게 달린 리뷰 조회", notes = "로그인한 유저에게 작성된 리뷰 전체 목록 조회")
    @GetMapping("/seller/{userCode}")
    public ResponseEntity getReviewAll(@ApiParam(value = "유저 정보", required = true) @PathVariable Long userCode) {
        log.info("userCode : {}", userCode);
        Map<String, Object> response = new HashMap<>();
        List<ReviewInfoResDto> reviewList;

        try {
            reviewList = reviewService.getReviewAll(userCode);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("result", "FAIL");
            response.put("reason", "리뷰 조회 실패");
            return ResponseEntity.status(200).body(response);
        }

        response.put("result", "SUCCESS");
        response.put("MyReview", reviewList);
        return ResponseEntity.status(200).body(response);
    }

    @ApiOperation(value = "리뷰 수정", notes = "거래된 상품의 ID로 작성된 리뷰를 조회하여 수정")
    @PatchMapping("/{productId}")
    public ResponseEntity updateReview(@ApiParam(value = "거래한 상품의 ID", required = true) @PathVariable Long productId,
                                       @ApiParam(value = "리뷰 정보", required = true) @RequestBody ReviewSaveReqDto reviewSaveReqDto) {
        Map<String, Object> response = new HashMap<>();
        Bill bill = reviewService.getReviewByProductId(productId);
        Bill updateBill;

        try{
            updateBill = reviewService.updateReview(reviewSaveReqDto, bill);
        } catch (Exception e) {
            e.printStackTrace();

            response.put("result", "FAIL");
            response.put("reason", "리뷰 수정 실패");
            return ResponseEntity.status(200).body(response);
        }

        response.put("result", "SUCCESS");
        response.put("review", updateBill);
        return ResponseEntity.status(200).body(response);
    }

    @ApiOperation(value = "리뷰 삭제", notes = "거래된 상품의 ID로 작성된 리뷰 조회하여 삭제")
    @DeleteMapping("/{productId}")
    public ResponseEntity deleteReview(@ApiParam(value = "거래한 상품의 ID", required = true) @PathVariable Long productId) {
        Map<String, Object> response = new HashMap<>();

        try {
            reviewService.deleteReview(productId);
        } catch (Exception e) {
            e.printStackTrace();

            response.put("result", "FAIL");
            response.put("reason", "리뷰 삭제 실패");
            return ResponseEntity.status(200).body(response);
        }

        response.put("result", "SUCCESS");
        response.put("reason", "리뷰 삭제 성공");
        return ResponseEntity.status(200).body(response);
    }


}
