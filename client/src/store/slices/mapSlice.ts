import type { StateCreator } from 'zustand'

export interface IMapLocationSlice {
  id: number
  label: string
  lat: number
  lng: number
}

export interface IMapLocationStore {
  selectedLocation: IMapLocationSlice | null
  setSelectedLocation: (location: IMapLocationSlice) => void
  clearSelectedLocation: () => void
}


export const createMapLocationSlice: StateCreator<
  IMapLocationStore
> = (set) => ({
  selectedLocation: null,

  setSelectedLocation: (location) =>
    set({ selectedLocation: location }),

  clearSelectedLocation: () =>
    set({ selectedLocation: null }),
})
