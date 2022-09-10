import { ExpansionOption } from "Types/Expansion";
import { fetchExpansions } from "Services/GameService";
import { useState } from "react";
import { ExpansionsToExpansionOptions } from "Utilities/helpers";

function useExpansions() {
  const [expansions, setExpansions] = useState<ExpansionOption[]>([]);

  return {
    expansions,
    setExpansions,
    getExpansions: async () => {
      try {
          const { data } = await fetchExpansions();
          setExpansions(ExpansionsToExpansionOptions(data));
        } catch (error) {
          console.error(error);
        }
    }
  };
}

export default useExpansions;