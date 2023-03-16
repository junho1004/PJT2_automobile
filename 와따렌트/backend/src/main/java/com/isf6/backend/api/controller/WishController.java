package com.isf6.backend.api.controller;

import com.isf6.backend.service.ProductService;
import com.isf6.backend.service.UserService;
import com.isf6.backend.service.WishService;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@ApiResponses({
        @ApiResponse(code = 200, message = "Success"),
        @ApiResponse(code = 400, message = "Bad Request"),
        @ApiResponse(code = 500, message = "Internal Server Error")
})
@Api(value = "/wish", description = "wish 정보를 처리 하는 Controller")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/wish")
public class WishController {
    private final WishService wishService;
    private final UserService userService;
    private final ProductService productService;

    @ApiOperation(value = "좋아요", notes = "좋아요를 누른 유저 정보를 받아서 관심 정보 DB에 저장")
    @PostMapping
    public ResponseEntity saveWish(@ApiParam(value = "userCode", required = true) @RequestParam("userCode") Long userCode,
                                   @ApiParam(value = "관심있는 상품 Id", required = true) @RequestParam("productId") Long productId) {
        Map<String, Object> result = new HashMap<>();
        wishService.saveWish(userCode, productId);

        long cnt = wishService.getWishCnt(productId);
        result.put("wishCnt", cnt);
        result.put("wishCheck", true);

        return ResponseEntity.status(200).body(result);
    }

    @ApiOperation(value = "좋아요 삭제", notes = "좋아요를 누른 유저 정보를 받아서 관심 정보 DB에서 삭제")
    @DeleteMapping
    public ResponseEntity deleteWish(@ApiParam(value = "userCode", required = true) @RequestParam("userCode") Long userCode,
                                     @ApiParam(value = "관심있는 상품 Id", required = true) @RequestParam("productId") Long productId) {
        Map<String, Object> result = new HashMap<>();
        wishService.deleteWish(userCode, productId);

        long cnt = wishService.getWishCnt(productId);
        result.put("wishCnt", cnt);
        result.put("wishCheck", false);

        return ResponseEntity.status(200).body(result);
    }

}
