"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenWhenSpectatorDisplaysWinner = exports.listenWhenGameRotates = exports.listenWhenWinnerIsSelected = exports.listenWhenUserSubmittedCards = exports.listenWhenGameStart = exports.listenWhenUserJoinsGame = exports.echo = exports.pusher = void 0;
var laravel_echo_1 = require("laravel-echo");
var pusher_js_1 = require("pusher-js");
exports.pusher = new pusher_js_1.default("80e06980f526e21fc058", { cluster: "us2" });
// @ts-ignore
window.Pusher = pusher_js_1.default;
// @ts-ignore
window.Echo = new laravel_echo_1.default({
    broadcaster: "pusher",
    key: "80e06980f526e21fc058",
    cluster: "us2",
    forceTLS: true,
});
// @ts-ignore
exports.echo = window.Echo;
var listenWhenUserJoinsGame = function (gameId, callback) {
    exports.echo.channel("game-".concat(gameId)).stopListening(".game.joined");
    exports.echo.channel("game-".concat(gameId)).listen(".game.joined", callback);
};
exports.listenWhenUserJoinsGame = listenWhenUserJoinsGame;
var listenWhenGameStart = function (userId, callback) {
    exports.echo.channel("user-".concat(userId)).stopListening(".game.started");
    exports.echo.channel("user-".concat(userId)).listen(".game.started", callback);
};
exports.listenWhenGameStart = listenWhenGameStart;
var listenWhenUserSubmittedCards = function (gameId, callback) {
    exports.echo.channel("game-".concat(gameId)).stopListening(".cards.submitted");
    exports.echo.channel("game-".concat(gameId)).listen(".cards.submitted", callback);
};
exports.listenWhenUserSubmittedCards = listenWhenUserSubmittedCards;
var listenWhenWinnerIsSelected = function (gameId, callback) {
    exports.echo.channel("game-".concat(gameId)).stopListening(".winner.selected");
    exports.echo.channel("game-".concat(gameId)).listen(".winner.selected", callback);
};
exports.listenWhenWinnerIsSelected = listenWhenWinnerIsSelected;
var listenWhenGameRotates = function (gameId, callback) {
    exports.echo.channel("game-".concat(gameId)).stopListening(".game.rotate");
    exports.echo.channel("game-".concat(gameId)).listen(".game.rotate", callback);
};
exports.listenWhenGameRotates = listenWhenGameRotates;
var listenWhenSpectatorDisplaysWinner = function (gameId, callback) {
    exports.pusher.channel("game-".concat(gameId)).unbind(".spectator.winner");
    exports.pusher.channel("game-".concat(gameId)).bind(".spectator.winner", callback);
    // echo.channel(`game-${gameId}`).stopListening(".spectator.winner");
    // echo.channel(`game-${gameId}`).listenForWhisper(".spectator.winner", callback);
};
exports.listenWhenSpectatorDisplaysWinner = listenWhenSpectatorDisplaysWinner;
