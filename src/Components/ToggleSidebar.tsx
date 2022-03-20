import { FC, Fragment, useState } from "react";

interface ToggleSidebarProps {
  buttonClass?: string;
}

const ToggleSidebar: FC<ToggleSidebarProps> = ({ buttonClass = "" }) => {
  const [show, setShow] = useState(false);

  return (
    <Fragment>
      <button
        onClick={() => setShow(!show)}
        data-testid="toggle-button"
        className={buttonClass}
      >
        hello
      </button>
      {show && <div data-testid="side-nav">no way</div>}
    </Fragment>
  );
};

export default ToggleSidebar;
