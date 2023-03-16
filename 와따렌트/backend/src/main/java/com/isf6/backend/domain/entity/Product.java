package com.isf6.backend.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="products")
public class Product extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="product_id")
    private Long id;

    private String title;

    private int price;

    private String description;

    private String availableTime;

    private Timestamp reserve;

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Img> imgList = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ProductStatus status; // ONSALE, BOOKING, SOLDOUT

    @JsonIgnore
    @ManyToOne(targetEntity = User.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "user_id", nullable = false)
    private Long userId;
    public Product(Long userId) {
        this.userId = userId;
    }

    @JsonIgnore
    @OneToOne(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private LiveRoom liveroom;

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<LiveRequest> liveRequests = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Wish> wishes = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Bill bill;

    public void update(String title, int price, String description, String availableTime, Timestamp reserve,  ProductStatus status) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.availableTime = availableTime;
        this.reserve = reserve;
        this.status = status;
    }

    public void setReserve(Timestamp reserve) {
        this.reserve = reserve;
    }
}