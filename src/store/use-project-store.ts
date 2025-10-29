import { Project } from "@/app/utils/types/project";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProjectStore = {
  selectedProject?: Project;
  setSelectedProject: (project?: Project) => void;
  clearSelectedProject: () => void;
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      selectedProject: undefined,
      setSelectedProject: (project) => set({ selectedProject: project }),
      clearSelectedProject: () => set({ selectedProject: undefined }),
    }),
    {
      name: "project-storage", // nome da chave no localStorage
    },
  ),
);
