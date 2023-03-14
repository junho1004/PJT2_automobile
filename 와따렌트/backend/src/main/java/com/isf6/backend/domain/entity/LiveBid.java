package com.isf6.backend.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LiveBid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "liveBid_id")
    private Long id;

    private String bidder;

    private int bidPrice;

    private Timestamp bidTime;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "liveRoom_id", insertable = false, updatable = false)
    private LiveRoom liveRoom;

    @Column(name = "liveRoom_id", nullable = false)
    private Long liveRoomId;
    public LiveBid(Long livRoomId) {
        this.liveRoomId = livRoomId;
    }
}
