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
            <div className="flex flex-row flex-grow">
                <div className="flex justify-around w-1/4 bg-white shadow-md">
                    <div className="m-12">
                        <BlackKard card={blackCard} />
                    </div>
                </div>
                <div className="p-12 pt-5 ">
                    {
                        submissions.map((submission) => (
                            <PlayerSubmittedCCard key={submission.user_id} playerSubmission={submission} blackCard={blackCard} />
                        ))
                    }
                </div>
            </div>
    );
};

export default ReviewRoom;