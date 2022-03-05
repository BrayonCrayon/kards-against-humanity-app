import React, {useCallback, useContext, useState} from "react";
import {apiClient} from "../../Api/apiClient";
import {useHistory} from "react-router-dom";
import {GameContext} from "../../State/Game/GameContext";
import {Game} from "../../Types/Game";
import {errorToast} from "../../Utilities/toasts";
import {IWhiteCard, WhiteCard} from "../../Types/WhiteCard";
import {transformUser, transformUsers} from "../../Types/User";
import {Button} from "../Button";
import {useUsers} from "../../State/Users/UsersContext";
import {SET_PLAYERS} from "../../State/Users/UsersActions";

const JoinGameForm: React.FC = () => {
  const history = useHistory();
  const [code, setCode] = useState("");
  const [userName, setUserName] = useState("");
  const {dispatch} = useUsers();
  const {
    setGame,
    setUser,
    setHand,
    setBlackCard,
    setHasSubmittedCards,
    setJudge,
  } = useContext(GameContext);

  const submitToApi = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        const {data} = await apiClient.post(`/api/game/${code}/join`, {
          name: userName,
        });
        setGame({
          id: data.id,
          judge_id: data.judge.id,
          code: data.code,
        } as Game);
        setUser(transformUser(data.current_user));
        dispatch({
          type: SET_PLAYERS,
          payload: {
            users: transformUsers(data.users)
          }
        })
        const hand = data.hand.map((item: IWhiteCard) => {
          return new WhiteCard(item.id, item.text, item.expansion_id);
        });
        setHand(hand);
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
      setHand,
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
        <label className="mb-4 pl-2 mt-4 flex justify-between">
          Player Name:
          <input
            type="text"
            data-testid="join-game-name-input"
            name="name"
            className="border-2 rounded shadow ml-2 px-2"
            required
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <label className="mb-4 pl-2 mt-4 flex justify-between">
          Code:
          <input
            type="text"
            data-testid="join-game-code-input"
            name="code"
            className="border-2 rounded shadow ml-2 px-2"
            required
            onChange={(e) => setCode(e.target.value)}
          />
        </label>

        <Button text="Join" dataTestid="join-game-form-submit" />
      </form>
    </div>
  );
};

export default JoinGameForm;
