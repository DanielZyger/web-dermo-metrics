"use client";

import { useRef, RefObject, Dispatch, SetStateAction, useMemo } from "react";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { FingerKey, fingerParse, HandKey } from "@/app/utils/constants";
import Image from "next/image";
import { Toast } from "primereact/toast";
import { FormDataFingerprint } from "@/app/utils/types/fingerprint";
import { isString } from "lodash";

const FingerprintUpload = ({
  hand,
  finger,
  formData,
  setFormData,
  toast,
}: FingerprintUploadParams) => {
  const fingerData = formData[hand][finger];
  const fileUploadRef = useRef<FileUpload>(null);

  const imagePreview = useMemo(() => {
    if (isString(fingerData.image_data) || !fingerData.image_data) return;

    return URL.createObjectURL(fingerData.image_data);
  }, [fingerData.image_data]);

  const handleFileSelect = (e: FileUploadSelectEvent) => {
    const files = e.files;
    if (files && files.length > 0) {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        [hand]: {
          ...prev[hand],
          [finger]: {
            image_data: file, // Armazena o File para submit
            image_filtered: null,
          },
        },
      }));

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: `Digital ${fingerParse[finger]} da mão ${hand === "leftHand" ? "esquerda" : "direita"} carregada`,
      });
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      [hand]: {
        ...prev[hand],
        [finger]: {
          image_data: null,
          image_filtered: null,
        },
      },
    }));

    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  };

  const triggerFileSelect = () => {
    if (fileUploadRef.current) {
      const input = fileUploadRef.current.getInput();
      if (input) {
        input.click();
      }
    }
  };

  return (
    <div style={{ marginBottom: "16px" }}>
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

      <div style={{ position: "relative" }}>
        {!fingerData?.image_data ? (
          <div className="file-upload" onClick={triggerFileSelect}>
            <i
              className="pi pi-plus"
              style={{
                fontSize: "24px",
                color: "#1E3A8A",
                marginBottom: "8px",
              }}
            />
            <span
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Adicionar Digital
            </span>
          </div>
        ) : (
          // Preview da imagem
          <div
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              border: "2px solid #10b981",
              backgroundColor: "#f0fdf4",
            }}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt={`Digital ${fingerParse[finger]}`}
                width={300}
                height={300}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  flexDirection: "column",
                }}
              >
                <i
                  className="pi pi-image"
                  style={{ fontSize: "24px", color: "#10b981" }}
                />
                <small style={{ color: "#10b981", marginTop: "4px" }}>
                  Carregando...
                </small>
              </div>
            )}

            <button onClick={removeImage} className="remove-file-button">
              <i className="pi pi-times" style={{ fontSize: "12px" }} />
            </button>
          </div>
        )}
      </div>

      <FileUpload
        ref={fileUploadRef}
        mode="basic"
        name={`${hand}_${finger}`}
        accept="image/*"
        maxFileSize={5000000}
        chooseLabel=""
        onSelect={handleFileSelect}
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
          width: "1px",
          height: "1px",
        }}
        auto={false}
      />
    </div>
  );
};

export default FingerprintUpload;

type FingerprintUploadParams = {
  hand: HandKey;
  finger: FingerKey;
  formData: FormDataFingerprint;
  setFormData: Dispatch<SetStateAction<FormDataFingerprint>>;
  toast: RefObject<Toast | null>;
};
