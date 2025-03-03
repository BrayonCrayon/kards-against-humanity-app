import { ChangeStage } from "@/State/Spectate/SpectateActions";
import { Stage } from "@/State/Spectate/SpectateState";
import { useEffect, useMemo } from "react";
import { User } from "@/Types/User";
import { useSpectate } from "@/State/Spectate/useSpectate";

export const useSwitchStages = (players: User[], stage: Stage) => {
  const { dispatch } = useSpectate()

  const haveAllPlayersSubmitted = useMemo(() => {
    return players.length > 0 && players.every(user => user.hasSubmittedWhiteCards);
  }, [players]);

  useEffect(() => {
    if (!haveAllPlayersSubmitted || stage !== Stage.DISPLAY_BLACK_CARD) {
      return
    }

    dispatch(new ChangeStage(Stage.DISPLAY_SUBMISSIONS))
  }, [haveAllPlayersSubmitted]);

}