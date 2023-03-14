package com.isf6.backend.service;

import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.entity.User;
import com.isf6.backend.domain.entity.Wish;
import com.isf6.backend.domain.repository.ProductRepository;
import com.isf6.backend.domain.repository.UserRepository;
import com.isf6.backend.domain.repository.WishRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class WishService {

    private final WishRepository wishRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public void saveWish(Long userCode, Long productId) {
        Wish wish = new Wish();

        User user = userRepository.findByUserCode(userCode);
        wish.setUser(user);

        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("해당 상품이 없습니다. id=" + productId));
        wish.setProduct(product);

        wishRepository.save(wish);
    }

    public Long getWishCnt(Long productId) {
        Long cnt = 0L;

        cnt = wishRepository.getWishCnt(productId);

        return cnt;
    }

    public Wish getWish(Long productId) {
        Wish wish = wishRepository.findByProductId(productId);

        return wish;
    }

    public List<Wish> getWishList(Long productId) {
        List<Wish> wish = wishRepository.getWishList(productId);

        return wish;
    }

    public void deleteWish(Long userCode, Long productId) {
        List<Wish> wish = getWishList(productId);
        log.info("wish : {}", wish);
        if(wish != null) {
            wishRepository.deleteWish(productId, userCode);
        }
    }
    
    public boolean getUserWishChk(Long productId, Long userCode) {
        boolean chk = false;
        Wish wish = wishRepository.getWish(productId, userCode);
        if(wish != null) {
            chk = true;
        }

        return chk;
    }

}
