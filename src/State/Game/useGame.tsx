import { GameContext } from "State/Game/GameContext";
import { useGenericContext } from "State/GeneralContext";

function useGame() {
  return useGenericContext(GameContext);
}

export {useGame}