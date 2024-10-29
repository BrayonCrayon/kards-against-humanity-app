import React, {useEffect, useState} from "react";
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
    const [cardIdx, setCardIdx] = useState(0)

    useEffect(() => {
        const timeout = setInterval(() => {
            setCardIdx((prev) => {
                return Math.min(prev + 1, submissions.length) === submissions.length ? 0 : prev + 1;
            })
        }, 1000);

        return () => {
            clearInterval(timeout);
        }
    }, []);

    return (
            <div className="flex flex-row flex-grow">
                <div className="flex justify-around w-1/4 bg-white shadow-md">
                    <div className="m-12">
                        <BlackKard card={blackCard} />
                    </div>
                </div>
                <div className="p-12 pt-5 ">
                    {
                        <PlayerSubmittedCCard key={submissions[cardIdx].user_id} playerSubmission={submissions[cardIdx]} blackCard={blackCard} />
                    }
                </div>
            </div>
    );
};

export default ReviewRoom;