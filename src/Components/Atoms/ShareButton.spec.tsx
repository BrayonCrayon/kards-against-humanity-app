import { render } from "@testing-library/react";
import ShareButton from "@/Components/Atoms/ShareButton";
import userEvent from "@testing-library/user-event";
import { webShare } from "@/Types/WebShare";

const mocks = vi.hoisted(() => ({
  errorToast: vi.fn(),
}));

vi.mock("@/Hooks/Notification/useToasts", () => ({
  useToasts: () => ({
    errorToast: mocks.errorToast,
  }),
}));

const renderComponent = () => {
  return render(<ShareButton />);
};

describe("ShareButton", () => {
  it("will check if user can share", async () => {
    const webSpy = vi.spyOn(webShare, "canShare").mockImplementationOnce(vi.fn());
    const wrapper = renderComponent();

    await userEvent.click(wrapper.getByRole("share-button"));

    expect(webSpy).toHaveBeenCalled();
    webSpy.mockRestore();
  });

  it("will share data", async () => {
    const webSpy = vi.spyOn(webShare, "canShare").mockImplementationOnce(vi.fn());
    const share = vi.spyOn(webShare, "share");
    const wrapper = renderComponent();

    await userEvent.click(wrapper.getByRole("share-button"));

    expect(share).toHaveBeenCalled();
    webSpy.mockRestore();
    share.mockRestore();
  });

  it("will catch error when user cannot share", async () => {
    const webSpy = vi.spyOn(webShare, "share").mockRejectedValueOnce("Error");
    const wrapper = renderComponent();

    await userEvent.click(wrapper.getByRole("share-button"));

    expect(mocks.errorToast).toHaveBeenCalled();
    webSpy.mockRestore();
  });
});
