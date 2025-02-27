import { kardsHookRender } from "Tests/testRenders";
import useDetermineWinner from "Hooks/Spectate/useDetermineWinner";
import { userFactory } from "Tests/Factories/UserFactory";
import { randNumber } from "@ngneat/falso";
import { spyOnUseVote } from "Tests/testHelpers";
import { blackCardFactory } from "Tests/Factories/BlackCardFactory";
import { RoundWinner } from "Types/ResponseTypes";
import { submittedCardFactory } from "Tests/Factories/SubmittedCardFactory";
import { SubmittedCard } from "Types/SubmittedCard";
import { transformSubmissionsToWhiteCard } from "Types/WhiteCard";

describe("useDetermineWinner", () => {
  it("will return defaults when there is no winner between games", () => {
    const { result } = kardsHookRender(useDetermineWinner, [])

    const { winner, winnerCards } = result.current;

    expect(winner).toBeUndefined();
    expect(winnerCards).toEqual([]);
  });

  it("will return no winner when there is no state in voting global state", () => {
    const players = Array.from({ length: 3 }).map(() => userFactory());

    const { result } = kardsHookRender(useDetermineWinner, players)

    const { winner, winnerCards } = result.current;

    expect(winner).toBeUndefined();
    expect(winnerCards).toEqual([]);
  });

  it("will return determine the winner when the judge has selected a winner", () => {
    const players = Array.from({ length: 3 }).map(() => userFactory());
    const expectedWinner = players[randNumber({ min: 0, max: players.length - 1})];
    const submissions: SubmittedCard[] = Array.from({ length: 2 }).map((_) => submittedCardFactory())
    const selectedRoundWinner: RoundWinner = { black_card: blackCardFactory(), user_id: expectedWinner.id, submitted_cards: submissions }
    spyOnUseVote(jest.fn(), { selectedRoundWinner, selectedPlayerId: -1 });

    const { result } = kardsHookRender(useDetermineWinner, players)
    const { winner, winnerCards } = result.current;

    expect(winner).toEqual(expectedWinner);
    expect(winnerCards).toEqual(transformSubmissionsToWhiteCard(submissions));
  });
})