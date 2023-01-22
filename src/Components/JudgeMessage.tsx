import {User} from "Types/User";
import {FC, useMemo} from "react";

interface JudgeMessageProps {
  user: User;
  judgeId: number;
  users: User[];
  className?: string;
}

const JudgeMessage: FC<JudgeMessageProps> = ({
  user,
  judgeId,
  users,
  className = "",
}) => {
  const allPlayersSubmitted = useMemo(() => {
    return users.filter(user => user.id !== judgeId).every(user => user.hasSubmittedWhiteCards);
  }, [users, judgeId]);

  return (
    <>
      {user.id === judgeId && (!allPlayersSubmitted || users.length === 1) && (
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
