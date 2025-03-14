import "@testing-library/jest-dom/vitest";
import Navigation from "@/Layouts/Navigation";
import { kardsRender } from "@/Tests/testRenders";

const renderComponent = () => {
  return kardsRender(<Navigation />);
}

const mocks = vi.hoisted(() => ({
  useLocation: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Link: () => <div></div>,
    useLocation: mocks.useLocation,
  };
});

describe("Navigation", () => {
  it("will show navigation", () => {
    mocks.useLocation.mockImplementation(() => ({ pathname: '' }));

    const wrapper = renderComponent();

    expect(wrapper.container.querySelector('nav')).toBeInTheDocument();
  });

  it("will not show navigation when user is playing", () => {
    mocks.useLocation.mockImplementation(() => ({ pathname: '/game/asjdfkhjaskdfhkasdjf' }))

    const wrapper = renderComponent();

    expect(wrapper.container.querySelector('nav')).not.toBeInTheDocument();
  });

  it("will not show join game link when on the create page", () => {
    mocks.useLocation.mockImplementation(() => ({ pathname: '/create' }))

    const wrapper = renderComponent();

    expect(wrapper.container.querySelector('a[href="/create"]')).not.toBeInTheDocument();
  });
})