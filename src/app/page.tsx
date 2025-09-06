import Link from "next/link";

const project = { id: "proj-001", name: "Projeto Dermatoglifia", description: 'Projeto dos pacientes que estão passando por cirurgias do Hospital Estadual de Passo fundo' };
const volunteers = [
  { id: 1, name: "João Silva", age: 28, sex: "Masculino", status: "Completo" },
  { id: 2, name: "Maria Souza", age: 34, sex: "Feminino", status: "Incompleto" },
  { id: 3, name: "Ana Oliveira", age: 22, sex: "Feminino", status: "Completo" },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#f9fafb" }}>
      {/* Sidebar esquerda */}
      <aside
        style={{
          width: "240px",
          backgroundColor: "ligth-green",
          padding: "30px",
          boxShadow: "2px 0 6px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px", color: 'white' }}>
          DERMOMETRICS
        </h1>
        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontWeight: "600", color: "#111" }}>Projetos</span>
          <span style={{ fontWeight: "600", color: "#111" }}>Configurações</span>

        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main style={{ flex: 1, padding: "24px", marginTop: 30 }}>
        <header style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: "bold", color: 'black' }}>{project.name}</h2>
          <p style={{ color: "#555", marginTop: 12, marginBottom: 12 }}>{project.description}</p>
        </header>

        <section style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          {/* Cabeçalho da tabela */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              padding: "12px 16px",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
              fontWeight: "600",
              fontSize: "14px",
              color: "#374151",
            }}
          >
            <div>Voluntário</div>
            <div>Idade</div>
            <div>Sexo</div>
            <div>Status</div>
            <div style={{ textAlign: "center" }}>Ações</div>
          </div>

          {/* Linhas */}
          {volunteers.map((v, idx) => (
            <div
              key={v.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                padding: "12px 16px",
                alignItems: "center",
                borderBottom: idx === volunteers.length - 1 ? "none" : "1px solid #e5e7eb",
                fontSize: "14px",
              }}
            >
              {/* Nome */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: "500", color: "#111827" }}>{v.name}</span>
                <span style={{ fontSize: "12px", color: "#6b7280" }}>ID: {v.id}</span>
              </div>

              {/* Idade */}
              <div>
                <span style={{ fontWeight: "500", color: "#111827" }}>{v.age}</span>
              </div>

              {/* Sexo */}
              <div>
                <span style={{ fontWeight: "500", color: "#111827" }}>{v.sex}</span>
              </div>

              {/* Status */}
              <div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor:
                      v.status === "Completo"
                        ? "#d1fae5"
                        : v.status === "Incompleto"
                        ? "#fee2e2"
                        : "#fef3c7",
                    color:
                      v.status === "Completo"
                        ? "#065f46"
                        : v.status === "Incompleto"
                        ? "#991b1b"
                        : "#92400e",
                  }}
                >
                  {v.status}
                </span>
              </div>

              {/* Ações */}
              <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                <Link
                  href={`/fingerprint-form?volunteer_id=${v.id}`}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    fontSize: "12px",
                    textDecoration: "none",
                  }}
                >
                  Registrar Digitais
                </Link>
                <button
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #d1d5db",
                    fontSize: "12px",
                    color: 'black',
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>
                <button
                  style={{
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: "#f3f4f6",
                    color: 'black',
                    border: "1px solid #d1d5db",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
