import { FC, Fragment, useState } from "react";

const ToggleSidebar: FC = () => {
  const [show, setShow] = useState(false);

  return (
    <Fragment>
      <button onClick={() => setShow(!show)} data-testid="toggle-button">
        hello
      </button>
      {show && <div data-testid="side-nav">no way</div>}
    </Fragment>
  );
};

export default ToggleSidebar;
