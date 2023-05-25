import {spyOnUseAuth, spyOnUseGame, spyOnUseHand, spyOnUsePlayers} from "Tests/testHelpers";
import {gameFactory} from "Tests/Factories/GameFactory";
import moment from "moment";
import {blackCardFactory} from "Tests/Factories/BlackCardFactory";
import {kardsRender} from "Tests/testRenders";
import SelectionRoundTimer from "./SelectionRoundTimer";
import {toMinutesSeconds} from "Utilities/helpers";
import {userFactory} from "Tests/Factories/UserFactory";
import {transformUser, transformUsers} from "Types/User";
import {waitFor} from "@testing-library/react";
import {service} from "setupTests";
import {act} from "react-dom/test-utils";
import {transformWhiteCardArray} from "Types/WhiteCard";
import {whiteCardFactory} from "Tests/Factories/WhiteCardFactory";
import {AxiosResponse} from "axios";

jest.useFakeTimers();

describe("SelectionRoundTimer", () => {
    beforeEach(() => {
        spyOnUseAuth(jest.fn(), { auth: userFactory(), hasSubmittedCards: false });
        spyOnUseHand();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    it("will show timer", async () => {
        jest.setSystemTime();
        const game = gameFactory({
            selectionTimer: 60,
            selectionEndsAt: moment().add(60, "seconds").unix()
        });
        spyOnUseGame(jest.fn(), {game, blackCard: blackCardFactory()});

        const wrapper = kardsRender(<SelectionRoundTimer/>);

        expect(wrapper.queryByText(toMinutesSeconds(game.selectionTimer!))).toBeInTheDocument();
    });

    it("will call end timer callback for players", async () => {
        jest.setSystemTime();
        const user = transformUser(userFactory());
        const game = gameFactory({
            selectionTimer: 60,
            selectionEndsAt: moment().add(60, "seconds").unix()
        });
        const hand = transformWhiteCardArray(
            Array.from({ length: 7 }).map((_, idx) => whiteCardFactory({ order: idx + 1 }))
        );
        jest.advanceTimersByTime(game.selectionTimer! * 1000);
        spyOnUseGame(jest.fn(), {game, blackCard: blackCardFactory()});
        spyOnUseAuth(jest.fn(), {auth: user, hasSubmittedCards: false});
        spyOnUseHand(jest.fn(), { hand });
        service.submitCards.mockResolvedValueOnce({} as AxiosResponse);

        kardsRender(<SelectionRoundTimer/>);

        await act(() => {
            jest.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(service.submitCards).toHaveBeenCalled();
        });
    });

    it("will not show timer when end of the round is not present", async () => {
        const game = gameFactory({selectionTimer: 60});
        spyOnUseGame(jest.fn(), {game, blackCard: blackCardFactory()});

        const wrapper = kardsRender(<SelectionRoundTimer/>);

        expect(wrapper.queryByTestId("timer")).not.toBeInTheDocument();
    });

    it("will not show timer when selection timer is not present", () => {
        const game = gameFactory({ selectionEndsAt: moment().unix() });
        spyOnUseGame(jest.fn(), {game, blackCard: blackCardFactory()});

        const wrapper = kardsRender(<SelectionRoundTimer/>);

        expect(wrapper.queryByTestId("timer")).not.toBeInTheDocument();
    });

    it("will not show timer when game is in voting state", () => {
        const game = gameFactory({ selectionTimer: 60, selectionEndsAt: moment().unix() });
        const players = transformUsers(Array.from({ length: 2 }).map(() => userFactory({ hasSubmittedWhiteCards: true })));
        spyOnUseGame(jest.fn(), { game, blackCard: blackCardFactory() });
        spyOnUsePlayers(jest.fn(), { players });

        const wrapper = kardsRender(<SelectionRoundTimer/>);

        expect(wrapper.queryByTestId("timer")).not.toBeInTheDocument();
    });

    it("will not call end timer callback for judge", async () => {
        jest.setSystemTime();
        const user = transformUser(userFactory());
        const game = gameFactory({
            judgeId: user.id,
            selectionTimer: 60,
            selectionEndsAt: moment().add(60, "seconds").unix()
        });
        const players = transformUsers(Array.from({ length: 2 }).map(() => userFactory()));
        jest.advanceTimersByTime(game.selectionTimer! * 1000);
        spyOnUseGame(jest.fn(), {game, blackCard: blackCardFactory()});
        spyOnUseAuth(jest.fn(), {auth: user, hasSubmittedCards: false});
        spyOnUsePlayers(jest.fn(), { players });
        service.submitCards.mockResolvedValueOnce({} as AxiosResponse);

        kardsRender(<SelectionRoundTimer/>);

        await act(() => {
            jest.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(service.submitCards).not.toHaveBeenCalled();
        });
    });

    it("will not call end timer callback when authed user already submitted their cards", async () => {
        jest.setSystemTime();
        const user = transformUser(userFactory({id: 1, hasSubmittedWhiteCards: true}));
        const game = gameFactory({
            judgeId: 999,
            selectionTimer: 60,
            selectionEndsAt: moment().add(60, "seconds").unix()
        });
        const players = transformUsers(Array.from({length: 2})
            .map((_, idx) => userFactory({id: idx + 1, hasSubmittedWhiteCards: idx > 0})));
        jest.advanceTimersByTime(game.selectionTimer! * 1000);
        spyOnUseGame(jest.fn(), {game, blackCard: blackCardFactory()});
        spyOnUseAuth(jest.fn(), {auth: user, hasSubmittedCards: false});
        spyOnUsePlayers(jest.fn(), {players});
        service.submitCards.mockResolvedValueOnce({} as AxiosResponse);

        kardsRender(<SelectionRoundTimer/>);

        await act(() => {
            jest.advanceTimersByTime(1000);
        });

        await waitFor(() => {
            expect(service.submitCards).not.toHaveBeenCalled();
        });
    });
});