import type { StateCreator } from "zustand";

export interface IMapLocationSlice {
  id: number;
  label: string;
  lat: number;
  lng: number;
}

export interface IMapLocationStore {
  selectedLocation: IMapLocationSlice | null;
  greenPreference: number;
  vehicleMode: string | null;
  setSelectedLocation: (location: IMapLocationSlice) => void;
  clearSelectedLocation: () => void;
  setGreenPreference: (value: number) => void;
  setVehicleMode: (mode: string) => void;
}

export const createMapLocationSlice: StateCreator<IMapLocationStore> = (
  set,
) => ({
  selectedLocation: null,
  greenPreference: 1,
  vehicleMode: null,

  setGreenPreference: (value) => set({ greenPreference: value }),

  setSelectedLocation: (location) => set({ selectedLocation: location }),

  setVehicleMode: (mode) => set({ vehicleMode: mode }),

  clearSelectedLocation: () =>
    set({
      selectedLocation: null,
      greenPreference: 0,
    }),
});
