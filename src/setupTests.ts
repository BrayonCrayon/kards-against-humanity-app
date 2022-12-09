import "@testing-library/jest-dom";
import { apiClient } from "Api/apiClient";
import gameService from "Services/GameService";

window.scrollTo = jest.fn();

jest.mock("Api/apiClient");
export const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

jest.mock("Services/GameService");
export const service = gameService as jest.Mocked<typeof gameService>;

jest.mock("Utilities/toasts");

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});
