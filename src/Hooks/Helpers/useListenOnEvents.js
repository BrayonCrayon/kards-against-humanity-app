"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PusherService_1 = require("@/Services/PusherService");
var useGameStateCallback_1 = require("@/Hooks/Game/State/useGameStateCallback");
var useRefreshPlayersStateCallback_1 = require("@/Hooks/Game/State/useRefreshPlayersStateCallback");
var useUserJoinsGameCallback_1 = require("@/Hooks/Helpers/useUserJoinsGameCallback");
function useListenOnEvents() {
    var updateGameState = (0, useGameStateCallback_1.default)();
    var userJoinsGameCallback = (0, useUserJoinsGameCallback_1.default)();
    var refreshPlayersState = (0, useRefreshPlayersStateCallback_1.default)();
    return (0, react_1.useCallback)(function (gameId, userId) {
        (0, PusherService_1.listenWhenUserSubmittedCards)(gameId, refreshPlayersState);
        (0, PusherService_1.listenWhenUserJoinsGame)(gameId, userJoinsGameCallback);
        (0, PusherService_1.listenWhenGameRotates)(gameId, updateGameState);
        (0, PusherService_1.listenWhenGameStart)(userId, updateGameState);
    }, []);
}
exports.default = useListenOnEvents;
