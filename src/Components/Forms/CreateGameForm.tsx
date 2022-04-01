import React, { useCallback, useContext, useEffect, useState } from "react";
import ExpansionCard from "../ExpansionCard";
import { Expansion } from "../../Types/Expansion";
import { useHistory } from "react-router-dom";
import { apiClient } from "../../Api/apiClient";
import { GameContext } from "../../State/Game/GameContext";
import { IWhiteCard, WhiteCard } from "../../Types/WhiteCard";
import { transformUser, transformUsers } from "../../Types/User";
import { Button } from "../Button";
import { useUsers } from "../../State/Users/UsersContext";
import { SetPlayersAction } from "../../State/Users/UsersActions";
import { useHand } from "../../State/Hand/HandContext";
import { SetHandAction } from "../../State/Hand/HandActionts";
import KAHInput from "../KAHInput";
import { useUser } from "../../State/User/UserContext";
import {
  SetHasSubmittedCards,
  SetUserAction,
} from "../../State/User/UserActions";

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
  const { setGame, setBlackCard, setJudge } = useContext(GameContext);

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

        setGame({
          id: data.id,
          name: data.name,
          code: data.code,
          judge_id: data.judge.id,
        });
        userDispatch(new SetUserAction(transformUser(data.current_user)));
        usersDispatch(new SetPlayersAction(transformUsers(data.users)));
        const hand = data.hand.map((item: IWhiteCard) => {
          return new WhiteCard(item.id, item.text, item.expansion_id);
        });
        handDispatch(new SetHandAction(hand));
        setBlackCard(data.current_black_card);
        userDispatch(new SetHasSubmittedCards(data.hasSubmittedWhiteCards));
        setJudge(transformUser(data.judge));
        history.push("/game/" + data.id);
      } catch (error) {
        console.error(error);
      }
    },
    [
      expansions,
      userName,
      history,
      setGame,
      setBlackCard,
      usersDispatch,
      userDispatch,
    ]
  );

  const onToggle = useCallback((id: number, checked: boolean) => {
    setExpansions((prev) => {
      const expansionOption = prev.find((item) => item.expansion.id === id);
      if (expansionOption) expansionOption.isSelected = !checked;
      return prev;
    });
  }, []);

  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={submitToApi}
        className="flex flex-col p-4 shadow-lg rounded border md:w-4/5 xl:w-1/2"
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
