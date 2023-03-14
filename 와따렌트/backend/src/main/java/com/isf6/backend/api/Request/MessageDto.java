package com.isf6.backend.api.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {

    private String type;
    private Long sender;
    private Long channelId;
    private String data;

}
