import React, { useCallback, useState } from "react";
import { Button } from "Components/Button";
import useJoinAsSpectator from "Hooks/Game/useJoinAsSpectator";
import KAHInput from "Components/KAHInput";
import { KAHCheckbox } from "Components/KAHCheckbox";
import useJoinGame from "Hooks/Game/useJoinGame";
import { KAHCard } from "Components/KAHCard";
import { CreateGameBanner } from "Components/CreateGameBanner";

const JoinGameForm: React.FC = () => {
  const [code, setCode] = useState("");
  const [userName, setUserName] = useState("");
  const [spectator, setSpectator] = useState(false);
  const joinAsSpectator = useJoinAsSpectator();
  const joinGame = useJoinGame();

  const submitToApi = useCallback(async (event) => {
      event.preventDefault();

      if (spectator) {
        await joinAsSpectator(code);
        return;
      }

      await joinGame(code, userName);
    },
    [userName, code, spectator]
  );

  return (
    <div className="flex flex-col w-full" data-testid="join-game-section">
      <KAHCard className="flex-grow mx-3 my-6 md:w-1/2 md:max-w-lg md:mx-auto">
        <form
          data-testid="join-game-form"
          onSubmit={submitToApi}
          className={"flex flex-col"}
        >
          <h2 className="text-2xl font-bold mb-4 mt-2">Join Game</h2>
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
                       size="text-2xl"
                       text="Spectator"
                       onClick={(value) => setSpectator(value)}
          />
          <Button className="w-full md:w-1/2 md:mx-auto" type="submit" text="Join Now" dataTestid="join-game-form-submit"/>
        </form>
      </KAHCard>
      <CreateGameBanner/>
    </div>
  );
};

export default JoinGameForm;
