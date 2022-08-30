import { kardsRender } from "../Tests/testRenders";
import JudgeMessage from "./JudgeMessage";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";
import { transformUser, transformUsers, User } from "../Types/User";

const { data: { currentUser, users, game } } = gameStateExampleResponse;

const loggedInUser = transformUser(currentUser);

const renderComponent = (
  user: User = loggedInUser,
  usersProp: User[] = transformUsers(users),
  judgeIdProp: number = game.judgeId,
) => {
  return kardsRender(
    <JudgeMessage user={user} users={usersProp} judgeId={judgeIdProp} />
  );
};

describe("JudgeMessage", () => {
  it("will render", () => {
    const wrapper = renderComponent();
    expect(wrapper).toBeTruthy();
  });

  it("will show judge message current user is a judge", () => {
    const user = transformUsers(users).find((item) => item.id === game.judgeId);
    const wrapper = renderComponent(user);

    expect(wrapper.getByTestId("judge-message").textContent).toEqual(
      "You are judging!"
    );
  });

  it("will not show message when the current user is not a judge", () => {
    const wrapper = renderComponent();
    expect(wrapper.queryByTestId("judge-message")).not.toBeInTheDocument();
  });

  it("will not show message if all users have submitted their cards", () => {
    const user = transformUsers(users).find((item) => item.id === game.judgeId);
    const allPlayersHaveSubmitted = transformUsers(
      users.map((item) => {
        if (item.id !== game.judgeId) {
          item.hasSubmittedWhiteCards = true;
        }
        return item;
      })
    );
    const wrapper = renderComponent(user, allPlayersHaveSubmitted);

    expect(wrapper.queryByTestId("judge-message")).not.toBeInTheDocument();
  });
});
