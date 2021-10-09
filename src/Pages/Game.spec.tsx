import {render, waitFor} from "@testing-library/react";
import Game from "./Game";
import {WhiteCard} from "../Types/WhiteCard";
import { GameContext } from "../State/Game/GameContext";

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

describe('Game', () => {
    it('shows users hand of seven white cards', async () => {
        const wrapper = render(
            <GameContext.Provider value={{hand: cardsInHand}}>
                <Game/>
            </GameContext.Provider>
        );

        await waitFor(() => {
            cardsInHand.forEach((card) => {
                const whiteCardElement = wrapper.queryByTestId(`white-card-${card.id}`);
                expect(whiteCardElement).not.toBeNull();
            });
        });
    });


});