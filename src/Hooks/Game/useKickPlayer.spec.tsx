import { renderHook } from "@testing-library/react-hooks";
import useKickPlayer from "./useKickPlayer";
import { VoteProvider } from "../../State/Vote/VoteContext";
import { apiClient } from "../../Api/apiClient";

const renderUseKickPlayer = () => {
  return renderHook(useKickPlayer, {
    wrapper: ({ children }) => <VoteProvider>{children}</VoteProvider>,
  });
};

jest.mock("../../Api/apiClient");
const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

describe("useKickPlayer", () => {
  it.todo("will call api to kick player", () => {});
  it.todo("will catch error if call to api fails");
});
