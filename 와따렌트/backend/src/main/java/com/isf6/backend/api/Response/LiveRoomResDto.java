package com.isf6.backend.api.Response;

import com.isf6.backend.domain.entity.LiveRoom;
import com.isf6.backend.domain.entity.LiveStatus;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.sql.Time;
import java.sql.Timestamp;

@Getter
@Setter
public class LiveRoomResDto {

    private Long id;
    private String title;
    private Timestamp live_start_time;
    private Timestamp live_end_time;
    private LiveStatus live_status; // ONAIR, WAIT, CLOSED
    private int viewers;
    private int applicants;
    private int now_bid;
    private int final_bid;
    private Long productId;
    private String thumbnail;

    public LiveRoomResDto(LiveRoom liveRoom) {
        this.id = liveRoom.getId();
        this.title = liveRoom.getTitle();
        this.live_start_time = liveRoom.getLive_start_time();
        this.live_end_time = liveRoom.getLive_end_time();
        this.live_status = liveRoom.getLive_status();
        this.viewers = liveRoom.getViewers();
        this.applicants = liveRoom.getApplicants();
        this.now_bid = liveRoom.getNow_bid();
        this.final_bid = liveRoom.getFinal_bid();
        this.productId = liveRoom.getProduct().getId();
        this.thumbnail = liveRoom.getProduct().getImgList().get(0).getImgUrl();
    }



}
