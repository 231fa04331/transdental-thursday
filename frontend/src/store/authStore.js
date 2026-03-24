import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      setAuth: ({ token, user, role }) => {
        set({ token, user, role });
      },
      logout: () => {
        set({ token: null, user: null, role: null });
      },
    }),
    {
      name: "tsms-auth-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
