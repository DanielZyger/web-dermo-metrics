import { create } from "zustand";
import { persist } from "zustand/middleware";

type VolunteerStore = {
  selectedVolunteerId: number | null;
  fingerprintsVersion: number; // 👈 valor que vamos usar
  setSelectedVolunteerId: (id: number | null) => void;
  clearSelectedVolunteer: () => void;
  bumpFingerprintsVersion: () => void; // 👈 ação para atualizar o valor
};

export const useVolunteerStore = create<VolunteerStore>()(
  persist(
    (set) => ({
      selectedVolunteerId: null,
      fingerprintsVersion: 0,

      setSelectedVolunteerId: (id) => set({ selectedVolunteerId: id }),

      clearSelectedVolunteer: () =>
        set({ selectedVolunteerId: null, fingerprintsVersion: 0 }),

      bumpFingerprintsVersion: () =>
        set((state) => ({
          fingerprintsVersion: state.fingerprintsVersion + 1,
        })),
    }),
    {
      name: "volunteer-storage", // só vai guardar o id
      // garante que só o id é persistido no localStorage
      partialize: (state) => ({
        selectedVolunteerId: state.selectedVolunteerId,
      }),
    },
  ),
);
