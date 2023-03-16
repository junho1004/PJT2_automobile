package com.isf6.backend.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class LiveRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="liveRoom_id")
    private Long id;

    private String title;

    private Timestamp live_start_time;

    private Timestamp live_end_time;

    @Enumerated(EnumType.STRING)
    private LiveStatus live_status; // ONAIR, WAIT, CLOSED

    private int viewers;

    private int applicants;

    private int now_bid;

    private int final_bid;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @JsonIgnore
    @OneToMany(mappedBy = "liveRoom")
    private List<UserLive> userLives = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "liveRoom")
    private List<LiveBid> liveBids = new ArrayList<>();
}
