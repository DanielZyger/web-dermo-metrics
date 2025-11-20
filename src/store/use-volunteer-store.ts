import { create } from "zustand";
import { persist } from "zustand/middleware";

type VolunteerStore = {
  selectedVolunteerId: number | null;
  setSelectedVolunteerId: (id: number | null) => void;
  clearSelectedVolunteer: () => void;
};

export const useVolunteerStore = create<VolunteerStore>()(
  persist(
    (set) => ({
      selectedVolunteerId: null,

      setSelectedVolunteerId: (id) => set({ selectedVolunteerId: id }),

      clearSelectedVolunteer: () => set({ selectedVolunteerId: null }),
    }),
    {
      name: "volunteer-storage", // só vai guardar o id
    },
  ),
);
