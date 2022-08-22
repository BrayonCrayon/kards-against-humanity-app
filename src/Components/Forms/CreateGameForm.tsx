import React, { useCallback, useEffect, useState } from "react";
import ExpansionCard from "Components/ExpansionCard";
import { Expansion } from "Types/Expansion";
import { apiClient } from "Api/apiClient";
import { Button } from "Components/Button";
import KAHInput from "Components/KAHInput";
import useCreateGame from "Hooks/Game/useCreateGame";

type ExpansionOption = {
    expansion: Expansion;
    isSelected: boolean;
};

export const CreateGameForm: React.FC = () => {
    const [expansions, setExpansions] = useState<ExpansionOption[]>([]);
    const [userName, setUserName] = useState("");
    const createGame = useCreateGame();

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

  const submitToApi = useCallback(async (event: any) => {
      event.preventDefault();

      await createGame(
        userName,
        expansions
          .filter(e => e.isSelected)
          .map(e => e.expansion.id)
      );
    },
    [expansions, userName]
  );

  const onToggle = useCallback((id: number) => {
      setExpansions((prevState) => {
        return prevState.map((item) => {
          if (item.expansion.id === id) item.isSelected = !item.isSelected;
          return item;
        });
      });
    },
    [expansions, setExpansions]
  );

  const toggleExpansions = useCallback(() => {
    setExpansions((prev) => {
      return prev.map((ex) => ({ ...ex, isSelected: !ex.isSelected }));
    });
  }, [expansions, setExpansions]);

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={submitToApi}
        className="flex flex-col p-4 shadow-lg rounded border md:w-4/5 xl:w-1/2"
      >
        <div className="text-2xl font-semibold mb-4 mt-2">Create Game</div>
        <Button
          text="Toggle Expansions"
          dataTestid="toggle-all-expansions"
          className="text-sm"
          onClick={toggleExpansions}
        />
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
        <KAHInput
          type="text"
          dataTestid="user-name"
          name="name"
          label="Player Name"
          placeholder="Bob's your uncle"
          required
          minLength={3}
          maxLength={17}
          onChange={(event) => setUserName(event.target.value)}
        />
        <Button
          text="Create"
          dataTestid="create-game-submit-button"
          type="submit"
        />
      </form>
    </div>
  );
};
