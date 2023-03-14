package com.isf6.backend.domain.repository;

import com.isf6.backend.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    // JPA findBy 규칙
    // select * from user_master where kakao_email = ?
    public User findByKakaoEmail(String kakaoEmail);
    public User findByUserCode(Long userCode);
    public Long countByKakaoNicknameStartingWith(String KakaoNickname);
    public boolean existsByKakaoNickname(String KakaoNickname);

    @Query("SELECT u FROM User u " +
            "JOIN LiveRequest lr ON lr.product.id = :productId " +
            "WHERE lr.user.userCode = u.userCode")
    List<User> getLiveRequestUser(@Param("productId") long productId);
}
