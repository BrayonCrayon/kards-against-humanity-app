import { spyOnUseAuth, spyOnUseGame, spyOnUseHand, spyOnUsePlayers } from "@/Tests/testHelpers";
import { gameFactory } from "@/Tests/Factories/GameFactory";
import moment from "moment";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { kardsRender } from "@/Tests/testRenders";
import SelectionRoundTimer from "./SelectionRoundTimer";
import { userFactory } from "@/Tests/Factories/UserFactory";
import { transformUser, transformUsers } from "@/Types/User";
import { waitFor } from "@testing-library/react";
import { service } from "@/setupTests";
import { act } from "react";
import { transformWhiteCardArray } from "@/Types/WhiteCard";
import { whiteCardFactory } from "@/Tests/Factories/WhiteCardFactory";
import { AxiosResponse } from "axios";
import { toMinutesSeconds } from "@/Utilities/helpers";


describe("SelectionRoundTimer", () => {
    beforeEach(() => {
        spyOnUseAuth(vi.fn(), { auth: userFactory(), hasSubmittedCards: false });
        spyOnUseHand();
        vi.useFakeTimers({shouldAdvanceTime: true});
        vi.setSystemTime(new Date(2025, 1, 1, 6, 0, 0, 0));
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.clearAllMocks();
    });

    it("will show timer", async () => {
        const game = gameFactory({
            selectionTimer: 60,
            selectionEndsAt: Date.now() / 1000 + 60,
        });

        spyOnUseGame(vi.fn(), {game, blackCard: blackCardFactory()});

        const wrapper = kardsRender(<SelectionRoundTimer/>);

        expect(wrapper.queryByText(toMinutesSeconds(game.selectionTimer!))).toBeInTheDocument();
    });

    it("will call end timer callback for players", async () => {
        const user = transformUser(userFactory());
        const game = gameFactory({
            selectionTimer: 60,
            selectionEndsAt: Date.now() / 1000 + 60,
        });
        const hand = transformWhiteCardArray(
            Array.from({ length: 7 }).map((_, idx) => whiteCardFactory({ order: idx + 1 }))
        );
        vi.advanceTimersByTime(game.selectionTimer! * 1000);
        spyOnUseGame(vi.fn(), {game, blackCard: blackCardFactory()});
        spyOnUseAuth(vi.fn(), {auth: user, hasSubmittedCards: false});
        spyOnUseHand(vi.fn(), { hand });
        service.submitCards.mockResolvedValueOnce({} as AxiosResponse);

        kardsRender(<SelectionRoundTimer/>);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(service.submitCards).toHaveBeenCalled();
        });
    });

    it("will not show timer when end of the round is not present", async () => {
        const game = gameFactory({selectionTimer: 60});
        spyOnUseGame(vi.fn(), {game, blackCard: blackCardFactory()});

        const wrapper = kardsRender(<SelectionRoundTimer/>);

        expect(wrapper.queryByTestId("timer")).not.toBeInTheDocument();
    });

    it("will not show timer when selection timer is not present", () => {
        const game = gameFactory({ selectionEndsAt: moment().unix() });
        spyOnUseGame(vi.fn(), {game, blackCard: blackCardFactory()});

        const wrapper = kardsRender(<SelectionRoundTimer/>);

        expect(wrapper.queryByTestId("timer")).not.toBeInTheDocument();
    });

    it("will not show timer when game is in voting state", () => {
        const game = gameFactory({ selectionTimer: 60, selectionEndsAt: moment().unix() });
        const players = transformUsers(Array.from({ length: 2 }).map(() => userFactory({ hasSubmittedWhiteCards: true })));
        spyOnUseGame(vi.fn(), { game, blackCard: blackCardFactory() });
        spyOnUsePlayers(vi.fn(), { players });

        const wrapper = kardsRender(<SelectionRoundTimer/>);

        expect(wrapper.queryByTestId("timer")).not.toBeInTheDocument();
    });

    it("will not call end timer callback for judge", async () => {
        const user = transformUser(userFactory());
        const game = gameFactory({
            judgeId: user.id,
            selectionTimer: 60,
            selectionEndsAt: Date.now() / 1000 + 60,
        });
        const players = transformUsers(Array.from({ length: 2 }).map(() => userFactory()));
        vi.advanceTimersByTime(game.selectionTimer! * 1000);
        spyOnUseGame(vi.fn(), {game, blackCard: blackCardFactory()});
        spyOnUseAuth(vi.fn(), {auth: user, hasSubmittedCards: false});
        spyOnUsePlayers(vi.fn(), { players });
        service.submitCards.mockResolvedValueOnce({} as AxiosResponse);

        kardsRender(<SelectionRoundTimer/>);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(service.submitCards).not.toHaveBeenCalled();
        });
    });

    it("will not call end timer callback when authed user already submitted their cards", async () => {
        const user = transformUser(userFactory({id: 1, hasSubmittedWhiteCards: true}));
        const game = gameFactory({
            judgeId: 999,
            selectionTimer: 60,
            selectionEndsAt: Date.now() / 1000 + 60, 
        });
        const players = transformUsers(Array.from({length: 2})
            .map((_, idx) => userFactory({id: idx + 1, hasSubmittedWhiteCards: idx > 0})));
        vi.advanceTimersByTime(game.selectionTimer! * 1000);
        spyOnUseGame(vi.fn(), {game, blackCard: blackCardFactory()});
        spyOnUseAuth(vi.fn(), {auth: user, hasSubmittedCards: false});
        spyOnUsePlayers(vi.fn(), {players});
        service.submitCards.mockResolvedValueOnce({} as AxiosResponse);

        kardsRender(<SelectionRoundTimer/>);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(service.submitCards).not.toHaveBeenCalled();
        });
    });
});