import { kardsRender } from "Tests/testRenders";
import ReviewRoom from "./ReviewRoom";
import { blackCardFactory } from "Tests/Factories/BlackCardFactory";
import { submittedCardFactory } from "Tests/Factories/SubmittedCardFactory";
import { userFactory } from "Tests/Factories/UserFactory";
import { PlayerSubmittedCard } from "Types/ResponseTypes";
import { playerSubmittedCardTestId } from "Tests/selectors";
import { submittedCardsResponse } from "Api/fixtures/submittedCardsResponse";

jest.mock("Services/PusherService")

describe("ReviewRoom", () => {
    it("Renders the black card", () => {
        const blackCard = blackCardFactory();
        const wrapper = kardsRender(<ReviewRoom gameId="394732k4jh2i3h4i23" blackCard={blackCard} submissions={[]} />);

        expect(wrapper.queryByTestId(`black-card-${blackCard.id}`)).toBeInTheDocument()
    });

    it("Renders the white cards", async () => {
        const usersSubmission: PlayerSubmittedCard[] = Array.from({ length: 5 })
          .map(() => ({
               user_id: userFactory().id,
               submitted_cards: Array.from({ length: 2 }).map(() => submittedCardFactory())
          }));
        const blackCard = blackCardFactory();

        const wrapper = kardsRender(<ReviewRoom gameId="394732k4jh2i3h4i23" blackCard={blackCard} submissions={usersSubmission} />);

        expect(wrapper.queryByTestId(playerSubmittedCardTestId(usersSubmission[0].user_id))).toBeInTheDocument()
        // usersSubmission.forEach(user => {
        //     expect(wrapper.queryByTestId(playerSubmittedCardTestId(user.user_id))).toBeInTheDocument()
        // })
    });

    // TODO: Got to come back and finish this test
    it("will switch to winner stage when a winner has been selected", () => {
        const usersSubmission: PlayerSubmittedCard[] = submittedCardsResponse.data
        const blackCard = blackCardFactory();

        const wrapper = kardsRender(<ReviewRoom gameId="394732k4jh2i3h4i23" blackCard={blackCard} submissions={usersSubmission} />);
    });
});