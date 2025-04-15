import { FC, useState } from "react";
import { SubmittedCard } from "src/Types/SubmittedCard";
import { CSSTransition } from "react-transition-group";
import { WhiteKard } from "@/Components/WhiteKard";


interface SubmissionTestProps {
  cards: SubmittedCard[]
}

export const SubmissionTest: FC<SubmissionTestProps> = (props) => {

  const [cardNodeRefs, setCardNodeRefs] = useState([])
  const { cards } = props;

  return (
    <>
      {
        cards.map(card => (
          <CSSTransition key={card.id} timeout={10000} classNames="item">
            <div>
            <WhiteKard key={card.id} hidePlayButton className="w-64" card={card} onClick={() => {}} />
            </div>
          </CSSTransition>
        ))
      }
    </>
  )
}

export default SubmissionTest;