import "@testing-library/jest-dom/vitest";
import { apiClient } from "@/Api/apiClient";
import gameService from "@/Services/GameService";
import { config } from "react-transition-group";
import { Mocked, vi } from "vitest";
import React from "react";

window.scrollTo = vi.fn();
config.disabled = true;

vi.mock("@/Api/apiClient");
export const mockedAxios = apiClient as Mocked<typeof apiClient>;

vi.mock("@/Services/GameService");
export const service = gameService as Mocked<typeof gameService>;

vi.mock("@/Hooks/Notification/useToasts", () => ({
  useToasts: () => ({
    happyToast: vi.fn(),
    errorToast: vi.fn(),
  }),
}));

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

vi.mock("react-confetti");
vi.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: () => <div data-testid="drum-icon" />,
}));

afterEach(() => {
  vi.clearAllMocks();
});
