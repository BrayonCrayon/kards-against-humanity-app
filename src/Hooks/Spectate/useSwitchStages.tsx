import { useSpectate } from "State/Spectate/useSpectate";
import { ChangeStage } from "State/Spectate/SpectateActions";
import { Stage } from "State/Spectate/SpectateState";
import { usePlayers } from "State/Players/usePlayers";
import { useEffect, useMemo } from "react";
import { useGame } from "State/Game/useGame";

export const useSwitchStages = () => {
  const { state: { stage }, dispatch } = useSpectate()
  const { state: { game } } = useGame()
  const { state: { players } } = usePlayers()

  const haveAllPlayersSubmitted = useMemo(() => {
    return players.filter(user => user.id !== game.judgeId)
      .every(user => user.hasSubmittedWhiteCards);
  }, [players, game.judgeId]);

  useEffect(() => {
    if (!haveAllPlayersSubmitted || stage !== Stage.DISPLAY_BLACK_CARD) {
      return
    }

    dispatch(new ChangeStage(Stage.DISPLAY_SUBMISSIONS))
  }, [haveAllPlayersSubmitted]);

}