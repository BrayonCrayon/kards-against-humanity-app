import { useGenericContext } from "@/State/GeneralContext";
import { SpectateContext } from "@/State/Spectate/SpectateContext";

function useSpectate() {
  return useGenericContext(SpectateContext);
}

export {useSpectate};