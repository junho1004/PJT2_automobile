import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TopNav.module.css";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function TopNav() {
  const navigate = useNavigate();


  return (
    <nav className={styles.body}>
      <div className={styles.contentbox}>
        <div
          className={styles.logo}
          onClicK={() => {
            navigate("/");
          }}
        >
          렌트카
        </div>
        <div className={styles.rightbox}>
          <MagnifyingGlassIcon
            className={styles.glassicon}
            onClick={() => {
              navigate("/search");
            }}
          />
        </div>
      </div>
    </nav>
  );
}
