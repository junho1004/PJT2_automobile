package com.isf6.backend.api.controller;

import com.isf6.backend.api.Request.BidSaveReqDto;
import com.isf6.backend.domain.repository.LiveBidRepostiory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1")
public class LiveBidController {

    public final LiveBidRepostiory liveBidRepostiory;

    @PostMapping("/bid")
    public Long savebid (@RequestBody BidSaveReqDto requestDto) {

        return liveBidRepostiory.save(requestDto.toEntity()).getId();
    }
}
