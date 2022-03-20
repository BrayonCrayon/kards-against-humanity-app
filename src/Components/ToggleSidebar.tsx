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
          className="w-screen h-screen fixed top-0 left-0 bg-white bg-opacity-75 flex"
          data-testid="sidebar"
        >
          <div className="w-3/4 border-r border-black shadow-md bg-white h-screen relative md:w-1/2">
            <button
              className="absolute top-1 right-2 hover:text-red-700"
              data-testid="close-button"
              onClick={() => setShow(!show)}
            >
              <i className="far fa-times-circle text-3xl" />
            </button>
            {children}
          </div>
          <div
            onClick={() => setShow(!show)}
            data-testid="sidebar-background"
            className="w-1/4 h-screen md:w-1/2"
          />
        </div>
      )}
    </Fragment>
  );
};

export default ToggleSidebar;
