package com.isf6.backend.api.controller;

import com.isf6.backend.service.LiveRequestService;
import com.isf6.backend.service.ProductService;
import com.isf6.backend.service.UserService;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@ApiResponses({
        @ApiResponse(code = 200, message = "Success"),
        @ApiResponse(code = 400, message = "Bad Request"),
        @ApiResponse(code = 500, message = "Internal Server Error")
})
@Api(value = "/liveRequest", description = "liveRequest 정보를 처리 하는 Controller")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/liveRequest")
public class LiveRequestController {

    private final LiveRequestService liveRequestService;
    private final UserService userService;
    private final ProductService productService;

    @ApiOperation(value = "라이브요청 추가", notes = "상품에 라이브 요청을 하면 DB에 요청 정보를 저장")
    @PostMapping()
    public ResponseEntity productLiveRequest(@ApiParam(value = "라이브 요청을 하는 유저의 정보", required = true) @RequestParam("userCode") Long userCode,
                                             @ApiParam(value = "라이브 요청을 받는 상품 정보", required = true) @RequestParam("productId") Long productId) {
        Map<String, Object> result = new HashMap<>();
        //userCode와 productId로 디비에 라이브 요청 생성
        boolean check = liveRequestService.saveLiveRequest(userCode, productId);
        if(!check) {
            //라이브 요청 불가능
            result.put("liveRequest", check);
        } else {
            result.put("liveRequest", check);
        }

        //라이브 요청 개수 리턴
        long cnt = liveRequestService.getLiveRequestCnt(productId);
        result.put("liveRequestCnt", cnt);
        //라이브 요청 여부 개수 리턴
        result.put("liveRequestCheck", true);

        return ResponseEntity.status(200).body(result);
    }


}
