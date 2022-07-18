import { KickPlayerAction, SetPlayersAction } from "State/Players/PlayersActions";
import { initialPlayersState } from "State/Players/PlayersState";

const createUser = (overrides = {}) => {
  return {
    id: 1,
    name: 'Jim',
    score: 1,
    whiteCards: [],
    hasSubmittedWhiteCards: false,
    redrawCount: 1,
    ...overrides
  }
}

const users = [
  createUser({id: 1}),
  createUser({id: 2})
]

describe("PlayersActions", () => {
  it("will remove player for kicked action", () => {
    const [user] = users;
    const userCount = users.length;
    const kickAction = new KickPlayerAction(user.id);

    const result = kickAction.execute({players: users});

    expect(result.players.length).toEqual(userCount - 1);
    expect(result.players.find(item => item.id === user.id)).toBeUndefined();
  });

  it("will set players in setter action", () => {
    const setAction = new SetPlayersAction(users);

    const result = setAction.execute(initialPlayersState);

    expect(result.players).toHaveLength(users.length);
    expect(result.players).toMatchObject(users);
  });
})