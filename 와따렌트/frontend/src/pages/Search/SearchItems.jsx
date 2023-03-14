import React from "react";
import styles from "./SearchItems.module.css";

export default function SearchItems({ recents, searchProducts }) {
  if (recents.length > 15) {
    return (
      <div className={styles.body}>
        <span className={styles.text}>최근 검색어</span>
        <div className={styles.wordcontainer}>
          {recents?.slice(0, 15).map((word, idx) => (
            <div key={idx} className={styles.word}>
              <span
                onClick={() => {
                  searchProducts(word);
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.body}>
        <span className={styles.text}>최근 검색어</span>
        <div className={styles.wordcontainer}>
          {recents?.map((word, idx) => (
            <div key={idx} className={styles.word}>
              <span
                onClick={() => {
                  searchProducts(word);
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
