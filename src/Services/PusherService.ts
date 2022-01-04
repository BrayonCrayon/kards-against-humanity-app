import Echo from "laravel-echo";
import Pusher from "pusher-js";

export const pusher = new Pusher("80e06980f526e21fc058");
// @ts-ignore
window.Pusher = require("pusher-js");
// @ts-ignore
window.Echo = new Echo({
  broadcaster: "pusher",
  key: "80e06980f526e21fc058",
  cluster: "us2",
});

// @ts-ignore
export const echo = window.Echo;

export interface UserJoinedGameData {
  gameId: string;
  userId: number;
}

export const listenWhenUserJoinsGame = (
  gameId: string,
  callback: (data: UserJoinedGameData) => void
) => {
  echo.channel(`game-${gameId}`).listen(".game.joined", callback);
};

export interface UserSubmittedCardsData {
  gameId: string;
  userId: number;
}

export const listenWhenUserSubmittedCards = (
  gameId: string,
  callback: (data: UserJoinedGameData) => void
) => {
  echo.channel(`game-${gameId}`).listen(".cards.submitted", callback);
};
