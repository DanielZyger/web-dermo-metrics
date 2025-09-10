'use client'

import Link from "next/link";
import { Button } from 'primereact/button';
import Sidebar from './components/sidebar';
import { useEffect, useState } from "react";
import { genderParse } from "./utils/constants";
import { useMultipleApi } from "./hooks/use-multiple-api";

const project = { id: "proj-001", name: "Projeto Dermatoglifia", description: 'Projeto dos pacientes que estão passando por cirurgias do Hospital Estadual de Passo fundo' };

export default function HomePage() {
  const { fetchMultiple, loading, errors } = useMultipleApi();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await fetchMultiple(['/volunteers', '/projects']);
        setVolunteers(results['/volunteers'] || []);
        setProjects(results['/projects'] || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, [fetchMultiple]);

  if(loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#F3F4F6" }}>
        Carregando Dados 
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#F3F4F6" }}>
      <Sidebar canCollapse={false} />

      <main style={{ flex: 1, padding: "24px", marginTop: 20 }}>
        <header style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: 'black' }}>{project.name}</h2>
          <p style={{ color: "#555", marginTop: 12, marginBottom: 12 }}>{project.description}</p>
        </header>

        <section style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)", overflow: "hidden" }}>
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

          {volunteers.map((v) => (
            <Link key={v.id} href={`/fingerprint-form?volunteer_id=${v.id}`}>
              <div
                key={v.id}
                className="table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                  padding: "16px",
                  borderBottom: "1px solid #f3f4f6",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#f9fafb"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: "500", color: "#111827" }}>{v.name}</span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>ID: {v.id}</span>
                </div>

                <div>
                  <span style={{ fontWeight: "500", color: "#111827" }}>{v.age}</span>
                </div>

                <div>
                  <span style={{ fontWeight: "500", color: "#111827" }}>{genderParse[v.gender]}</span>
                </div>

                <div>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                      fontWeight: "500",
                      backgroundColor:
                        true === "Completo"
                          ? "#d1fae5"
                          : true === "Incompleto"
                          ? "#fee2e2"
                          : "#fef3c7",
                      color:
                        true === "Completo"
                          ? "#065f46"
                          : true === "Incompleto"
                          ? "#991b1b"
                          : "#92400e",
                    }}
                  >
                    {'Completo'}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                  <Button icon="pi pi-pencil" size="small" severity="secondary" rounded outlined aria-label="Edit"></Button>
                  <Button icon="pi pi-trash" size="small" severity="danger" rounded outlined aria-label="Edit"></Button>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}