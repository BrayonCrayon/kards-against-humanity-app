import {act, render, screen, waitFor} from "@testing-library/react";
import {CreateGamePage} from "./CreateGamePage";
import userEvent from "@testing-library/user-event";
import {Expansion} from "../Types/Expansion";
import {API_URL} from "../config";
import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import {apiClient} from "../api/apiClient";

jest.mock('../api/apiClient');

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;
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

        expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game/store`, {
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

        expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game/store`, {
            expansionIds: [otherExpansion.id],
            name
        });

        await waitFor(() => {
            expect(history.push).toHaveBeenCalledWith('/game')
        });
    })
})