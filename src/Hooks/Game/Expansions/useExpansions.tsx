import { Expansion } from "Types/Expansion";
import { fetchExpansions } from "Services/GameService";
import { useState } from "react";

export type ExpansionOption = {
  expansion: Expansion;
  isSelected: boolean;
};

function useExpansions() {
  const [expansions, setExpansions] = useState<ExpansionOption[]>([]);

  return {
    expansions,
    setExpansions,
    getExpansions: async () => {
      try {
          const { data } = await fetchExpansions();

          setExpansions(
            data.map((item: Expansion) => {
              return {
                expansion: item,
                isSelected: true
              };
            })
          );
        } catch (error) {
          console.error(error);
        }
    }
  };
}

export default useExpansions;