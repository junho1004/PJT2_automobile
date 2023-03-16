package com.isf6.backend.domain.repository;

import com.isf6.backend.domain.entity.LiveBid;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LiveBidRepostiory extends JpaRepository<LiveBid, Long> {
}
