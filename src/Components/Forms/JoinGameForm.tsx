import React, {useCallback, useState} from "react";
import {apiClient} from "Api/apiClient";
import {useHistory} from "react-router-dom";
import {useGame} from "State/Game/GameContext";
import {errorToast} from "Utilities/toasts";
import {transformWhiteCardArray} from "Types/WhiteCard";
import {transformUser, transformUsers} from "Types/User";
import {Button} from "../Button";
import {useUsers} from "State/Users/UsersContext";
import {SetPlayersAction} from "State/Users/UsersActions";
import {useHand} from "State/Hand/HandContext";
import {SetHandAction} from "State/Hand/HandActionts";
import KAHInput from "../KAHInput";
import {useUser} from "State/User/UserContext";
import {SetHasSubmittedCards, SetUserAction,} from "State/User/UserActions";
import {SetBlackCardAction, SetGameAction, SetJudgeAction,} from "State/Game/GameActions";

const JoinGameForm: React.FC = () => {
    const history = useHistory();
    const [code, setCode] = useState("");
    const [userName, setUserName] = useState("");
    const {dispatch} = useUsers();
    const {dispatch: handDispatch} = useHand();
    const {dispatch: userDispatch} = useUser();
    const {dispatch: gameDispatch} = useGame();

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
        gameDispatch(
          new SetGameAction({
            id: data.id,
            judge_id: data.judge.id,
            name: data.name,
            code: data.code,
              redrawLimit: data.redrawLimit
          })
        );
        userDispatch(new SetUserAction(transformUser(data.current_user)));
          dispatch(new SetPlayersAction(transformUsers(data.users)));
          handDispatch(new SetHandAction(transformWhiteCardArray(data.hand, false, [])));
          gameDispatch(new SetBlackCardAction(data.current_black_card));
        userDispatch(new SetHasSubmittedCards(data.hasSubmittedWhiteCards));
        gameDispatch(new SetJudgeAction(transformUser(data.judge)));

        history.push(`/game/${data.id}`);
      } catch (e) {
        console.error(e);
        errorToast("Game does not exist");
      }
    },
    [userName, code, history]
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
          inputClass="flex-grow"
          required
          onChange={(e) => setCode(e.target.value)}
        />
        <KAHInput
            label="Player Name"
            placeholder="Bob's your uncle"
            name="name"
            dataTestid="join-game-name-input"
            inputClass="flex-grow"
            minLength={3}
            maxLength={17}
            required
            onChange={(e) => setUserName(e.target.value)}
        />
        <Button type="submit" text="Join" dataTestid="join-game-form-submit" />
      </form>
    </div>
  );
};

export default JoinGameForm;
