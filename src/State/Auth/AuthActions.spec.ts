import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { IncrementRedrawCount, SetHasSubmittedCards, SetAuthAction } from "State/Auth/AuthActions";
import { initialAuthState } from "State/Auth/AuthState";

const {data} = gameStateExampleResponse;

describe('UserActions', () => {
  it("will set user", () => {
    const user = data.currentUser;

    const action = new SetAuthAction(user);

    const result = action.execute(initialAuthState)
    expect(result.auth).toEqual(user)
  });

  it('will set submitted cards', () => {
    const action = new SetHasSubmittedCards(true);

    const result = action.execute(initialAuthState);

    expect(result.hasSubmittedCards).toBeTruthy();
  })

  it("will increment redraw count", () => {
    const action = new IncrementRedrawCount(1);

    const result = action.execute(initialAuthState);

    expect(result.auth.redrawCount).toEqual(1);
  });
});