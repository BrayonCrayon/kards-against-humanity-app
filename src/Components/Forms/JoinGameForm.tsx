import React, { useCallback, useContext, useState } from "react";
import { apiClient } from "../../Api/apiClient";
import { useHistory } from "react-router-dom";
import { GameContext } from "../../State/Game/GameContext";
import { Game } from "../../Types/Game";

const JoinGameForm: React.FC = () => {
  const history = useHistory();
  const [code, setCode] = useState("");
  const [userName, setUserName] = useState("");
  const { setGame, setUser, setUsers, setHand, setBlackCard } =
    useContext(GameContext);

  const submitToApi = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        const { data } = await apiClient.post(`/api/game/${code}/join`, {
          name: userName,
        });
        setGame({
          id: data.id,
          judge_id: data.judge.id,
          code: data.code,
        } as Game);
        setUser(data.current_user);
        setHand(data.hand);
        setBlackCard(data.current_black_card);
        setUsers(data.users);

        history.push(`/game/${data.id}`);
      } catch (e) {
        console.error(e);
      }
    },
    [userName, code]
  );

  return (
    <div className="flex justify-center" data-testid="join-game-section">
      <form
        data-testid="join-game-form"
        onSubmit={submitToApi}
        className="flex flex-col p-4 shadow-lg rounded border md:w-4/5 xl:w-1/2"
      >
        <div className="text-2xl font-semibold mb-4 mt-2">Join Game</div>
        <label className="mb-4 pl-2 mt-4">
          Name:
          <input
            type="text"
            data-testid="join-game-name-input"
            name="name"
            className="border-2 rounded shadow ml-2 px-2"
            required
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <label className="mb-4 pl-2 mt-4">
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

        <button
          data-testid="join-game-form-submit"
          className="bg-gray-300 p-2 text-gray-900 font-semibold rounded shadow mt-4 hover:bg-gray-200 "
        >
          Join game
        </button>
      </form>
    </div>
  );
};

export default JoinGameForm;
