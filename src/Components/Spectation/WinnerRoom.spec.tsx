import "@testing-library/jest-dom/vitest";
import { userFactory } from "@/Tests/Factories/UserFactory";
import { render } from "@testing-library/react";
import WinnerRoom from "@/Components/Spectation/WinnerRoom";
import { whiteCardFactory } from "@/Tests/Factories/WhiteCardFactory";
import { userTestId, whiteCardTestId } from "@/Tests/selectors";
import React, { act } from "react";

vi.useFakeTimers();

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


  it("will call passed callback after showing winner and their cards for a certain amount of time", () => {
    const winner = userFactory();
    const cards = Array.from({length: 3}).map(() => whiteCardFactory())
    const onEndCallable = vi.fn()
    render(<WinnerRoom player={winner} cards={cards} onEnd={onEndCallable} />);

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    act(() => {
      vi.advanceTimersByTime(11000);
    });

    expect(onEndCallable).toBeCalled();
  });

  it("will call passed onShowWinner callback when showing the winner after drums", () => {
    const winner = userFactory();
    const cards = Array.from({length: 3}).map(() => whiteCardFactory())
    const onCallback = vi.fn()
    render(<WinnerRoom player={winner} cards={cards} onShowWinner={onCallback} />);

    act(() => {
      vi.advanceTimersByTime(6000);
    });
    act(() => {
      vi.advanceTimersByTime(11000);
    });

    expect(onCallback).toHaveBeenCalled()
  });
})