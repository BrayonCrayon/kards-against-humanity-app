import {act, render, screen, waitFor} from "@testing-library/react";
import {CreateGamePage, Expansion} from "./CreateGamePage";
import axios from "axios";

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
})