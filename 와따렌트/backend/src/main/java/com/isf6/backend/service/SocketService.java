package com.isf6.backend.service;

import com.isf6.backend.api.Response.ChatRoomInfoResDto;
import com.isf6.backend.domain.entity.ChatRoom;
import com.isf6.backend.domain.entity.User;
import com.isf6.backend.domain.repository.ChatRepository;
import com.isf6.backend.domain.repository.ChatRoomRepository;
import com.isf6.backend.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class SocketService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;

//    private Map<String, ChatRoomResDto> chatRooms;
//
//    @PostConstruct
//    private void init() {
//        chatRooms = new LinkedHashMap<>();
//    }

    //방 생성해서 코드 저장해야됨
    public ChatRoom createRoom(Long userCode1, Long userCode2) {
        //방이 null이라면 방 만들기
        ChatRoom chatRoomInfo = new ChatRoom();
        String randomId = UUID.randomUUID().toString();
        chatRoomInfo.setChatRoomCode(randomId);

        User buyer = userRepository.findByUserCode(userCode1);
        chatRoomInfo.setBuyer(buyer);

        User seller = userRepository.findByUserCode(userCode2);
        chatRoomInfo.setSeller(seller);

        chatRoomRepository.save(chatRoomInfo); //저장

        //log.info("chatRoom id : {}", chatRoomInfo.getId());
        //String chatRoomCode = chatRoomInfo.getChatRoomCode(); //id로 변경해서 사용
        long chatRoomId = chatRoomInfo.getId();

//        ChatRoomRestDto chatRoom = ChatRoomResDto.builder()
//                .roomId(randomId)
//                .build();
//        chatRooms.put(randomId, chatRoom);
        return chatRoomInfo;
    }

    public String deleteRoom(long id) {
        log.info("code service : {}", id);
        
        ChatRoom chatroom = chatRoomRepository.findByChatRoomId(id);
        log.info("chatroom : {}", chatroom.getId());
        if(chatroom == null) {
            return "null";
        }

        chatRepository.deleteChat(id);

        chatRoomRepository.delete(chatroom);
        return "success";
    }

    public List<ChatRoomInfoResDto> getAllChatRoom(Long userCode) {
        List<ChatRoom> myChatRoomList = new ArrayList<>();
        myChatRoomList = chatRoomRepository.findByChatRoomList(userCode);

        List<ChatRoomInfoResDto> result = myChatRoomList.stream()
                .map(room -> new ChatRoomInfoResDto(room))
                .collect(Collectors.toList());
        return result;
    }

    // 채팅방에 메시지 발송
//    public void sendMessage(MessageDto messageDto) {
//
//
//        chatRoomRepository.saveMessage(chatMessageSave);
//
//
//
//    }
}
