import { useGenericContext } from "State/GeneralContext";
import { VoteContext } from "State/Vote/VoteContext";

function useVote() {
  return useGenericContext(VoteContext);
}

export {useVote}