import React, { useCallback, useEffect, useState } from "react";
import ExpansionCard from "Components/ExpansionCard";
import { Expansion } from "Types/Expansion";
import { useHistory } from "react-router-dom";
import { apiClient } from "Api/apiClient";
import { useGame } from "State/Game/useGame";
import { transformWhiteCardArray } from "Types/WhiteCard";
import { transformUser, transformUsers } from "Types/User";
import { Button } from "Components/Button";
import { usePlayers } from "State/Players/usePlayers";
import { SetPlayersAction } from "State/Players/PlayersActions";
import { useHand } from "State/Hand/useHand";
import { SetHandAction } from "State/Hand/HandActions";
import KAHInput from "Components/KAHInput";
import { useAuth } from "State/Auth/useAuth";
import { SetAuthAction, SetHasSubmittedCards } from "State/Auth/AuthActions";
import { SetBlackCardAction, SetGameAction, SetJudgeAction } from "State/Game/GameActions";

type ExpansionOption = {
    expansion: Expansion;
    isSelected: boolean;
};

export const CreateGameForm: React.FC = () => {
    const [expansions, setExpansions] = useState<ExpansionOption[]>([]);
    const [userName, setUserName] = useState("");
    const history = useHistory();
  const { dispatch: usersDispatch } = usePlayers();
  const { dispatch: handDispatch } = useHand();
  const { dispatch: userDispatch } = useAuth();
  const { dispatch: gameDispatch } = useGame();

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

        gameDispatch(
          new SetGameAction({
            id: data.id,
            name: data.name,
            code: data.code,
            judge_id: data.judge.id,
              redrawLimit: data.redrawLimit
          })
        );
        userDispatch(new SetAuthAction(transformUser(data.currentUser)));
        usersDispatch(new SetPlayersAction(transformUsers(data.users)));
        handDispatch(new SetHandAction(transformWhiteCardArray(data.hand, false, [])));
        gameDispatch(new SetBlackCardAction(data.blackCard));
        userDispatch(new SetHasSubmittedCards(data.hasSubmittedWhiteCards));
        gameDispatch(new SetJudgeAction(transformUser(data.judge)));
        history.push("/game/" + data.id);
      } catch (error) {
        console.error(error);
      }
    },
    [expansions, userName, history]
  );

  const onToggle = useCallback(
    (id: number) => {
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
