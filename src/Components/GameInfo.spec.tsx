import React from "react";
import { RenderResult, waitFor } from "@testing-library/react";
import GameInfo from "./GameInfo";
import { gameStateJudgeExampleResponse } from "Api/fixtures/gameStateJudgeExampleResponse";
import userEvent from "@testing-library/user-event";
import { togglePlayerList } from "Tests/actions";
import { transformUser, transformUsers } from "Types/User";
import { kardsRender } from "Tests/testRenders";
import { spyOnUseAuth, spyOnUseGame, spyOnUsePlayers } from "Tests/testHelpers";

const { data: {game, users, currentUser, blackCard} } = gameStateJudgeExampleResponse;
const players = transformUsers(users);
const auth = transformUser(currentUser);
const hasSubmittedCards = false;

const renderer = async (): Promise<RenderResult> => {
  return kardsRender(<GameInfo />);
};

const mockKickPlayer = jest.fn();
jest.mock("Hooks/Game/useKickPlayer", () => {
  return () => {
    return mockKickPlayer;
  };
});

describe("GameInfo", () => {
  beforeEach(() => {
    spyOnUsePlayers(jest.fn(), { players });
    spyOnUseAuth(jest.fn(), { auth, hasSubmittedCards });
    spyOnUseGame(jest.fn(), { game, blackCard });
  });

  describe("Spectation Box", () => {
    it("shows the judge icon next to the player who is the judge", async () => {

      const { queryByTestId } = await renderer();

      await togglePlayerList();

      await waitFor(async () => {
        expect(queryByTestId(`user-${game.judgeId}-judge`)).not.toBeNull();
      });
    });

    it("does not show the judge icon next to the player who is not the judge", async () => {
      const nonJudgeUser = players.find((item) => item.id !== auth.id);
      const { queryByTestId } = await renderer();

      await togglePlayerList();

      await waitFor(async () => {
        expect(nonJudgeUser).not.toBeNull();
        expect(queryByTestId(`user-${nonJudgeUser!.id}-judge`)).toBeNull();
      });
    });

    it("Shows the users name in green when they have submitted the cards", async () => {
      players[0].hasSubmittedWhiteCards = true;
      const wrapper = await renderer();

      await togglePlayerList();

      const playerNameElement = wrapper
        .getByTestId(`user-${players[0].id}`)
        .getElementsByTagName("p")[1];

      expect(playerNameElement).toHaveClass("text-green-500");
    });

    it("shows a button to kick players on users list", async () => {
      const wrapper = await renderer();
      const playerToKickId = users.filter((item) => item.id !== currentUser.id)[0].id;

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
        users.forEach((user) => {
          expect(wrapper.queryByTestId(`kick-player-${user.id}`)).not.toBeInTheDocument();
        });
      });
    });

    it("will not show kick player on player that is the judge", async () => {
      const wrapper = await renderer();

      await waitFor(() => {
        expect(wrapper.queryByTestId(`kick-player-${currentUser.id}`)).not.toBeInTheDocument();
      });
    });

    it("will call api endpoint to kick player from game", async () => {
      const wrapper = await renderer();
      const playerToKick = users.filter((item) => item.id !== currentUser.id)[0];

      await togglePlayerList();

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(`kick-player-${playerToKick.id}`));
      });

      await waitFor(() => {
        userEvent.click(wrapper.getByText("Yes, kick!"));
      });

      await waitFor(() => {
        expect(mockKickPlayer).toHaveBeenCalledWith(game.id, playerToKick.id);
      });
    });
  });

  describe("Game box", () => {
    it("shows game name", async () => {
      const wrapper = await renderer();

      expect(wrapper.queryByTestId(`game-${game.id}-name`)).not.toBeNull();
      expect(wrapper.queryByTestId(`game-${game.id}-name`)).toHaveTextContent(
        game.name
      );
    });
  });
});
