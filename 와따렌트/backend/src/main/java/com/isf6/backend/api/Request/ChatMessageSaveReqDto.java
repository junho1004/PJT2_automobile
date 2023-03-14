package com.isf6.backend.api.Request;

import com.isf6.backend.domain.entity.Chat;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class ChatMessageSaveReqDto {
    private Long roomId;
    private String chat_content;
//    private Timestamp chat_date;
    private Long chatterId;

    @Builder
    public ChatMessageSaveReqDto(Long roomId, Long chatterId, String chat_content) {
        this.roomId = roomId;
        this.chat_content = chat_content;
        this.chatterId = chatterId;
    }

    public ChatMessageSaveReqDto toChatMessageSaveReqDto(Chat chat) {
        ChatMessageSaveReqDto chatMessageSaveReqDto = new ChatMessageSaveReqDto();

        chatMessageSaveReqDto.setChat_content(chat.getChat_content());
//        chatMessageSaveReqDto.setChat_date(chat.getChat_date());
        chatMessageSaveReqDto.setChatterId(chat.getChatterId());
        return chatMessageSaveReqDto;
    }
}
