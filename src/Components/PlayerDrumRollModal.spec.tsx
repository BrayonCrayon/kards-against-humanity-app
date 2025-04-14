import "@testing-library/jest-dom/vitest";
import { kardsRender } from "@/Tests/testRenders";
import PlayerDrumRollModal from "@/Components/PlayerDrumRollModal";
import { spyOnUseAuth, spyOnUseGame, spyOnUsePlayers, spyOnUseVote } from "@/Tests/testHelpers";
import roundWinnerFactory from "@/Tests/Factories/RoundWinnerFactory";
import { userFactory } from "@/Tests/Factories/UserFactory";
import { gameFactory } from "@/Tests/Factories/GameFactory";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { service } from "@/setupTests";
import { waitFor } from "@testing-library/react";
import { act } from "react";
import { Game } from "@/Types/Game";
import { User } from "@/Types/User";

vi.useFakeTimers({ shouldAdvanceTime: true });

const gameSetup = (judge: User, auth: User): Game => {
  const selectedRoundWinner = roundWinnerFactory({ user_id: auth.id })
  const game = gameFactory({ judgeId: judge.id })
  spyOnUsePlayers(vi.fn(), { players: [judge] })
  spyOnUseVote(vi.fn(), { selectedRoundWinner, selectedPlayerId: -1 })
  spyOnUseGame(vi.fn(), { game, blackCard: blackCardFactory(), hasSpectator: true })
  spyOnUseAuth(vi.fn(), { auth, hasSubmittedCards: false })

  return game;
}

describe("PlayerDrumRollModal", () => {
  it("not start drum roll when a winner is not selected", () => {
    const wrapper = kardsRender(<PlayerDrumRollModal />);

    expect(wrapper.queryByTestId("display-winner")).not.toBeInTheDocument();
  });

  it("will start drum roll when a winner is present", () => {
    const players = Array.from({ length: 2 }).map(() => userFactory())
    const selectedRoundWinner = roundWinnerFactory({ user_id: players[1].id })
    spyOnUsePlayers(vi.fn(), { players })
    spyOnUseVote(vi.fn(), { selectedRoundWinner, selectedPlayerId: -1 })

    const wrapper = kardsRender(<PlayerDrumRollModal />);

    expect(wrapper.queryByTestId("display-winner")).toBeInTheDocument();
  });

  it("will rotate game when displaying winner has finished and the user is a judge", async () => {
    const auth = userFactory();
    const game = gameSetup(auth, auth);
    kardsRender(<PlayerDrumRollModal />);

    await act(() => vi.advanceTimersByTime(5000));
    await act(() => vi.advanceTimersByTime(10000));

    await waitFor(() => {
      expect(service.rotate).toHaveBeenCalledWith(game.id);
    });
  });

  it("will will not rotate game when user is not the judge user", async () => {
    const [judge, user] = Array.from({ length: 2 }).map(() => userFactory())
    gameSetup(judge, user)
    kardsRender(<PlayerDrumRollModal />)

    await act(() => vi.advanceTimersByTime(5000))
    await act(() => vi.advanceTimersByTime(10000))

    await waitFor(() => {
      expect(service.rotate).not.toHaveBeenCalled()
    })
  });
})