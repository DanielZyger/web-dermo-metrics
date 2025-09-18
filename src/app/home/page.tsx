"use client";

import Link from "next/link";
import { Button } from "primereact/button";
import { useState } from "react";
import Sidebar from "../components/sidebar";
import { genderParse } from "../utils/constants";
import { useApi } from "../hooks/use-api";
import { Project } from "../utils/types/project";
import { useApiItem } from "../hooks/use-api-item";
import { User } from "../utils/types/user";
import { useRouter, useSearchParams } from "next/navigation";

const status = "Completo";

const statusStyles: Record<string, { backgroundColor: string; color: string }> =
  {
    Completo: { backgroundColor: "#d1fae5", color: "#065f46" },
    Incompleto: { backgroundColor: "#fee2e2", color: "#991b1b" },
    Pendente: { backgroundColor: "#fef3c7", color: "#92400e" },
  };

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");

  const { data: user } = useApiItem<User>(`/users/${user_id}`);

  const { data: volunteers, loading: loadingVolunteers } =
    useApi<Volunteer>(`/volunteers`);

  if (loadingVolunteers || !user) {
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#F3F4F6",
      }}
    >
      <Sidebar
        canCollapse={false}
        showProject={true}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />

      <main style={{ flex: 1, padding: "24px", marginTop: 20 }}>
        <header style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "black" }}>
            {selectedProject?.name || "Projeto"}
          </h2>
          <p style={{ color: "#555", marginTop: 12, marginBottom: 12 }}>
            {selectedProject?.description}
          </p>
        </header>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "15px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Button
            label="Cadastrar Voluntário"
            style={{ padding: 10 }}
            size="small"
            onClick={() => {
              router.push(
                `/create-volunteers?user_id=${user.id}&project_id=${selectedProject?.id}`,
              );
            }}
          />
        </div>
        <section
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              padding: "12px 16px",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#1E3A8A",
              fontWeight: "600",
              fontSize: "15px",
              color: "white",
            }}
          >
            <div>Voluntário</div>
            <div>Idade</div>
            <div>Sexo</div>
            <div>Status</div>
            <div style={{ textAlign: "center" }}>Ações</div>
          </div>

          {volunteers && volunteers.length > 0 ? (
            volunteers.map((v) => (
              <Link
                key={v.id}
                href={`/fingerprint-form?volunteer_id=${v.id}&user_id=${user.id}`}
              >
                <div key={v.id} className="table-row">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "500", color: "#111827" }}>
                      {v.name}
                    </span>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      ID: {v.id}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontWeight: "500", color: "#111827" }}>
                      {v.age}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontWeight: "500", color: "#111827" }}>
                      {genderParse[v.gender]}
                    </span>
                  </div>

                  <div>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        fontSize: "12px",
                        fontWeight: 500,
                        ...statusStyles[status],
                      }}
                    >
                      {status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <Button
                      icon="pi pi-pencil"
                      size="small"
                      severity="secondary"
                      rounded
                      outlined
                      aria-label="Editar"
                    ></Button>
                    <Button
                      icon="pi pi-trash"
                      size="small"
                      severity="danger"
                      rounded
                      outlined
                      aria-label="Remover"
                    ></Button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#6b7280",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
                border: "1px #d1d5db",
              }}
            >
              <i
                className="pi pi-users"
                style={{
                  fontSize: "48px",
                  color: "#d1d5db",
                  marginBottom: "16px",
                }}
              ></i>
              <h3 style={{ margin: "0 0 8px 0", color: "#374151" }}>
                Nenhum voluntário cadastrado
              </h3>
              <p style={{ fontSize: "14px", margin: 0 }}>
                Cadastre o primeiro voluntário para começar.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
