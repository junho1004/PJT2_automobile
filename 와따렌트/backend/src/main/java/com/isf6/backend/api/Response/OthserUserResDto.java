package com.isf6.backend.api.Response;

import com.isf6.backend.domain.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OthserUserResDto {
    private Long userCode;
    private String kakaoProfileImg;
    private String kakaoNickname;

    public OthserUserResDto(User user) {
        this.userCode = user.getUserCode();
        this.kakaoProfileImg = user.getKakaoProfileImg();
        this.kakaoNickname = user.getKakaoNickname();
    }
}
