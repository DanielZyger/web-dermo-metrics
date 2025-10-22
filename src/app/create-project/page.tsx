"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "../components/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserWithLocalStorage } from "../hooks/use-user-local-storage";
import { API_BASE_URL } from "../utils/constants";
import { Toast } from "primereact/toast";
import "./styles.css";

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
                  <i className="pi pi-folder" />
                  <div className="plus-badge">
                    <i className="pi pi-plus" />
                  </div>
                </div>
              </div>

              <h1 className="welcome-title">Pronto para começar?</h1>
              <p className="welcome-description">
                Você ainda não está vinculado a nenhum projeto. Vamos criar o
                seu primeiro projeto!
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
                  <h2>Criar Novo Projeto</h2>
                  <p>Preencha as informações básicas do seu projeto</p>
                </div>

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
                    Criar Projeto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
