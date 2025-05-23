import { FC, JSX, PropsWithChildren, useState } from "react";
import { Button } from "@/Components/Atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface ToggleSidebarProps extends PropsWithChildren {
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
          className="w-screen h-screen fixed z-50 top-0 left-0 bg-white/75 flex cursor-pointer"
          data-testid="sidebar"
        >
          <div
            onClick={() => setShow(!show)}
            data-testid="sidebar-background"
            className="h-screen flex-1"
          />
          <div className={`w-3/4 border-l border-black shadow-md bg-white h-screen relative max-w-xs cursor-auto md:w-1/2 xl:w-1/4 ${sideBarStyles}`}>
            <button
              className="absolute top-1 left-2 text-black cursor-pointer z-60 hover:text-gray-500"
              data-testid="close-button"
              onClick={() => setShow(!show)}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-3xl" />
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default ToggleSidebar;
