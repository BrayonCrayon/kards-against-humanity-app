import { SetHandAction } from "@/State/Hand/HandActions";
import { whiteCardFixture } from "@/Api/fixtures/whiteCardFixture";
import { initialHandState } from "@/State/Hand/HandState";
import { whiteCardFactory } from "@/Tests/Factories/WhiteCardFactory";
import { WhiteCard } from "@/Types/WhiteCard";


describe("HandActions", () => {
  it("sets the hand", () => {
    const handAction = new SetHandAction(whiteCardFixture);

    const result = handAction.execute(initialHandState)

    expect(result.hand).toHaveLength(whiteCardFixture.length);
    expect(whiteCardFixture).toMatchObject(result.hand);
  })

  it("will keep selected state if the user hasn't selected their cards", () => {
    const payloadFromApi = Array.from({ length: 7 }).map(() => whiteCardFactory());
    const hand = payloadFromApi.map((card: WhiteCard, idx) => {
      return whiteCardFactory({ ...card, selected: idx < 2, order: idx < 2 ? idx + 1 : 0  });
    });
    const handAction = new SetHandAction(payloadFromApi);

    const result = handAction.execute({ hand });

    expect(result.hand).toEqual(hand);
  });
})