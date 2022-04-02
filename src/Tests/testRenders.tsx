import { render, RenderResult } from "@testing-library/react";
import { GameContext, GameProvider } from "../State/Game/GameContext";
import GameContextProvider from "../State/Game/GameContextProvider";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { VoteProvider } from "../State/Vote/VoteContext";
import { UsersProvider } from "../State/Users/UsersContext";
import { HandProvider } from "../State/Hand/HandContext";
import { UserProvider } from "../State/User/UserContext";
import { renderHook } from "@testing-library/react-hooks";
import useFetchGameState from "../Hooks/Game/useFetchGameState";
import React from "react";

export const history = createMemoryHistory();
history.push = jest.fn();

// export const customKardsRender = (
//   children: JSX.Element,
//   value?: Partial<IGameContext>
// ): RenderResult => {
//   return render(
//     <Router history={history}>
//       <UserProvider>
//         <HandProvider>
//           <GameContext.Provider
//             value={{
//               ...initialState,
//               ...value,
//             }}
//           >
//             <VoteProvider>
//               <UsersProvider>{children}</UsersProvider>
//             </VoteProvider>
//           </GameContext.Provider>
//         </HandProvider>
//       </UserProvider>
//     </Router>
//   );
// };

export const kardsRender = (children: JSX.Element): RenderResult => {
  return render(
    <Router history={history}>
      <GameProvider>
        <UserProvider>
          <HandProvider>
            <VoteProvider>
              <UsersProvider>{children}</UsersProvider>
            </VoteProvider>
          </HandProvider>
        </UserProvider>
      </GameProvider>
    </Router>
  );
};

export const kardsHookRender = <TProps, TResult>(
  callback: (props: TProps) => TResult
) => {
  return renderHook(callback, {
    wrapper: ({ children }) => (
      <Router history={history}>
        <GameProvider>
          <UserProvider>
            <HandProvider>
              <VoteProvider>
                <UsersProvider>{children}</UsersProvider>
              </VoteProvider>
            </HandProvider>
          </UserProvider>
        </GameProvider>
      </Router>
    ),
  });
};
