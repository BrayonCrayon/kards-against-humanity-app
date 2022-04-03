import { User } from "../Types/User";
import { FC } from "react";

interface JudgeMessageProps {
  user: User;
  judge: User;
  className?: string;
}

const JudgeMessage: FC<JudgeMessageProps> = ({
  user,
  judge,
  className = "",
}) => {
  return (
    <>
      {user.id === judge.id && (
        <div
          data-testid="judge-message"
          className={`flex flex-col w-full ${className}`}
        >
          <i className="fas fa-user-secret text-8xl self-center" />
          <p className="text-center font-bold text-2xl">You are judging!</p>
        </div>
      )}
    </>
  );
};

export default JudgeMessage;
