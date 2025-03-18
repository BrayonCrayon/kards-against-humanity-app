import { useGenericContext } from "@/State/GeneralContext";
import { PlayersContext } from "@/State/Players/PlayersContext";

function usePlayers() {
  return useGenericContext(PlayersContext);
}

export {usePlayers};