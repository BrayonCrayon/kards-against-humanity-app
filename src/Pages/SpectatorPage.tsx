import React from "react";
import { usePlayers } from "State/Players/usePlayers";
import { User } from "Types/User";

export const SpectatorPage: React.FC = () => {
  const { state: { players } } = usePlayers();

  return <>
    <div className="flex justify-between">
      {
        players.map(({ name, id }: User) => (
          <div key={id} className="flex flex-1 align-center justify-center">
            <p data-testid={id}>
              {name}
              <i className="fas fa-gavel text-2xl" />
            </p>
          </div>

        ))
      }
    </div>
  </>
}