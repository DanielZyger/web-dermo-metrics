"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Sidebar from "../components/sidebar";
import PersonalDataForm from "./components/personal-data";
import FingerprintSession from "./components/fingerprint-session";
import {
  API_BASE_URL,
  FingerKey,
  fingerParse,
  HandEnum,
} from "../utils/constants";
import {
  FingerprintCreatePayload,
  FormDataFingerprint,
} from "../utils/types/fingerprint";
import { Volunteer } from "../utils/types/volunteer";
import { useSearchParams } from "next/navigation";
import { useApiItem } from "../hooks/use-api-item";
import base64ToFile from "../utils/base64_to_file";

export default function FingerprintForm() {
  const searchParams = useSearchParams();
  const volunteerId = Number(searchParams.get("volunteer_id"));
  const [volunteerUpdated, setVolunteerUpdated] = useState(false);
  const { data: volunteer, refetch } = useApiItem<Volunteer>(
    `/volunteers/${volunteerId}`,
  );

  const toast = useRef<Toast>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fingerKeys: FingerKey[] = ["thumb", "index", "middle", "ring", "pinky"];

  const emptyFormData: FormDataFingerprint = {
    notes: "",
    leftHand: {
      thumb: { image_data: null, image_filtered: null },
      index: { image_data: null, image_filtered: null },
      middle: { image_data: null, image_filtered: null },
      ring: { image_data: null, image_filtered: null },
      pinky: { image_data: null, image_filtered: null },
    },
    rightHand: {
      thumb: { image_data: null, image_filtered: null },
      index: { image_data: null, image_filtered: null },
      middle: { image_data: null, image_filtered: null },
      ring: { image_data: null, image_filtered: null },
      pinky: { image_data: null, image_filtered: null },
    },
  };

  const buildFormData = (volunteer: Volunteer | null): FormDataFingerprint => {
    if (!volunteer || !volunteer.fingerprints.length) return emptyFormData;

    volunteer.fingerprints.forEach((fp) => {
      const hand = fp.hand === "left" ? "leftHand" : "rightHand";
      const finger = fp.finger as FingerKey;

      if (!fp.image_data || !fp.image_filtered) return;

      formData[hand][finger] = {
        image_data: fp.image_data,
        image_filtered: fp.image_filtered,
        file: null,
      };
    });

    return formData;
  };

  const [formData, setFormData] = useState<FormDataFingerprint>(() =>
    buildFormData(volunteer),
  );

  const validateFingerprints = () => {
    const missingFingers: string[] = [];

    fingerKeys.forEach((finger) => {
      if (!formData.leftHand[finger]) {
        missingFingers.push(`${fingerParse[finger]} da mão esquerda`);
      }
      if (!formData.rightHand[finger]) {
        missingFingers.push(`${fingerParse[finger]} da mão direita`);
      }
    });

    return missingFingers;
  };

  const createFingerprintRecords = () => {
    const fingerprintRecords: FingerprintCreatePayload[] = [];

    fingerKeys.forEach((finger) => {
      // Registro para mão esquerda
      if (formData.leftHand[finger]?.file) {
        fingerprintRecords.push({
          volunteer_id: volunteerId,
          hand: HandEnum.LEFT,
          notes: "MAO DIREITA",
          finger: finger,
          image_data: formData.leftHand[finger].file,
        });
      }

      // Registro para mão direita
      if (formData.rightHand[finger]?.file) {
        fingerprintRecords.push({
          volunteer_id: volunteerId,
          notes: "MAO ESQUERDA",
          hand: HandEnum.RIGHT,
          finger: finger,
          image_data: formData.rightHand[finger].file,
        });
      }
    });

    return fingerprintRecords;
  };

  const saveFingerprintRecords = async (
    records: FingerprintCreatePayload[],
  ) => {
    const savePromises = records.map(async (record) => {
      const formData = new FormData();

      if (record.image_data) {
        formData.append("image_data", record.image_data);

        (Object.keys(record) as (keyof FingerprintCreatePayload)[]).forEach(
          (key) => {
            if (key !== "image_data" && record[key] !== undefined) {
              formData.append(key, record[key]!.toString());
            }
          },
        );
      } else {
        throw new Error("Imagem não encontrada no registro");
      }

      const response = await fetch(`${API_BASE_URL}/fingerprints`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar registro: ${response.statusText}`);
      }

      return response.json();
    });

    try {
      const results = await Promise.all(savePromises);

      console.log("Todos os registros de fingerprint foram salvos:", results);
      setVolunteerUpdated(true);
      return {
        success: true,
        recordCount: records.length,
        results,
      };
    } catch (error) {
      console.error("Erro ao salvar alguns registros:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (!volunteerId) {
        toast.current?.show({
          severity: "error",
          summary: "Erro de Validação",
          detail: "Voluntário não encontrado",
        });
        return;
      }

      // Validação das digitais (todos os 10 dedos)
      const missingFingers = validateFingerprints();
      if (missingFingers.length > 0) {
        toast.current?.show({
          severity: "error",
          summary: "Digitais Incompletas",
          detail: `Faltam as seguintes digitais: ${missingFingers.join(", ")}`,
          life: 6000,
        });
        return;
      }

      // Criar registros individuais para cada dedo
      const fingerprintRecords = createFingerprintRecords();

      // Salvar os registros
      const result = await saveFingerprintRecords(fingerprintRecords);

      if (result.success) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: `Registros registros de digitais salvos com sucesso!`,
          life: 5000,
        });
      } else {
        const errorMessage = true
          ? "Falha ao salvar todas as digitais"
          : `Registro digitais salvas, MUITAS falharam`;

        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: errorMessage,
          life: 5000,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Ocorreu um erro ao salvar os dados. Tente novamente.",
        life: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInsertedFingerprintsCount = () => {
    let count = 0;

    fingerKeys.forEach((finger) => {
      if (formData.leftHand[finger]) count++;
      if (formData.rightHand[finger]) count++;
    });

    return count;
  };

  useEffect(() => {
    if (volunteerUpdated) {
      refetch();
    }
  }, [volunteerUpdated, refetch]);

  useEffect(() => {
    setFormData(buildFormData(volunteer));
  }, [volunteer, buildFormData]);

  // viewMode: "raw" | "filtered";

  const insertedCount = getInsertedFingerprintsCount();
  const isFormComplete = insertedCount === 10;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#F3F4F6",
      }}
    >
      <Toast ref={toast} />

      <Sidebar canCollapse={true} />

      <main style={{ flex: 1, margin: 30 }}>
        <div style={{ width: "100%", margin: "0 auto" }}>
          <PersonalDataForm />

          <FingerprintSession
            volunteer={volunteer}
            formData={formData}
            setFormData={setFormData}
            toast={toast}
          />

          {/* Indicador de progresso */}
          <div
            style={{
              background: insertedCount === 10 ? "#f0fdf4" : "#fefce8",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              border: `1px solid ${insertedCount === 10 ? "#bbf7d0" : "#fef3c7"}`,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <i
              className={
                insertedCount === 10
                  ? "pi pi-check-circle"
                  : "pi pi-info-circle"
              }
              style={{
                color: insertedCount === 10 ? "#10b981" : "#f59e0b",
                fontSize: "20px",
              }}
            />
            <div>
              <div style={{ fontWeight: "600", color: "#374151" }}>
                Progresso das Digitais: {insertedCount}/10
              </div>
              <div
                style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}
              >
                {insertedCount === 10
                  ? "Todas as digitais foram coletadas. Você pode finalizar o registro."
                  : `Faltam ${10 - insertedCount} digitais para completar o registro.`}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#f8fafc",
              borderRadius: "12px",
              padding: "24px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Button
              label="Cancelar"
              icon="pi pi-times"
              outlined
              severity="secondary"
              disabled={isSubmitting}
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            />
            <Button
              label={isSubmitting ? "Salvando..." : "Finalizar Registro"}
              icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
              onClick={handleSubmit}
              disabled={!isFormComplete || isSubmitting}
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "500",
                background:
                  isFormComplete && !isSubmitting
                    ? "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)"
                    : "#9ca3af",
                border: "none",
                opacity: isFormComplete && !isSubmitting ? 1 : 0.6,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
