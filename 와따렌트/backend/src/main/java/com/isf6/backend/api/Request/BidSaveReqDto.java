package com.isf6.backend.api.Request;


import com.isf6.backend.domain.entity.LiveBid;
import com.isf6.backend.domain.entity.LiveRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BidSaveReqDto {

    private String bidder;

    private int bidPrice;

    private Timestamp bidTime;
    private long liveRoomId;

    public LiveBid toEntity() {
        return LiveBid.builder()
                .bidder(bidder)
                .bidPrice(bidPrice)
                .bidTime(bidTime)
                .liveRoomId(liveRoomId)
                .build();
    }
}
