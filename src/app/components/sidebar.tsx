"use client";

import {
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from "react";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useApiItem } from "../hooks/use-api-item";
import { User } from "../utils/types/user";
import { Project } from "../utils/types/project";
import { useSearchParams } from "next/navigation";
import ProjectsDropdown from "./projects-dropdown";

export default function Sidebar({
  selectedProject,
  setSelectedProject,
  showProject = true,
  canCollapse = false,
}: SidebarParams) {
  const searchParams = useSearchParams();
  const user_id = searchParams.get("user_id");

  const { data: user } = useApiItem<User>(`/users/${user_id}`);

  const projects = useMemo(() => {
    if (!user) return;
    return user.projects;
  }, [user]);

  const [isCollapsed, setIsCollapsed] = useState(canCollapse);

  const handleToggle = () => {
    if (!canCollapse) return;
    const newState = !isCollapsed;
    setIsCollapsed(newState);
  };

  const handleProjectSelect = useCallback(
    (project: Project) => {
      if (setSelectedProject) {
        setSelectedProject(project);
      }
    },
    [setSelectedProject],
  );

  useEffect(() => {
    if (projects?.length === 1) {
      handleProjectSelect(projects[0]);
    }
  }, [handleProjectSelect, projects]);

  return (
    <>
      {isCollapsed && (
        <Tooltip target=".sidebar-menu-item, .user-info, .project-dropdown" />
      )}

      <aside
        style={{
          width: isCollapsed ? "100px" : "300px",
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
            marginBottom: "30px",
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

        {/* Dados do usuário */}
        <div
          className="user-info"
          style={{
            display: "flex",
            alignItems: "center",
            gap: isCollapsed ? "0" : "12px",
            marginBottom: "30px",
            padding: isCollapsed ? "8px" : "12px",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "8px",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          {!isCollapsed && user && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "2px",
                  padding: 5,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "12px",
                  padding: 5,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.email}
              </div>
            </div>
          )}
        </div>

        {showProject && (
          <ProjectsDropdown
            isCollapsed={isCollapsed}
            projects={projects}
            selectedProject={selectedProject}
            handleProjectSelect={handleProjectSelect}
          />
        )}
      </aside>
    </>
  );
}

type SidebarParams = {
  showProject?: boolean;
  selectedProject?: Project | undefined;
  setSelectedProject?: Dispatch<SetStateAction<Project | undefined>>;
  canCollapse?: boolean;
};
