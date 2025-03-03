import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { PlayerSubmittedCard } from "@/Types/ResponseTypes";
import { whiteCardFactory } from "@/Tests/Factories/WhiteCardFactory";
import { render } from "@testing-library/react";
import { PlayerSubmittedCCard } from "@/Components/PlayerSubmittedCCard";
import { playerSubmittedCardTestId } from "@/Tests/selectors";


describe("PlayerSubmittedCCard", () => {
  it("render component", () => {
    const playerSubmittedCard: PlayerSubmittedCard = {
      user_id: 1,
      submitted_cards: [whiteCardFactory()]
    }
    const blackCard = blackCardFactory();

    const wrapper = render(<PlayerSubmittedCCard playerSubmission={playerSubmittedCard} blackCard={blackCard} />)

    expect(wrapper.queryByTestId(playerSubmittedCardTestId(playerSubmittedCard.user_id))).toBeInTheDocument()
  });
})