import {render, waitFor} from "@testing-library/react";
import GamePage from "./GamePage";
import {WhiteCard} from "../Types/WhiteCard";
import { GameContext } from "../State/Game/GameContext";
import { Game } from "../Types/Game";

const cardsInHand: WhiteCard[] = [
    {
        id: 1625,
        text: 'White card 1',
        expansion_id: 4,
    },
    {
        id: 828,
        text: 'White card 1',
        expansion_id: 1,
    },
    {
        id: 237,
        text: 'White card 1',
        expansion_id: 2,
    },
    {
        id: 408,
        text: 'White card 1',
        expansion_id: 8,
    },
    {
        id: 95,
        text: 'White card 1',
        expansion_id: 12,
    },
    {
        id: 16,
        text: 'White card 1',
        expansion_id: 1,
    },
    {
        id: 253,
        text: 'White card 1',
        expansion_id: 1,
    }
];


Object.assign(navigator, {
    clipboard: {
        writeText: () => {},
    },
});

describe('GamePage', () => {
    afterAll(() => {
       jest.resetAllMocks();
    });

    it('shows users hand of seven white cards', async () => {
        const wrapper = render(
            <GameContext.Provider value={{hand: cardsInHand, game: {id: "", name: "", judge_id: 0}}}>
                <GamePage/>
            </GameContext.Provider>
        );

        await waitFor(() => {
            cardsInHand.forEach((card) => {
                const whiteCardElement = wrapper.queryByTestId(`white-card-${card.id}`);
                expect(whiteCardElement).not.toBeNull();
            });
        });
    });

    it('shows game id', async () => {
        const game: Game = {
            id: "121313klhj3-eqweewq-2323-dasd",
            name: "Game 1",
            judge_id: 1,
        }
       const wrapper = render(
           <GameContext.Provider value={{game, hand: []}}>
               <GamePage/>
           </GameContext.Provider>
       );

       await waitFor(() => {
           const gameIdDisplayElement = wrapper.queryByTestId(`game-${game.id}`) as HTMLElement;
           expect(gameIdDisplayElement).not.toBeNull();
           expect(gameIdDisplayElement.innerHTML).toBe(game.id);
       });
    });

    it('copies game id to clipboard when clicked', async () => {
        const game: Game = {
            id: "121313klhj3-eqweewq-2323-dasd",
            name: "Game 1",
            judge_id: 1,
        }
        jest.spyOn(navigator.clipboard, "writeText");
        const wrapper = render(
            <GameContext.Provider value={{game, hand: []}}>
                <GamePage/>
            </GameContext.Provider>
        );

        const gameIdDisplayElement = wrapper.queryByTestId(`game-${game.id}`) as HTMLElement;
        gameIdDisplayElement.click();
        await waitFor(() => {
            expect(navigator.clipboard.writeText).toBeCalledWith(game.id);
        });
    });
});