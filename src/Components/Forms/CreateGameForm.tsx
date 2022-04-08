import React, { useCallback, useEffect, useState } from "react";
import ExpansionCard from "Components/ExpansionCard";
import { Expansion } from "Types/Expansion";
import { useHistory } from "react-router-dom";
import { apiClient } from "Api/apiClient";
import { useGame } from "State/Game/GameContext";
import { IWhiteCard, WhiteCard } from "Types/WhiteCard";
import { transformUser, transformUsers } from "Types/User";
import { Button } from "Components/Button";
import { useUsers } from "State/Users/UsersContext";
import { SetPlayersAction } from "State/Users/UsersActions";
import { useHand } from "State/Hand/HandContext";
import { SetHandAction } from "State/Hand/HandActionts";
import KAHInput from "Components/KAHInput";
import { useUser } from "State/User/UserContext";
import {
  SetHasSubmittedCards,
  SetUserAction,
} from "../../State/User/UserActions";
import {
  SetBlackCardAction,
  SetGameAction,
  SetJudgeAction,
} from "../../State/Game/GameActions";

type ExpansionOption = {
  expansion: Expansion;
  isSelected: boolean;
};

export const CreateGameForm: React.FC = () => {
  const [expansions, setExpansions] = useState<ExpansionOption[]>([]);
  const [userName, setUserName] = useState("");
  const history = useHistory();
  const { dispatch: usersDispatch } = useUsers();
  const { dispatch: handDispatch } = useHand();
  const { dispatch: userDispatch } = useUser();
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
          })
        );
        userDispatch(new SetUserAction(transformUser(data.current_user)));
        usersDispatch(new SetPlayersAction(transformUsers(data.users)));
        const hand = data.hand.map((item: IWhiteCard) => {
          return new WhiteCard(item.id, item.text, item.expansion_id);
        });
        handDispatch(new SetHandAction(hand));
        gameDispatch(new SetBlackCardAction(data.current_black_card));
        userDispatch(new SetHasSubmittedCards(data.hasSubmittedWhiteCards));
        gameDispatch(new SetJudgeAction(transformUser(data.judge)));
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
        <button
          type="button"
          data-testid={"toggle-all-expansions"}
          onClick={toggleExpansions}
        >
          Toggle Expansions
        </button>
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
        <Button text="Create" dataTestid="create-game-submit-button" />
      </form>
    </div>
  );
};
