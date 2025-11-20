"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Sidebar from "../components/sidebar";
import PersonalDataForm from "./components/personal-data";
import FingerprintSession from "./components/fingerprint-session";
import { Fingerprint, FormDataFingerprint } from "../utils/types/fingerprint";
import { Volunteer } from "../utils/types/volunteer";
import { useRouter } from "next/navigation";
import { useApiItem } from "../hooks/use-api-item";
import {
  submitFingerprints,
  transformFingerprintsToFormData,
} from "./utils/fingerprint-api";
import { useVolunteerStore } from "@/store/use-volunteer-store";

export default function FingerprintForm() {
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const { selectedVolunteer } = useVolunteerStore();

  const { data: volunteer, refetch } = useApiItem<Volunteer>(
    `/volunteers/${selectedVolunteer?.id}`,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fingerprint, setFingerprint] = useState<Fingerprint[]>([]);

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
      setFingerprint(volunteer.fingerprints);

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

    if (!selectedVolunteer) return;

    try {
      const { success, errors } = await submitFingerprints(
        formData,
        selectedVolunteer.id,
      );

      if (success > 0) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: `${success} digital(is) enviada(s) com sucesso!`,
          life: 3000,
        });

        await refetch();

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
    const hasFingerprints =
      Object.values(formData.leftHand).some(
        (f) => f.image_data || f.image_filtered,
      ) ||
      Object.values(formData.rightHand).some(
        (f) => f.image_data || f.image_filtered,
      );

    if (hasFingerprints) {
      // mostra confirmação antes de sair
      const confirmLeave = window.confirm(
        "Há digitais adicionadas. Se você voltar agora, os dados inseridos serão perdidos.\n\nDeseja realmente voltar?",
      );

      if (!confirmLeave) return;
    }

    router.back();
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
            fingerprint={fingerprint}
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
                gap: "8px",
                fontWeight: "500",
              }}
            />
            <Button
              label={isSubmitting ? "Cadastrando..." : "Cadastrar Digitais"}
              icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
              onClick={handleSubmit}
              disabled={isSubmitting}
              iconPos="left"
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 500,
                background: !isSubmitting
                  ? "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)"
                  : "#9ca3af",
                border: "none",
                gap: "8px",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
