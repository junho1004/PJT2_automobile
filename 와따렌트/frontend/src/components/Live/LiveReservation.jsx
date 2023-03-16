import React, { useState } from "react";
import styles from "./LiveReservation.module.css";
import ReservationModal from "./ReservationModal";

export default function LiveReservation({ product }) {
  const [modalOpen, setModalOpen] = useState(false);

  const showModal = () => {
    setModalOpen(true);
  };

  return (
    <div className={styles.box}>
      <div
        className={styles.image}
        style={{
          backgroundImage: "url(" + `${product.thumbnail}` + ")",
        }}
      >
        <p className={styles.title}>{product.title}</p>
        {product.reserve === null ? (
          <button className={styles.btn} onClick={showModal}>
            시간 예약하기
          </button>
        ) : (
          <button className={styles.btn}>예약되었습니다.</button>
        )}
      </div>
      {modalOpen && (
        <ReservationModal
          setModalOpen={setModalOpen}
          productId={product.productId}
        />
      )}
    </div>
  );
}
