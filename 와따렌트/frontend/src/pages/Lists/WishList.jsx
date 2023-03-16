import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector} from 'react-redux'
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import styles from "./WishList.module.css";
import axios from "axios";
import ProductItem from "../../components/Product/ProductItem";

export default function WishList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);


  const userId = useSelector((state) => { return state.user.userCode})
  const clickProduct = (id) => {
    navigate(`/detail/${id}`);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/wishList/${userId}`)
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
            navigate(`/userinfo/${userId}`);
          }}
        />
        <div className={styles.title}>관심 목록</div>
      </div>
      <div className={styles.scrollarea}>
        {products.length !== 0 ? products.map((product) => (
            <ProductItem
              key={product.productId}
              product={product}
              clickProduct={clickProduct}
            />
          )) : <div className={styles.alert}>상품이 없어요 😢 </div> }
        {/* {products?.map((product) => {
          return (
            <ProductItem
              key={product.productId}
              product={product}
              clickProduct={clickProduct}
            />
          );
        })} */}
      </div>
    </div>
  );
}
