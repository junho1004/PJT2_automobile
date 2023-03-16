package com.isf6.backend.api.Response;

import com.isf6.backend.domain.entity.Chat;
import com.isf6.backend.domain.entity.ChatRoom;
import com.isf6.backend.domain.entity.User;
import lombok.Getter;

@Getter
public class ChatRoomInfoResDto {

    private Long roomId;
    private String chatRoomCode;
    private User buyer;
    private User seller;
    private Chat lastChat; //가장 마지막 채팅

    public ChatRoomInfoResDto(ChatRoom chatRoom) {
        roomId = chatRoom.getId();
        chatRoomCode = chatRoom.getChatRoomCode();
        buyer = chatRoom.getBuyer();
        seller = chatRoom.getSeller();
        if(chatRoom.getChats().size() >= 1) {
            lastChat = chatRoom.getChats().get(chatRoom.getChats().size() - 1);
        } else {
            lastChat = new Chat();
        }
    }
}
