import { Volunteer } from "@/app/utils/types/volunteer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type VolunteerStore = {
  selectedVolunteer?: Volunteer;
  setSelectedVolunteer: (volunteer?: Volunteer) => void;
  clearSelectedVolunteer: () => void;
};

export const useVolunteerStore = create<VolunteerStore>()(
  persist(
    (set) => ({
      selectedVolunteer: undefined,
      setSelectedVolunteer: (volunteer) =>
        set({ selectedVolunteer: volunteer }),
      clearSelectedVolunteer: () => set({ selectedVolunteer: undefined }),
    }),
    {
      name: "volunteer-storage", // nome da chave no localStorage
    },
  ),
);
