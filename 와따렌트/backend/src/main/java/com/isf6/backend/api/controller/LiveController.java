package com.isf6.backend.api.controller;

import com.isf6.backend.api.Response.LiveRoomResDto;
import com.isf6.backend.api.Request.LiveRoomSaveReqDto;
import com.isf6.backend.api.Response.LiveProductResDto;
import com.isf6.backend.domain.entity.LiveRoom;
import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.service.LiveRequestService;
import com.isf6.backend.service.LiveService;
import com.isf6.backend.service.ProductService;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApiResponses({
        @ApiResponse(code = 200, message = "Success"),
        @ApiResponse(code = 400, message = "Bad Request"),
        @ApiResponse(code = 500, message = "Internal Server Error")
})
@Api(value = "/live", description = "live 정보를 처리 하는 Controller")
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/live")
public class LiveController {

    private final LiveService liveService;
    private final LiveRequestService liveRequestService;
    private final ProductService productService;

    @ApiOperation(value = "라이브 방 생성", notes = "라이브 방을 생성하여 DB에 저장하고 정보를 반환")
    @PostMapping("/room")
    public ResponseEntity createLiveRoom(@ApiParam(value = "라이브 방 생성에 필요한 정보", required = true) @RequestBody LiveRoomSaveReqDto liveRoomSaveReqDto) {
        //log.info("liveRoomCreateReq.getProductId : {}", liveRoomSaveReqDto.getProductId());

        //1. 라이브 방을 생성(라이브방정보)
        //2. 성공 실패 결과 담아서 front로 전달
        // 성공하면 200으로 라이브 방 정보와 함께 넘겨주고
        // 실패해도 200으로 실패 정보 보내기
        Map<String, Object> response = new HashMap<>();
        LiveRoom liveRoom;

        try {
            liveRoom = liveService.createLive(liveRoomSaveReqDto);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("result", "FAIL");
            response.put("reason", "라이브 방 생성 실패");
            return ResponseEntity.status(200).body(response);
        }

        response.put("result", "SUCCESS");
        response.put("LiveRoom", liveRoom);
        return ResponseEntity.status(200).body(response);
    }

    @ApiOperation(value = "상품 번호로 라이브 방 조회", notes = "DB에서 상품 번호로 라이브 방을 조회하여 정보를 반환")
    @GetMapping("/{productId}")
    public ResponseEntity selectLiveRoom(@ApiParam(value = "상품 번호", required = true) @PathVariable long productId) {
        Map<String, Object> response = new HashMap<>();
        LiveRoom liveRoom = liveService.getLiveByProductId(productId);

        if(liveRoom == null) {
            response.put("result", "FAIL");
            response.put("reason", "검색되는 방 정보 없음");
            return ResponseEntity.status(200).body(response);
        }

        response.put("result", "SUCCESS");
        response.put("LiveRoom", liveRoom);
        return ResponseEntity.status(200).body(response);
    }

    @ApiOperation(value = "모든 라이브 방 조회", notes = "DB에서 모든 라이브 방을 조회하여 정보를 반환")
    @GetMapping("/all")
    public ResponseEntity selectAllLives() {
        Map<String, Object> response = new HashMap<>();
        List<LiveRoom> liveList = liveService.getAllLives();

        if(liveList != null) {
            response.put("result", "SUCCESS");
            response.put("liveList", liveList);
            return ResponseEntity.status(200).body(response);
        }

        response.put("result", "FAIL");
        response.put("reason", "전체 라이브 방 조회 실패");
        return ResponseEntity.status(200).body(response);
    }

    @ApiOperation(value = "라이브 방 정보 변경", notes = "DB에서 상품 번호로 라이브 방을 조회하여 정보를 변경한 후 정보를 반환")
    @PatchMapping("/{productId}")
    public ResponseEntity updateLiveRoom(@ApiParam(value = "상품 번호", required = true) @PathVariable long productId, @ApiParam(value = "라이브 방 생성에 필요한 정보", required = true) @RequestBody LiveRoomSaveReqDto liveRoomSaveReqDto) {
        //1.파라메터로 넘어온 상품 아이디에 해당되는 live 객체 찾기
        LiveRoom liveRoom = liveService.getLiveByProductId(productId);

        //2. 성공 실패 결과 담아서 front로 전달
        // 성공하면 200으로 라이브 방 정보와 함께 넘겨주고
        // 실패해도 200으로 실패 정보 보내기
        Map<String, Object> response = new HashMap<>();

        //3. 라이브 방 정보 수정
        try {
            liveRoom = liveService.updateLive(liveRoomSaveReqDto, liveRoom);
            response.put("result", "SUCCESS");
            response.put("LiveRoom", liveRoom);
            return ResponseEntity.status(200).body(response);

        } catch (Exception e) {
            e.printStackTrace();
        }
        response.put("result", "FAIL");
        response.put("reason", "라이브 방 생성 실패");
        return ResponseEntity.status(200).body(response);
    }

