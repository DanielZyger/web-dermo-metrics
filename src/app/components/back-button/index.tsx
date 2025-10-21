"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.css";

const BackButton = () => {
  const router = useRouter();

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div style={{ textAlign: "center", marginBottom: "32px" }}>
      <button onClick={handleGoBack} style={styles.goBackButton}>
        <i className="pi pi-arrow-left" style={{ fontSize: "14px" }} />
        Voltar
      </button>
    </div>
  );
};

export default BackButton;
