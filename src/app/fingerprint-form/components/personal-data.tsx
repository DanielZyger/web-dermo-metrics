"use client";

import { Card } from "primereact/card";
import { useApiItem } from "@/app/hooks/use-api-item";
import { genderParse } from "@/app/utils/constants";
import { useRouter } from "next/navigation";
import { Volunteer } from "@/app/utils/types/volunteer";
import { useVolunteerStore } from "@/store/use-volunteer-store";
import { useEffect, useMemo } from "react";

const PersonalDataForm = () => {
  const { selectedVolunteerId, fingerprintsVersion } = useVolunteerStore();
  const router = useRouter();

  const {
    data: volunteer,
    loading,
    refetch,
  } = useApiItem<Volunteer>(`/volunteers/${selectedVolunteerId}`);

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!selectedVolunteerId) return;
    refetch();
  }, [fingerprintsVersion, selectedVolunteerId, refetch]);

  const totalRidgeCounts = useMemo(
    () =>
      (volunteer?.fingerprints ?? []).reduce(
        (sum, fp) => sum + (fp.ridge_counts ?? 0),
        0,
      ),
    [volunteer?.fingerprints],
  );

  const totalDeltas = useMemo(
    () =>
      (volunteer?.fingerprints ?? []).reduce(
        (sum, fp) => sum + (fp.number_deltas ?? 0),
        0,
      ),
    [volunteer?.fingerprints],
  );

  if (!volunteer) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          backgroundColor: "#F3F4F6",
        }}
      >
        Carregando Dados
      </div>
    );
  }

  return (
    <>
      <div style={{ textAlign: "left", marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleGoBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              color: "#6b7280",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
              e.currentTarget.style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            <i className="pi pi-arrow-left" style={{ fontSize: "14px" }} />
            Voltar
          </button>
        </div>
      </div>
      <Card title="Dados Pessoais" style={{ padding: 10, marginBottom: 10 }}>
        <div style={{ padding: "15px 0" }}>
          {/* Grid de informações principais */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              marginBottom: "10px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#64748b",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                Nome Completo
              </label>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                {volunteer.name || "-"}
              </span>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#64748b",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                Idade
              </label>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                {volunteer.age ? `${volunteer.age} anos` : "-"}
              </span>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#64748b",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                Altura
              </label>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                {volunteer.height} cm
              </span>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#64748b",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                Peso
              </label>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                {volunteer.weight} kg
              </span>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#64748b",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                Gênero
              </label>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                {genderParse[volunteer.gender] || "-"}
              </span>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#64748b",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                Telefone
              </label>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                {volunteer.phone || "-"}
              </span>
            </div>
          </div>

          {volunteer.description && (
            <div
              style={{
                borderTop: "1px solid #e2e8f0",
                paddingTop: "24px",
              }}
            >
              {/* Cabeçalho Observações + SQTL / Deltas */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  Observações
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    fontSize: "12px",
                  }}
                >
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      backgroundColor: "#e0f2fe",
                      color: "#0369a1",
                      fontSize: "14px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    SQTL: {totalRidgeCounts}
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      backgroundColor: "#fee2e2",
                      color: "#b91c1c",
                      fontSize: "14px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Deltas: {totalDeltas}
                  </span>
                </div>
              </div>

              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#475569",
                  margin: 0,
                  padding: "16px 0",
                }}
              >
                {volunteer.description}
              </p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default PersonalDataForm;
