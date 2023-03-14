package com.isf6.backend.api.controller;

import com.isf6.backend.api.Request.ProductSearchReqDto;
import com.isf6.backend.api.Response.IndexProductsResDto;
import com.isf6.backend.api.Response.ProductResDto;
import com.isf6.backend.api.Request.ProductSaveReqDto;
import com.isf6.backend.api.Request.ProductUpdateReqDto;
import com.isf6.backend.domain.entity.Product;
import com.isf6.backend.domain.entity.ProductStatus;
import com.isf6.backend.domain.repository.ProductRepository;
import com.isf6.backend.domain.repository.ProductSearchRepository;
import com.isf6.backend.service.ProductService;
import com.isf6.backend.service.S3Service;
import io.swagger.annotations.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ApiResponses({
        @ApiResponse(code = 200, message = "Success"),
        @ApiResponse(code = 400, message = "Bad Request"),
        @ApiResponse(code = 500, message = "Internal Server Error")
})
@Api(description = "product 정보를 처리 하는 Controller")
@Slf4j
@RequiredArgsConstructor
@RestController
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;
    private final ProductSearchRepository productSearchRepository;
    private final S3Service s3Service;

//    @PostMapping("/product")
//    public Long save(@RequestBody ProductSaveRequestDto requestDto) {
//        return productService.save(requestDto);
//    }
//
//    @PostMapping("/product/images")
//    public Long uploadProduct(@RequestPart("imgUrl") List<MultipartFile> multipartFiles) {
//        List<String> imgPaths = s3Service.upload(multipartFiles);
//        System.out.println("IMG 경로들 : " + imgPaths);
//        productService.uploadImages(imgPaths);
//    }

    @ApiOperation(value = "상품 등록", notes = "상품을 등록을 위해 DB에 저장하고 정보를 반환")
    @PostMapping("/api/v1/product")
    public Long uploadProduct(@ApiParam(value = "상품 정보", required = true) @RequestPart("content") ProductSaveReqDto requestDto,
                              @ApiParam(value = "이미지 파일", required = true) @RequestPart("imgUrl") List<MultipartFile> multipartFiles) {

//        if (multipartFiles == null) {
//            throw new PrivateException(Code.WRONG_INPUT_CONTENT);
//        }
        List<String> imgPaths = s3Service.upload(multipartFiles);
        System.out.println("IMG 경로들 : " + imgPaths);

        return productService.uploadProduct(requestDto, imgPaths);
    }

    @ApiOperation(value = "상품 수정", notes = "상품의 정보를 수정하여 DB에 저장하고 정보를 반환")
    @PutMapping("/api/v1/product/{id}")
    public Long update(@ApiParam(value = "상품 Id", required = true) @PathVariable Long id,
                       @ApiParam(value = "상품 정보", required = true) @RequestBody ProductUpdateReqDto requestDto) {
        return productService.update(id, requestDto);
    }

    @ApiOperation(value = "상품 상세정보 조회", notes = "DB에서 상품의 상세 정보를 조회")
    @GetMapping("/api/v1/product/{id}")
    public ProductResDto findById (@ApiParam(value = "상품 Id", required = true) @PathVariable Long id,
                                   @ApiParam(value = "유저 code", required = true) @RequestParam Long userCode) {
        return productService.findById(id, userCode);
    }

    @ApiOperation(value = "상품 삭제", notes = "상품 정보를 DB에서 삭제")
    @DeleteMapping("/api/v1/product/{id}")
    public Long delete(@ApiParam(value = "상품 Id", required = true) @PathVariable Long id) {
        productService.delete(id);
        return id;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("product", productService.findAllDesc());
        return "index";
    }

    @GetMapping("/api/v1/products")
    public List<IndexProductsDto> mainProducts() {
        List<Product> products = productRepository.findAllDesc();

        List<IndexProductsDto> result = products.stream()
                .map(p -> new IndexProductsDto(p))
                .collect(Collectors.toList());

        return result;
    }

    @ApiOperation(value = "상품 검색", notes = "DB에서 상품 제목으로 상품 검색하여 5개씩 전달")
    @PostMapping("/api/v1/product/search")
    public List<IndexProductsResDto> searchProducts(@ApiParam(value = "상품 검색 정보", required = true) @RequestBody ProductSearchReqDto requestDto) {
        List<Product> products = productSearchRepository.findBySearch(requestDto);

        List<IndexProductsResDto> result = products.stream()
                .map(p -> new IndexProductsResDto(p))
                .collect(Collectors.toList());

        return result;
    }

    @ApiOperation(value = "유저 판매 목록", notes = "DB에서 유저가 판매한 상품 목록을 전달")
    @GetMapping("/api/v1/products/sellList/{id}")
    public List<IndexProductsResDto> userSellList(@ApiParam(value = "유저 Id", required = true) @PathVariable Long id) {
        List<Product> products = productRepository.findSellUserCode(id);
        log.info("product : {}", products);

        List<IndexProductsResDto> result = products.stream()
                .map(p -> new IndexProductsResDto(p))
                .collect(Collectors.toList());

        return result;
    }

    @ApiOperation(value = "유저 구매 목록", notes = "DB에서 유저가 구매한 상품 목록을 전달")
    @GetMapping("/api/v1/products/buyList/{id}")
    public List<IndexProductsResDto> userBuyList(@ApiParam(value = "유저 Id", required = true) @PathVariable Long id) {
        List<Product> products = productRepository.findBuyUserCode(id);

        List<IndexProductsResDto> result = products.stream()
                .map(p -> new IndexProductsResDto(p))
                .collect(Collectors.toList());

        return result;
    }

    @ApiOperation(value = "유저 관심 목록", notes = "DB에서 유저가 좋아요를 누른 관심상품 목록을 전달")
    @GetMapping("/api/v1/products/wishList/{id}")
    public List<IndexProductsResDto> userWishList(@PathVariable Long id) {
        log.info("wishList");
        List<Product> products = productRepository.findWishUserCode(id);

        List<IndexProductsResDto> result = products.stream()
                .map(p -> new IndexProductsResDto(p))
                .collect(Collectors.toList());

        return result;
    }

    //페이지네이션...?
//    @GetMapping("/products/main")
//    public Page<IndexProductsResDto> getMainProduct(@RequestParam String sort, @RequestParam String category, @RequestParam int page, @RequestParam int size) {
//        return productService.getMainProducts(sort, category, page, size);
//    }

    //무한 스크롤 no-offset 방식
    @GetMapping("/api/v1/products/main/noOffset")
    public List<IndexProductsResDto> getMainProduct(@RequestParam Long productId, @RequestParam int pageSize) {
        return productService.getMainProductsNo(productId, pageSize);
    }

    //offset방식
    @ApiOperation(value = "메인 페이지 상품 목록", notes = "DB에 등록된 상품 정보를 5개씩 전달")
    @GetMapping("/api/v1/products/main")
    public List<IndexProductsResDto> getMainProduct(@RequestParam int pageNo, @RequestParam int pageSize) {
        return productService.getMainProducts(pageNo, pageSize);
    }


    @Data
    static class IndexProductsDto {
        private Long productId;
        private String title;
        private int price;
        private ProductStatus status;
        private LocalDateTime createdDate;
        private int wishSize;
        private int liveReqSize;


        public IndexProductsDto(Product product) {
            productId = product.getId();
            title = product.getTitle();
            price = product.getPrice();
            status = product.getStatus();
            createdDate = product.getCreatedDate();
            wishSize = product.getWishes().size();
            liveReqSize = product.getLiveRequests().size();
        }
    }
}
