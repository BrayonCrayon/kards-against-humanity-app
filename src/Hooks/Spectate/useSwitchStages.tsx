import { useSpectate } from "State/Spectate/useSpectate";
import { ChangeStage } from "State/Spectate/SpectateActions";
import { Stage } from "State/Spectate/SpectateState";
import { usePlayers } from "State/Players/usePlayers";
import { useEffect } from "react";

export const useSwitchStages = () => {
  const { dispatch } = useSpectate()
  const { state: { players } } = usePlayers()

  useEffect(() => {
    const allWhiteCardsReviewed = players.every(player => player.hasSubmittedWhiteCards)

    if (!allWhiteCardsReviewed) {
      return
    }

    dispatch(new ChangeStage(Stage.DISPLAY_BLACK_CARD))
  }, [players]);

}