import { User } from "../Types/User";
import { FC } from "react";

interface JudgeMessageProps {
  user: User;
  judge: User;
}

const JudgeMessage: FC<JudgeMessageProps> = ({ user, judge }) => {
  return (
    <>
      {user.id === judge.id && (
        <div data-testid="judge-message" className="">
          You are judging!
        </div>
      )}
    </>
  );
};

export default JudgeMessage;
