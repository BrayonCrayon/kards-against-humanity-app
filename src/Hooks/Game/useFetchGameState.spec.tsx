import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useFetchGameState from "./useFetchGameState";
import { apiClient } from "../../Api/apiClient";
import { Game } from "../../Types/Game";
import { gameStateSubmittedWhiteCardsExampleResponse } from "../../Api/fixtures/gameStateSubmittedWhiteCardsExampleResponse";
import { constructWhiteCardArray } from "../../Types/WhiteCard";
import { transformUser, transformUsers } from "../../Types/User";
import * as Users from "../../State/Users/UsersContext";

jest.mock("../../Api/apiClient");
const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

const setUser = jest.fn();
const setGame = jest.fn();
const setHand = jest.fn();
const setBlackCard = jest.fn();
const setHasSubmittedWhiteCards = jest.fn();
const setJudge = jest.fn();

describe("useFetchGameState", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce(
      gameStateSubmittedWhiteCardsExampleResponse
    );
  });

  it("returns correct data", async () => {
    const mockedDispatch = jest.fn();
    jest.spyOn(Users, "useUsers").mockImplementation(() => ({
      dispatch: mockedDispatch,
      state: {
        users: [],
      },
    }));
    const { result } = renderHook(() =>
      useFetchGameState(
        setUser,
        setGame,
        setHand,
        setBlackCard,
        setHasSubmittedWhiteCards,
        setJudge
      )
    );
    const gameId = "123";
    await result.current(gameId);

    const { data } = gameStateSubmittedWhiteCardsExampleResponse;

    expect(mockedAxios.get).toHaveBeenCalledWith(`/api/game/${gameId}`);

    expect(setUser).toHaveBeenCalledWith(transformUser(data.current_user));
    expect(mockedDispatch).toHaveBeenCalledWith({
      users: transformUsers(data.users),
    });
    expect(setGame).toHaveBeenCalledWith({
      id: data.id,
      judge_id: data.judge.id,
      name: data.name,
      code: data.code,
    } as Game);

    expect(setHand).toHaveBeenCalledWith(
      constructWhiteCardArray(
        data.hand,
        data.hasSubmittedWhiteCards,
        data.submittedWhiteCardIds
      )
    );
    expect(setBlackCard).toHaveBeenCalledWith(data.current_black_card);
    expect(setHasSubmittedWhiteCards).toHaveBeenCalledWith(
      data.hasSubmittedWhiteCards
    );
    expect(setJudge).toHaveBeenCalledWith(transformUser(data.judge));
  });
});
