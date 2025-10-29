import { User } from "@/app/utils/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  user?: User;
  setUser: (user?: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: undefined,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: undefined }),
    }),
    {
      name: "user-storage", // nome da chave no localStorage
    },
  ),
);
