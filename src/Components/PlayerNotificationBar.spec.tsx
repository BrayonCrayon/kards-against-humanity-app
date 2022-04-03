import { kardsRender } from "../Tests/testRenders";
import PlayerNotificationBar from "./PlayerNotificationBar";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "../Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { transformUser, transformUsers, User } from "../Types/User";

const {
  data: { users, judge },
} = gameStateAllPlayerSubmittedCardsExampleResponse;

const renderComponent = (
  usersProp: User[] = transformUsers(users),
  judgeProp: User = transformUser(judge)
) => {
  return kardsRender(
    <PlayerNotificationBar users={usersProp} judge={judgeProp} />
  );
};

describe("PlayerNotificationBar", () => {
  it("renders", () => {
    const wrapper = renderComponent();
    expect(wrapper).toBeTruthy();
  });

  it("will show zero out of zero if only the judge is in the game", () => {
    const wrapper = renderComponent([]);

    expect(wrapper.queryByTestId("player-submitted-info")).toBeInTheDocument();
    expect(wrapper.queryByTestId("player-submitted-info")?.textContent).toEqual(
      "0/0 Players Submitted"
    );
  });

  it("will show judgement message when all players have submitted their cards", () => {
    const nonJudgePlayers = transformUsers(
      users.filter((item) => item.id !== judge.id)
    );

    const wrapper = renderComponent(nonJudgePlayers);

    expect(wrapper.queryByTestId("player-submitted-info")).toBeInTheDocument();
    expect(wrapper.queryByTestId("player-submitted-info")?.textContent).toEqual(
      "Prepare for Judgement!"
    );
  });

  it("will only show half of the players that have submitted their cards", () => {
    const nonJudgePlayers = transformUsers(
      users.filter((item) => item.id !== judge.id)
    );
    nonJudgePlayers[0].hasSubmittedWhiteCards = false;
    const totalSubmittedCount = nonJudgePlayers.filter(
      (item) => item.hasSubmittedWhiteCards
    ).length;

    const wrapper = renderComponent(nonJudgePlayers);

    expect(wrapper.queryByTestId("player-submitted-info")).toBeInTheDocument();
    expect(wrapper.queryByTestId("player-submitted-info")?.textContent).toEqual(
      `${totalSubmittedCount}/${nonJudgePlayers.length} Players Submitted`
    );
  });
});
