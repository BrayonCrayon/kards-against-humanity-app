import Echo from "laravel-echo";
import Pusher from "pusher-js";

export const pusher = new Pusher("80e06980f526e21fc058", { cluster: "us2"});
// @ts-ignore
window.Pusher = Pusher;
// @ts-ignore
window.Echo = new Echo({
  broadcaster: "pusher",
  key: "80e06980f526e21fc058",
  cluster: "us2",
  forceTLS: true,
});

// @ts-ignore
export const echo = window.Echo;

export interface gameCallbackData {
  gameId: string;
  userId: number;
}

export const listenWhenUserJoinsGame = (
  gameId: string,
  callback: (data: gameCallbackData) => void
) => {
  echo.channel(`game-${gameId}`).stopListening(".game.joined");
  echo.channel(`game-${gameId}`).listen(".game.joined", callback);
};

export const listenWhenGameStart = (
    userId: number,
    callback: (data: gameCallbackData) => void
) =>{
  echo.channel(`user-${userId}`).stopListening(".game.started");
  echo.channel(`user-${userId}`).listen(".game.started", callback);
};

export const listenWhenUserSubmittedCards = (
  gameId: string,
  callback: (data: gameCallbackData) => void
) => {
  echo.channel(`game-${gameId}`).stopListening(".cards.submitted");
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
  echo.channel(`game-${gameId}`).stopListening(".winner.selected");
  echo.channel(`game-${gameId}`).listen(".winner.selected", callback);
};

export const listenWhenGameRotates = (
  gameId: string,
  callback: (data: gameCallbackData) => void
) => {
  echo.channel(`game-${gameId}`).stopListening(".game.rotate");
  echo.channel(`game-${gameId}`).listen(".game.rotate", callback);
};
