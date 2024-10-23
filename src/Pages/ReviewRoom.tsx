import React from "react";
import {BlackCard} from "../Types/BlackCard";
import {BlackKard} from "../Components/BlackKard";
import {PlayerSubmittedCard} from "../Types/ResponseTypes";
import {PlayerSubmittedCCard} from "../Components/PlayerSubmittedCCard";

export interface IReviewRoomProps {
    blackCard: BlackCard,
    submissions: PlayerSubmittedCard[]
}

const ReviewRoom: React.FC<IReviewRoomProps> = (props) => {
    const {blackCard, submissions} = props;

    return (
            <>
                <BlackKard card={blackCard} />
                {
                    submissions.map((submission) => (
                        <PlayerSubmittedCCard key={submission.user_id} playerSubmission={submission} blackCard={blackCard} />
                    ))
                }
            </>
    );
};

export default ReviewRoom;