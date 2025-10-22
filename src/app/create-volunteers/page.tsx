"use client";

import "./styles.css";

import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { API_BASE_URL } from "../utils/constants";
import { useRouter, useSearchParams } from "next/navigation";

interface VolunteerFormData {
  name: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  gender: string;
  phone: string;
  description: string;
}

interface VolunteerFormErrors {
  name?: string;
  age?: string;
  height?: string;
  weight?: string;
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
    weight: null,
    height: null,
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

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        gender: formData.gender,
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        phone: formData.phone,
        project_id: project_id,
      };

      const response = await fetch(`${API_BASE_URL}/volunteers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar registro: ${response.statusText}`);
      }

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: `Voluntário criado com sucesso!`,
        life: 5000,
      });

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
      weight: null,
      height: null,
      phone: "",
      description: "",
    });
    setErrors({});
  };

  return (
    <div className="container">
      <Toast ref={toast} />

      <div className="formWrapper">
        <div className="formContainer">
          <div className="card">
            <div className="header">
              <div className="backButtonContainer">
                <button onClick={handleGoBack} className="backButton">
                  <i className="pi pi-arrow-left backButtonIcon" />
                  Voltar
                </button>
              </div>
              <h2 className="title">Cadastrar Voluntário</h2>
              <p className="subtitle">Preencha as informações do voluntário</p>
            </div>

            <div className="form">
              <div className="formGroup">
                <label className="label">Nome Completo *</label>
                <div style={{ position: "relative" }}>
                  <InputText
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: João Silva Santos"
                    className="input"
                    style={{
                      border: `2px solid ${errors.name ? "#ef4444" : "#e5e7eb"}`,
                    }}
                  />
                  <div className="inputIcon">
                    <i className="pi pi-user" />
                  </div>
                </div>
                {errors.name && <p className="errorMessage">{errors.name}</p>}
              </div>

              <div className="twoColumns">
                <div className="formGroup">
                  <label className="label">Altura</label>
                  <InputNumber
                    value={formData.height}
                    onValueChange={(e) => handleInputChange("height", e.value)}
                    placeholder="Ex: 176.5 cm"
                    min={15}
                    max={250}
                    minFractionDigits={0}
                    maxFractionDigits={2}
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
                  {errors.height && (
                    <p className="errorMessage">{errors.height}</p>
                  )}
                </div>
                <div className="formGroup">
                  <label className="label">Peso</label>
                  <InputNumber
                    value={formData.weight}
                    onValueChange={(e) => handleInputChange("weight", e.value)}
                    placeholder="Ex: 65.3 kg"
                    min={2}
                    minFractionDigits={0}
                    maxFractionDigits={2}
                    max={200}
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
                  {errors.weight && (
                    <p className="errorMessage">{errors.weight}</p>
                  )}
                </div>
              </div>

              <div className="twoColumns">
                <div className="formGroup">
                  <label className="label">Idade</label>
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
                  {errors.age && <p className="errorMessage">{errors.age}</p>}
                </div>

                <div className="formGroup">
                  <label className="label">Telefone *</label>
                  <div style={{ position: "relative" }}>
                    <InputText
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="(00) 00000-0000"
                      className="input"
                      style={{
                        border: `2px solid ${errors.phone ? "#ef4444" : "#e5e7eb"}`,
                      }}
                    />
                    <div className="inputIcon">
                      <i className="pi pi-phone" />
                    </div>
                  </div>
                  {errors.phone && (
                    <p className="errorMessage">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="label">Gênero *</label>
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
                  <p className="errorMessage">{errors.gender}</p>
                )}
              </div>

              <div>
                <label className="label">Observações *</label>
                <InputTextarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Adicione observações sobre o voluntário"
                  rows={4}
                  className="textarea"
                  style={{
                    border: `2px solid ${errors.description ? "#ef4444" : "#e5e7eb"}`,
                  }}
                />
                {errors.description && (
                  <p className="errorMessage">{errors.description}</p>
                )}
                <p className="helpText">
                  Inclua observações sobre o voluntário
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <Button
                  label="Cancelar"
                  severity="secondary"
                  outlined
                  onClick={handleCancel}
                  className="cancelButton"
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
                  className="submitButton"
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
