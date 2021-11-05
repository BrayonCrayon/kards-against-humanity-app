import React, { useCallback, useContext, useEffect, useState } from "react";
import ExpansionCard from "../Components/ExpansionCard";
import { Expansion } from "../Types/Expansion";
import { useHistory } from "react-router-dom";
import { apiClient } from "../Api/apiClient";
import { GameContext, initialState } from "../State/Game/GameContext";
import { Game } from "../Types/Game";

type ExpansionOption = {
  expansion: Expansion;
  isSelected: boolean;
};

export const CreateGamePage: React.FC = () => {
  const [expansions, setExpansions] = useState<ExpansionOption[]>([]);
  const [userName, setUserName] = useState("");
  const history = useHistory();
  const { setGame, setUser, setHand, setBlackCard } = useContext(GameContext);

  const fetchExpansions = useCallback(async () => {
    try {
      const { data } = await apiClient.get(`/api/expansions`);

      setExpansions(
        data.map((item: Expansion) => {
          return {
            expansion: item,
            isSelected: true,
          };
        })
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (expansions.length > 0) return;
    fetchExpansions();
  }, [fetchExpansions, expansions]);

  const submitToApi = useCallback(
    async (event: any) => {
      event.preventDefault();

      try {
        const { data } = await apiClient.post(`/api/game`, {
          name: userName,
          expansionIds: expansions
            .filter((e) => {
              return e.isSelected;
            })
            .map((e) => e.expansion.id),
        });

        setGame({ id: data.id, name: data.name } as Game);
        setUser(data.current_user);
        setHand(data.hand);
        setBlackCard(data.current_black_card);

        history.push("/game/" + data.id);
      } catch (error) {
        console.error(error);
      }
    },
    [expansions, userName, history]
  );

  const onToggle = useCallback((id: number, checked: boolean) => {
    setExpansions((prev) => {
      const expansionOption = prev.find((item) => item.expansion.id === id);
      if (expansionOption) expansionOption.isSelected = !checked;
      return prev;
    });
  }, []);

  return (
    <div className="w-full flex justify-center self-center mt-4 ">
      <form
        onSubmit={submitToApi}
        className="flex w-1/3 flex-col p-4 shadow-lg rounded border"
      >
        <div className="text-2xl font-semibold mb-4 mt-2">Create Game</div>
        <div className="h-64 overflow-x-auto p-2 border rounded mb-4 bg-gray-100">
          {expansions.map(({ expansion, isSelected }) => {
            return (
              <ExpansionCard
                key={`expansion-${expansion.id}`}
                id={expansion.id}
                name={expansion.name}
                checked={isSelected}
                onToggle={onToggle}
              />
            );
          })}
        </div>
        <label className="mb-4 pl-2 mt-4">
          Name:
          <input
            type="text"
            data-testid="user-name"
            name="name"
            className="border-2 rounded shadow ml-2 px-2"
            required
            onChange={(event) => setUserName(event.target.value)}
          />
        </label>
        <button
          data-testid="create-game-submit-button"
          className="bg-gray-300 p-2 text-gray-900 font-semibold rounded shadow mt-4 hover:bg-gray-200 "
        >
          Enter game
        </button>
      </form>
    </div>
  );
};
