import React from "react";
import useFetchGameState from "./useFetchGameState";
import { gameStateSubmittedWhiteCardsExampleResponse } from "Api/fixtures/gameStateSubmittedWhiteCardsExampleResponse";
import { transformWhiteCardArray } from "Types/WhiteCard";
import { transformUser, transformUsers } from "Types/User";
import { expectDispatch, spyOnUseAuth, spyOnUseGame, spyOnUseHand, spyOnUsePlayers } from "Tests/testHelpers";
import { usePlayers } from "State/Players/usePlayers";
import { renderHook } from "@testing-library/react-hooks";
import { initialHandState } from "State/Hand/HandState";
import { initialPlayersState } from "State/Players/PlayersState";
import { initialAuthState } from "State/Auth/AuthState";
import { initialGameState } from "State/Game/GameState";
import { service } from "setupTests";
import { AxiosResponse } from "axios";
import { fetchState } from "Services/GameService";

let mockedDispatch = jest.fn();

describe("useFetchGameState", () => {
  beforeEach(() => {
    spyOnUseHand(initialHandState, mockedDispatch);
    spyOnUsePlayers(initialPlayersState, mockedDispatch);
    spyOnUseAuth(initialAuthState, mockedDispatch);
    spyOnUseGame(initialGameState, mockedDispatch);
    service.fetchState.mockResolvedValueOnce(
      gameStateSubmittedWhiteCardsExampleResponse as AxiosResponse
    );
  });

  it("returns correct data", async () => {
    const { result } = renderHook(useFetchGameState);
    const gameId = "123";
    await result.current(gameId);

    const { data } = gameStateSubmittedWhiteCardsExampleResponse;

    expect(fetchState).toHaveBeenCalledWith(gameId);
    expectDispatch(usePlayers().dispatch, transformUsers(data.users));
    expectDispatch(mockedDispatch, {
      id: data.id,
      judge_id: data.judge.id,
      name: data.name,
      code: data.code,
      redrawLimit: data.redrawLimit,
    });

    expectDispatch(
      mockedDispatch,
        transformWhiteCardArray(
            data.hand,
            data.hasSubmittedWhiteCards,
            data.submittedWhiteCardIds
        )
    );

    expectDispatch(mockedDispatch, transformUser(data.currentUser));

    expectDispatch(mockedDispatch, data.hasSubmittedWhiteCards);

    expectDispatch(mockedDispatch, data.blackCard);

    expectDispatch(mockedDispatch, transformUser(data.judge));
  });
});
