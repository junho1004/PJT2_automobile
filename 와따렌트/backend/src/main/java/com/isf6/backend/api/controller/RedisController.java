package com.isf6.backend.api.controller;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
// 레디스-docker 연결 테스트 파일 - 추후 삭제 예정
@RestController
@RequestMapping("/redis")
public class RedisController {

    private final RedisTemplate<String, String> redisTemplate;

    public RedisController(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // set
    @PostMapping("")
    public String setRedisKey(@RequestBody Map<String, String> req){
        ValueOperations<String, String> vop = redisTemplate.opsForValue();
        try {
            // Redis Set Key-value
            vop.set(req.get("key").toString(), req.get("value").toString());
            return "set message success";
        } catch (Exception e) {
            return "set message fail";
        }
    }

    // get
    @GetMapping("/{key}")
    public String getRedisKey(@PathVariable String key) {
        ValueOperations<String, String> vop = redisTemplate.opsForValue();
        return vop.get(key);
    }

}
