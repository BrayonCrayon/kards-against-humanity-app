import { render } from "@testing-library/react";
import { PreGameModal } from "@/Components/PreGameModal";
import { toMinutesSeconds } from "@/Utilities/helpers";
import { userFactory } from "@/Tests/Factories/UserFactory";
import { spyOnUseAuth, spyOnUseGame } from "@/Tests/testHelpers";
import { gameFactory } from "@/Tests/Factories/GameFactory";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { kardsRender } from "@/Tests/testRenders";
import userEvent from "@testing-library/user-event";
import { Game } from "@/Types/Game";

const mockedStartGame = vi.fn();
vi.mock("@/Hooks/Game/Timer/useGameStart", () => () => mockedStartGame);

const setupState = (gameOptions: Partial<Game> = { selectionTimer: 215 }) => {
    const user = userFactory();
    spyOnUseAuth(vi.fn(), { auth: user, hasSubmittedCards: false });
    spyOnUseGame(vi.fn(), {
        game: gameFactory({ judgeId: user.id, ...gameOptions }),
        blackCard: blackCardFactory()
    });
}

describe("PreGameModal", () => {
    it.each([214,154])("will display time in human readable format", (seconds) => {
        setupState({ selectionTimer: seconds });
        const wrapper = render(<PreGameModal />);

        expect(wrapper.getByText(toMinutesSeconds(seconds))).toBeInTheDocument();
    });

    it("will display button when user is the judge", () => {
        setupState();
        const wrapper = kardsRender(<PreGameModal />);
        expect(wrapper.getByRole("button",{name:"Yep"})).toBeInTheDocument();
    });

    it("will not display button if user is not the judge", () => {
        const judge = userFactory();
        setupState({ judgeId: judge.id, selectionTimer: 215 });
        const wrapper = kardsRender(<PreGameModal />);

        expect(wrapper.queryByRole("button",{name:"Yep"})).not.toBeInTheDocument();
    });

    it("will not show modal when game does not have selection timer", () => {
        setupState({ selectionTimer: null });
        const wrapper = kardsRender(<PreGameModal />);
        
        expect(wrapper.queryByTestId("pre-game-modal")).not.toBeInTheDocument();
    });

    it("will show modal when game timer is set", () => {
        setupState();
        const wrapper = kardsRender(<PreGameModal />);

        expect(wrapper.queryByTestId("pre-game-modal")).toBeInTheDocument();
    });

    it("will not show modal when a second round of selection has started", () => {
        setupState({ selectionEndsAt: 2929292, selectionTimer: 215 });
        const wrapper = kardsRender(<PreGameModal/>);

        expect(wrapper.queryByTestId("pre-game-modal")).not.toBeInTheDocument();
    });

    it("will call hook when user starts the game", async () => {
        const id = "game-id"
        setupState({ id, selectionTimer: 215 });
        const wrapper = kardsRender(<PreGameModal/>);

        await userEvent.click(wrapper.getByRole("button"));

        expect(mockedStartGame).toHaveBeenCalledWith(id);
    });
});