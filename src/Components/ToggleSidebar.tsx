import { FC, useState } from "react";
import { Button } from "./Button";

interface ToggleSidebarProps {
  toggleElement?: JSX.Element;
  dataTestId?: string;
  className?: string;
  sideBarStyles?: string;
}

const ToggleSidebar: FC<ToggleSidebarProps> = ({
  toggleElement = <Button text="toggle" />,
  dataTestId = "",
  className = "",
  children,
  sideBarStyles = ""
}) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div
        className={className}
        onClick={() => setShow(!show)}
        data-testid={dataTestId}
      >
        {toggleElement}
      </div>
      {show && (
        <div
          className="w-screen h-screen fixed z-50 top-0 left-0 bg-white bg-opacity-75 flex cursor-pointer"
          data-testid="sidebar"
        >
          <div
            onClick={() => setShow(!show)}
            data-testid="sidebar-background"
            className="h-screen flex-1"
          />
          <div className={`w-3/4 border-l border-black shadow-md bg-white h-screen relative max-w-xs cursor-auto ${sideBarStyles}`}>
            <button
              className="absolute top-1 left-2 text-black cursor-pointer z-60 hover:text-gray-500"
              data-testid="close-button"
              onClick={() => setShow(!show)}
            >
              <i className="fa-solid fa-arrow-left text-3xl" />
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default ToggleSidebar;
