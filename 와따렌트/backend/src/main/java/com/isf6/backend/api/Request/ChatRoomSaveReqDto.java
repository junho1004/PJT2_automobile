package com.isf6.backend.api.Request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChatRoomSaveReqDto {
    private Long buyerCode;
    private Long sellerCode;

}
