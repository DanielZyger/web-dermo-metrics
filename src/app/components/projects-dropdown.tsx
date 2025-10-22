"use client";

import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { Project } from "../utils/types/project";
import { useRef, useState } from "react";
import "./projects-dropdown/styles.css";
import { useDelete } from "../hooks/use-delete";
import { Toast } from "primereact/toast";
import { useRouter, useSearchParams } from "next/navigation";

const ProjectsDropdown = ({
  isCollapsed,
  projects,
  refetchList,
  selectedProject,
  handleProjectSelect,
}: ProjectsDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user_id = searchParams.get("user_id");
  const toast = useRef<Toast | null>(null);
  const menuRefs = useRef<{ [key: string]: OverlayPanel | null }>({});
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);

  const { deleteItem, loading } = useDelete("/projects");

  const toggleProjects = () => {
    setIsProjectsExpanded(!isProjectsExpanded);
  };

  const handleDelete = async (id: number) => {
    const sucesso = await deleteItem(id);

    if (sucesso) {
      refetchList();

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: `Item deletado com sucesso!`,
        life: 5000,
      });
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Toast ref={toast} />

      <Button
        className="project-dropdown projects-collapse"
        icon="pi pi-folder"
        label={!isCollapsed ? "Projetos" : undefined}
        text
        style={{
          justifyContent: isCollapsed ? "center" : "space-between",
          padding: isCollapsed ? "12px 8px" : "12px 16px",
        }}
        tooltip={isCollapsed ? "Projetos" : undefined}
        tooltipOptions={{ position: "right" }}
        onClick={toggleProjects}
      >
        {!isCollapsed && (
          <i
            className={`pi pi-chevron-${isProjectsExpanded ? "up" : "down"}`}
            style={{
              fontSize: "12px",
              marginLeft: "8px",
              transition: "transform 0.2s ease",
            }}
          />
        )}
      </Button>

      {/* Lista de projetos colapsável */}
      <div
        style={{
          overflow: "hidden",
          transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
          maxHeight: isProjectsExpanded && !isCollapsed ? "300px" : "0px",
          opacity: isProjectsExpanded && !isCollapsed ? 1 : 0,
        }}
      >
        <div
          style={{
            paddingLeft: "16px",
            marginTop: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {projects?.map((project) => (
            <div
              key={project.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                className="sidebar-project-list"
                style={{
                  flexDirection: "row",
                  display: "flex",
                  flex: 1,
                  color:
                    selectedProject?.id === project.id
                      ? "#60A5FA"
                      : "rgba(255,255,255,0.8)",
                  fontWeight:
                    selectedProject?.id === project.id ? "600" : "400",
                  backgroundColor:
                    selectedProject?.id === project.id
                      ? "rgba(96,165,250,0.1)"
                      : "transparent",
                }}
              >
                <Button
                  label={project.name}
                  text
                  size="small"
                  style={{ flex: 1 }}
                  onClick={() => handleProjectSelect(project)}
                />

                <Button
                  icon="pi pi-ellipsis-v"
                  text
                  size="small"
                  rounded
                  aria-label="Ações do projeto"
                  onClick={(e) => menuRefs.current[project.id]?.toggle(e)}
                />
              </div>

              <OverlayPanel
                ref={(el) => (menuRefs.current[project.id] = el)}
                style={{ borderRadius: 10, borderWidth: 1 }}
              >
                <div
                  style={{
                    padding: 10,
                    flex: 1,
                    gap: 10,
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                  }}
                >
                  <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    iconPos="right"
                    size="small"
                    text
                    onClick={() =>
                      router.push(
                        `/create-project?user_id=${user_id}&project_id=${project.id}`,
                      )
                    }
                  />
                  <Button
                    label="Excluir"
                    icon="pi pi-trash"
                    loading={loading}
                    iconPos="right"
                    size="small"
                    text
                    severity="danger"
                    onClick={() => handleDelete(project.id)}
                  />
                </div>
              </OverlayPanel>
            </div>
          ))}

          <Button
            label="Criar Projeto"
            icon="pi pi-plus"
            style={{
              width: "100%",
              alignSelf: "flex-start",
              padding: 5,
              color: "white",
              backgroundColor: "#06b6d4",
            }}
            loading={loading}
            size="small"
            iconPos="left"
            onClick={() => router.push(`/create-project?user_id=${user_id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectsDropdown;

type ProjectsDropdownProps = {
  isCollapsed: boolean;
  projects: Project[] | undefined;
  selectedProject: Project | undefined;
  handleProjectSelect: (project: Project) => void;
  refetchList: () => Promise<void>;
};
