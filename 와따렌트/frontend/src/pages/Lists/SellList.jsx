import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./SellList.module.css";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import ProductItem from "../../components/Product/ProductItem";


export default function SellList() {
  //status 상태
  const filters = ["ONSALE", "BOOKING", "SOLDOUT"];
  // filterText 변경
  const filterText = ["판매 중", "예약 중", "판매완료"];
  const navigate = useNavigate();
  const userId = useParams().userId;
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("ONSALE");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/sellList/${userId}`)
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data.filter((product) => product.status === filter))
      })
      .catch((err) => {
        console.log(err);
      });
  }, [products]);

  const clickProduct = (id) => {
    navigate(`/detail/${id}`);
  };
  // filter
  const handleChangeStatus = (filter) => {
    setFilter(filter);
    setFiltered(getFilteredItems(filter));
  };


  const getFilteredItems = (filter) => {
    return products?.filter((product) => product.status === filter);
  };

  return (
    //전체 컨테이너
    <div className={styles.body}>
      {/**nav부분*/}
      <div className={styles.nav}>
        <ChevronLeftIcon
          className="w-6 h-6 text-black-100"
          onClick={() => {
            navigate(`/userinfo/${userId}`);
          }}
        />
        <div className={styles.title}>판매 목록</div>
      </div>
      {/*거래 상태 표시 */}
        <div className={styles.statusnav}>
        {filters.map((item, index) => {
          return (
            <li key={index} className={styles.block}>
              <div
                onClick={() => handleChangeStatus(item)}
                className={styles.btn}
                style={{borderBottom: item===filter ? '1px solid black' : 'none'}}
              >
                {filterText[index]}
              </div>
            </li>
          );
        })}
        </div>
        <div className={styles.status}>
        <ul>
          {/**filtered된 product리스트 productitem에 보여주기 */}
          {filtered.length!== 0 ? filtered.map((product) => (
            <ProductItem
              key={product.productId}
              product={product}
              clickProduct={clickProduct}
            />
          )) : <div className={styles.alert}>상품이 없어요 😢</div> } 
        </ul>
      </div>
    </div>
  );
}
