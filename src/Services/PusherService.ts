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

export interface UpdateGameState {
  gameId: string;
  userId: number;
}

export const listenWhenUserJoinsGame = (
  gameId: string,
  callback: (data: UpdateGameState) => void
) => {
  echo.channel(`game-${gameId}`).listen(".game.joined", callback);
};

export const listenWhenUserSubmittedCards = (
  gameId: string,
  callback: (data: UpdateGameState) => void
) => {
  echo.channel(`game-${gameId}`).listen(".cards.submitted", callback);
};

export interface IWinnerIsSelectedEventData {
  gameId: string;
  userId: number;
  blackCardId: number;
}

export const listenWhenWinnerIsSelected = (
  gameId: string,
  callback: (data: IWinnerIsSelectedEventData) => void
) => {
  echo.channel(`game-${gameId}`).listen(".winner.selected", callback);
};

export const listenWhenGameRotates = (
  gameId: string,
  callback: (data: UpdateGameState) => void
) => {
  echo.channel(`game-${gameId}`).listen(".game.rotate", callback);
};
