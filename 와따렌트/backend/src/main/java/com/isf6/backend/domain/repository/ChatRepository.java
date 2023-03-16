package com.isf6.backend.domain.repository;

import com.isf6.backend.domain.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    @Query("SELECT c FROM Chat c WHERE c.chatRoom.id = :chatRoomId")
    List<Chat> getChatList(Long chatRoomId);

    @Modifying
    @Query("DELETE FROM Chat c WHERE c.chatRoom.id = :chatRoomId")
    void deleteChat(@Param("chatRoomId") long chatRoomId);

}
