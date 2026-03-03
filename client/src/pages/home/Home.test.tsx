import { render, screen } from "@testing-library/react"
import { vi } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Home from "./index"

// mock leaflet
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => <div>{children}</div>,
  TileLayer: () => <div>TileLayer</div>,
  Marker: () => <div>Marker</div>,
  ZoomControl: () => <div>ZoomControl</div>,
}))

// mock user location hook
vi.mock("../../hooks/useUserLocation", () => ({
  useUserLocation: () => ({
    location: null,
    loading: true,
  }),
}))

describe("Home", () => {
  it("shows loading spinner when loading is true", () => {
    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    )

    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })
})