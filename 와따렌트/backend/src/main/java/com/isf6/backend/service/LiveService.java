package com.isf6.backend.service;

import com.isf6.backend.api.Request.LiveRoomSaveReqDto;
import com.isf6.backend.api.Response.LiveRoomResDto;
import com.isf6.backend.api.controller.LiveController;
import com.isf6.backend.domain.entity.LiveRequest;
import com.isf6.backend.domain.entity.LiveRoom;
import com.isf6.backend.domain.entity.LiveStatus;
import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.repository.LiveRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class LiveService {

    private final LiveRoomRepository liveRoomRepository;
    private final ProductService productService;
    private final LiveRequestService liveRequestService;

    public LiveRoom createLive(LiveRoomSaveReqDto liveRoomSaveReqDto) {
        //1. 새로운 라이브방 생성
        LiveRoom liveRoom = new LiveRoom();

        //2. 라이브방 entity에 맞춰서 정보 입력
        Long productId = liveRoomSaveReqDto.getProductId();
        log.info("productId : {}", productId);
        Product product = productService.getProduct(productId); //상품 아이디로 상품 정보 가져오기
        liveRoom.setProduct(product);

        liveRoom.setTitle(product.getTitle()); //제목 추가
        liveRoom.setLive_start_time(liveRoomSaveReqDto.getLiveStartTime()); //라이브 시간 추가
        liveRoom.setLive_status(liveRoomSaveReqDto.getLiveStatus()); //라이브 상태

        liveRoomRepository.save(liveRoom); //라이브 저장

        return liveRoom;
    }

    public LiveRoom getLiveByProductId(long productId) {
        log.info("productId : {}", productId);
        LiveRoom liveRoom = liveRoomRepository.findByProductId(productId);
        log.info("liveRoom : {}", liveRoom);
        return liveRoom;
    }

    public List<LiveRoom> getAllLives() {
        List<LiveRoom> list = liveRoomRepository.findAll();
        return list;
    }

    public LiveRoom updateLive(LiveRoomSaveReqDto liveRoomSaveReqDto, LiveRoom liveRoom) {
        //1. 라이브방 entity에 맞춰서 정보 입력
        Long productId = liveRoomSaveReqDto.getProductId();
        Product product = productService.getProduct(productId); //상품 아이디로 상품 정보 가져오기
        liveRoom.setProduct(product);

        liveRoom.setLive_start_time(liveRoomSaveReqDto.getLiveStartTime());
        liveRoom.setLive_status(liveRoomSaveReqDto.getLiveStatus());

        //2. repository에도 라이브 저장하기
        liveRoomRepository.save(liveRoom); //라이브 저장

        return liveRoom;
    }

    public void deleteLiveRoom(long productId) {
        LiveRoom liveRoom = getLiveByProductId(productId);
        log.info("liveRoom id : {}" , liveRoom.getId());
        //라이브 방이 존재하면
        if(liveRoom != null) {
            log.info("방 존재");
            liveRoomRepository.deleteRoom(productId);

            //해당 상품에 대한 라이브 요청 지우기
            liveRequestService.deleteProductLiveRequest(productId);
        }
    }

    public void updateStatus(long productId, String status) {
        LiveRoom liveRoom = liveRoomRepository.findByProductId(productId);
        log.info("liveRoom : {}", liveRoom);

        if(status.equals("start")) {
            liveRoom.setLive_status(LiveStatus.valueOf("ONAIR"));
        } else if(status.equals("end")) {
            liveRoom.setLive_status(LiveStatus.valueOf("CLOSED"));
        }

        liveRoomRepository.save(liveRoom);
    }

    public List<LiveRoomResDto> getStartRequestLiveRoomList(long userCode) {
        //라이브요청 리스트로 라이브방 목록 가져오기... 근데 라이브 상태가 시작인 것만...
//        List<LiveRoom> liveRoomList = new ArrayList<>();
//        liveRoomList = liveRoomRepository.getStartLiveRoomList(userCode);

        return liveRoomRepository.getStartLiveRoomList(userCode).stream()
                .map(liveRoom -> new LiveRoomResDto(liveRoom))
                .collect(Collectors.toList());
    }

    public List<LiveRoomResDto> getWaitRequestLiveRoomList(long userCode) {
        //라이브요청 리스트로 라이브방 목록 가져오기... 근데 라이브 상태가 대기인 것만...
//        List<LiveRoom> liveRoomList = new ArrayList<>();
//        liveRoomList = liveRoomRepository.getWaitLiveRoomList(userCode);

        return liveRoomRepository.getWaitLiveRoomList(userCode).stream()
                .map(liveRoom -> new LiveRoomResDto(liveRoom))
                .collect(Collectors.toList());
    }

}
