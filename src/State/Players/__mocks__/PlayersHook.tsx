
const mockHappyLittleMock = jest.fn();


export const usePlayers = () => ({
  state: {
    players: []
  },
  dispatch: mockHappyLittleMock
});