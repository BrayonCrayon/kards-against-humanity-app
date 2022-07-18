import { kardsHookRender } from "Tests/testRenders";
import useJoinAsSpectator from "Hooks/Game/useJoinAsSpectator";
import { expectDispatch } from "Tests/testHelpers";
import { transformUser, transformUsers } from "Types/User";
import { gameSpectatorExampleResponse } from "Api/fixtures/gameSpectatorExampleResponse";
import { mockedAxios } from "setupTests";
import GameService from "Services/GameService";
import { waitFor } from "@testing-library/react";
import { act } from "@testing-library/react-hooks";

const {data: {users, user, game} } = gameSpectatorExampleResponse;

let mockedDispatch = jest.fn();
jest.mock("State/Game/GameContext", () => ({
  ...jest.requireActual("State/Game/GameContext"),
  useGame: () => ({
    dispatch: mockedDispatch,
  })
}))

jest.mock("State/Users/UsersContext", () => ({
  ...jest.requireActual("State/Users/UsersContext"),
  useUsers: () => ({
    dispatch: mockedDispatch,
  })
}))

jest.mock("State/User/UserContext", () => ({
  ...jest.requireActual("State/User/UserContext"),
  useUser: () => ({
    dispatch: mockedDispatch,
  })
}))

describe('useJoinAsSpectator', () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValueOnce(
      gameSpectatorExampleResponse
    );
  });

  it("will call join spectator endpoint and set state", async () => {
    const { result } = kardsHookRender(useJoinAsSpectator);

    await result.current("1223");

    expectDispatch(mockedDispatch, transformUsers(users));
    expectDispatch(mockedDispatch, transformUser(user));
    expectDispatch(mockedDispatch, game);
  });
})