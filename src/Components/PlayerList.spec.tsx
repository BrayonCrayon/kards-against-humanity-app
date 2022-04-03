import { kardsRender } from "Tests/testRenders";
import PlayerList from "./PlayerList";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { transformUsers } from "Types/User";
import { waitFor } from "@testing-library/react";

const users = transformUsers(gameStateExampleResponse.data.users);

describe("PlayerList", () => {
  it("will render", () => {
    const wrapper = kardsRender(<PlayerList users={users} />);
    expect(wrapper).toBeTruthy();
  });

  it("will display users", async () => {
    const wrapper = kardsRender(<PlayerList users={users} />);

    await waitFor(() => {
      users.forEach((user) =>
        expect(wrapper.queryByTestId(`user-${user.id}`)).toBeInTheDocument()
      );
    });
  });
});
