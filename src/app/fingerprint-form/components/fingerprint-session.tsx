"use client";

import { Card } from "primereact/card";
import FingerprintUpload from "./fingerprint-upload";
import { FingerKey, fingerParse } from "@/app/utils/constants";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { Toast } from "primereact/toast";
import { FormDataFingerprint } from "@/app/utils/types/fingerprint";
import FingerprintDisplay from "./fingerprint-display";

const fingers = Object.keys(fingerParse).filter((key): key is FingerKey =>
  ["thumb", "index", "middle", "ring", "pinky"].includes(key),
);

const FingerprintSession = ({
  formData,
  setFormData,
  toast,
}: FingerprintSessionParams) => {
  const [viewMode, setViewMode] = useState<"raw" | "filtered">("raw");

  const hasFingerprint = (
    hand: "leftHand" | "rightHand",
    finger: FingerKey,
  ) => {
    const fingerData = formData[hand]?.[finger];
    return !!(fingerData?.image_data || fingerData?.image_filtered);
  };

  return (
    <Card
      title="Cadastro de Digitais"
      style={{
        marginBottom: "32px",
        padding: 15,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* 🔘 Radio para alternar visualização */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <label>
          <input
            type="radio"
            name="viewMode"
            value="raw"
            checked={viewMode === "raw"}
            onChange={() => setViewMode("raw")}
          />{" "}
          Original
        </label>
        <label>
          <input
            type="radio"
            name="viewMode"
            value="filtered"
            checked={viewMode === "filtered"}
            onChange={() => setViewMode("filtered")}
          />{" "}
          Filtrada
        </label>
      </div>
      <div style={{ marginBottom: "40px" }}>
        <h4
          style={{
            margin: "10px 0 20px 0",
            color: "#374151",
            fontSize: "16px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Mão Esquerda
        </h4>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            width: "100%",
          }}
        >
          {[...fingers].reverse().map((finger) => (
            <div key={`left-${finger}`} style={{ flex: 1 }}>
              {hasFingerprint("leftHand", finger) ? (
                <FingerprintDisplay
                  hand="leftHand"
                  finger={finger}
                  formData={formData}
                  setFormData={setFormData}
                  toast={toast}
                  viewMode={viewMode}
                />
              ) : (
                <FingerprintUpload
                  hand="leftHand"
                  finger={finger}
                  formData={formData}
                  setFormData={setFormData}
                  toast={toast}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mão Direita */}
      <div>
        <h4
          style={{
            margin: "0 0 20px 0",
            color: "#374151",
            fontSize: "16px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Mão Direita
        </h4>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            width: "100%",
          }}
        >
          {fingers.map((finger) => (
            <div key={`right-${finger}`} style={{ flex: 1 }}>
              {hasFingerprint("rightHand", finger) ? (
                <FingerprintDisplay
                  hand="rightHand"
                  finger={finger}
                  formData={formData}
                  setFormData={setFormData}
                  toast={toast}
                  viewMode={viewMode}
                />
              ) : (
                <FingerprintUpload
                  hand="rightHand"
                  finger={finger}
                  formData={formData}
                  setFormData={setFormData}
                  toast={toast}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FingerprintSession;

type FingerprintSessionParams = {
  formData: FormDataFingerprint;
  setFormData: Dispatch<SetStateAction<FormDataFingerprint>>;
  toast: RefObject<Toast | null>;
};
