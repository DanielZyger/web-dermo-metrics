"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

export default function Sidebar({ canCollapse = false }) {
  const [isCollapsed, setIsCollapsed] = useState(canCollapse);

  const handleToggle = () => {
    if (!canCollapse) return;
    const newState = !isCollapsed;
    setIsCollapsed(newState);
  };

  const menuItems = [
    { label: "Projetos", icon: "pi pi-folder", href: "/" },
    { label: "Configurações", icon: "pi pi-cog", href: "/settings" },
  ];

  return (
    <>
      {/* Tooltip para itens colapsados */}
      {isCollapsed && <Tooltip target=".sidebar-menu-item" />}

      <aside
        style={{
          width: isCollapsed ? "80px" : "240px",
          backgroundColor: "#1E3A8A",
          padding: isCollapsed ? "20px 10px" : "30px",
          boxShadow: "2px 0 6px rgba(0,0,0,0.08)",
          transition: "width 0.3s ease-in-out",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header com logo e botão de toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              fontSize: isCollapsed ? "14px" : "18px",
              fontWeight: "bold",
              color: "white",
              transition: "font-size 0.3s ease-in-out",
              whiteSpace: "nowrap",
              overflow: "hidden",
              margin: 0,
            }}
          >
            {isCollapsed ? "DM" : "DERMOMETRICS"}
          </h1>

          {canCollapse && (
            <Button
              icon={`pi ${isCollapsed ? "pi-angle-right" : "pi-angle-left"}`}
              onClick={handleToggle}
              text
              rounded
              size="small"
              style={{
                color: "white",
                width: "32px",
                height: "32px",
              }}
              tooltip={isCollapsed ? "Expandir" : "Recolher"}
              tooltipOptions={{ position: "right" }}
            />
          )}
        </div>

        {/* Menu de navegação */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <Button
                icon={item.icon}
                label={!isCollapsed ? item.label : undefined}
                text
                className="sidebar-menu-item"
                style={{
                  width: "100%",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  color: "white",
                  padding: isCollapsed ? "12px 8px" : "12px 16px",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  fontSize: "14px",
                  fontWeight: "600",
                  gap: "12px",
                }}
                tooltip={isCollapsed ? item.label : undefined}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              />
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
