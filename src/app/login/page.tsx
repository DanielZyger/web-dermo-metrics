"use client";

import React, { useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { API_BASE_URL } from "../utils/constants";
import { redirect } from "next/navigation";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      window.location.href = `${API_BASE_URL}/auth/google/login`;

      setTimeout(() => {
        toast.current?.show({
          severity: "success",
          summary: "Acesso Autorizado",
          detail: "Bem-vindo ao Sistema de Dermatoglifia!",
          life: 3000,
        });

        setLoading(false);
        redirect("/home");
      }, 1500);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Acesso Negado",
        detail: "Falha na autenticação. Tente novamente.",
        life: 3000,
      });
      setLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  // Ícone de Impressão Digital
  const FingerprintIcon = () => (
    <svg
      width="120"
      height="120"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M6.87 17c.16-.7.26-1.4.26-2.12C7.13 12.54 6 10.38 6 8c0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.38-1.13 4.54-1.13 6.88" />
      <path d="M12 2v2" />
      <path d="M3 8c0-1 0-1 1-1" />
      <path d="M21 8c0-1 0-1-1-1" />
      <path d="M5.6 5.6c.7-.7.7-.7 1.4 0" />
      <path d="M18.4 5.6c-.7-.7-.7-.7-1.4 0" />
    </svg>
  );

  // Padrões de impressão digital como decoração
  const FingerprintPattern = ({ style }) => (
    <div
      style={{
        position: "absolute",
        opacity: 0.05,
        ...style,
      }}
    >
      <svg
        width="200"
        height="200"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="35" />
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="25" />
        <circle cx="50" cy="50" r="20" />
        <circle cx="50" cy="50" r="15" />
        <circle cx="50" cy="50" r="10" />
        <path d="M20 50 Q50 20 80 50" />
        <path d="M20 50 Q50 80 80 50" />
        <path d="M30 30 Q50 50 70 70" />
        <path d="M30 70 Q50 50 70 30" />
      </svg>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e1b4b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Toast ref={toast} />

      {/* Padrões de fundo */}
      <FingerprintPattern
        style={{ top: "10%", left: "10%", transform: "rotate(15deg)" }}
      />
      <FingerprintPattern
        style={{ bottom: "10%", right: "10%", transform: "rotate(-30deg)" }}
      />
      <FingerprintPattern
        style={{ top: "60%", left: "5%", transform: "rotate(45deg)" }}
      />
      <FingerprintPattern
        style={{ top: "20%", right: "15%", transform: "rotate(-15deg)" }}
      />

      {/* Grid Pattern Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
          backgroundSize: "50px 50px",
        }}
      />

      <Card
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 32px 64px rgba(0, 0, 0, 0.3)",
          maxWidth: "480px",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            padding: "60px 40px 40px",
            background: "linear-gradient(135deg, #1e40af 0%, #3730a3 100%)",
            color: "white",
            margin: "-1px -1px 0 -1px",
            position: "relative",
          }}
        >
          {/* Fingerprint Icon Container */}
          <div
            style={{
              width: "140px",
              height: "140px",
              background: "rgba(255, 255, 255, 0.15)",
              borderRadius: "50%",
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid rgba(255, 255, 255, 0.2)",
              position: "relative",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background:
                  "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)",
                animation: "spin 3s linear infinite",
              }}
            ></div>
            <FingerprintIcon />
          </div>

          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "0 0 12px 0",
              letterSpacing: "-0.5px",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            DermoMetrics
          </h1>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              margin: "0 0 8px 0",
              opacity: 0.9,
              letterSpacing: "0.5px",
            }}
          >
            SISTEMA DE DERMATOGLIFIA
          </h2>
          <p
            style={{
              fontSize: "16px",
              opacity: 0.8,
              margin: 0,
              fontWeight: "300",
              lineHeight: "1.4",
            }}
          >
            Gerenciamento Profissional de
            <br />
            Análises Dermatoglíficas
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "50px 40px" }}>
          <Button
            onClick={handleGoogleLogin}
            loading={loading}
            style={{
              background: "linear-gradient(135deg, #1e40af 0%, #3730a3 100%)",
              border: "none",
              borderRadius: "16px",
              padding: "18px 32px",
              fontSize: "17px",
              fontWeight: "600",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 24px rgba(30, 64, 175, 0.4)",
              width: "100%",
              marginBottom: "24px",
            }}
            className="p-button-lg"
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 12px 32px rgba(30, 64, 175, 0.5)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 24px rgba(30, 64, 175, 0.4)";
            }}
          >
            <GoogleIcon />
            Acessar com Google
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
