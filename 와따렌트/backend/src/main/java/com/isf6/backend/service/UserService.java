package com.isf6.backend.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.isf6.backend.api.Request.UserUpdateReqDto;
import com.isf6.backend.common.oauth.KakaoProfile;
import com.isf6.backend.common.oauth.OauthToken;
import com.isf6.backend.config.jwt.JwtProperties;
import com.isf6.backend.domain.repository.UserRepository;
import com.isf6.backend.domain.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    @Value("${kakao-client-id}")
    private String kakaoClientId;
    @Value("${kakao-redirect-uri}")
    private String kakaoRedirectUri;
    @Value("${kakao-client-secret}")
    private String kakaoClientSecret;

    private final UserRepository userRepository;

    public OauthToken getAccessToken(String code) {
        RestTemplate rt = new RestTemplate();

        //1. Header 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        //2.
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId); //REST API KEY
        params.add("redirect_uri", kakaoRedirectUri); //REDIRECT URI
        params.add("code", code);
        params.add("client_secret", kakaoClientSecret); // 생략 가능!

        //3.
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
                new HttpEntity<>(params, headers);

        //4. 엑세스 토큰을 발급 받기
        ResponseEntity<String> accessTokenResponse = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        //5.
        ObjectMapper objectMapper = new ObjectMapper();
        OauthToken oauthToken = null;
        try {
            oauthToken = objectMapper.readValue(accessTokenResponse.getBody(), OauthToken.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return oauthToken;
    }

    public KakaoProfile findProfile(String token) {
        RestTemplate rt = new RestTemplate();

        //1. 헤더 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token); //(1-4)
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest =
                new HttpEntity<>(headers);

        //2.Http 요청 (POST 방식) 후, response 변수에 유저 프로필 정보 응답을 받음
        ResponseEntity<String> kakaoProfileResponse = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoProfileRequest,
                String.class
        );

        //3.
        ObjectMapper objectMapper = new ObjectMapper();
        KakaoProfile kakaoProfile = null;
        try {
            kakaoProfile = objectMapper.readValue(kakaoProfileResponse.getBody(), KakaoProfile.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return kakaoProfile;
    }

    public String saveUserAndGetToken(String token) {
        KakaoProfile profile = findProfile(token);

        //1. 이메일로 유저 정보 찾기
        User user = userRepository.findByKakaoEmail(profile.getKakao_account().getEmail());

        //2. 유저 정보가 없다면
        if(user == null) {
            // 2-1. 유저 닉네임 중복 검사
            Long userCnt = userRepository.countByKakaoNicknameStartingWith(profile.getKakao_account().getProfile().getNickname());
            if (userCnt++ > 0) {
                profile.getKakao_account().getProfile().setNickname(profile.getKakao_account().getProfile().getNickname() + userCnt);
            };

            // 2-2. DB에 새로 저장
            user = User.builder()
                    .kakaoId(profile.getId())
                    .kakaoProfileImg(profile.getKakao_account().getProfile().getProfile_image_url())
                    .kakaoNickname(profile.getKakao_account().getProfile().getNickname())
                    .kakaoEmail(profile.getKakao_account().getEmail())
                    .kakaoPhoneNumber(profile.kakao_account.getPhone_number())
                    .point(5) //기본 포인트 5로 설정
                    //.userRole("ROLE_USER")
                    .build();

            userRepository.save(user);
        }

        return createToken(user);
    }

    public String createToken(User user) {
        String jwtToken = JWT.create()

                .withSubject(user.getKakaoEmail())
                .withExpiresAt(new Date(System.currentTimeMillis()+ JwtProperties.EXPIRATION_TIME))

                .withClaim("id", user.getUserCode())
                .withClaim("nickname", user.getKakaoNickname())

                .sign(Algorithm.HMAC512(JwtProperties.SECRET));

        return jwtToken;
    }

    //유저 코드로 유저 찾기
    public User findUser(Long userCode) {
        User user = userRepository.findByUserCode(userCode);
        return user;
    }

    public User getUser(HttpServletRequest request) { //(1)
        //1. request에서 userCode 가져오기
        Long userCode = (Long) request.getAttribute("userCode");
        //log.info("넘겨 받은 userCode : {}", userCode);

        //2.userCode로 유저 찾기
        User user = findUser(userCode);

        return user;
    }

    //token으로 유저 정보 조회
    public User getUserToken(String token) {
        Long userCode = null;
        token = token.replace(JwtProperties.TOKEN_PREFIX, "");

        try{
            userCode = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET)).build().verify(token).getClaim("id").asLong();
        } catch (TokenExpiredException e) {
            e.printStackTrace();
        } catch (JWTVerificationException e) {
            e.printStackTrace();
        }

        User user = findUser(userCode);

        return user;
    }

    //유저 정보 수정
    public User updateUser(Long userCode, UserUpdateReqDto userUpdateReqDto, List<String> imgPath) {
        User user = userRepository.findByUserCode(userCode);

        user.setKakaoNickname(userUpdateReqDto.getNickname());
        user.setKakaoProfileImg(imgPath.get(0));

        userRepository.save(user);

        return user;
    }

    public boolean checkNicknameDuplicate(String nickname) {

        return userRepository.existsByKakaoNickname(nickname);
    }

    //해당 상품에 라이브 요청한 유저들 정보 가져오기
    public List<User> getLiveRequestUser(Long productId) {
        List<User> liveRequestUserList = new ArrayList<>();

        liveRequestUserList = userRepository.getLiveRequestUser(productId);

        return liveRequestUserList;
    }
}
