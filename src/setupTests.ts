import "@testing-library/jest-dom/vitest";
import { apiClient } from "@/Api/apiClient";
import gameService from "@/Services/GameService";
import { config } from "react-transition-group";
import { Mocked, vi } from "vitest";

window.scrollTo = vi.fn();
config.disabled = true;

vi.mock("@/Api/apiClient");
export const mockedAxios = apiClient as Mocked<typeof apiClient>;

vi.mock("@/Services/GameService");
export const service = gameService as Mocked<typeof gameService>;

vi.mock("@/Utilities/toasts");

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

vi.mock("pusher-js");
vi.mock("sweetalert2");

export const mockedUsedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));