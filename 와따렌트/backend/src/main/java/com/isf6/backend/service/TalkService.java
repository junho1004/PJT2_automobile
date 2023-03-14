package com.isf6.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.isf6.backend.api.Request.ProductUpdateReqDto;
import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class TalkService {

    @Value("${Talk-api-key}")
    private String TalkApiKey;
    @Value("${Talk-user-id}")
    private String TalkUserId;
    @Value("${Talk-sender-key}")
    private String TalkSenderKey;
    @Value("${Reserve-tpl-code}")
    private String ReserveTplCode;
    @Value("${LiveStart-tpl-code}")
    private String LiveStartTplCode;
    @Value("${Talk-sender}")
    private String TalkSender;
    @Value("${zumgo-url}")
    private String zumgoUrl;


    //알림톡 전송을 위한 token 발급
    public String createToken() throws JsonProcessingException, ParseException {
        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, Object> params = new LinkedMultiValueMap<>();
        params.add("apikey", TalkApiKey); //api key
        params.add("userid", TalkUserId); //사이트 아이디
        HttpEntity<MultiValueMap<String, Object>> TokenRequest = new HttpEntity<>(params);

        //7일 동안 사용 가능한 엑세스 토큰을 발급 받기
        ResponseEntity<String> accessTokenResponse = rt.exchange(
                "https://kakaoapi.aligo.in/akv10/token/create/7/d/",
                HttpMethod.POST,
                TokenRequest,
                String.class
        );

        String token = null;
        log.info("access : {}", accessTokenResponse.getBody());
        log.info("type : {}", accessTokenResponse.getBody().getClass().getName());

        Object obj = null;
        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObj = new JSONObject();

        obj = jsonParser.parse(accessTokenResponse.getBody());
        jsonObj = (JSONObject) obj;

        log.info("jsonObj : {}", jsonObj);
        token = (String) jsonObj.get("urlencode");

        return token;
    }

    //라이브 예약시 전송되는 알림톡
    public ResponseEntity<String> LiveReserveTalk(ProductUpdateReqDto requestDto, List<User> liveRequestUser, String token) {

        //알림톡 전송을 위해 정보 받아오기
        String productName = requestDto.getTitle();
        String reserveTime = requestDto.getReserve().toString().substring(0,16);
        String subject = "상품 라이브 예약 알림";
        //버튼 정보 입력
        Map<String, String> buttonMap = new HashMap<>();
        buttonMap.put("name", "zum:go 바로가기"); //버튼명
        buttonMap.put("linkType", "WL"); //버튼 링크타입(DS:배송조회, WL:웹링크, AL:앱링크, BK:봇키워드, MD:메시지전달)
        buttonMap.put("linkTypeName", "웹링크"); //버튼 링크 타입네임, ( 배송조회, 웹링크, 앱링크, 봇키워드, 메시지전달 중에서 1개)
        buttonMap.put("linkM", zumgoUrl); //WL일때 필수
        buttonMap.put("linkP", zumgoUrl); //WL일때 필수
        List<Map> button = new ArrayList<>();
        button.add(buttonMap);
        Map<String, List<Map>> buttonInfo = new HashMap<>(); //버튼 정보
        buttonInfo.put("button", button);

        //전송 객체 생성
        RestTemplate rt = new RestTemplate();

        //header와 body 생성
        HttpHeaders headers = new HttpHeaders();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<String, Object>();
        body.add("apikey", TalkApiKey); //api key
        body.add("userid", TalkUserId); //사이트 아이디
        body.add("token", token); //발급받은 토큰
        body.add("senderkey", TalkSenderKey); //발신프로파일 키
        body.add("tpl_code", ReserveTplCode); //템플릿 코드
        body.add("sender", TalkSender); //발신자 연락처

        int receiverSize = liveRequestUser.size();
        for (int i=0; i<receiverSize; i++) {
            body.add("receiver_"+ (i+1), liveRequestUser.get(i).getKakaoPhoneNumber()); //수신자 연락처 -> 여기 수정 수신자 개수만큼
            body.add("subject_" + (i+1), subject); //알림톡 제목(발신자만 보임)
            body.add("message_" + (i+1), "이 알림톡은 " + productName + " 라이브 요청자에게만 발송됩니다.\n" +
                    "\n" +
                    liveRequestUser.get(i).getKakaoNickname() + "님께서 요청하신 " + productName + " 라이브가 " + reserveTime + " 예약 되었습니다."); //알림톡 내용
            body.add("button_" + (i+1), buttonInfo); //버튼정보
        }
        //body.add("testMode", "Y"); //테스트모드

        //전송 객체 생성
        HttpEntity<MultiValueMap<String, Object>> LiveReserveRequest = new HttpEntity<>(body);

        //post로 보내고 결과 받기
        ResponseEntity<String> LiveReserveResponse = rt.exchange(
                "https://kakaoapi.aligo.in/akv10/alimtalk/send/",
                HttpMethod.POST,
                LiveReserveRequest,
                String.class
        );

        return LiveReserveResponse;
    }

    public ResponseEntity<String> LiveStartTalk(Product product, List<User> liveRequestUser, String token) {
        //알림톡 전송을 위해 정보 받아오기
        String productName = product.getTitle();
        String reserveTime = product.getReserve().toString().substring(0,16);
        String subject = "라이브 시작 알림";

        Map<String, String> buttonMap = new HashMap<>();
        buttonMap.put("name", "zum:go 바로가기"); //버튼명
        buttonMap.put("linkType", "WL"); //버튼 링크타입(DS:배송조회, WL:웹링크, AL:앱링크, BK:봇키워드, MD:메시지전달)
        buttonMap.put("linkTypeName", "웹링크"); //버튼 링크 타입네임, ( 배송조회, 웹링크, 앱링크, 봇키워드, 메시지전달 중에서 1개)
        buttonMap.put("linkM", zumgoUrl); //WL일때 필수
        buttonMap.put("linkP", zumgoUrl); //WL일때 필수
        List<Map> button = new ArrayList<>();
        button.add(buttonMap);
        Map<String, List<Map>> buttonInfo = new HashMap<>(); //버튼 정보
        buttonInfo.put("button", button);

        //전송 객체 생성
        RestTemplate rt = new RestTemplate();

        //header와 body 생성
        HttpHeaders headers = new HttpHeaders();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<String, Object>();
        body.add("apikey", TalkApiKey); //api key
        body.add("userid", TalkUserId); //사이트 아이디
        body.add("token", token); //발급받은 토큰
        body.add("senderkey", TalkSenderKey); //발신프로파일 키
        body.add("tpl_code", LiveStartTplCode); //템플릿 코드
        body.add("sender", TalkSender); //발신자 연락처

        int receiverSize = liveRequestUser.size();
        for (int i=0; i<receiverSize; i++) {
            body.add("receiver_"+ (i+1), liveRequestUser.get(i).getKakaoPhoneNumber()); //수신자 연락처 -> 여기 수정 수신자 개수만큼
            body.add("subject_" + (i+1), subject); //알림톡 제목(나만 보임)
            body.add("message_" + (i+1), "이 알림톡은 " + productName + " 라이브 요청자에게만 발송됩니다.\n" +
                    "\n" +
                    liveRequestUser.get(i).getKakaoNickname() + "님께서 요청하신 " + productName+ " 라이브 방송이 시작 되었습니다!\n" +
                    "\n" +
                    "지금 zum:go 하세요!"); //알림톡 내용
            body.add("button_" + (i+1), buttonInfo); //버튼정보
        }
        //body.add("testMode", "Y"); //테스트모드

        //전송 객체 생성
        HttpEntity<MultiValueMap<String, Object>> LiveReserveRequest = new HttpEntity<>(body);

        //post로 보내고 결과 받기
        ResponseEntity<String> LiveReserveResponse = rt.exchange(
                "https://kakaoapi.aligo.in/akv10/alimtalk/send/",
                HttpMethod.POST,
                LiveReserveRequest,
                String.class
        );

        //결과코드(code)가 0이면 성공 -99이면 전송 실패
        return LiveReserveResponse;

    }


}
