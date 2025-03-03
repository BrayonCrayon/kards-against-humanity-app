import { kardsRender } from "@/Tests/testRenders";
import Navigation from "Layouts/Navigation";
import { useLocation } from "react-router-dom";

const renderComponent = () => {
  return kardsRender(<Navigation />);
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));

const mockedUseLocation = useLocation as jest.Mocked<typeof useLocation>;

describe("Navigation", () => {
  it("will show navigation", () => {
    // @ts-ignore
    mockedUseLocation.mockImplementation(() => ({ pathname: '' }));
    const wrapper = renderComponent();
    expect(wrapper.container.querySelector('nav')).toBeInTheDocument();
  });

  it("will not show navigation when user is playing", () => {
    // @ts-ignore
    mockedUseLocation.mockImplementation(() => ({ pathname: '/game/asjdfkhjaskdfhkasdjf' }))
    const wrapper = renderComponent();
    expect(wrapper.container.querySelector('nav')).not.toBeInTheDocument();
  });

  it("will not show join game link when on the create page", () => {
    // @ts-ignore
    mockedUseLocation.mockImplementation(() => ({ pathname: '/create' }))
    const wrapper = renderComponent();

    expect(wrapper.container.querySelector('a[href="/create"]')).not.toBeInTheDocument();
  });
})