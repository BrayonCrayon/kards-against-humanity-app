import { FC, useState } from "react";
import { Button } from "./Button";

interface ToggleSidebarProps {
  toggleElement?: JSX.Element;
  dataTestId?: string;
  className?: string;
}

const ToggleSidebar: FC<ToggleSidebarProps> = ({
  toggleElement = <Button text="toggle" />,
  dataTestId = "",
  className = "",
  children,
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
          className="w-screen h-screen fixed z-50 top-0 left-0 bg-white bg-opacity-75 flex"
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
    </>
  );
};

export default ToggleSidebar;
