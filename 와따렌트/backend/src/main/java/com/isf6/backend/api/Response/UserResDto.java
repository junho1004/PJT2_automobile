package com.isf6.backend.api.Response;

import com.isf6.backend.domain.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResDto {
    private Long userCode;
    private Long kakaoId;
    private String kakaoProfileImg;
    private String kakaoNickname;
    private String kakaoEmail;
    private int point;

    public UserResDto(User user) {
        this.userCode = user.getUserCode();
        this.kakaoId = user.getKakaoId();
        this.kakaoProfileImg = user.getKakaoProfileImg();
        this.kakaoNickname = user.getKakaoNickname();
        this.kakaoEmail = user.getKakaoEmail();
        this.point = user.getPoint();
    }
}
