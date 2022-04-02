import { initialUsersState, IUsersState } from "../State/Users/UsersState";

export const mockUseUsers = (
  dispatchMock: Function = jest.fn(),
  state: IUsersState = initialUsersState
) => {
  jest.mock("../../State/Users/UsersContext", () => ({
    ...jest.requireActual("../../State/Users/UsersContext"),
    useUsers: () => ({
      dispatch: dispatchMock,
      state,
    }),
  }));
};
