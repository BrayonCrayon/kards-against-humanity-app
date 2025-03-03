import { render } from "@testing-library/react";
import ShareButton from "@/Components/Atoms/ShareButton";
import userEvent from "@testing-library/user-event";
import { webShare } from "@/Types/WebShare";
import { errorToast } from "@/Utilities/toasts";

jest.mock("@/Utilities/toasts", () => ({
  errorToast: jest.fn()
}))

const renderComponent = () => {
  return render(<ShareButton />);
}

describe("ShareButton", () => {
  it("will check if user can share", async () => {
    const webSpy = jest.spyOn(webShare, "canShare").mockImplementationOnce(jest.fn());
    const wrapper = renderComponent();

    await userEvent.click(wrapper.getByRole("share-button"));

    expect(webSpy).toHaveBeenCalled();
    webSpy.mockRestore();
  });

  it("will share data", async () => {
    const webSpy = jest.spyOn(webShare, "canShare").mockImplementationOnce(jest.fn());
    const share = jest.spyOn(webShare, "share");
    const wrapper = renderComponent();

    await userEvent.click(wrapper.getByRole("share-button"));

    expect(share).toHaveBeenCalled();
    webSpy.mockRestore();
    share.mockRestore();
  });

  it("will catch error when user cannot share", async () => {
    const webSpy = jest.spyOn(webShare, "share").mockRejectedValueOnce("Error");
    const wrapper = renderComponent();

    await userEvent.click(wrapper.getByRole("share-button"));

    expect(errorToast).toHaveBeenCalled();
    webSpy.mockRestore();
  });
})