import React from "react";
import useFetchGameState from "./useFetchGameState";
import { apiClient } from "../../Api/apiClient";
import { gameStateSubmittedWhiteCardsExampleResponse } from "../../Api/fixtures/gameStateSubmittedWhiteCardsExampleResponse";
import { constructWhiteCardArray } from "../../Types/WhiteCard";
import { transformUser, transformUsers } from "../../Types/User";
import { kardsHookRender } from "../../Tests/testRenders";

jest.mock("../../Api/apiClient");
const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

let mockedDispatch = jest.fn();

jest.mock("../../State/Users/UsersContext", () => ({
  ...jest.requireActual("../../State/Users/UsersContext"),
  useUsers: () => ({
    dispatch: mockedDispatch,
    state: {
      users: [],
    },
  }),
}));

jest.mock("../../State/Hand/HandContext", () => ({
  ...jest.requireActual("../../State/Hand/HandContext"),
  useHand: () => ({
    dispatch: mockedDispatch,
    state: {
      hand: [],
    },
  }),
}));

jest.mock("../../State/User/UserContext", () => ({
  ...jest.requireActual("../../State/User/UserContext"),
  useUser: () => ({
    dispatch: mockedDispatch,
    state: {
      user: {
        id: 0,
        name: "",
        whiteCards: [],
        hasSubmittedWhiteCards: false,
      },
      hasSubmittedCards: false,
    },
  }),
}));

jest.mock("../../State/Game/GameContext", () => ({
  ...jest.requireActual("../../State/Game/GameContext"),
  useGame: () => ({
    dispatch: mockedDispatch,
    state: {
      judge: {
        id: 0,
        name: "",
        whiteCards: [],
        hasSubmittedWhiteCards: false,
      },
      game: {
        id: "",
        name: "",
        judge_id: 0,
        code: "",
      },
      blackCard: {
        id: 0,
        text: "",
        pick: 0,
        expansion_id: 0,
      },
    },
  }),
}));

describe("useFetchGameState", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce(
      gameStateSubmittedWhiteCardsExampleResponse
    );
  });

  it("returns correct data", async () => {
    const { result } = kardsHookRender(useFetchGameState);
    const gameId = "123";
    await result.current(gameId);

    const { data } = gameStateSubmittedWhiteCardsExampleResponse;

    expect(mockedAxios.get).toHaveBeenCalledWith(`/api/game/${gameId}`);

    expect(mockedDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        execute: expect.any(Function),
        payload: transformUsers(data.users),
      })
    );
    expect(mockedDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        execute: expect.any(Function),
        payload: {
          id: data.id,
          judge_id: data.judge.id,
          name: data.name,
          code: data.code,
        },
      })
    );

    expect(mockedDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        execute: expect.any(Function),
        payload: constructWhiteCardArray(
          data.hand,
          data.hasSubmittedWhiteCards,
          data.submittedWhiteCardIds
        ),
      })
    );

    expect(mockedDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        execute: expect.any(Function),
        payload: transformUser(data.current_user),
      })
    );

    expect(mockedDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        execute: expect.any(Function),
        payload: data.hasSubmittedWhiteCards,
      })
    );

    expect(mockedDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        execute: expect.any(Function),
        payload: data.current_black_card,
      })
    );
    expect(mockedDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        execute: expect.any(Function),
        payload: data.judge,
      })
    );
  });
});
