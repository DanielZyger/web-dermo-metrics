"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Sidebar from "../components/sidebar";
import PersonalDataForm from "./components/personal-data";
import FingerprintSession from "./components/fingerprint-session";
import { FormDataFingerprint } from "../utils/types/fingerprint";
import { Volunteer } from "../utils/types/volunteer";
import { useSearchParams } from "next/navigation";
import { useApiItem } from "../hooks/use-api-item";
import {
  submitFingerprints,
  transformFingerprintsToFormData,
} from "./utils/fingerprint-api";

export default function FingerprintForm() {
  const toast = useRef<Toast>(null);
  const searchParams = useSearchParams();
  const volunteerId = Number(searchParams.get("volunteer_id"));

  const { data: volunteer, refetch } = useApiItem<Volunteer>(
    `/volunteers/${volunteerId}`,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormDataFingerprint>({
    leftHand: {
      thumb: { image_data: "", image_filtered: null },
      index: { image_data: "", image_filtered: null },
      middle: { image_data: "", image_filtered: null },
      ring: { image_data: "", image_filtered: null },
      pinky: { image_data: "", image_filtered: null },
    },
    rightHand: {
      thumb: { image_data: "", image_filtered: null },
      index: { image_data: "", image_filtered: null },
      middle: { image_data: "", image_filtered: null },
      ring: { image_data: "", image_filtered: null },
      pinky: { image_data: "", image_filtered: null },
    },
    notes: "",
  });

  useEffect(() => {
    if (volunteer?.fingerprints && volunteer.fingerprints.length > 0) {
      const transformedData = transformFingerprintsToFormData(
        volunteer.fingerprints,
      );
      setFormData(transformedData);

      toast.current?.show({
        severity: "info",
        summary: "Digitais Carregadas",
        detail: `${volunteer.fingerprints.length} digital(is) carregada(s)`,
        life: 3000,
      });
    }
  }, [volunteer?.fingerprints]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Submete as digitais
      const { success, errors } = await submitFingerprints(
        formData,
        volunteerId,
      );

      if (success > 0) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: `${success} digital(is) enviada(s) com sucesso!`,
          life: 3000,
        });

        // Aguarda processamento
        await refetch();

        // Recarrega as digitais para pegar as versões processadas

        toast.current?.show({
          severity: "success",
          summary: "Processamento Concluído",
          detail: "Digitais processadas foram carregadas!",
          life: 3000,
        });
      }

      if (errors > 0) {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: `Falha ao enviar ${errors} digital(is)`,
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Erro ao submeter digitais:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro inesperado ao processar digitais",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    // validar se tem alguma fingerprint adicionada
    // alert informando que os dados inseridos vão ser limpos se ele voltar agora
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#F3F4F6",
      }}
    >
      <Toast ref={toast} />
      <Sidebar canCollapse />

      <main style={{ flex: 1, margin: 30 }}>
        <div style={{ width: "100%", margin: "0 auto" }}>
          <PersonalDataForm />

          <FingerprintSession
            formData={formData}
            setFormData={setFormData}
            toast={toast}
          />

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
              onClick={handleGoBack}
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
              disabled={isSubmitting}
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 500,
                background: !isSubmitting
                  ? "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)"
                  : "#9ca3af",
                border: "none",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
