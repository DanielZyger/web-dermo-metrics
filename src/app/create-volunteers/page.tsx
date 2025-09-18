"use client";

import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { API_BASE_URL } from "../utils/constants";
import { useApiItem } from "../hooks/use-api-item";
import { useRouter, useSearchParams } from "next/navigation";

interface VolunteerFormData {
  name: string;
  age: number | null;
  gender: string;
  phone: string;
  description: string;
}

interface VolunteerFormErrors {
  name?: string;
  age?: string;
  gender?: string;
  phone?: string;
  description?: string;
}

const VolunteerForm = () => {
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");
  const router = useRouter();

  const toast = useRef<Toast | null>(null);

  const [formData, setFormData] = useState<VolunteerFormData>({
    name: "",
    age: null,
    gender: "",
    phone: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<VolunteerFormErrors>({});

  const genderOptions = [
    { label: "Masculino", value: "male" },
    { label: "Feminino", value: "female" },
  ];

  const validateForm = (): boolean => {
    const newErrors: VolunteerFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (formData.age && (formData.age < 1 || formData.age > 120)) {
      newErrors.age = "Idade deve ser entre 1 e 120 anos";
    }

    if (!formData.gender) {
      newErrors.gender = "Gênero é obrigatório";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.current?.show({
        severity: "error",
        summary: "Erro de Validação",
        detail: "Por favor, corrija os erros no formulário",
        life: 5000,
      });
      return;
    }

    setLoading(true);

    if (!project_id) return;

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("description", formData.description);
    formDataObj.append("gender", formData.gender);
    formDataObj.append("age", formData.age);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("project_id", project_id);

    try {
      const response = await fetch(`${API_BASE_URL}/volunteers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, project_id: project_id }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar registro: ${response.statusText}`);
      }

      if (response.ok) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: `Voluntário criado com sucesso!`,
          life: 5000,
        });
      }

      handleCancel();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao cadastrar voluntário. Tente novamente.",
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof VolunteerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Remove erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      age: null,
      gender: "",
      phone: "",
      description: "",
    });
    setErrors({});
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <Toast ref={toast} />

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          maxWidth: "1200px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              padding: "40px",
              border: "1px solid #f3f4f6",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "24px",
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
                    color: "black",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f3f4f6";
                    e.target.style.color = "#374151";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#6b7280";
                  }}
                >
                  <i
                    className="pi pi-arrow-left"
                    style={{ fontSize: "14px" }}
                  />
                  Voltar
                </button>
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#111827",
                  marginBottom: "8px",
                }}
              >
                Cadastrar Voluntário
              </h2>
              <p style={{ color: "#4b5563" }}>
                Preencha as informações do voluntário
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* Nome */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "12px",
                  }}
                >
                  Nome Completo *
                </label>
                <div style={{ position: "relative" }}>
                  <InputText
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: João Silva Santos"
                    style={{
                      width: "100%",
                      padding: "16px 48px 16px 16px",
                      backgroundColor: "#f9fafb",
                      border: `2px solid ${errors.name ? "#ef4444" : "#e5e7eb"}`,
                      borderRadius: "12px",
                      color: "#111827",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.2s",
                      boxSizing: "border-box",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <i
                      className="pi pi-user"
                      style={{
                        fontSize: "16px",
                        color: "#9ca3af",
                      }}
                    />
                  </div>
                </div>
                {errors.name && (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#ef4444",
                      marginTop: "8px",
                    }}
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Idade e Telefone */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: "12px",
                    }}
                  >
                    Idade
                  </label>
                  <InputNumber
                    value={formData.age}
                    onValueChange={(e) => handleInputChange("age", e.value)}
                    placeholder="Ex: 25"
                    min={1}
                    max={120}
                    style={{
                      width: "100%",
                    }}
                    inputStyle={{
                      padding: "16px",
                      backgroundColor: "#f9fafb",
                      border: `2px solid ${errors.age ? "#ef4444" : "#e5e7eb"}`,
                      borderRadius: "12px",
                      color: "#111827",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                  />
                  {errors.age && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#ef4444",
                        marginTop: "8px",
                      }}
                    >
                      {errors.age}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: "12px",
                    }}
                  >
                    Telefone *
                  </label>
                  <div style={{ position: "relative" }}>
                    <InputText
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="(00) 00000-0000"
                      style={{
                        width: "100%",
                        padding: "16px 48px 16px 16px",
                        backgroundColor: "#f9fafb",
                        border: `2px solid ${errors.phone ? "#ef4444" : "#e5e7eb"}`,
                        borderRadius: "12px",
                        color: "#111827",
                        fontSize: "16px",
                        outline: "none",
                        transition: "all 0.2s",
                        boxSizing: "border-box",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      <i
                        className="pi pi-phone"
                        style={{
                          fontSize: "16px",
                          color: "#9ca3af",
                        }}
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#ef4444",
                        marginTop: "8px",
                      }}
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Gênero */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "12px",
                  }}
                >
                  Gênero *
                </label>
                <Dropdown
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.value)}
                  options={genderOptions}
                  placeholder="Selecione o gênero"
                  style={{
                    width: "100%",
                  }}
                  inputStyle={{
                    padding: "16px",
                    backgroundColor: "#f9fafb",
                    border: `2px solid ${errors.gender ? "#ef4444" : "#e5e7eb"}`,
                    borderRadius: "12px",
                    color: "#111827",
                    fontSize: "16px",
                  }}
                />
                {errors.gender && (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#ef4444",
                      marginTop: "8px",
                    }}
                  >
                    {errors.gender}
                  </p>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "12px",
                  }}
                >
                  Descrição / Habilidades *
                </label>
                <InputTextarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Descreva as habilidades, experiências e áreas de interesse do voluntário..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: "#f9fafb",
                    border: `2px solid ${errors.description ? "#ef4444" : "#e5e7eb"}`,
                    borderRadius: "12px",
                    color: "#111827",
                    fontSize: "16px",
                    outline: "none",
                    transition: "all 0.2s",
                    resize: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
                {errors.description && (
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#ef4444",
                      marginTop: "8px",
                    }}
                  >
                    {errors.description}
                  </p>
                )}
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    marginTop: "8px",
                  }}
                >
                  Inclua informações sobre habilidades técnicas, experiências
                  anteriores e áreas de interesse
                </p>
              </div>

              {/* Botões */}
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <Button
                  label="Cancelar"
                  severity="secondary"
                  outlined
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    padding: "16px",
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "12px",
                    transition: "all 0.2s",
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !formData.name.trim() ||
                    !formData.gender ||
                    !formData.phone.trim() ||
                    !formData.description.trim()
                  }
                  style={{
                    flex: 2,
                    padding: "16px",
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "12px",
                    border: "none",
                    cursor:
                      loading ||
                      !formData.name.trim() ||
                      !formData.gender ||
                      !formData.phone.trim() ||
                      !formData.description.trim()
                        ? "not-allowed"
                        : "pointer",
                    background:
                      loading ||
                      !formData.name.trim() ||
                      !formData.gender ||
                      !formData.phone.trim() ||
                      !formData.description.trim()
                        ? "#d1d5db"
                        : "linear-gradient(to right, #3b82f6, #4f46e5)",
                    color:
                      loading ||
                      !formData.name.trim() ||
                      !formData.gender ||
                      !formData.phone.trim() ||
                      !formData.description.trim()
                        ? "#6b7280"
                        : "white",
                    boxShadow:
                      loading ||
                      !formData.name.trim() ||
                      !formData.gender ||
                      !formData.phone.trim() ||
                      !formData.description.trim()
                        ? "none"
                        : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {loading && <i className="pi pi-spin pi-spinner" />}
                  {loading ? "Cadastrando..." : "Cadastrar Voluntário"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerForm;
