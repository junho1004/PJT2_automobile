package com.isf6.backend.service;

import com.isf6.backend.api.Request.ProductSaveReqDto;
import com.isf6.backend.api.Request.ProductSearchReqDto;
import com.isf6.backend.api.Request.ProductUpdateReqDto;
import com.isf6.backend.api.Response.IndexProductsResDto;
import com.isf6.backend.api.Response.ProductListResDto;
import com.isf6.backend.api.Response.ProductResDto;
import com.isf6.backend.domain.entity.Img;
import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.entity.ProductStatus;
import com.isf6.backend.domain.entity.User;
import com.isf6.backend.domain.repository.ImgRepository;
import com.isf6.backend.domain.repository.ProductRepository;
import com.isf6.backend.domain.repository.ProductSearchRepository;
import com.isf6.backend.domain.repository.custom.ProductRepositoryCustomImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductSearchRepository productSearchRepository;
    private final ImgRepository imgRepository;

    private final WishService wishService;
    private final LiveRequestService liveRequestService;
    private final UserService userService;

    private final ProductRepositoryCustomImpl productRepositoryCustomImpl;

//
//    @Transactional
//    public Long save(ProductSaveRequestDto requestDto)
//    {
//        return productRepository.save(requestDto.toEntity()).getId();
//    }

    @Transactional
    public Long uploadProduct(ProductSaveReqDto requestDto, List<String> imgPaths) {
        postBlankCheck(imgPaths);
        Long id = productRepository.save(requestDto.toEntity()).getId();
        Product product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 상품이 없습니다. id=" + id));
//        List<String> imgList = new ArrayList<>();
        for (String imgUrl : imgPaths) {
            Img img = new Img(imgUrl, product);
            imgRepository.save(img);
//            imgList.add(img.getImgUrl());
        }
        return id;
    }

    private void postBlankCheck(List<String> imgPaths) {
        if(imgPaths == null || imgPaths.isEmpty()){ //.isEmpty()도 되는지 확인해보기
//            throw new PrivateException(Code.WRONG_INPUT_IMAGE);
        }
    }

    @Transactional
    public Long update(Long id, ProductUpdateReqDto requestDto) {
        Product product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 상품이 없습니다. id=" + id));
        product.update(
                requestDto.getTitle(),
                requestDto.getPrice(),
                requestDto.getDescription(),
                requestDto.getAvailableTime(),
                requestDto.getReserve(),
                requestDto.getStatus());

        return id;
    }
    public ProductResDto findById (Long id, Long userCode) {
        Product entity = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 상품이 없습니다. id=" + id));


        boolean wishCheck;
        boolean liveReqCheck;
        //로그인한 유저인지 비로그인 유저인지 확인
        if(userCode == 0) {
            wishCheck = false;
            liveReqCheck = false;
        } else {
            //라이브 요청 여부, 좋아요 여부 체크하여 포함해서 상세페이지로 전달
            //지금 들어오는 유저가 이 상품에 좋아요를 눌렀는지...
            wishCheck = wishService.getUserWishChk(id, userCode);
            //지금 들어오는 유저가 이 상품에 라이브 요청을 했는지...
            liveReqCheck = liveRequestService.getUserLiveReqChk(id, userCode);
        }

        // 이미지 URL 문자열만 뽑아줌...
        List<Img> imgList = entity.getImgList();
        List<String> imgUrlList = new ArrayList<>();
        for (Img img: imgList) {
            imgUrlList.add(img.getImgUrl());
        }

        //판매자 userCode, nickname, profileImg 필요함...
        User user = userService.findUser(entity.getUser().getUserCode());

        return new ProductResDto(entity, wishCheck, liveReqCheck, imgUrlList, user);
    }

    @Transactional
    public void delete (Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 상품이 없습니다. id=" + id));

        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public List<ProductListResDto> findAllDesc() {
        return productRepository.findAllDesc().stream()
                .map(product -> new ProductListResDto(product))
                .collect(Collectors.toList());
    }

    @Transactional
    public Product getProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 상품이 없습니다. id=" + id));

        return product;
    }

    public boolean checkProductStatus(Long productId) {
        //상품의 상태가 SOLDOUT이면 false, 아니라면 true
        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("해당 상품이 없습니다. id=" + productId));

        log.info("status : {}", product.getStatus());
        if(product.getStatus().equals(ProductStatus.SOLDOUT)) {
            return false;
        }

        return true;
    }
    
//    public Page<IndexProductsResDto> getMainProducts(String sort, String category, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size);
//        return productRepositoryCustomImpl.findAllByCategoryOrderBySort(sort, category, pageable);
//    }

    //no-offset 방식
    public List<IndexProductsResDto> getMainProductsNo(Long productId, int pageSize) {
        return productRepositoryCustomImpl.findAllNoOffset(productId, pageSize);
    }

    //offset 방식
    public List<IndexProductsResDto> getMainProducts(int pageNo, int pageSize) {
        return productRepositoryCustomImpl.findAllOffSet(pageNo, pageSize);
    }

    // 문자열 포함한 상품 목록 검색
    public List<Product> findProducts(ProductSearchReqDto productSearch) {
        return productSearchRepository.findBySearch(productSearch);
    }

    //라이브 방 삭제시 상품에 저장된 라이브 예약시간 null로 변경.
    public void deleteProductReserveTime(long productId) {
        //먼저 그 상품을 찾고
        Product product = getProduct(productId);
        //그 상품 예약시간을 null로 바꾸고
        product.setReserve(null);
        //다시 save
        productRepository.save(product);
    }
}