import { kardsRender } from "Tests/testRenders";
import ReviewRoom from "./ReviewRoom";
import {blackCardFactory} from "../Tests/Factories/BlackCardFactory";
import {whiteCardFactory} from "../Tests/Factories/WhiteCardFactory";
import {submittedCardFactory} from "../Tests/Factories/SubmittedCardFactory";
import {userFactory} from "../Tests/Factories/UserFactory";
import {PlayerSubmittedCard} from "../Types/ResponseTypes";
import {playerSubmittedCardTestId} from "../Tests/selectors";
describe("ReviewRoom", () => {
    it("Renders the black card", () => {
        const blackCard = blackCardFactory();

        const wrapper = kardsRender(<ReviewRoom blackCard={blackCard} submissions={[]} />);

        expect(wrapper.queryByTestId(`black-card-${blackCard.id}`)).toBeInTheDocument()
    });

    it("Renders the white cards", () => {
        const userCount = 5;
        const cardsPerUser = 2;

        const usersSubmission: PlayerSubmittedCard[] = Array.from({ length: userCount })
           .map(() => {
               return {
                   user_id: userFactory().id,
                   submitted_cards: Array.from({ length: cardsPerUser }).map(() => submittedCardFactory())
               }
           });

        const blackCard = blackCardFactory();

        const wrapper = kardsRender(<ReviewRoom blackCard={blackCard} submissions={usersSubmission} />);

        usersSubmission.forEach(user => {
            expect(wrapper.queryByTestId(playerSubmittedCardTestId(user.user_id))).toBeInTheDocument()
        })
    });
});