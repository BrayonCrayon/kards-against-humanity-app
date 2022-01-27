import { submittedCardsResponse } from "../Api/fixtures/submittedCardsResponse";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "../Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import {
  customGameVoteRender,
  customGameWrapperRender,
} from "../Tests/testRenders";
import { act, RenderResult, waitFor } from "@testing-library/react";
import { apiClient } from "../Api/apiClient";
import { IGameContext, initialState } from "../State/Game/GameContext";
import { transformUser, transformUsers } from "../Types/User";
import { VotingSection } from "./VotingSection";
import { constructWhiteCardArray } from "../Types/WhiteCard";
import userEvent from "@testing-library/user-event";

jest.mock("../Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

const gameFixture = {
  id: "063a4fa2-7ab7-46d5-b59f-f0d15bb17f65",
  code: "1234",
  name: "Puzzled Penguin",
  judge_id: gameStateAllPlayerSubmittedCardsExampleResponse.data.judge.id,
};

const renderer = (value?: Partial<IGameContext>): RenderResult => {
  return customGameVoteRender(<VotingSection />, {
    ...initialState,
    game: gameFixture,
    user: transformUser(
      gameStateAllPlayerSubmittedCardsExampleResponse.data.current_user
    ),
    users: transformUsers(
      gameStateAllPlayerSubmittedCardsExampleResponse.data.users
    ),
    hand: constructWhiteCardArray(
      gameStateAllPlayerSubmittedCardsExampleResponse.data.hand,
      false,
      []
    ),
    blackCard:
      gameStateAllPlayerSubmittedCardsExampleResponse.data.current_black_card,
    ...value,
  });
};

describe("VotingSection", () => {
  describe("Api call", () => {
    it("calls backend api for submitted cards", async () => {
      mockedAxios.get.mockResolvedValue(submittedCardsResponse);

      await act(async () => {
        await renderer();
      });

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `/api/game/${gameStateAllPlayerSubmittedCardsExampleResponse.data.id}/submitted-cards`
        );
      });
    });

    it("catches axios error if api call fails", async () => {
      const errorMessage = { message: "failed api call" };
      mockedAxios.get.mockRejectedValueOnce(errorMessage);
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderer();

      await waitFor(() => {
        expect(consoleSpy).toBeCalledWith(errorMessage);
      });
    });
  });

  describe("select a player submitted card", () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValueOnce(submittedCardsResponse);
    });

    it("allows user to select a player submitted card", async () => {
      const wrapper = await renderer();
      const { user_id } = submittedCardsResponse.data[0];

      const submittedCardElement = await waitFor(() => {
        return wrapper.getByTestId(`player-submitted-response-${user_id}`);
      });
      userEvent.click(submittedCardElement);

      await waitFor(() => {
        expect(submittedCardElement).toHaveClass("border border-blue-400");
      });
    });
  });

  describe("displaying players submitted card", () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValueOnce(submittedCardsResponse);
    });

    it("will display players submitted card", async () => {
      const wrapper = await renderer();

      await waitFor(() => {
        submittedCardsResponse.data.forEach((submittedData) => {
          expect(
            wrapper.queryByTestId(
              `player-submitted-response-${submittedData.user_id}`
            )
          ).toBeInTheDocument();

          submittedData.submitted_cards.forEach((card) =>
            expect(
              wrapper.queryByTestId(
                `player-card-response-${submittedData.user_id}`
              )?.textContent
            ).toEqual(expect.stringContaining(card.text))
          );
        });
      });
    });

    it("will display players submitted cards in order", async () => {
      const wrapper = await renderer();
      const { submitted_cards } = submittedCardsResponse.data[0];

      const { text: blackCardText } =
        gameStateAllPlayerSubmittedCardsExampleResponse.data.current_black_card;

      const expectedCardText = blackCardText
        .replace("_", submitted_cards[1].text.replace(/\.$/, ""))
        .replace("_", submitted_cards[0].text.replace(/\.$/, ""));

      await waitFor(() => {
        expect(wrapper.queryByText(expectedCardText)).toBeInTheDocument();
      });
    });
  });
});
