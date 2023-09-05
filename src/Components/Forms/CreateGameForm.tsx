import React, { useCallback, useEffect, useState } from "react";
import { Button } from "Components/Atoms/Button";
import KAHInput from "Components/KAHInput";
import useCreateGame from "Hooks/Game/Create/useCreateGame";
import { KAHCard } from "Components/KAHCard";
import { GameOptions } from "Components/Sidebars/GameOptions";
import useExpansions from "Hooks/Game/Expansions/useExpansions";
import useLoading from "Hooks/Game/Shared/useLoading";

export const CreateGameForm: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [timer, setTimer] = useState<null|number>(null);
  const createGame = useCreateGame();
  const { expansions, getExpansions, setExpansions } = useExpansions();
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    if (expansions.length > 0) return;
    getExpansions();
  }, []);

  const submitToApi = useCallback(async (event: any) => {
      event.preventDefault();
      await setLoading(true);
      await createGame(
        userName,
        expansions.filter((e) => e.isSelected).map((e) => e.expansion.id),
        timer
      );
    },
    [expansions, userName, timer]
  );

  const onToggle = useCallback((id: number) => {
      setExpansions(
        expansions.map((item) => {
          if (item.expansion.id === id) item.isSelected = !item.isSelected;
          return item;
        })
      );
    },
    [expansions]
  );

  const toggleExpansions = useCallback((toggledState: boolean) => {
      setExpansions((prev) => {
        return prev.map((ex) => ({ ...ex, isSelected: toggledState }));
      });
    },
    [expansions]
  );

  const onTimerChanged = useCallback((seconds: number) => {
      setTimer(seconds);
    },
    [timer]
  );

  return (
    <div className="flex flex-col w-full">
      <KAHCard className="flex-grow mx-3 my-6 sm:w-1/2 sm:mx-auto lg:w-1/3">
        <form onSubmit={submitToApi} className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 mt-2">Create Game</h2>
          <KAHInput
            type="text"
            dataTestid="user-name"
            value={userName}
            name="name"
            label="Player Name"
            placeholder="Bob's your uncle"
            required
            minLength={3}
            maxLength={17}
            onChange={(event) => setUserName(event.target.value)}
          />
          <GameOptions
            expansions={expansions}
            onToggle={onToggle}
            toggleAll={toggleExpansions}
            onTimerChange={onTimerChanged}
            timer={timer}
          />
          <Button isLoading={loading} text="Create" dataTestid="create-game-submit-button" type="submit" />
        </form>
      </KAHCard>
    </div>
  );
};
