import React from "react";
import { IGameContext } from "../State/Game/GameContext";
import { RenderResult, waitFor } from "@testing-library/react";
import GameInfo from "./GameInfo";
import { gameStateJudgeExampleResponse } from "../Api/fixtures/gameStateJudgeExampleResponse";
import { customKardsRender } from "../Tests/testRenders";
import userEvent from "@testing-library/user-event";
import { togglePlayerList } from "../Tests/actions";
import { transformUser } from "../Types/User";

const updateGameStateCallback = jest.fn();

const { data } = gameStateJudgeExampleResponse;
let mockUsers = data.users;
let mockUser = transformUser(data.current_user);
let mockHasSubmittedCards = false;
let mockUsersDispatch = jest.fn();

const renderer = async (
  value?: Partial<IGameContext>
): Promise<RenderResult> => {
  return await customKardsRender(<GameInfo />, {
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
    blackCard: data.current_black_card,
    ...value,
  });
};

const mockKickPlayer = jest.fn();
jest.mock("../Hooks/Game/useKickPlayer", () => {
  return () => {
    return mockKickPlayer;
  };
});

jest.mock("../State/Users/UsersContext", () => ({
  ...jest.requireActual("../State/Users/UsersContext"),
  useUsers: () => ({
    state: {
      users: mockUsers,
    },
    dispatch: mockUsersDispatch,
  }),
}));

jest.mock("../State/User/UserContext", () => ({
  ...jest.requireActual("../State/User/UserContext"),
  useUser: () => ({
    state: {
      user: mockUser,
      hasSubmittedWhiteCards: mockHasSubmittedCards,
    },
    dispatch: mockUsersDispatch,
  }),
}));

describe("GameInfo", () => {
  describe("Users Box", () => {
    it("shows the judge icon next to the player who is the judge", async () => {
      const { queryByTestId } = await renderer();

      await togglePlayerList();

      await waitFor(async () => {
        expect(queryByTestId(`user-${data.judge.id}-judge`)).not.toBeNull();
      });
    });

    it("does not show the judge icon next to the player who is not the judge", async () => {
      const nonJudgeUser = mockUsers.find((item) => item.id !== mockUser.id);
      const { queryByTestId } = await renderer();

      await togglePlayerList();

      await waitFor(async () => {
        expect(nonJudgeUser).not.toBeNull();
        expect(queryByTestId(`user-${nonJudgeUser!.id}-judge`)).toBeNull();
      });
    });

    it("Shows the users name in green when they have submitted the cards", async () => {
      mockUsers[0].hasSubmittedWhiteCards = true;
      const wrapper = await renderer();

      await togglePlayerList();

      const playerNameElement = wrapper
        .getByTestId(`user-${mockUsers[0].id}`)
        .getElementsByTagName("p")[0];

      expect(playerNameElement).toHaveClass("text-green-500");
      mockHasSubmittedCards = false;
    });

    it("shows a button to kick players on users list", async () => {
      const wrapper = await renderer();
      const playerToKickId = data.users.filter(
        (item) => item.id !== data.current_user.id
      )[0].id;

      await togglePlayerList();

      await waitFor(() => {
        expect(
          wrapper.queryByTestId(`kick-player-${playerToKickId}`)
        ).toBeInTheDocument();
      });
    });

    it("only show kick player buttons when user is the judge", async () => {
      const wrapper = await renderer();

      await waitFor(() => {
        data.users.forEach((user) => {
          expect(
            wrapper.queryByTestId(`kick-player-${user.id}`)
          ).not.toBeInTheDocument();
        });
      });
    });

    it("will not show kick player on player that is the judge", async () => {
      const wrapper = await renderer();

      await waitFor(() => {
        expect(
          wrapper.queryByTestId(`kick-player-${data.current_user.id}`)
        ).not.toBeInTheDocument();
      });
    });

    it("will call api endpoint to kick player from game", async () => {
      const wrapper = await renderer();
      const playerToKick = data.users.filter(
        (item) => item.id !== data.current_user.id
      )[0];

      await togglePlayerList();

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(`kick-player-${playerToKick.id}`));
      });

      await waitFor(() => {
        userEvent.click(wrapper.getByText("Yes, kick!"));
      });

      await waitFor(() => {
        expect(mockKickPlayer).toHaveBeenCalledWith(data.id, playerToKick.id);
      });
    });
  });

  describe("Game box", () => {
    it("shows game name", async () => {
      const wrapper = await renderer();

      expect(wrapper.queryByTestId(`game-${data.id}-name`)).not.toBeNull();
      expect(wrapper.queryByTestId(`game-${data.id}-name`)).toHaveTextContent(
        data.name
      );
    });
  });
});
