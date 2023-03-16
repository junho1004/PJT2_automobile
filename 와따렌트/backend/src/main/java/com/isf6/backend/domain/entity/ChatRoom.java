package com.isf6.backend.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="chatRoom_id")
    private Long id;

    @Column(name="chatRoom_code")
    private String chatRoomCode;

    @JsonIgnore
    // 구매자, 판매자 단반향 매핑?????
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="buyer_id")
    private User buyer;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="seller_id")
    private User seller;

    @JsonIgnore
    @OneToMany(mappedBy = "chatRoom")
    private List<Chat> chats = new ArrayList<>();

    public ChatRoom toChatRoom(String chatRoomCode, User buyer, User seller) {
        ChatRoom chatRoom = new ChatRoom();

        chatRoom.setChatRoomCode(chatRoomCode);
        chatRoom.setBuyer(buyer);
        chatRoom.setSeller(seller);
        return chatRoom;
    }
}
