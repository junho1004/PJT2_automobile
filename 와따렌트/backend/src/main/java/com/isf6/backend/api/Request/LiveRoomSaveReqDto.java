package com.isf6.backend.api.Request;

import com.isf6.backend.domain.entity.LiveStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
public class LiveRoomSaveReqDto {

    private Long productId; //상품 아이디
    private Timestamp liveStartTime; //라이브 시작시간
    private LiveStatus liveStatus; //라이브 상태

    @Builder
    public LiveRoomSaveReqDto(Long productId, Timestamp liveStartTime, LiveStatus liveStatus) {
        this.productId = productId;
        this.liveStartTime = liveStartTime;
        this.liveStatus = liveStatus;
    }

}
