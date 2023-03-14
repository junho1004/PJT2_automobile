import React, { useEffect, useState } from "react";
import SearchItems from "./SearchItems";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import styles from "./Search.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductItem from "../../components/Product/ProductItem";

export default function Search() {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [products, setProducts] = useState([]);
  const [recentOpen, setRecentOpen] = useState(true);
  const loadedRecents = localStorage.getItem("recents")
    ? JSON.parse(window.localStorage.getItem("recents"))
    : window.localStorage.setItem("recents", JSON.stringify([]));
  const [recents, setRecents] = useState(loadedRecents);

  const handleSearchWord = (e) => {
    setSearchName(e.target.value);
  };

  const searchProducts = (searchWord) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/product/search`, {
        searchName: searchWord,
      })
      .then((res) => {
        setProducts([...res.data]);
        if (res.data !== []) {
          setRecentOpen(false)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 검색하기 함수
  const handleSubmitSearch = (e) => {
    e.preventDefault();

    if (!searchName) {
      alert("검색어를 입력해주세요!");
      setRecentOpen(true);
      return;
    }

    searchProducts(searchName);

    // 배열로 다시 바꿔서 recents에 저장하기
    setRecents(JSON.parse(window.localStorage.getItem("recents")));
    setRecents([searchName, ...recents]);

    // 문자열로 다시 바꿔서 recents에 저장하기
    window.localStorage.setItem("recents", JSON.stringify(recents));

    setSearchName("");
  };

  // 검색한 상품을 클릭하면 상세페이지로 이동
  const handleClickProduct = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className={styles.body}>
      <div className={styles.nav}>
        <ChevronLeftIcon
          onClick={() => {
            navigate(-1);
          }}
        />
        <form className={styles.input} onSubmit={handleSubmitSearch}>
          <input
            type="text"
            placeholder="검색어를 입력해주세요."
            onInput={handleSearchWord}
            onFocus={() => setRecentOpen(true)}
            value={searchName}
          />
          <MagnifyingGlassIcon onClick={handleSubmitSearch} />
        </form>
      </div>
      {/* 최근 검색어 & 검색된 내용 리스트*/}
      {recentOpen ? (
        <SearchItems
          recents={recents}
          searchProducts={searchProducts}
        />
      ) : (
        <div className={styles.searchlist}>
          {products?.length > 0 ? (
            products?.map((product) => (
              <ProductItem
                key={product.productId}
                product={product}
                clickProduct={handleClickProduct}
              />
            ))
          ) : (
            <div className={styles.noresults}>검색 결과가 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}
