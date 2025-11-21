// src/app/create-project/CreateProjectPageClient.tsx
"use client";

import "./styles.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../components/sidebar";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../utils/constants";
import { Toast } from "primereact/toast";
import { useUserStore } from "@/store/use-user-store";
import { useProjectStore } from "@/store/use-project-store";
import { useApiItem } from "../hooks/use-api-item";
import { User } from "../utils/types/user";

type CreateProjectPageClientProps = {
  userId?: string;
};

const CreateProjectPageClient = ({ userId }: CreateProjectPageClientProps) => {
  const { selectedProject } = useProjectStore();
  const toast = useRef<Toast | null>(null);
  const router = useRouter();

  const { user, setUser } = useUserStore();
  const { data: apiUser } = useApiItem<User>(`/users/${userId}`);

  useEffect(() => {
    if (apiUser) {
      setUser(apiUser);
    }
  }, [apiUser, setUser]);

  const projectId = useMemo(() => {
    return selectedProject?.id;
  }, [selectedProject]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Buscar dados do projeto se estiver editando
  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do projeto");
      }

      const project = await response.json();
      setFormData({
        name: project.name || "",
        description: project.description || "",
      });
      setIsEditMode(true);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar os dados do projeto",
        life: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const handleSubmit = useCallback(async () => {
    if (!user) return;

    const formDataObj = new FormData();
    console.log("formData", formData);
    formDataObj.append("name", formData.name);
    formDataObj.append("description", formData.description);
    formDataObj.append("user_id", user.id.toString());

    const url = isEditMode
      ? `${API_BASE_URL}/projects/${projectId}`
      : `${API_BASE_URL}/projects`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar registro: ${response.statusText}`);
      }

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: isEditMode
          ? "Projeto atualizado com sucesso!"
          : "Projeto criado com sucesso!",
        life: 5000,
      });

      router.push(`/home`);
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: isEditMode
          ? "Não foi possível atualizar o projeto"
          : "Não foi possível criar o projeto",
        life: 5000,
      });
    }
  }, [formData, user, router, isEditMode, projectId]);

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId, fetchProjectData]);

  return (
    <div className="create-project-container">
      <Toast ref={toast} />

      <Sidebar canCollapse={false} showProject={false} />

      <div className="create-project-content">
        <div className="header-actions">
          <button
            onClick={() => router.push(`/home?user_id=${user?.id}`)}
            className="home-button"
          >
            <i className="pi pi-home" />
            <span>Voltar para Home</span>
          </button>
        </div>

        <div className="main-content">
          <div className="content-wrapper">
            <div className="welcome-section">
              <div className="icon-wrapper">
                <div className="floating-circle circle-1"></div>
                <div className="floating-circle circle-2"></div>
                <div className="floating-circle circle-3"></div>

                <div className="main-icon">
                  <i
                    className={`pi ${isEditMode ? "pi-pencil" : "pi-folder"}`}
                  />
                  <div className="plus-badge">
                    <i
                      className={`pi ${isEditMode ? "pi-check" : "pi-plus"}`}
                    />
                  </div>
                </div>
              </div>

              <h1 className="welcome-title">
                {isEditMode ? "Editar Projeto" : "Pronto para começar?"}
              </h1>
              <p className="welcome-description">
                {isEditMode
                  ? "Atualize as informações do seu projeto conforme necessário."
                  : "Você ainda não está vinculado a nenhum projeto. Vamos criar o seu primeiro projeto!"}
              </p>

              <div className="features-list">
                <div className="feature-badge">
                  <i className="pi pi-users feature-icon-blue" />
                  <span>Colaboração em equipe</span>
                </div>
                <div className="feature-badge">
                  <i className="pi pi-th-large feature-icon-green" />
                  <span>Informações claras</span>
                </div>
                <div className="feature-badge">
                  <i className="pi pi-folder-plus feature-icon-purple" />
                  <span>Organização total</span>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-card">
                <div className="form-header">
                  <h2>
                    {isEditMode ? "Editar Projeto" : "Criar Novo Projeto"}
                  </h2>
                  <p>
                    {isEditMode
                      ? "Modifique as informações do projeto"
                      : "Preencha as informações básicas do seu projeto"}
                  </p>
                </div>

                {isLoading ? (
                  <div className="loading-state">
                    <i
                      className="pi pi-spin pi-spinner"
                      style={{ fontSize: "2rem" }}
                    />
                    <p>Carregando dados do projeto...</p>
                  </div>
                ) : (
                  <div className="form-fields">
                    <div className="field-group">
                      <label>Nome do Projeto *</label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Ex: Sistema de Gestão, App Mobile, Website..."
                          className="text-input"
                        />
                        <div className="input-icon">
                          <i className="pi pi-folder-plus" />
                        </div>
                      </div>
                    </div>

                    <div className="field-group">
                      <label>Descrição do Projeto</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Descreva o objetivo, escopo e principais características do seu projeto..."
                        rows={4}
                        className="textarea-input"
                      />
                      <p className="field-hint">
                        Uma boa descrição ajuda a equipe a entender os objetivos
                        do projeto
                      </p>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={!formData.name.trim()}
                      className={`submit-button ${!formData.name.trim() ? "disabled" : ""}`}
                    >
                      {isEditMode ? "Atualizar Projeto" : "Criar Projeto"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPageClient;
