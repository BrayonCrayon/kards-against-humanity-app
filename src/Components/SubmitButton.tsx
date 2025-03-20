import React, { FC, useCallback, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Button, ButtonVariant } from "@/Components/Atoms/Button";

interface SubmitButtonProps {
  show: boolean;
  timeout?: number;
  onSubmit?: () => void;
  transitionClassName: string;
  buttonClass: string;
  dataTestId?: string;
}

const SubmitButton: FC<SubmitButtonProps> = ({
  show,
  timeout = 300,
  onSubmit = () => {},
  transitionClassName = "",
  buttonClass = "",
  dataTestId = "",
}) => {
  const [loading, setLoading] = useState(false);
  const nodeRef = useRef(null);

  const onClick = useCallback(async () => {
    setLoading(true);
    await onSubmit();
    setLoading(false);
  }, [loading, onSubmit]);

  return (
    <CSSTransition nodeRef={nodeRef} in={show} timeout={timeout} unmountOnExit classNames={transitionClassName}>
      <Button
        ref={nodeRef}
        variant={ButtonVariant["submit-test"]}
        text="Submit"
        className={buttonClass}
        iconClass="text-emerald-500 justify-self-end"
        beforeLoadingClass="flex w-3/4 gap-2 items-center"
        isLoading={loading}
        onClick={() => onClick()}
        dataTestid={dataTestId}
      >
        <img alt="submit icon" src="/images/green-check.png" />
      </Button>
    </CSSTransition>
  );
};

export default SubmitButton;
