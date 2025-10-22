"use client";

import { Button } from "primereact/button";
import { useState } from "react";
import Sidebar from "../components/sidebar";
import { useApi } from "../hooks/use-api";
import { Project } from "../utils/types/project";
import { useApiItem } from "../hooks/use-api-item";
import { User } from "../utils/types/user";
import { useRouter, useSearchParams } from "next/navigation";
import { Volunteer } from "../utils/types/volunteer";
import VolunteerTable from "../components/volunteer-table";

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");

  const { data: user } = useApiItem<User>(`/users/${user_id}`);

  const { data: volunteers, loading: loadingVolunteers } =
    useApi<Volunteer>(`/volunteers`);

  if (!user || loadingVolunteers) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          backgroundColor: "#F3F4F6",
        }}
      >
        Selecione um projeto para visualizar os voluntários.
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
                `/create-volunteers?user_id=${user?.id}&project_id=${selectedProject?.id}`,
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
              flexDirection: "row",
              display: "flex",
              width: "100%",
              padding: "12px 16px",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#1E3A8A",
              fontWeight: "600",
              fontSize: "15px",
              color: "white",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1fr",
                width: "90%",
              }}
            >
              <div>Voluntário</div>
              <div>Idade</div>
              <div>Altura</div>
              <div>Peso</div>
              <div>Sexo</div>
              <div>Status</div>
            </div>
            <div style={{ textAlign: "center" }}>Ações</div>
          </div>

          {volunteers && volunteers.length > 0 ? (
            volunteers.map((volunteer) => (
              <VolunteerTable
                user={user}
                key={volunteer.id}
                volunteer={volunteer}
                project={selectedProject}
              />
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
