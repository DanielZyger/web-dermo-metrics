"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Sidebar from "../components/sidebar";
import PersonalDataForm from "./components/personal-data";
import FingerprintSession from "./components/fingerprint-session";
import { API_BASE_URL, FingerKey, HandEnum } from "../utils/constants";
import {
  FingerprintCreatePayload,
  FormDataFingerprint,
} from "../utils/types/fingerprint";
import { Volunteer } from "../utils/types/volunteer";
import { useSearchParams } from "next/navigation";
import { useApiItem } from "../hooks/use-api-item";

export default function FingerprintForm() {
  const toast = useRef<Toast>(null);
  const searchParams = useSearchParams();
  const volunteerId = Number(searchParams.get("volunteer_id"));

  const { data: volunteer, refetch } = useApiItem<Volunteer>(
    `/volunteers/${volunteerId}`,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [volunteerUpdated, setVolunteerUpdated] = useState(false);

  const fingerKeys: FingerKey[] = useMemo(() => {
    return ["thumb", "index", "middle", "ring", "pinky"];
  }, []);

  const emptyHand = useMemo(() => {
    return {
      thumb: { image_data: null, image_filtered: null, file: null },
      index: { image_data: null, image_filtered: null, file: null },
      middle: { image_data: null, image_filtered: null, file: null },
      ring: { image_data: null, image_filtered: null, file: null },
      pinky: { image_data: null, image_filtered: null, file: null },
    };
  }, []);

  const emptyFormData: FormDataFingerprint = useMemo(() => {
    return {
      notes: "",
      leftHand: structuredClone(emptyHand),
      rightHand: structuredClone(emptyHand),
    };
  }, [emptyHand]);

  const buildFormData = useCallback(
    (v: Volunteer | null): FormDataFingerprint => {
      if (!v?.fingerprints?.length) return emptyFormData;

      const form = structuredClone(emptyFormData);

      v.fingerprints.forEach((fp) => {
        const hand = fp.hand === "left" ? "leftHand" : "rightHand";
        const finger = fp.finger as FingerKey;

        if (fp.image_data && fp.image_filtered) {
          form[hand][finger] = {
            image_data: fp.image_data,
            image_filtered: fp.image_filtered,
            file: null,
          };
        }
      });

      return form;
    },
    [emptyFormData],
  );

  const [formData, setFormData] = useState<FormDataFingerprint>(
    buildFormData(volunteer),
  );

  /** Atualiza o formData ao carregar o voluntário */
  useEffect(() => {
    setFormData(buildFormData(volunteer));
  }, [volunteer, buildFormData]);

  /** Recarrega dados após atualização */
  useEffect(() => {
    if (volunteerUpdated) refetch();
  }, [volunteerUpdated, refetch]);

  /** Cria os registros de digitais a partir do estado atual */
  const createFingerprintRecords =
    useCallback((): FingerprintCreatePayload[] => {
      const records: FingerprintCreatePayload[] = [];

      fingerKeys.forEach((finger) => {
        const leftFile = formData.leftHand[finger]?.file;
        const rightFile = formData.rightHand[finger]?.file;

        if (leftFile) {
          records.push({
            volunteer_id: volunteerId,
            hand: HandEnum.LEFT,
            finger,
            notes: "MÃO ESQUERDA",
            image_data: leftFile,
          });
        }

        if (rightFile) {
          records.push({
            volunteer_id: volunteerId,
            hand: HandEnum.RIGHT,
            finger,
            notes: "MÃO DIREITA",
            image_data: rightFile,
          });
        }
      });

      return records;
    }, [formData, fingerKeys, volunteerId]);

  /** Exibe mensagens */
  const showToast = (
    severity: "success" | "error",
    summary: string,
    detail: string,
  ) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 5000,
    });
  };

  /** Envia as digitais para o backend */
  const saveFingerprintRecords = async (
    records: FingerprintCreatePayload[],
  ) => {
    const requests = records.map(async (record) => {
      if (!record.image_data) throw new Error("Imagem ausente no registro");

      const fd = new FormData();
      fd.append("image_data", record.image_data);

      Object.entries(record).forEach(([key, value]) => {
        if (key !== "image_data" && value !== undefined && value !== null) {
          fd.append(key, value.toString());
        }
      });

      const res = await fetch(`${API_BASE_URL}/fingerprints`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error(`Erro ao salvar registro: ${res.statusText}`);
      }

      return res.json();
    });

    return Promise.all(requests);
  };

  /** Manipula o envio do formulário */
  const handleSubmit = async () => {
    if (!volunteerId) {
      showToast("error", "Erro de Validação", "Voluntário não encontrado.");
      return;
    }

    setIsSubmitting(true);

    try {
      const records = createFingerprintRecords();

      if (!records.length) {
        showToast("error", "Erro", "Nenhuma digital selecionada para envio.");
        return;
      }

      await saveFingerprintRecords(records);

      showToast(
        "success",
        "Sucesso",
        `${records.length} registro(s) de digitais salvos com sucesso!`,
      );
      setVolunteerUpdated(true);
    } catch (err) {
      console.error("Erro ao salvar digitais:", err);
      showToast(
        "error",
        "Erro",
        "Ocorreu um erro ao salvar as digitais. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
