import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useFetchGameState from "./UseFetchGameState";
import { apiClient } from "../../Api/apiClient";
import { Game } from "../../Types/Game";
import { gameStateSubmittedWhiteCardsExampleResponse } from "../../Api/fixtures/gameStateSubmittedWhiteCardsExampleResponse";
import { constructWhiteCardArray } from "../../Types/WhiteCard";

jest.mock("../../Api/apiClient");
const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

const setUsers = jest.fn();
const setUser = jest.fn();
const setGame = jest.fn();
const setHand = jest.fn();
const setBlackCard = jest.fn();
const setHasSubmittedWhiteCards = jest.fn();

describe("UseFetchGameState", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce(
      gameStateSubmittedWhiteCardsExampleResponse
    );
  });

  it("returns correct data", async () => {
    const { result } = renderHook(() =>
      useFetchGameState(
        setUsers,
        setUser,
        setGame,
        setHand,
        setBlackCard,
        setHasSubmittedWhiteCards
      )
    );
    const gameId = "123";
    await result.current(gameId);

    const { data } = gameStateSubmittedWhiteCardsExampleResponse;

    expect(mockedAxios.get).toHaveBeenCalledWith(`/api/game/${gameId}`);

    expect(setUser).toHaveBeenCalledWith(data.current_user);
    expect(setUsers).toHaveBeenCalledWith(data.users);
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
  });
});
