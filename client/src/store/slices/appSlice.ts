import type { StateCreator } from "zustand";

export interface UserInfo {
  userId: string;
  name: string;
  email: string;
}

export interface IAppSlice {
  isSidebarOpen: boolean;
  isMiniSidebar: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;
  toggleSidebar: () => void;
  setIsSidebarOpen: (value: boolean) => void;
  setMiniSidebar: (value: boolean) => void;
  login: (user: UserInfo) => void;
  logout: () => void;
}

const getStoredUser = (): UserInfo | null => {
  const stored = localStorage.getItem("ecoroute_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

const initialUser = getStoredUser();

export const createAppSlice: StateCreator<IAppSlice> = (set) => ({
  isSidebarOpen: false,
  isMiniSidebar: false,
  isAuthenticated: !!initialUser,
  user: initialUser,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setIsSidebarOpen: (value) => set({ isSidebarOpen: value }),
  toggleMiniSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setMiniSidebar: (value) => set({ isMiniSidebar: value }),
  login: (user) => {
    localStorage.setItem("ecoroute_user", JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    localStorage.removeItem("ecoroute_user");
    set({ isAuthenticated: false, user: null });
  },
});
