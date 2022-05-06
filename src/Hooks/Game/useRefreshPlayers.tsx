import React, {useCallback} from "react";
import {useUsers} from "State/Users/UsersContext";
import {transformUsers} from "Types/User";
import {SetPlayersAction} from "State/Users/UsersActions";
import {fetchPlayers} from "Services/GameService";

function useRefreshPlayers() {
  const {dispatch} = useUsers();

  return useCallback(async (gameId: string) => {
    try {
      const {data} = await fetchPlayers(gameId);
      dispatch(new SetPlayersAction(transformUsers(data)));
    } catch (e) {
      console.error(e);
    }
  }, []);
}

export default useRefreshPlayers;
