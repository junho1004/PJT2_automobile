package com.isf6.backend.service;

import com.isf6.backend.api.Response.LiveProductResDto;
import com.isf6.backend.domain.entity.LiveRequest;
import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.entity.User;
import com.isf6.backend.domain.entity.Wish;
import com.isf6.backend.domain.repository.LiveRequestRepository;
import com.isf6.backend.domain.repository.ProductRepository;
import com.isf6.backend.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class LiveRequestService {

    private final LiveRequestRepository liveRequestRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public boolean saveLiveRequest(Long userCode, Long productId) {
        LiveRequest liveRequest = new LiveRequest();

        User user = userRepository.findByUserCode(userCode);
        if(user.getPoint()-2 < 0) {
            //포인트가 없으면 라이브 요청이 안되도록 변경
            return false;
        } else {
            user.setPoint(user.getPoint() - 2);

            liveRequest.setUser(user);

            Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("해당 상품이 없습니다. id=" + productId));
            liveRequest.setProduct(product);

            liveRequestRepository.save(liveRequest);
            return true;
        }
    }

    public Long getLiveRequestCnt(Long productId) {
        Long cnt = 0L;
        //라이브요청 개수 반환
        cnt = liveRequestRepository.getLiveRequestCnt(productId);

        return cnt;
    }

    //내가 라이브 요청한 상품들의 목록
    public List<LiveProductResDto> getMyLiveRequestProductList(Long userCode) {
        log.info("getMyLiveRequestList : true ");
//        List<Product> liveRequestList = new ArrayList<>();
//        liveRequestList = productRepository.getMyLiveRequestList(userCode);

        return productRepository.getMyLiveRequestList(userCode).stream()
                .map(product -> new LiveProductResDto(product))
                .collect(Collectors.toList());
    }

    //내가 판매중인 상품 중에서 라이브요청의 개수가 1개 이상인 상품의 목록
    public List<LiveProductResDto> getSellLiveRequestList(Long userCode) {
        log.info("getSellLiveRequestList : true ");
//        List<Product> liveRequestList = new ArrayList<>();
//        liveRequestList = productRepository.getSellLiveRequestList(userCode);
//        log.info("size : {}", liveRequestList.size());

//        return liveRequestList;
        return productRepository.getSellLiveRequestList(userCode).stream()
                .map(product -> new LiveProductResDto(product))
                .collect(Collectors.toList());
    }

    public boolean getUserLiveReqChk(Long productId, Long userCode) {
        boolean chk = false;
        LiveRequest liveRequest = liveRequestRepository.getLiveRequest(productId, userCode);
        if(liveRequest != null) {
            chk = true;
        }

        return chk;
    }

    //내가 라이브 요청한 목록
    public List<LiveRequest> getMyLiveRequestList(Long userCode) {
        List<LiveRequest> liveRequestList = new ArrayList<>();
        liveRequestList = liveRequestRepository.findByUserId(userCode);
        return liveRequestList;
    }

    //상품에 대한 라이브 요청 삭제하기
    @Transactional
    public void deleteProductLiveRequest(Long productId){

        liveRequestRepository.deleteLiveRequest(productId);
    }

}
