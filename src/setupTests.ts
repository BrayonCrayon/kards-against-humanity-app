import "@testing-library/jest-dom";
import { apiClient } from "@/Api/apiClient";
import gameService from "@/Services/GameService";
import { config } from "react-transition-group";

window.scrollTo = jest.fn();
config.disabled = true;

jest.mock("@/Api/apiClient");
export const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

jest.mock("@/Services/GameService");
export const service = gameService as jest.Mocked<typeof gameService>;

jest.mock("@/Utilities/toasts");

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

jest.mock("pusher-js");
jest.mock("sweetalert2");

export const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom") as any,
  useNavigate: () => mockedUsedNavigate,
}));