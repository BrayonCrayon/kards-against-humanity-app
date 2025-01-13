import React, { useEffect, useState } from "react";
import { BlackCard } from "Types/BlackCard";
import { BlackKard } from "Components/BlackKard";
import { PlayerSubmittedCard } from "Types/ResponseTypes";
import { PlayerSubmittedCCard } from "Components/PlayerSubmittedCCard";
import { listenWhenWinnerIsSelected } from "Services/PusherService";

export interface IReviewRoomProps {
    gameId: string,
    blackCard: BlackCard,
    submissions: PlayerSubmittedCard[]
}

const ReviewRoom: React.FC<IReviewRoomProps> = (props) => {
    const { blackCard, submissions, gameId} = props;
    const [cardIdx, setCardIdx] = useState(0)

    useEffect(() => {
      listenWhenWinnerIsSelected(gameId, () => {})
    }, []);

    useEffect(() => {
        // const timeout = setInterval(() => {
        //     setCardIdx((prev) => {
        //         return Math.min(prev + 1, submissions.length) === submissions.length ? 0 : prev + 1;
        //     })
        // }, 3000);
        //
        // return () => {
        //     clearInterval(timeout);
        // }
    }, []);

    return (
            <div className="flex flex-grow">
                <div className="flex justify-around w-1/4 bg-white shadow-md">
                    <div className="m-12">
                        <BlackKard card={blackCard} className="text-ellipsis overflow-hidden max-h-96" />
                    </div>
                </div>
                <div className="p-12 w-full pt-5 flex flex-row items-center justify-center h-72">
                  {
                    submissions.length > 0 &&
                      <PlayerSubmittedCCard className="max-h-72 overflow-hidden" key={submissions[cardIdx].user_id} playerSubmission={submissions[cardIdx]} blackCard={blackCard} />
                  }
                </div>
            </div>
    );
};

export default ReviewRoom;