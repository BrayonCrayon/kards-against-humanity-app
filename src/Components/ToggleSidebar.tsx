import { FC, Fragment, useState } from "react";

interface ToggleSidebarProps {
  buttonClass?: string;
  buttonText?: string;
}

const ToggleSidebar: FC<ToggleSidebarProps> = ({
  buttonClass = "",
  buttonText = "",
  children,
}) => {
  const [show, setShow] = useState(false);

  return (
    <Fragment>
      <button
        onClick={() => setShow(!show)}
        data-testid="toggle-button"
        className={buttonClass}
      >
        {buttonText}
      </button>
      {show && <div data-testid="sidebar">{children}</div>}
    </Fragment>
  );
};

export default ToggleSidebar;
