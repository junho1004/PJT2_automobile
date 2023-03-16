package com.isf6.backend.api.controller;

import com.isf6.backend.api.Request.ChatMessageSaveReqDto;
import com.isf6.backend.api.Request.ChatRoomSaveReqDto;
import com.isf6.backend.api.Request.MessageDto;
import com.isf6.backend.api.Response.ChatInfoResDto;
import com.isf6.backend.api.Response.ChatRoomInfoResDto;
import com.isf6.backend.domain.entity.Chat;
import com.isf6.backend.domain.entity.ChatRoom;
import com.isf6.backend.domain.entity.User;
import com.isf6.backend.domain.repository.ChatRepository;
import com.isf6.backend.domain.repository.ChatRoomRepository;
import com.isf6.backend.domain.repository.UserRepository;
import com.isf6.backend.service.SocketService;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ApiResponses({
        @ApiResponse(code = 200, message = "Success"),
        @ApiResponse(code = 400, message = "Bad Request"),
        @ApiResponse(code = 500, message = "Internal Server Error")
})
@Api(value = "/socket", description = "chat(socket) 정보를 처리 하는 Controller")
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/socket")
public class SocketController {

    private final SocketService socketService;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;
    private static Set<Integer> userList = new HashSet<>();
    private final SimpMessagingTemplate simpMessagingTemplate;

    // websocket "/pub/chat/{id}"로 들어오는 메시징을 처리 (메시지 발행)
    @ApiOperation(value = "채팅 전송", notes = "\"/pub/chat/{id}\"로 들어오는 메시징을 처리하고 DB에 저장")
    @MessageMapping("/chat/{id}")
    public void sendMessage(@ApiParam(value = "채팅방 Id", required = true) @DestinationVariable String id,
                            @ApiParam(value = "채팅 정보", required = true) @Payload MessageDto messageDto) {
        log.info("id={}", id);
        log.info("messageDto={}", messageDto);
//        this.simpMessagingTemplate.convertAndSend("/queue/addChatToClient/" + id, messageDto);
//        socketService.sendMessage(messageDto);
        // 메시지에 정의된 channelId로 메시지 보냄
        this.simpMessagingTemplate.convertAndSend("/sub/channels/" + id, messageDto);
        // db 저장
        ChatRoom chatRoom = chatRoomRepository.findByChatRoomId(messageDto.getChannelId());
        ChatMessageSaveReqDto chatMessageSaveReqDto = new ChatMessageSaveReqDto(messageDto.getChannelId(), messageDto.getSender(), messageDto.getData());
        chatRepository.save(Chat.toChat(chatMessageSaveReqDto, chatRoom));
        //System.out.println(chatRoom);
    }

    @ApiOperation(value = "채팅방 입장", notes = "채팅방에 입장")
    @MessageMapping("/join")
    public void joinUser(@ApiParam(value = "userCode", required = true) @Payload String userId) {
        log.info("userId={}", userId);
    }

    @ApiOperation(value = "채팅방 생성 및 입장", notes = "userCode로 채팅방을 조회하여 존재하면 방 Id와 채팅 내역 불러와서 리턴, 없으면 채팅 생성하여 방 Id 리턴")
    @PostMapping("/room")
    public ChatInfoResDto createChatRoom(@ApiParam(value = "채팅방을 생성할때 필요한 userCode 정보", required = true) @RequestBody ChatRoomSaveReqDto chatRoomSaveReqDto) {
        log.info("방 생성 & 방 입장");

        ChatInfoResDto chatInfo = new ChatInfoResDto();

        Long buyerCode = chatRoomSaveReqDto.getBuyerCode();
        Long sellerCode = chatRoomSaveReqDto.getSellerCode();

        //채팅방이 존재하면 채팅 내역 불러오기
        ChatRoom chatRoomInfo = new ChatRoom();
        chatRoomInfo = chatRoomRepository.findByBuyerIdANDSellerId(buyerCode, sellerCode); //유저 코드로 방 정보 찾기

        long chatRoomId = 0L;
        List<Chat> chatList = new ArrayList<>();

        //채팅방이 null이면 채팅방 만들어주고 아니면 채팅 내역 함께 넘겨주기
        if(chatRoomInfo == null) {
            //String chatRoomCode = socketService.createRoom(buyerCode, sellerCode);
            chatRoomInfo = socketService.createRoom(buyerCode, sellerCode);
            chatInfo.setChatRoomId(chatRoomId); //채팅방 id
            chatInfo.setBuyer(chatRoomInfo.getBuyer()); //구매자 정보
            chatInfo.setSeller(chatRoomInfo.getSeller()); //판매자 정보
            chatInfo.setChatList(new ArrayList<>()); //채팅내역은 빈 리스트

            chatInfo.setChatRoomId(chatRoomInfo.getId()); //채팅방 id

        } else {
            //채팅 내역 가져오기
            log.info("채팅방 존재");

            chatInfo.setBuyer(chatRoomInfo.getBuyer()); //구매자 정보
            chatInfo.setSeller(chatRoomInfo.getSeller()); //판매자 정보

            chatList = chatRepository.getChatList(chatRoomInfo.getId());
            chatInfo.setChatList(chatList); //채팅내역

            chatInfo.setChatRoomId(chatRoomInfo.getId()); //채팅방 id
        }

//        // 프로필 이미지 추가
//        chatInfo.setSellerImg(chatRoomInfo.getSeller().getKakaoProfileImg());
//        chatInfo.setBuyerImg(chatRoomInfo.getBuyer().getKakaoProfileImg());
//
//        // 유저 닉네임 추가
//        chatInfo.setSellerNickname(chatRoomInfo.getSeller().getKakaoNickname());
//        chatInfo.setBuyerNickname(chatRoomInfo.getBuyer().getKakaoNickname());
        
        return chatInfo;
    }

    @ApiOperation(value = "채팅방 나가기(삭제)", notes = "채팅방 Id로 채팅방 삭제")
    @DeleteMapping("/exit")
    public ResponseEntity deleteChatRoom(@ApiParam(value = "채팅방 Id", required = true) @RequestParam long id) {
        log.info("chatRoomCode : {}", id);
        String result = socketService.deleteRoom(id);
        if(result.equals("null")) {
            return ResponseEntity.status(200).body("방 삭제 실패");
        }
        return ResponseEntity.status(200).body("방 삭제");
    }

    @ApiOperation(value = "유저의 모든 채팅방 조회", notes = "userCode로 유저가 참여하고 있는 채팅방 전체 목록 조회")
    @GetMapping("/{userCode}/all")
    public ResponseEntity getAllChatRoom(@ApiParam(value = "유저 Code", required = true) @PathVariable Long userCode) {
        //각 채팅방의 마지막 채팅 정보도 함께 넘겨주기
        List<ChatRoomInfoResDto> ChatRoomList = new ArrayList<>();
        ChatRoomList = socketService.getAllChatRoom(userCode);

        return ResponseEntity.status(200).body(ChatRoomList);
    }

}
