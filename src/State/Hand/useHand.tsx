import { useGenericContext } from "@/State/GeneralContext";
import { HandContext } from "@/State/Hand/HandContext";


function useHand() {
  return useGenericContext(HandContext);
}

export {useHand};