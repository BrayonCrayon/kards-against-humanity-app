import {act, render, screen, waitFor} from "@testing-library/react";
import {CreateGamePage} from "./CreateGamePage";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import {Expansion} from "../Types/Expansion";

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>;
const expectedExpansionName = 'Some Sweet Expansion';
const expansion = {
    id: 1,
    name: expectedExpansionName
}

const responses: Expansion[] = [expansion]

describe('CreateGamePage', () => {

    beforeEach(() => {
        mockedAxios.get.mockResolvedValue({data: {data: responses}})
    })

    it('renders expansion cards', async () => {
        render(<CreateGamePage/>);
        await screen.findByText(expectedExpansionName);
    })

    it('renders expansion cards with checkboxes checked', async () => {
        render(<CreateGamePage/>);

        //screen find all expansions using test id then check if their checboxes checked?
        const checkbox = await screen.findByTestId(`expansion-${expansion.id}-checkbox`);

        expect(checkbox).toBeChecked();
    })

    it('handles form submit', async () => {
        const name = "Slim Shady"
        render(<CreateGamePage/>);

        const checkbox = await screen.findByTestId(`expansion-${expansion.id}-checkbox`);
        userEvent.click(checkbox)

        expect(checkbox).not.toBeChecked();

        const nameInput = await screen.findByTestId('user-name');
        userEvent.type(nameInput, name);

        const submitBtn = await screen.findByTestId('create-game-submit-button');
        userEvent.click(submitBtn);

        // expect axios to be called with selected expansions and users name
        expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/api/game/store',{
            expansionIds: [expansion.id],
            name
        })
    })
})