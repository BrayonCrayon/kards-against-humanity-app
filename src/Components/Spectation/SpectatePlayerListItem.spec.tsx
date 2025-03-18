import { gameSpectatorExampleResponse } from "@/Api/fixtures/gameSpectatorExampleResponse";
import { transformUsers, User } from "@/Types/User";
import { kardsRender } from "@/Tests/testRenders";
import SpectatePlayerListItem from "@/Components/Spectation/SpectatePlayerListItem";

const {data: {users, game}} = gameSpectatorExampleResponse;
const players = transformUsers(users);

const renderComponent = (props: {player: User, isJudge: boolean} = {player: players[0], isJudge: game.judgeId === players[0].id}) => {
  return kardsRender(<SpectatePlayerListItem player={props.player} isJudge={props.isJudge} />);
}

describe("SpectatePlayerListItem", () => {
  it("will indicate when users have submitted their cards", () => {
    const [player] = players;
    player.hasSubmittedWhiteCards = true;
    const wrapper = renderComponent({player, isJudge: false});

    const svg: HTMLImageElement = wrapper.queryByTestId(`card-submitted-icon-${player.id}`) as HTMLImageElement;
    expect(svg).not.toBeNull();
    expect(svg?.classList).not.toContain("opacity-25");
  });

  it("will indicate when users have not submitted their cards", () => {
    const [player] = players;
    player.hasSubmittedWhiteCards = false;
    const wrapper = renderComponent({player, isJudge: false});

    const svg: HTMLImageElement = wrapper.queryByTestId(`card-submitted-icon-${player.id}`) as HTMLImageElement;
    expect(svg).not.toBeNull();
    expect(svg?.classList).toContain("opacity-25");
  });
});