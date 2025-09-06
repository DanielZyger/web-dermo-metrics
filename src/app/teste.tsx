'use client'

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processed, setProcessed] = useState<string | null>(null);

  const [volunteerId, setVolunteerId] = useState("");
  const [hand, setHand] = useState("left");
  const [finger, setFinger] = useState("thumb");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
      setProcessed(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!image) return;

  const formData = new FormData();
  formData.append("volunteer_id", volunteerId);
  formData.append("hand", hand);
  formData.append("finger", finger);
  formData.append("notes", notes);
  formData.append("image_data", image);

  setLoading(true);
  setProcessed(null);

  try {
    const res = await fetch("http://127.0.0.1:8000/fingerprints", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Erro ao enviar");

    const data = await res.json();

    // data.image_filtered é Base64
    setProcessed(data.image_filtered); 
  } catch (err) {
    console.error("Erro no upload", err);
  } finally {
    setLoading(false);
  }
};


  const formStyle = {
    background: "#fff",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    gap: "16px",
  };

  const labelStyle = { marginBottom: "4px", color: "#333", fontWeight: 500 };
  const inputStyle = { backgroundColor: '#918f8fff', padding: "12px", borderRadius: "12px", border: "1px solid #ccc", width: "100%", boxSizing: 'border-box', color: "black" };
  const buttonStyle = { width: '100%', padding: "14px", borderRadius: "16px", border: "none", background: "#007bff", color: "#fff", fontWeight: 600, fontSize: "16px", cursor: "pointer" };
  const imgContainerStyle = { display: "flex", gap: "32px", marginTop: "32px", justifyContent: "center" };
  const imgStyle = { width: "300px", height: "300px", objectFit: "contain", borderRadius: "16px", border: "1px solid #ccc", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px" }}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={{flexDirection: 'row',
              width: "100%",
        }}>
        <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "700", marginBottom: "16px", color: "#000" }}>
          Upload Impressão Digital
        </h2>

        <div>
          <label style={labelStyle}>ID do Voluntário</label>
          <input type="number" value={volunteerId} onChange={(e) => setVolunteerId(e.target.value)} style={inputStyle} required />
        </div>

        <div>
          <label style={labelStyle}>Mão</label>
          <select value={hand} onChange={(e) => setHand(e.target.value)} style={inputStyle}>
            <option value="left">Esquerda</option>
            <option value="right">Direita</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Dedo</label>
          <select value={finger} onChange={(e) => setFinger(e.target.value)} style={inputStyle}>
            <option value="thumb">Polegar</option>
            <option value="index">Indicador</option>
            <option value="middle">Dedo Médio</option>
            <option value="ring">Anelar</option>
            <option value="little">Mindinho</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Notas</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inputStyle, height: "80px" }} />
        </div>

        <div style={{}}>
          <label style={labelStyle}>Upload da Imagem</label>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: "100%", color: "#000", marginTop: 10, marginBottom: 10}} />
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          <p style={{alignItems: 'center', justifyContent: 'center'}}>{loading ? "Processando..." : "Enviar"} </p>
        </button>
        </div>
      </form>

      {preview && (
        <div style={imgContainerStyle}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ marginBottom: "8px", fontWeight: "bold", fontSize: 20, color: "white" }}>Original</p>
            <img src={preview} alt="Imagem original" style={imgStyle} />
          </div>

          {/* {processed && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <p style={{ marginBottom: "8px", fontWeight: 500, color: "#000" }}>Processada</p>
              <img src={processed} alt="Imagem processada" style={imgStyle} />
            </div>
          )} */}
          {processed && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ marginBottom: "8px", fontWeight: "bold", fontSize: 20, color: "white" }}>Processada</p>
            <img
              src={`data:image/png;base64,${processed}`} // aqui usamos data URL
              alt="Imagem processada"
              style={{
                width: "300px",
                height: "300px",
                objectFit: "contain",
                borderRadius: "16px",
                border: "1px solid #ccc",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        )}
        </div>
      )}
    </div>
  );
}
