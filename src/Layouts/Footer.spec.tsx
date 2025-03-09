import { kardsRender } from "@/Tests/testRenders";
import Footer from "@/Layouts/Footer";
import { useLocation } from "react-router-dom";

const renderComponent = () => {
  return kardsRender(<Footer />);
};

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useLocation: vi.fn(),
}));

const mockedUseLocation = useLocation as vi.Mocked<typeof useLocation>;

describe("Footer", () => {
  it("will show join game footer", () => {
    // @ts-ignore
    mockedUseLocation.mockImplementation(() => ({ pathname: "/create" }));
    const wrapper = renderComponent();

    expect(wrapper.queryByText("Create One Now")).toBeFalsy();
    expect(wrapper.queryByText("Join One Now")).toBeTruthy();
  });

  it("will show create game footer when on join page", () => {
    // @ts-ignore
    mockedUseLocation.mockImplementation(() => ({ pathname: "/" }));
    const wrapper = renderComponent();

    expect(wrapper.queryByText("Create One Now")).toBeTruthy();
    expect(wrapper.queryByText("Join One Now")).toBeFalsy();
  });

  it("will not show footer when user is playing a game", () => {
    // @ts-ignore
    mockedUseLocation.mockImplementation(() => ({ pathname: "/game" }));
    const wrapper = renderComponent();

    expect(wrapper.queryByText("Create One Now")).toBeFalsy();
    expect(wrapper.queryByText("Join One Now")).toBeFalsy();
  });
});
