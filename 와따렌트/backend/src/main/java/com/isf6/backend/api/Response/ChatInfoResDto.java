package com.isf6.backend.api.Response;

import com.isf6.backend.domain.entity.Chat;
import com.isf6.backend.domain.entity.User;
import lombok.Data;

import java.util.List;

@Data
public class ChatInfoResDto {

    private long chatRoomId;
    private List<Chat> chatList;
    private User buyer;
    private User seller;

//    private String buyerNickname;
//    private String sellerNickname;
//    private String buyerImg;
//    private String sellerImg;



}
