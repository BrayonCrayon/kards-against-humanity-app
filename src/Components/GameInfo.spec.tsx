import React from "react";
import {
  GameContext,
  IGameContext,
  initialState,
} from "../State/Game/GameContext";
import { render, RenderResult } from "@testing-library/react";
import GameInfo from "./GameInfo";
import { gameStateJudgeExampleResponse } from "../Api/fixtures/gameStateJudgeExampleResponse";

const setHand = jest.fn();
const setHasSubmittedCards = jest.fn();
const setUsers = jest.fn();
const userJoinedGameCallback = jest.fn();

const { data } = gameStateJudgeExampleResponse;

const renderer = (value?: Partial<IGameContext>): RenderResult => {
  return render(
    <GameContext.Provider
      value={{
        ...initialState,
        setHand,
        setHasSubmittedCards,
        setUsers,
        userJoinedGameCallback,
        game: {
          id: data.id,
          name: data.name,
          code: data.code,
          judge_id: data.judge.id,
        },
        judge: {
          ...data.judge,
          whiteCards: data.hand,
        },
        user: {
          ...data.current_user,
          whiteCards: data.hand,
        },
        users: data.users,
        hand: data.hand,
        blackCard: data.current_black_card,
        ...value,
      }}
    >
      <GameInfo />
    </GameContext.Provider>
  );
};

describe("GameInfo", () => {
  describe("Users Box", () => {
    it("shows the judge icon next to the player who is the judge", async () => {
      const { findByTestId } = renderer();

      expect(await findByTestId(`user-${data.judge.id}-judge`)).not.toBeNull();
    });
    it("does not show the judge icon next to the player who is not the judge", async () => {
      const nonJudge = data.users[1];

      const { queryByTestId } = renderer({ user: nonJudge });

      expect(await queryByTestId(`user-${nonJudge.id}-judge`)).toBeNull();
    });

    it("Shows the users name in green when they have submitted the cards", () => {
      data.users[1].hasSubmittedWhiteCards = true;
      const wrapper = renderer();

      expect(wrapper.queryByTestId(`user-${data.users[1].id}`)).toHaveClass(
        "text-green-500"
      );
    });
  });
});
