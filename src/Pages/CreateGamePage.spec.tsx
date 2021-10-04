import {act, render, screen, waitFor} from "@testing-library/react";
import {CreateGamePage} from "./CreateGamePage";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import {Expansion} from "../Types/Expansion";
import {API_URL} from "../config";
import {Router, useHistory} from 'react-router-dom'
import {createMemoryHistory} from 'history'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>;
const expectedExpansionName = 'Some Sweet Expansion';
const expansion = {
    id: 1,
    name: expectedExpansionName
}
const otherExpansion = {
    id: 2,
    name: expectedExpansionName + ' but different'
}

const responses: Expansion[] = [expansion, otherExpansion]

describe('CreateGamePage', () => {

    beforeEach(() => {
        mockedAxios.get.mockResolvedValue({data: {data: responses}});
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
        const history = createMemoryHistory();
        history.push = jest.fn();

        render(
            <Router history={history}>
                <CreateGamePage/>
            </Router>
        );

        const nameInput = await screen.findByTestId('user-name');
        userEvent.type(nameInput, name);

        const submitBtn = await screen.findByTestId('create-game-submit-button');
        userEvent.click(submitBtn);

        // expect axios to be called with selected expansions and users name
        expect(mockedAxios.post).toHaveBeenCalledWith(`${API_URL}/api/game/store`, {
            expansionIds: [expansion.id, otherExpansion.id],
            name
        });
    })

    it('handles form submit with selected expansions only', async () => {
        const name = "Slim Shady";
        const history = createMemoryHistory();
        history.push = jest.fn();

        render(
            <Router history={history}>
                <CreateGamePage/>
            </Router>
        );

        const checkbox = await screen.findByTestId(`expansion-${expansion.id}-checkbox`);
        userEvent.click(checkbox);

        expect(checkbox).not.toBeChecked();

        const nameInput = await screen.findByTestId('user-name');
        userEvent.type(nameInput, name);

        const submitBtn = await screen.findByTestId('create-game-submit-button');
        userEvent.click(submitBtn);

        // expect axios to be called with selected expansions and users name
        expect(mockedAxios.post).toHaveBeenCalledWith(`${API_URL}/api/game/store`, {
            expansionIds: [otherExpansion.id],
            name
        });

        await waitFor(() => {
            expect(history.push).toHaveBeenCalledWith('/game')
        });
    })
})