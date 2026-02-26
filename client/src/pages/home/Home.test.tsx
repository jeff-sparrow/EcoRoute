import { render, screen } from "@testing-library/react"
import { vi } from "vitest"
import Home from "./index"

// mock leaflet
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => <div>{children}</div>,
  TileLayer: () => <div>TileLayer</div>,
  Marker: () => <div>Marker</div>,
  ZoomControl: () => <div>ZoomControl</div>,
}))

// mock user location hook (always loading true)
vi.mock("../../hooks/useUserLocation", () => ({
  useUserLocation: () => ({
    location: null,
    loading: true,
  }),
}))

describe("Home", () => {
  it("shows loading spinner when loading is true", () => {
    render(<Home />)

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })
})