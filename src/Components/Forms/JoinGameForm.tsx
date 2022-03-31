import React, { useCallback, useContext, useState } from "react";
import { apiClient } from "../../Api/apiClient";
import { useHistory } from "react-router-dom";
import { GameContext } from "../../State/Game/GameContext";
import { Game } from "../../Types/Game";
import { errorToast } from "../../Utilities/toasts";
import { IWhiteCard, WhiteCard } from "../../Types/WhiteCard";
import { transformUser, transformUsers } from "../../Types/User";
import { Button } from "../Button";
import { useUsers } from "../../State/Users/UsersContext";
import { SetPlayersAction } from "../../State/Users/UsersActions";
import { useHand } from "../../State/Hand/HandContext";
import { SetHandAction } from "../../State/Hand/HandActionts";
import KAHInput from "../KAHInput";

const JoinGameForm: React.FC = () => {
  const history = useHistory();
  const [code, setCode] = useState("");
  const [userName, setUserName] = useState("");
  const { dispatch } = useUsers();
  const { dispatch: handDispatch } = useHand();
  const { setGame, setUser, setBlackCard, setHasSubmittedCards, setJudge } =
    useContext(GameContext);

  const submitToApi = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        const { data } = await apiClient.post(
          `/api/game/${code.toUpperCase()}/join`,
          {
            name: userName,
          }
        );
        setGame({
          id: data.id,
          judge_id: data.judge.id,
          name: data.name,
          code: data.code,
        } as Game);
        setUser(transformUser(data.current_user));
        dispatch(new SetPlayersAction(transformUsers(data.users)));
        const hand = data.hand.map((item: IWhiteCard) => {
          return new WhiteCard(item.id, item.text, item.expansion_id);
        });
        handDispatch(new SetHandAction(hand));
        setBlackCard(data.current_black_card);
        setHasSubmittedCards(data.hasSubmittedWhiteCards);
        setJudge(transformUser(data.judge));

        history.push(`/game/${data.id}`);
      } catch (e) {
        console.error(e);
        errorToast("Game does not exist");
      }
    },
    [
      userName,
      code,
      setGame,
      setUser,
      setBlackCard,
      setHasSubmittedCards,
      history,
    ]
  );

  return (
    <div className="flex justify-center" data-testid="join-game-section">
      <form
        data-testid="join-game-form"
        onSubmit={submitToApi}
        className="flex flex-col p-4 shadow-lg rounded border md:w-4/5 xl:w-1/2"
      >
        <div className="text-2xl font-semibold mb-4 mt-2">Join Game</div>
        <KAHInput
          label="Code"
          placeholder="ex: A3D5"
          name="code"
          dataTestid="join-game-code-input"
          pattern="[A-Z0-9]"
          required
          onChange={(e) => setCode(e.target.value)}
        />
        <KAHInput
          label="Player Name"
          placeholder="Bob's your uncle"
          name="name"
          dataTestid="join-game-name-input"
          required
          onChange={(e) => setUserName(e.target.value)}
        />
        <Button text="Join" dataTestid="join-game-form-submit" />
      </form>
    </div>
  );
};

export default JoinGameForm;
