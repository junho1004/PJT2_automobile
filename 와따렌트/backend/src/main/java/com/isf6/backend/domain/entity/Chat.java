package com.isf6.backend.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.isf6.backend.api.Request.ChatMessageSaveReqDto;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="chat_id")
    private Long id;

    @CreationTimestamp
    private Timestamp chat_date;

    private String chat_content;

    private Long chatterId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="chatRoom_id", nullable = false)
    private ChatRoom chatRoom;

    public static Chat toChat(ChatMessageSaveReqDto chatMessageSaveReqDto, ChatRoom chatRoom) {
        Chat chat = new Chat();

        chat.setChatRoom(chatRoom);
        chat.setChatterId(chatMessageSaveReqDto.getChatterId());
        chat.setChat_content(chatMessageSaveReqDto.getChat_content());

        return chat;
    }
}