    @ApiOperation(value = "상품 번호로 라이브 방 삭제", notes = "DB에서 상품 번호로 라이브 방을 삭제")
    @DeleteMapping("/{productId}")
    public ResponseEntity deleteLiveRoom(@ApiParam(value = "상품 번호", required = true) @PathVariable long productId) {
        Map<String, Object> response = new HashMap<>();
        //상품에 라이브 예약 시간 삭제
        productService.deleteProductReserveTime(productId);

        //라이브 방 삭제
        liveService.deleteLiveRoom(productId);
        response.put("result", "SUCCESS");

        return ResponseEntity.status(200).body(response);
    }

//    @ApiOperation(value = "라이브방 시작 상태 변경", notes = "DB에서 라이브 방의 상태를 시작으로 변경")
//    @PatchMapping("/start/{productId}")
//    public ResponseEntity startLive(@ApiParam(value = "상품 번호", required = true) @PathVariable long productId) {
//        Map<String, Object> response = new HashMap<>();
//        liveService.updateStatus(productId, "start");
//        response.put("status", "ONAIR");
//        response.put("result", "SUCCESS");
//
//        return ResponseEntity.status(200).body(response);
//    }
    //시작하기 누르면 바뀜 여기에 알림톡 추가

    @ApiOperation(value = "라이브방 종료 상태 변경", notes = "DB에서 라이브 방의 상태를 종료로 변경")
    @PatchMapping("/end/{productId}")
    public ResponseEntity endLive(@ApiParam(value = "상품 번호", required = true) @PathVariable long productId) {
        Map<String, Object> response = new HashMap<>();
        liveService.updateStatus(productId, "end");
        response.put("status", "CLOSED");
        response.put("result", "SUCCESS");

        return ResponseEntity.status(200).body(response);
    }

    //라이브 탭 진입시 목록 데이터 반환
    @GetMapping("/main")
    public ResponseEntity mainTabList(@RequestParam("userCode") Long userCode) {
        Map<String, Object> result = new HashMap<>();

        //판매하고 있는 상품 중에서 라이브 요청이 1개 이상인 상품 목록
        List<LiveProductResDto> sellLiveRequestList = new ArrayList<>();
        sellLiveRequestList = liveRequestService.getSellLiveRequestList(userCode);
        log.info("sellListSize : {}", sellLiveRequestList.size());
        result.put("sellLiveRequestList", sellLiveRequestList);

        //내가 라이브 요청을 한 상품 목록
        List<LiveProductResDto> MyLiveRequestList = new ArrayList<>();
        MyLiveRequestList = liveRequestService.getMyLiveRequestProductList(userCode);
        log.info("listSize : {}", MyLiveRequestList.size()); //확인용
        result.put("MyLiveRequestList", MyLiveRequestList);

        return ResponseEntity.status(200).body(result);
    }

    //유저가 라이브 요청한 상품에 대한 라이브방 목록 조회(시작한 것만)
    @ApiOperation(value = "라이브 요청한 상품 중 시작한 라이브방 목록 조회", notes = "라이브 요청한 상품 중 시작한 라이브방 목록 조회")
    @GetMapping("/request/start/{userCode}")
    public ResponseEntity getStartRequestLiveRoomList(@PathVariable long userCode) {
        Map<String, Object> result = new HashMap<>();

        //내가 라이브요청한 상품의 라이브 방이 생성되었는지 확인하고 조회....
        List<LiveRoomResDto> liveRoomList = new ArrayList<>();
        liveRoomList = liveService.getStartRequestLiveRoomList(userCode);
        log.info("liveRoomList : {}", liveRoomList.size());
        result.put("myLiveRoomList", liveRoomList);

        return ResponseEntity.status(200).body(result);
    }

    @ApiOperation(value = "라이브 요청한 상품 중 대기 상태인 라이브방 목록 조회", notes = "라이브 요청한 상품 중 대기 상태인 라이브방 목록 조회")
    @GetMapping("/request/wait/{userCode}")
    public ResponseEntity getWaitRequestLiveRoomList(@PathVariable long userCode) {
        Map<String, Object> result = new HashMap<>();

        //내가 라이브요청한 상품의 라이브 방이 생성되었는지 확인하고 조회....
        List<LiveRoomResDto> liveRoomList = new ArrayList<>();
        liveRoomList = liveService.getWaitRequestLiveRoomList(userCode);
        log.info("liveRoomList : {}", liveRoomList.size());
        result.put("myLiveRoomList", liveRoomList);

        return ResponseEntity.status(200).body(result);
    }

}
