import { waitFor } from "@testing-library/react";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { getExpansionsExampleResponse } from "Api/fixtures/getExpansionsExampleResponse";
import JoinGameForm from "./JoinGameForm";
import { kardsRender } from "Tests/testRenders";
import { setupAndSubmitForm } from "Tests/actions";
import { spyOnUseAuth, spyOnUseGame, spyOnUseHand, spyOnUsePlayers } from "Tests/testHelpers";
import { mockedAxios } from "setupTests";
import userEvent from "@testing-library/user-event";

const mockJoinAsSpectator = jest.fn();
const mockJoinGame = jest.fn();
jest.mock("Hooks/Game/useJoinAsSpectator", () => {
  return () => mockJoinAsSpectator
})
jest.mock("Hooks/Game/useJoinGame", () => {
  return () => mockJoinGame
});

const {data} = gameStateExampleResponse;
const userName = "Joe";
const code = "1234";

const renderer = () => {
  return kardsRender(<JoinGameForm />);
};

describe("JoinGameForm", () => {
  beforeEach(() => {
    spyOnUseGame();
    spyOnUsePlayers();
    spyOnUseAuth();
    spyOnUseHand();
    mockedAxios.get.mockResolvedValue(getExpansionsExampleResponse);
  });

  it("renders", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      expect(wrapper.queryByTestId("join-game-section")).not.toBeNull();
    });
  });

  it("allows user to join game as a player", async () => {
    renderer();
    setupAndSubmitForm(userName, code);

    await waitFor(() => {
      expect(mockJoinGame).toHaveBeenCalledWith(code, userName);
    });
  });

  it('allows a user to join as a spectator', async () => {
    renderer()
    setupAndSubmitForm(userName, code, true);

    await waitFor(async () => {
      expect(mockJoinAsSpectator).toHaveBeenCalledWith( data.game.code );
      expect(mockJoinGame).not.toHaveBeenCalled();
    });
  })

  it("will hide user name input when spectator is checked", () => {
    const gameCode = "1j1j";
    const wrapper = renderer();

    const codeInput = wrapper.queryByTestId("join-game-code-input");
    expect(codeInput).not.toBeNull();
    userEvent.type(codeInput!, gameCode);

    expect(wrapper.queryByRole('user-name')).toBeInTheDocument();
    userEvent.click(wrapper.getByTestId("is-spectator"));

    expect(wrapper.queryByRole('user-name')).not.toBeInTheDocument();
  });
});
