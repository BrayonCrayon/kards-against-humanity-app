import "@testing-library/jest-dom/vitest";
import { kardsRender } from "@/Tests/testRenders";
import Navigation from "@/Layouts/Navigation";
import { useLocation } from "react-router-dom";
import { Mocked } from "vitest";

const renderComponent = () => {
  return kardsRender(<Navigation />);
}

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useLocation: vi.fn()
}));

const mockedUseLocation = useLocation as Mocked<typeof useLocation>;

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