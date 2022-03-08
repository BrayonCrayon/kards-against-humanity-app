import React from "react";
import { IGameContext } from "../State/Game/GameContext";
import { RenderResult, waitFor } from "@testing-library/react";
import GameInfo from "./GameInfo";
import { gameStateJudgeExampleResponse } from "../Api/fixtures/gameStateJudgeExampleResponse";
import { customKardsRender } from "../Tests/testRenders";

const setHand = jest.fn();
const setHasSubmittedCards = jest.fn();
const updateGameStateCallback = jest.fn();

const { data } = gameStateJudgeExampleResponse;
let mockUsers = data.users;

const renderer = (value?: Partial<IGameContext>): RenderResult => {
  return customKardsRender(<GameInfo />, {
    setHand,
    setHasSubmittedCards,
    updateGameStateCallback,
    game: {
      id: data.id,
      name: data.name,
      code: data.code,
      judge_id: data.judge.id,
    },
    judge: {
      ...data.judge,
      hasSubmittedWhiteCards: false,
      whiteCards: data.hand,
    },
    user: {
      ...data.current_user,
      hasSubmittedWhiteCards: false,
      whiteCards: data.hand,
    },
    hand: data.hand,
    blackCard: data.current_black_card,
    ...value,
  });
};

jest.mock("../State/Users/UsersContext", () => ({
  ...jest.requireActual("../State/Users/UsersContext"),
  useUsers: () => ({
    state: {
      users: mockUsers,
    },
    dispatch: jest.fn(),
  }),
}));

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

    it("shows a button to kick players on users list", async () => {
      const wrapper = renderer();
      const playerToKickId = data.users.filter(
        (item) => item.id !== data.current_user.id
      )[0].id;

      await waitFor(() => {
        expect(
          wrapper.queryByTestId(`kick-player-${playerToKickId}`)
        ).toBeInTheDocument();
      });
    });
    it.todo("only show kick player buttons when user is the judge");
    it.todo("will call kick player hook when button is clicked");
  });

  describe("Game box", () => {
    it("shows game name", () => {
      const wrapper = renderer();

      expect(wrapper.queryByTestId(`game-${data.id}-name`)).not.toBeNull();
      expect(wrapper.queryByTestId(`game-${data.id}-name`)).toHaveTextContent(
        data.name
      );
    });
  });
});
