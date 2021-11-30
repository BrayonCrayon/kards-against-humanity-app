import React, { useContext } from "react";
import { renderHook } from "@testing-library/react-hooks";
import useFetchGameState from "./UseFetchGameState";
import { apiClient } from "../../Api/apiClient";
import { gameStateExampleResponse } from "../../Api/fixtures/gameStateExampleResponse";
import { GameContext, initialState } from "../../State/Game/GameContext";
import { Game } from "../../Types/Game";

jest.mock("../../Api/apiClient");
const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

const setUsers = jest.fn();
const setUser = jest.fn();
const setGame = jest.fn();
const setHand = jest.fn();
const setBlackCard = jest.fn();

const wrapper = ({ children }) => {
  const { ...rest } = initialState;

  return (
    <GameContext.Provider
      value={{
        ...rest,
        setUsers,
        setUser,
        setGame,
        setHand,
        setBlackCard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

describe("UseFetchGameState", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce(gameStateExampleResponse);
  });

  it("returns correct data", async () => {
    const { result } = renderHook(() => useFetchGameState(), { wrapper });
    const gameId = "123";
    await result.current(gameId);

    const { data } = gameStateExampleResponse;

    expect(setUser).toHaveBeenCalledWith(data.current_user);
    expect(setUsers).toHaveBeenCalledWith(data.users);
    expect(setGame).toHaveBeenCalledWith({
      id: data.id,
      judge_id: data.judge.id,
      name: data.name,
      code: data.code,
    } as Game);
    expect(setHand).toHaveBeenCalledWith(data.hand);
    expect(setBlackCard).toHaveBeenCalledWith(data.current_black_card);
  });
});
