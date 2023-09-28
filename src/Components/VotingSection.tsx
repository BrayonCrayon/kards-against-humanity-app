import React, {FC, useCallback, useEffect} from "react";
import {useGame} from "State/Game/useGame";
import {useVote} from "State/Vote/useVote";
import {PlayerSubmittedCCard} from "./PlayerSubmittedCCard";
import {listenWhenWinnerIsSelected} from "Services/PusherService";
import useFetchRoundWinner from "Hooks/Game/State/useFetchRoundWinner";
import {Selectable} from "Components/Atoms/Selectable";
import {SelectWinnerAction} from "State/Vote/VoteActions";
import {useAuth} from "State/Auth/useAuth";
import useSubmittedCards from "Hooks/Game/State/useSubmittedCards";
import useSubmitWinner from "Hooks/Game/Actions/useSubmitWinner";
import SubmitButton from "./SubmitButton";
import {PlayerSubmittedCard} from "Types/ResponseTypes";

export const VotingSection: FC = () => {
  const {
    state: { game, blackCard },
  } = useGame();
  const {
    state: { selectedPlayerId },
    dispatch,
  } = useVote();
  const {
    state: { auth },
  } = useAuth();

  const { submittedCards, getSubmittedCards } = useSubmittedCards();
  const submitWinner = useSubmitWinner();

  const fetchRoundWinner = useFetchRoundWinner();
  useEffect(() => {
    listenWhenWinnerIsSelected(game.id, fetchRoundWinner);
  }, []);

  useEffect(() => {
    if (submittedCards.length > 0) return;
    getSubmittedCards(game.id);
  }, []);

  const selectCard = useCallback((user_id: number) => {
      if (game.judgeId !== auth.id) return;
      dispatch(new SelectWinnerAction(user_id));
  }, [dispatch, game, auth]);

  const showSubmitButton = useCallback((submission: PlayerSubmittedCard) => {
    return auth.id === game.judgeId && selectedPlayerId === submission.user_id;
  }, [game.judgeId, selectedPlayerId]);

  return (
    <div data-testid="voting-section" className="h-full bg-lukewarmGray-300 py-4">
      <div className="grid md:grid-cols-5 h-24 ">
        <div className="col-start-3">
          <SubmitButton
            show={auth.id === game.judgeId && selectedPlayerId > 0}
            transitionClassName="submit-button"
            buttonClass="submit-button w-full"
            onSubmit={() => submitWinner(game.id, selectedPlayerId)}
            dataTestId="submit-selected-winner"
          />
        </div>
      </div>
      <div className="grid place-items-center grid-cols-1 pb-10 justify-items-center md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:px-6">
        {submittedCards.map((submission) => (
          <div className="w-full flex flex-col" key={submission.user_id}>
            <Selectable
              dataTestid={`selectable-${submission.user_id}`}
              role={`selectable-${submission.user_id}`}
              isSelected={submission.user_id === selectedPlayerId}
              className={`h-full max-w-64 self-center md:m-0 ${showSubmitButton(submission) ? "" : "mb-16"}`}
              selectedClass="border-4 border-emerald-500"
              onClick={() => selectCard(submission.user_id)}
            >
              <PlayerSubmittedCCard playerSubmission={submission} blackCard={blackCard} />
            </Selectable>
            <SubmitButton
              show={showSubmitButton(submission)}
              timeout={400}
              transitionClassName="submit-button-slide"
              buttonClass="white-card-submit-button"
              onSubmit={() => submitWinner(game.id, selectedPlayerId)}
              dataTestId="submit-selected-winner"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
