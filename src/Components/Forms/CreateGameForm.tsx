import React, { useCallback, useEffect, useState } from "react";
import { Button } from "Components/Button";
import KAHInput from "Components/KAHInput";
import useCreateGame from "Hooks/Game/Create/useCreateGame";
import { CreateGameBanner } from "Components/CreateGameBanner";
import { KAHCard } from "Components/KAHCard";
import { ExpansionSelector } from "Components/Sidebars/ExpansionSelector";
import useExpansions from "Hooks/Game/Expansions/useExpansions";
import useLoading from "Hooks/Game/Shared/useLoading";

export const CreateGameForm: React.FC = () => {
  const [userName, setUserName] = useState("");
  const createGame = useCreateGame();
  const {expansions, getExpansions, setExpansions} = useExpansions();
  const {loading, setLoading} = useLoading();

  useEffect(() => {
    if (expansions.length > 0) return;
    getExpansions();
  }, []);

  const submitToApi = useCallback(async (event: any) => {
      event.preventDefault();
      await setLoading(true);
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
      setExpansions(expansions.map((item) => {
        if (item.expansion.id === id)  item.isSelected = !item.isSelected;
        return item;
      }));
    },
    [expansions]
  );

  const toggleExpansions = useCallback((toggledState: boolean) => {
    setExpansions((prev) => {
      return prev.map((ex) => ({ ...ex, isSelected: toggledState}));
    });
  }, [expansions]);

  return (
    <div className="flex flex-col w-full">
      <KAHCard className="flex-grow mx-3 my-6 md:w-1/2 md:max-w-lg md:mx-auto">
        <form
          onSubmit={submitToApi}
          className="flex flex-col"
        >
          <h2 className="text-2xl font-semibold mb-4 mt-2">Create Game</h2>
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
          <ExpansionSelector expansions={expansions} onToggle={onToggle} toggleAll={toggleExpansions} />
          <Button
            isLoading={loading}
            text="Create"
            dataTestid="create-game-submit-button"
            type="submit"
          />
        </form>
      </KAHCard>
      <CreateGameBanner />
    </div>
  );
};
