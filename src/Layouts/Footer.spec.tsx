import { kardsRender } from "@/Tests/testRenders";
import Footer from "@/Layouts/Footer";

const renderComponent = () => {
  return kardsRender(<Footer />);
};

const mocks = vi.hoisted(() => ({
  useLocation: vi.fn()
}))

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useLocation: mocks.useLocation,
  useNavigate: vi.fn()
}));

describe("Footer", () => {
  it("will show join game footer", () => {
    mocks.useLocation.mockImplementation(() => ({ pathname: "/create" }));
    const wrapper = renderComponent();

    expect(wrapper.queryByText("Create One Now")).toBeFalsy();
    expect(wrapper.queryByText("Join One Now")).toBeTruthy();
  });

  it("will show create game footer when on join page", () => {
    mocks.useLocation.mockImplementation(() => ({ pathname: "/" }));
    const wrapper = renderComponent();

    expect(wrapper.queryByText("Create One Now")).toBeTruthy();
    expect(wrapper.queryByText("Join One Now")).toBeFalsy();
  });

  it("will not show footer when user is playing a game", () => {
    mocks.useLocation.mockImplementation(() => ({ pathname: "/game" }));
    const wrapper = renderComponent();

    expect(wrapper.queryByText("Create One Now")).toBeFalsy();
    expect(wrapper.queryByText("Join One Now")).toBeFalsy();
  });
});
