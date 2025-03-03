import { spyOnUseGame } from "@/Tests/testHelpers";
import { gameFactory } from "@/Tests/Factories/GameFactory";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { kardsRender } from "@/Tests/testRenders";
import GameSettingsTab from "./GameSettingsTab";
import React from "react";
import { toMinutesSeconds } from "@/Utilities/helpers";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";


describe("GameSettingsTab", () => {

    it("will show leave and update settings button when user is in game", () => {
        const spyInstance = spyOnUseGame(jest.fn(), { game: gameFactory(), blackCard: blackCardFactory()});
        const wrapper = kardsRender(<GameSettingsTab />);

        expect(wrapper.queryByTestId("update-settings")).toBeInTheDocument();
        expect(wrapper.queryByTestId("leave-game")).toBeInTheDocument();
        spyInstance.mockRestore();
    });

    it("will not show leave and update settings buttons when user is not in game", () => {
        const wrapper = kardsRender(<GameSettingsTab />);

        expect(wrapper.queryByTestId("update-settings")).not.toBeInTheDocument();
        expect(wrapper.queryByTestId("leave-game")).not.toBeInTheDocument();
    });

    it.skip("will set animation toggle and timer when values are provided", () => {
        const options = { timer: 150, hasAnimations: true };
        spyOnUseGame(jest.fn(), { game: gameFactory(), blackCard: blackCardFactory() });
        const wrapper = kardsRender(<GameSettingsTab options={options} />);

        expect(wrapper.queryByText(toMinutesSeconds(options.timer))).toBeInTheDocument();
        expect(wrapper.getByTestId("animation-toggle").innerHTML).toContain("fa-toggle-on");
    });

    it("will call update callback when timer has been updated", async () => {
        const callback = jest.fn();
        spyOnUseGame(jest.fn(), { game: gameFactory(), blackCard: blackCardFactory() });
        const wrapper = kardsRender(<GameSettingsTab onUpdatedSettings={callback}/>);

        await userEvent.click(wrapper.getByTestId("timer-toggle"));

        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith({ timer: 180, hasAnimations: false});
        });
    });

    it.skip("will call update callback when animations have been toggled", async () => {
        const callback = jest.fn();
        spyOnUseGame(jest.fn(), { game: gameFactory(), blackCard: blackCardFactory() });
        const wrapper = kardsRender(<GameSettingsTab onUpdatedSettings={callback}/>);

        await userEvent.click(wrapper.getByTestId("animation-toggle"));

        await waitFor(() => {
            expect(callback).toHaveBeenCalledWith({timer: null, hasAnimations: true});
        });
    });
});