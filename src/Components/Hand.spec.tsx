import {kardsRender} from "Tests/testRenders";
import Hand from "./Hand";
import {gameStateExampleResponse} from "Api/fixtures/gameStateExampleResponse";
import {transformWhiteCardArray} from "Types/WhiteCard";
import userEvent from "@testing-library/user-event";
import {waitFor} from "@testing-library/react";
import {gameFixture} from "Api/fixtures/gameFixture";
import {transformUser} from "Types/User";
import {errorToast} from "Utilities/toasts";
import {spyOnUseAuth, spyOnUseGame, spyOnUseHand} from "Tests/testHelpers";

const {data: {id, hand: handResponse, blackCard, currentUser}} = gameStateExampleResponse;

const hand = transformWhiteCardArray(handResponse, false, []);
const game = {
    ...gameFixture,
    id
}
const auth = transformUser(currentUser);

const mockRedraw = jest.fn();
jest.mock("Hooks/Game/useRedrawPlayerHand", () => () => mockRedraw);
jest.mock("Utilities/toasts");

describe("Hand", () => {
    beforeEach(() => {
        spyOnUseGame({ game, blackCard: blackCard, judge: auth });
        spyOnUseAuth({ auth, hasSubmittedCards: false });
        spyOnUseHand({hand});
    })

    it("will prompt user to confirm to redraw", () => {
        const wrapper = kardsRender(<Hand/>);

        userEvent.click(wrapper.getByTestId("redraw-button"));

        wrapper.getByText("Are you sure you want to redraw?");
    });

    it('will not redraw hand when user cancels confirm', async () => {
        const wrapper = kardsRender(<Hand/>);

        userEvent.click(wrapper.getByTestId("redraw-button"));

        await waitFor(() => {
            userEvent.click(wrapper.getByText("Cancel"));
        })

        await waitFor(() => {
            expect(mockRedraw).not.toHaveBeenCalled()
        });

    });

    it("will call redraw hook when user confirms to redraw", async () => {
        const wrapper = kardsRender(<Hand/>);

        userEvent.click(wrapper.getByTestId("redraw-button"));

        userEvent.click(wrapper.getByText("Yes"));

        await waitFor(() => {
            expect(mockRedraw).toHaveBeenCalledWith(id);
        });
    });

    it("will show the remaining redraws a user can take", () => {
        auth.redrawCount = 1;
        const wrapper = kardsRender(<Hand/>);

        wrapper.getByText(`${auth.redrawCount} Redraws Left`);
    });

    it("will show different text when user reaches limit of redraws", () => {
        auth.redrawCount = game.redrawLimit;
        const wrapper = kardsRender(<Hand/>);

        wrapper.getByText("0 Redraws Left");
    });

    it("will not allow user to redraw when they reach their limit", () => {
        auth.redrawCount = game.redrawLimit;
        const wrapper = kardsRender(<Hand/>);

        userEvent.click(wrapper.getByTestId("redraw-button"));

        expect(errorToast).toHaveBeenCalledWith("Cannot redraw, please wait until next round.");
        expect(wrapper.queryByText("Yes")).not.toBeInTheDocument();
    });
});