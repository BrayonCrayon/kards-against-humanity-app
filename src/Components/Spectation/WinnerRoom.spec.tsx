import "@testing-library/jest-dom/vitest";
import { userFactory } from "@/Tests/Factories/UserFactory";
import { render } from "@testing-library/react";
import WinnerRoom from "@/Components/Spectation/WinnerRoom";
import { whiteCardFactory } from "@/Tests/Factories/WhiteCardFactory";
import { userTestId, whiteCardTestId } from "@/Tests/selectors";
import React, { act } from "react";
import { expectDispatch, spyOnUseGame, spyOnUseSpectate } from "@/Tests/testHelpers";
import { Stage } from "@/State/Spectate/SpectateState";
import { gameFactory } from "@/Tests/Factories/GameFactory";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";

vi.useFakeTimers();
const mockedTrigger = vi.fn()
const mocks = vi.hoisted(() => ({
  echo: {
    channel: vi.fn().mockImplementation(() => ({
      whisper: mockedTrigger
    })),
  },
}))

describe("WinnerRoom", () => {
  it("will show drum icon before winner", () => {
    const winner = userFactory();
    const cards = Array.from({length: 3}).map(() => whiteCardFactory())
    const wrapper = render(<WinnerRoom player={winner} cards={cards} />);

    expect(wrapper.queryByTestId("drum-icon")).toBeInTheDocument();
    expect(wrapper.queryByText(winner.name)).not.toBeInTheDocument();
    cards.forEach((card) => {
      expect(wrapper.queryByTestId(whiteCardTestId(card.id))).not.toBeInTheDocument();
    })
  });

  it("will show winner after the drum timeout has been completed", async () => {
    const winner = userFactory();
    const cards = Array.from({length: 3}).map(() => whiteCardFactory())
    const wrapper = render(<WinnerRoom player={winner} cards={cards} />);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(wrapper.queryByTestId("drum-icon")).not.toBeInTheDocument();

    const winnerDisplay = wrapper.queryByTestId(userTestId(winner.id));
    expect(winnerDisplay).toBeInTheDocument();
    expect(winnerDisplay!.textContent).toContain(winner.name);

    cards.forEach((card) => {
      expect(wrapper.queryByTestId(whiteCardTestId(card.id))).toBeInTheDocument();
    })
  });

  it("will call spectator dispatch and passed callback after showing winner and their cards for a certain amount of time", () => {
    const winner = userFactory();
    const cards = Array.from({length: 3}).map(() => whiteCardFactory())
    const onEndCallable = vi.fn()
    const dispatch = spyOnUseSpectate();
    render(<WinnerRoom player={winner} cards={cards} onEnd={onEndCallable} />);

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    act(() => {
      vi.advanceTimersByTime(11000);
    });

    expectDispatch(dispatch, Stage.DISPLAY_BLACK_CARD);
    expect(onEndCallable).toBeCalled();
  });

  it("will send pusher event to display round winner", () => {
    const winner = userFactory();
    const cards = Array.from({length: 3}).map(() => whiteCardFactory())
    const game = gameFactory();
    spyOnUseGame(vi.fn(), {game, blackCard: blackCardFactory(), hasSpectator: true});
    vi.mock("@/Services/PusherService", () => ({ echo: mocks.echo }));
    render(<WinnerRoom player={winner} cards={cards} />);


    act(() => {
      vi.advanceTimersByTime(6000);
    });
    act(() => {
      vi.advanceTimersByTime(11000);
    });

    expect(mocks.echo.channel).toHaveBeenCalledWith(`game-${game.id}`)
    expect(mockedTrigger).toHaveBeenCalledWith('.spectator.winner')
  });
})