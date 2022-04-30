import {kardsRender} from "Tests/testRenders";
import Hand from "./Hand";
import {gameStateExampleResponse} from "Api/fixtures/gameStateExampleResponse";
import {transformWhiteCardArray} from "Types/WhiteCard";
import userEvent from "@testing-library/user-event";
import {waitFor} from "@testing-library/react";
import {gameFixture} from "Api/fixtures/gameFixture";
import {transformUser} from "Types/User";
import {errorToast} from "Utilities/toasts";

const {data: {code, hand, current_black_card, current_user}} = gameStateExampleResponse;

const mockBlackCard = current_black_card;
const mockHand = transformWhiteCardArray(hand, false, []);
const mockGame = {
    ...gameFixture,
    code
}
const mockUser = transformUser(current_user);

const mockDispatch = jest.fn();
jest.mock("State/Hand/HandContext", () => ({
    ...jest.requireActual("State/Hand/HandContext"),
    useHand: () => ({
        state: {
            hand: mockHand
        },
        dispatch: mockDispatch
    })
}));

jest.mock("State/Game/GameContext", () => ({
    ...jest.requireActual("State/Game/GameContext"),
    useGame: () => ({
        state: {
            game: mockGame,
            blackCard: mockBlackCard
        }
    })
}));

jest.mock("State/User/UserContext", () => ({
    ...jest.requireActual("State/User/UserContext"),
    useUser: () => ({
        state: {
            hasSubmittedCards: false,
            user: mockUser
        }
    })
}));

const mockRedraw = jest.fn();
jest.mock("Hooks/Game/useRedrawPlayerHand", () => () => mockRedraw);

jest.mock("Utilities/toasts");


describe("Hand", () => {

    it("will prompt user to confirm to redraw", () => {
        const wrapper = kardsRender(<Hand/>);

        userEvent.click(wrapper.getByTestId("redraw-button"));

        wrapper.getByText("Are you sure you want to redraw?");
    });

    it("will call redraw hook when user confirms to redraw", async () => {
        const wrapper = kardsRender(<Hand/>);

        userEvent.click(wrapper.getByTestId("redraw-button"));

        userEvent.click(wrapper.getByText("Yes"));

        await waitFor(() => {
            expect(mockRedraw).toHaveBeenCalledWith(code);
        });
    });

    it("will show the remaining redraws a user can take", () => {
        mockUser.redrawCount = 1;
        const wrapper = kardsRender(<Hand/>);

        wrapper.getByText(`${mockUser.redrawCount} Redraws Left`);
    });

    it("will show different text when user reaches limit of redraws", () => {
        mockUser.redrawCount = mockGame.redrawLimit;
        const wrapper = kardsRender(<Hand/>);

        wrapper.getByText("0 Redraws Left");
    });

    it("will not allow user to redraw when they reach their limit", () => {
        mockUser.redrawCount = mockGame.redrawLimit;
        const wrapper = kardsRender(<Hand/>);

        userEvent.click(wrapper.getByTestId("redraw-button"));

        expect(errorToast).toHaveBeenCalledWith("Cannot redraw, please wait until next round.");
        expect(wrapper.queryByText("Yes")).not.toBeInTheDocument();
    });
});