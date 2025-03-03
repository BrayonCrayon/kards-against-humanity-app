import { SetBlackCardAction, SetGameAction } from "@/State/Game/GameActions";
import { Game } from "@/Types/Game";
import { initialGameState } from "@/State/Game/GameState";
import { BlackCard } from "@/Types/BlackCard";
import { gameFactory } from "@/Tests/Factories/GameFactory";

describe("GameActions", () => {
  it("will set game", () => {
    const game: Game = gameFactory();

    const action = new SetGameAction(game);
    expect(action.execute(initialGameState).game).toEqual(game);
  });

  it("will set black card", () => {
    const blackCard: BlackCard = { expansionId: 1, id: 2, pick: 2, text: "I am _" };

    const action = new SetBlackCardAction(blackCard);

    expect(action.execute(initialGameState).blackCard).toEqual(blackCard);
  });
});
