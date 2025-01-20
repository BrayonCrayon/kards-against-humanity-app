import React, { useEffect, useState } from "react";
import { BlackCard } from "Types/BlackCard";
import { BlackKard } from "Components/BlackKard";
import { PlayerSubmittedCard } from "Types/ResponseTypes";
import { PlayerSubmittedCCard } from "Components/PlayerSubmittedCCard";
import { listenWhenWinnerIsSelected } from "Services/PusherService";
import { useSpectate } from "State/Spectate/useSpectate";
import { ChangeStage } from "State/Spectate/SpectateActions";
import { Stage } from "State/Spectate/SpectateState";

export interface IReviewRoomProps {
    gameId: string,
    blackCard: BlackCard,
    submissions: PlayerSubmittedCard[]
}

const ReviewRoom: React.FC<IReviewRoomProps> = (props) => {
    const { blackCard, submissions, gameId} = props;
    const [cardIdx, setCardIdx] = useState(0)
    const { dispatch} = useSpectate()

    const changeStage = () => {
      dispatch(new ChangeStage(Stage.DISPLAY_WINNER))
    }

    useEffect(() => {
      listenWhenWinnerIsSelected(gameId, changeStage)
    }, []);

    useEffect(() => {
        const timeout = setInterval(() => {
            setCardIdx((prev) => {
                return Math.min(prev + 1, submissions.length) === submissions.length ? 0 : prev + 1;
            })
        }, 5000);

        return () => {
            clearInterval(timeout);
        }
    }, []);

    return (
          <>
              <div className="flex justify-around w-1/4 bg-white shadow-md pt-12">
                  <BlackKard card={blackCard} className="text-ellipsis overflow-hidden max-h-96" />
              </div>
              <div className="p-12 w-full h-full pt-5 flex items-center justify-center">
                {
                  submissions.length > 0 &&
                    <PlayerSubmittedCCard
                      className="overflow-hidden h-3/4 w-1/2 max-w-xl animate-slide-in-and-slide-out"
                      key={submissions[cardIdx].user_id}
                      playerSubmission={submissions[cardIdx]}
                      blackCard={blackCard}
                    />
                }
              </div>
          </>
    );
};

export default ReviewRoom;