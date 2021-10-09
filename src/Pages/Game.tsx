import React from "react";
import { GameContext } from "../State/Game/GameContext";

const Game = () => {
    return (
        <GameContext.Consumer>
            {({ hand }) => (
                <div>
                    {
                        hand.map(card => (
                           <div key={card.id} data-testid={`white-card-${card.id}`}>
                               { card.text }
                           </div>
                        ))
                    }
                </div>
            )}
        </GameContext.Consumer>
    )
}

export  default Game