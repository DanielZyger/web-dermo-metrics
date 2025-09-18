import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { FingerKey, fingerParse } from "@/app/utils/constants";
import { Dispatch, RefObject, SetStateAction } from "react";
import { Toast } from "primereact/toast";
import { FormDataFingerprint } from "@/app/utils/types/fingerprint";
import Image from "next/image";

type FingerprintDisplayProps = {
  hand: "leftHand" | "rightHand";
  finger: FingerKey;
  formData: FormDataFingerprint;
  setFormData: Dispatch<SetStateAction<FormDataFingerprint>>;
  toast: RefObject<Toast | null>;
  viewMode: "raw" | "filtered";
};

const FingerprintDisplay = ({
  hand,
  finger,
  formData,
  setFormData,
  toast,
  viewMode,
}: FingerprintDisplayProps) => {
  const fingerData = formData[hand]?.[finger];
  const imageToShow =
    viewMode === "raw" ? fingerData?.image_data : fingerData?.image_filtered;
  const fingerName = fingerParse[finger];

  const handleRemove = () => {
    setFormData((prev) => ({
      ...prev,
      [hand]: {
        ...prev[hand],
        [finger]: {
          ...prev[hand]?.[finger],
          image_data: undefined,
          image_filtered: undefined,
        },
      },
    }));

    toast.current?.show({
      severity: "info",
      summary: "Removido",
      detail: `Digital ${fingerName} removida`,
      life: 3000,
    });
  };

  const handleReplace = () => {
    // Limpa os dados para voltar ao modo upload
    setFormData((prev) => ({
      ...prev,
      [hand]: {
        ...prev[hand],
        [finger]: {
          ...prev[hand]?.[finger],
          image_data: undefined,
          image_filtered: undefined,
        },
      },
    }));
  };

  return (
    <>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#374151",
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        {fingerName}
      </label>
      <Card
        style={{
          height: "300px",
          display: "flex",
          flexDirection: "column",
          border: "2px solid #10b981",
          borderRadius: "12px",
          overflow: "hidden",
          padding: "0",
          position: "relative",
        }}
      >
        <button
          onClick={handleReplace}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            fontSize: "12px",
            padding: "4px",
            height: "24px",
            width: "24px",
            border: "1px solid #6366f1",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "#6366f1",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          <i className="pi pi-times" style={{ fontSize: "12px" }} />
        </button>

        {imageToShow ? (
          <Image
            src={`data:image/jpeg;base64,${imageToShow}`}
            height={300}
            width={300}
            alt={`${fingerName} - ${viewMode === "raw" ? "Original" : "Filtrada"}`}
            style={{
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              fontSize: "12px",
              backgroundColor: "#f9fafb",
            }}
          >
            <i
              className="pi pi-image"
              style={{ fontSize: "24px", marginBottom: "8px" }}
            />
            <span style={{ textAlign: "center" }}>
              {viewMode === "raw" ? "Imagem original" : "Imagem filtrada"}
              <br />
              não disponível
            </span>
          </div>
        )}
      </Card>
    </>
  );
};

export default FingerprintDisplay;
