"use client";

import { Card } from "primereact/card";
import { useApiItem } from "@/app/hooks/use-api-item";
import { genderParse } from "@/app/utils/constants";
import { useSearchParams, useRouter } from "next/navigation";
import { Volunteer } from "@/app/utils/types/volunteer";

const PersonalDataForm = () => {
  const searchParams = useSearchParams();
  const volunteerId = searchParams.get("volunteer_id");
  const router = useRouter();

  const { data: volunteer, loading } = useApiItem<Volunteer>(
    `/volunteers/${volunteerId}`,
  );

  const handleGoBack = () => {
    router.back();
  };

  if (loading || !volunteer) {
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
      {/* Botão de voltar */}
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
        <div style={{ padding: "20px 0" }}>
          {/* Grid de informações principais */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "10px",
              marginBottom: "32px",
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
                ID
              </label>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1e293b",
                }}
              >
                # {volunteer.id}
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
                Nome Completo
              </label>
              <span
                style={{
                  fontSize: "20px",
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
                  fontSize: "20px",
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
                Gênero
              </label>
              <span
                style={{
                  fontSize: "20px",
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
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                {volunteer.phone || "-"}
              </span>
            </div>
          </div>

          {/* Seção de observações separada */}
          {volunteer.description && (
            <div
              style={{
                borderTop: "1px solid #e2e8f0",
                paddingTop: "24px",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#64748b",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                Observações
              </label>
              <p
                style={{
                  fontSize: "16px",
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
