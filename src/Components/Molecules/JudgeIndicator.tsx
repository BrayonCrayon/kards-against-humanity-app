import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGavel } from "@fortawesome/free-solid-svg-icons";

const JudgeIndicator: FC = () => {
  return (
    <div
      data-testid="judge-message"
      className="flex items-center justify-around border border-lukewarmGray-100 shadow-md border-lukewarmgray-50 w-[160px] px-2 py-1 bg-white rounded-full font-semibold"
    >
      <FontAwesomeIcon icon={faGavel} />
      <p>You're Judging</p>
    </div>
  );
};

export default JudgeIndicator;
