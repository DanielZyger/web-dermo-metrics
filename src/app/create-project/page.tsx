"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../components/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserWithLocalStorage } from "../hooks/use-user-local-storage";
import { API_BASE_URL } from "../utils/constants";
import { Toast } from "primereact/toast";

const CreateProjectPage = () => {
  const { user, fetchUser } = useUserWithLocalStorage();
  const toast = useRef<Toast | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  const handleSubmit = useCallback(async () => {
    if (!user) return;
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("description", formData.description);
    formDataObj.append("user_id", user.id.toString());

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      body: formDataObj,
    });

    if (!response.ok) {
      throw new Error(`Erro ao salvar registro: ${response.statusText}`);
    }

    if (response.ok) {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: `Projeto criado com sucesso!`,
        life: 5000,
      });

      router.push(`/home?user_id=${user.id}`);
    }
  }, [formData, user, router]);

  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)",
      }}
    >
      <Toast ref={toast} />

      <Sidebar canCollapse={false} showProject={false} />
      <div
        style={{
          minHeight: "100vh",
          flex: 1,
          background:
            "linear-gradient(to bottom right, #dbeafe, #ffffff, #e0e7ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "48px", flex: 1 }}>
            <div style={{ position: "relative", marginBottom: "32px" }}>
              <div
                style={{
                  position: "absolute",
                  top: "-16px",
                  left: "-16px",
                  width: "80px",
                  height: "80px",
                  backgroundColor: "#dbeafe",
                  borderRadius: "50%",
                  opacity: 0.5,
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  right: "-32px",
                  width: "64px",
                  height: "64px",
                  backgroundColor: "#e0e7ff",
                  borderRadius: "50%",
                  opacity: 0.4,
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  top: "32px",
                  right: "48px",
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#ede9fe",
                  borderRadius: "50%",
                  opacity: 0.3,
                }}
              ></div>

              {/* Ícone principal */}
              <div
                style={{
                  position: "relative",
                  background:
                    "linear-gradient(to bottom right, #3b82f6, #4f46e5)",
                  borderRadius: "24px",
                  width: "96px",
                  height: "96px",
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                <i
                  className="pi pi-folder"
                  style={{
                    fontSize: "45px",
                    color: "white",
                    marginBottom: "8px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: "#10b981",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i
                    className="pi pi-plus"
                    style={{
                      fontSize: "16px",
                      color: "white",
                      marginBottom: "8px",
                    }}
                  />
                </div>
              </div>
            </div>

            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "24px",
                lineHeight: "1.2",
              }}
            >
              Pronto para começar?
            </h1>
            <p
              style={{
                fontSize: "1.25rem",
                color: "#4b5563",
                marginBottom: "16px",
                maxWidth: "512px",
                margin: "0 auto 16px auto",
              }}
            >
              Você ainda não está vinculado a nenhum projeto. Vamos criar o seu
              primeiro projeto!
            </p>

            {/* Features */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "24px",
                marginTop: "32px",
                marginBottom: "48px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "white",
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
              >
                <i
                  className="pi pi-users"
                  style={{
                    fontSize: "16px",
                    color: "#3b82f6",
                    marginBottom: "8px",
                  }}
                />
                <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                  Colaboração em equipe
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "white",
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
              >
                <i
                  className="pi pi-th-large"
                  style={{
                    fontSize: "16px",
                    color: "#10b981",
                    marginBottom: "8px",
                  }}
                />
                <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                  Informações claras
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "white",
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
              >
                <i
                  className="pi pi-folder-plus"
                  style={{
                    fontSize: "16px",
                    color: "#8b5cf6",
                    marginBottom: "8px",
                  }}
                />
                <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                  Organização total
                </span>
              </div>
            </div>
          </div>

          <div style={{ margin: "0 auto", flex: 1 }}>
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
                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  Criar Novo Projeto
                </h2>
                <p style={{ color: "#4b5563" }}>
                  Preencha as informações básicas do seu projeto
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
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
                    Nome do Projeto *
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: Sistema de Gestão, App Mobile, Website..."
                      style={{
                        width: "100%",
                        padding: "16px 48px 16px 16px",
                        backgroundColor: "#f9fafb",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        color: "#111827",
                        fontSize: "16px",
                        outline: "none",
                        transition: "all 0.2s",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.borderColor = "#3b82f6";
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = "#f9fafb";
                        e.target.style.borderColor = "#e5e7eb";
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
                        className="pi pi-folder-plus"
                        style={{
                          fontSize: "16px",
                          color: "#9ca3af",
                          marginBottom: "8px",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Campo Descrição */}
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
                    Descrição do Projeto
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descreva o objetivo, escopo e principais características do seu projeto..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "#f9fafb",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      color: "#111827",
                      fontSize: "16px",
                      outline: "none",
                      transition: "all 0.2s",
                      resize: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = "white";
                      e.target.style.borderColor = "#3b82f6";
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = "#f9fafb";
                      e.target.style.borderColor = "#e5e7eb";
                    }}
                  />
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#6b7280",
                      marginTop: "8px",
                    }}
                  >
                    Uma boa descrição ajuda a equipe a entender os objetivos do
                    projeto
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!formData.name.trim()}
                  className="button-create-project"
                  style={{
                    cursor: formData.name.trim() ? "pointer" : "not-allowed",
                    background: formData.name.trim()
                      ? "linear-gradient(to right, #3b82f6, #4f46e5)"
                      : "#d1d5db",
                    color: formData.name.trim() ? "white" : "#6b7280",
                    boxShadow: formData.name.trim()
                      ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                      : "none",
                  }}
                >
                  Criar Projeto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
