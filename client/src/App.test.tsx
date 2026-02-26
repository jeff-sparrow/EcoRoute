import { render } from "@testing-library/react"
import { vi } from "vitest"
import App from "./App"

vi.mock("./navigation/RouterConfig", () => ({
  default: () => <div>Mocked Router</div>,
}))

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />)
  })
})