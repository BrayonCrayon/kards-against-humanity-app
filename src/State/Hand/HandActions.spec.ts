import { SetHandAction } from "State/Hand/HandActions";
import { whiteCardFixture } from "Api/fixtures/whiteCardFixture";
import { initialHandState } from "State/Hand/HandState";


describe('HandActions', () => {
  it('sets the hand', () => {
    const handAction = new SetHandAction(whiteCardFixture);

    const result = handAction.execute(initialHandState)

    expect(result.hand).toHaveLength(whiteCardFixture.length);
    expect(whiteCardFixture).toMatchObject(result.hand);
  })
})