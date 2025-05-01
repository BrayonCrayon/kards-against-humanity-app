import { FC, FormEvent, useCallback, useState } from "react";
import { Button } from "@/Components/Atoms/Button";
import useJoinAsSpectator from "@/Hooks/Game/Join/useJoinAsSpectator";
import KAHInput from "@/Components/KAHInput";
import { KAHCheckbox } from "@/Components/KAHCheckbox";
import useJoinGame from "@/Hooks/Game/Join/useJoinGame";
import { KAHCard } from "@/Components/KAHCard";
import useLoading from "@/Hooks/Game/Shared/useLoading";
import { useParams } from "react-router-dom";

const JoinGameForm: FC = () => {
  const { code: sharedCode } = useParams<{ code: string | undefined }>();
  const [code, setCode] = useState(sharedCode ?? "");
  const [userName, setUserName] = useState("");
  const [spectator, setSpectator] = useState(false);
  const { loading, setLoading } = useLoading();
  const joinAsSpectator = useJoinAsSpectator();
  const joinGame = useJoinGame();

  const submitToApi = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setLoading(true);
      if (spectator) {
        await joinAsSpectator(code);
        return;
      }

      await joinGame(code, userName);
    },
    [userName, code, spectator],
  );

  return (
    <div className="flex flex-col w-full h-full" data-testid="join-game-section">
      <KAHCard className="grow mx-3 my-6 md:w-1/2 md:max-w-lg md:mx-auto lg:w-1/3">
        <form data-testid="join-game-form" onSubmit={submitToApi} className="flex flex-col">
          <h2 className="text-2xl font-bold mb-4 mt-2">Join Game</h2>
          <KAHInput
            value={code}
            ariaRole="game-code-input"
            label="Code"
            placeholder="ex: A3D5"
            name="code"
            inputClass="grow"
            required
            onChange={(e) => setCode(e.target.value)}
          />
          {!spectator ? (
            <KAHInput
              ariaRole="user-name"
              label="Player Name"
              value={userName}
              placeholder="Bob's your uncle"
              name="name"
              inputClass="grow"
              minLength={3}
              maxLength={17}
              required
              onChange={(e) => setUserName(e.target.value)}
            />
          ) : null}
          <div className="flex items-center">
            <KAHCheckbox
              dataTestid="is-spectator"
              className="text-2xl border-2 border-black h-8 w-8 mr-2"
              onClick={(value) => setSpectator(value)}
            />
            <span>Spectator</span>
          </div>
          <Button
            isLoading={loading}
            className="w-full md:w-1/2 md:mx-auto"
            type="submit"
            text="Join Now"
            role="submit-form"
            dataTestid="join-game-form-submit"
          />
        </form>
      </KAHCard>
    </div>
  );
};

export default JoinGameForm;
