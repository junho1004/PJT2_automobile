import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import styles from "./BuyList.module.css";
import { useNavigate } from "react-router";
import BuyProductItem from "./BuyProductItem";
import { useSelector } from 'react-redux'

export default function BuyList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const userId = useSelector((state) => { return state.user.userCode})

  const clickProduct = (id) => {
    navigate(`/detail/${id}`);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/buyList/${userId}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={styles.body}>
      <div className={styles.nav}>
        <ChevronLeftIcon
          className="w-6 h-6 text-black-100"
          onClick={() => {
            navigate(`/userInfo/${userId}`);
          }}
        />
        <div className={styles.title}>구매 목록</div>
      </div>
      <div className={styles.scrollarea}>
        {products.length !== 0 ? (
          products.map((product) => (
            <BuyProductItem
              key={product.productId}
              product={product}
              clickProduct={clickProduct}
            />
          ))
        ) : (
          <div className={styles.alert}>상품이 없어요 😢</div>
        )}
      </div>
    </div>
  );
}
