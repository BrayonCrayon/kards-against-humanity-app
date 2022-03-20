import { FC, Fragment, useState } from "react";
import { Button } from "./Button";

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
      <Button
        onClick={() => setShow(!show)}
        dataTestid="toggle-button"
        className={buttonClass}
        text={buttonText}
      />
      {show && (
        <div
          className="w-1/2 h-screen fixed top-0 left-0 bg-white transition ease-in duration-700"
          data-testid="sidebar"
        >
          <button data-testid="close-button" onClick={() => setShow(!show)}>
            <i className="far fa-times-circle" />
          </button>
          {children}
        </div>
      )}
    </Fragment>
  );
};

export default ToggleSidebar;
