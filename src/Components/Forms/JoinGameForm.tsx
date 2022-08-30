import React, { useCallback, useState } from "react";
import { Button } from "Components/Button";
import useJoinAsSpectator from "Hooks/Game/useJoinAsSpectator";
import KAHInput from "Components/KAHInput";
import { KAHCheckbox } from "Components/KAHCheckbox";
import useJoinGame from "Hooks/Game/useJoinGame";

const JoinGameForm: React.FC = () => {
  const [code, setCode] = useState("");
  const [userName, setUserName] = useState("");
  const [spectator, setSpectator] = useState(false)
  const joinAsSpectator = useJoinAsSpectator();
  const joinGame = useJoinGame();

  const submitToApi = useCallback(async (event) => {
      event.preventDefault();

      if (spectator) {
        await joinAsSpectator(code)
        return;
      }

      await joinGame(code, userName);
    },
    [userName, code, spectator]
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
        {!spectator ? <KAHInput
          ariaRole="user-name"
          label="Player Name"
          placeholder="Bob's your uncle"
          name="name"
          dataTestid="join-game-name-input"
          inputClass="flex-grow"
          minLength={3}
          maxLength={17}
          required
          onChange={(e) => setUserName(e.target.value)}
        /> : null}
        <KAHCheckbox dataTestid="is-spectator"
                     classNames="flex items-center p-2"
                     size="text-4xl"
                     text="Spectate"
                     onClick={(value) => setSpectator(value)}
        />
        <Button type="submit" text="Join" dataTestid="join-game-form-submit" />
      </form>
    </div>
  );
};

export default JoinGameForm;
