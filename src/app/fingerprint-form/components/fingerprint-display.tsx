import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { FingerKey, fingerParse } from "@/app/utils/constants";
import { Dispatch, RefObject, SetStateAction } from "react";
import { Toast } from "primereact/toast";
import { FormDataFingerprint } from "@/app/utils/types/fingerprint";

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
        {fingerParse[finger]}
      </label>
      <Card
        style={{
          height: "300px",
          display: "flex",
          flexDirection: "column",
          border: "2px solid #10b981",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              flexDirection: "row",
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleReplace}
              style={{
                fontSize: "10px",
                padding: "6px 8px",
                height: "28px",
                border: "1px solid #6366f1",
                backgroundColor: "white",
                color: "#6366f1",
                borderRadius: "4px",
                cursor: "pointer",
                alignItems: "flex-end",
                justifyContent: "end",
                gap: "4px",
              }}
            >
              <i className="pi pi-times" />
            </button>
          </div>

          {/* Imagem */}
          <div
            style={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "8px",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {imageToShow ? (
              <img
                src={`data:image/jpeg;base64,${imageToShow}`}
                alt={`${fingerName} - ${viewMode === "raw" ? "Original" : "Filtrada"}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "4px",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#9ca3af",
                  fontSize: "12px",
                }}
              >
                <i
                  className="pi pi-image"
                  style={{ fontSize: "24px", marginBottom: "8px" }}
                />
                <span>
                  {viewMode === "raw" ? "Imagem original" : "Imagem filtrada"}
                  <br />
                  não disponível
                </span>
              </div>
            )}
          </div>

          {/* Status indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginBottom: "8px",
              fontSize: "11px",
              color: "#10b981",
              fontWeight: "500",
            }}
          >
            <i className="pi pi-check-circle" />
            <span>Carregada</span>
          </div>
        </div>
      </Card>
    </>
  );
};

export default FingerprintDisplay;
