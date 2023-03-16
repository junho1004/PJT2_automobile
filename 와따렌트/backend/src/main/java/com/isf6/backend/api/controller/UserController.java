package com.isf6.backend.api.controller;

import com.isf6.backend.api.Request.ReportSaveReqDto;
import com.isf6.backend.api.Request.UserUpdateReqDto;
import com.isf6.backend.api.Response.UserResDto;
import com.isf6.backend.domain.repository.UserRepository;
import com.isf6.backend.service.ReportService;
import com.isf6.backend.service.S3Service;
import com.isf6.backend.service.UserService;
import com.isf6.backend.common.oauth.OauthToken;
import com.isf6.backend.config.jwt.JwtProperties;
import com.isf6.backend.domain.entity.User;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApiResponses({
        @ApiResponse(code = 200, message = "Success"),
        @ApiResponse(code = 400, message = "Bad Request"),
        @ApiResponse(code = 500, message = "Internal Server Error")
})
@Api(value = "/api", description = "user 정보를 처리 하는 Controller")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final ReportService reportService;
    private final S3Service s3Service;
    private final UserRepository userRepository;

    // 프론트에서 인가코드 받아오는 url
    @ApiOperation(value = "인가코드으로 로그인", notes = "카카오를 통해 발급받은 인가코드로 로그인하고, 받아온 정보로 DB 저장")
    @GetMapping("/oauth/token")
    public ResponseEntity getLogin(@ApiParam(value = "카카오 인가코드", required = true) @RequestParam("code") String code) {
        log.info("code : {} ", code);

        // 1. 넘어온 인가 코드를 통해 access_token 발급
        OauthToken oauthToken = userService.getAccessToken(code);
        log.info("oauthToken : {} ", oauthToken);

        // 2. 발급 받은 accessToken 으로 카카오 회원 정보 DB 저장 후 JWT 를 생성
        String jwtToken = userService.saveUserAndGetToken(oauthToken.getAccess_token());
        log.info("jwtToken : {} ", jwtToken);

        // 3. 헤더에 JWT 토근 정보 담기
        HttpHeaders headers = new HttpHeaders();
        headers.add(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX + jwtToken);
        log.info("headers : {} ", headers);

        return ResponseEntity.ok().headers(headers).body("success");
    }

    //유저 정보 조회
    @ApiOperation(value = "유저 정보 조회", notes = "로그인한 유저의 정보를 DB에서 조회")
    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentUser(@ApiParam(value = "HttpServletRequest", required = true) HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>(); //결과를 담을 Map

        // 1. token 정보를 포함한 request로 로그인한 유저 정보 가져오기
        User user = userService.getUser(request);

        //2. user가 null이 아니라면 반환유저객체 만들고 그 정보를 담아서 return
        if(user != null) {
            UserResDto userResDto = new UserResDto(user);
            response.put("result", "SUCCESS");
            response.put("user", userResDto);

            return ResponseEntity.status(200).body(response);
        }

        //3. 아니라면 실패 정보를 담아서 return
        response.put("result", "FAIL");
        response.put("reason", "유저 정보 수정 실패");
        return ResponseEntity.status(200).body(response);
    }

    //다른 유저 정보 조회
    @ApiOperation(value = "다른 유저 정보 조회", notes = "다른 유저의 정보를 DB에서 조회")
    @GetMapping("/user/{userCode}")
    public ResponseEntity getUser(@ApiParam(value = "userCode", required = true) @PathVariable Long userCode) {
        Map<String, Object> response = new HashMap<>(); //결과를 담을 Map

        User user = userService.findUser(userCode);

        if(user != null) {
            UserResDto userResDto = new UserResDto(user);
            response.put("result", "SUCCESS");
            response.put("user", userResDto);

            return ResponseEntity.status(200).body(response);
        }

        //3. 아니라면 실패 정보를 담아서 return
        response.put("result", "FAIL");
        response.put("reason", "유저 정보 수정 실패");
        return ResponseEntity.status(200).body(response);
    }

    //유저 정보 수정
    @ApiOperation(value = "유저 정보 수정", notes = "로그인한 유저의 정보를 DB에서 수정")
    @PatchMapping("/user/{userCode}")
    public ResponseEntity updateUser(@ApiParam(value = "userCode", required = true) @PathVariable Long userCode,
                                     @ApiParam(value = "유저 정보", required = true) @RequestPart(value="content") UserUpdateReqDto userUpdateReqDto,
                                     @ApiParam(value = "이미지 파일", required = true) @RequestPart(value="imgUrl", required = false) List<MultipartFile>  multipartFile) {

        Map<String, Object> response = new HashMap<>(); //결과를 담을 Map

        List<String> imgPath = new ArrayList<>();

        if (multipartFile!=null) {
            imgPath = s3Service.upload(multipartFile);
        } else {
            // 파일을 받지 않았으면 기본값
            imgPath.add(userRepository.findById(userCode).get().getKakaoProfileImg());
        }

        //1. userCode와 수정 정보 객체를 넘겨서 DB에서 user 정보 수정
        User user = userService.updateUser(userCode, userUpdateReqDto, imgPath);

        //2. user가 null이 아니라면 반환유저객체 만들고 그 정보를 담아서 return
        if(user != null) {
            UserResDto userResDto = new UserResDto(user);
            response.put("result", "SUCCESS");
            response.put("user", userResDto);

            return ResponseEntity.status(200).body(response);
        }

        //3. 아니라면 실패 정보를 담아서 return
        response.put("result", "FAIL");
        response.put("reason", "유저 정보 수정 실패");
        return ResponseEntity.status(200).body(response);
    }

    //유저 신고 등록
    @ApiOperation(value = "유저 신고 등록", notes = "유저가 작성한 신고를 DB에 저장")
    @PostMapping("/user/report/{reportedUserCode}")
    public ResponseEntity report(@ApiParam(value = "신고 당하는 유저", required = true) @PathVariable Long reportedUserCode,
                                 @ApiParam(value = "신고 정보", required = true) @RequestBody ReportSaveReqDto reportSaveReqDto) {
        Map<String, Object> response = new HashMap<>(); //결과를 담을 Map

        // 1. 신고 당하는 유저의 code와 신고 객체를 넘겨서 DB에 신고 등록
        reportService.saveReport(reportedUserCode, reportSaveReqDto);
        response.put("reason", "신고 성공");

        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/user/{nickname}/exists")
    public ResponseEntity<Boolean> checkNicknameDuplicate(@PathVariable String nickname) {
        return ResponseEntity.ok(userService.checkNicknameDuplicate(nickname));
    }
}
