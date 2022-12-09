import { User } from "Types/User";
import { FC, useMemo } from "react";

interface PlayerNotificationBarProps {
  users: User[];
  judgeId: number;
}

const PlayerNotificationBar: FC<PlayerNotificationBarProps> = ({
  users,
  judgeId,
}) => {
  const nonJudgeUsers = useMemo(() => {
    return users.filter((item) => item.id !== judgeId);
  }, [users, judgeId]);

  const totalSubmittedAmount = useMemo(() => {
    return nonJudgeUsers.filter((item) => item.hasSubmittedWhiteCards).length;
  }, [nonJudgeUsers]);

  const infoMessage = useMemo(() => {
    return nonJudgeUsers.length === 0 ||
      nonJudgeUsers.length > totalSubmittedAmount
      ? `${totalSubmittedAmount}/${nonJudgeUsers.length} Players Submitted`
      : "Prepare for Judgement!";
  }, [nonJudgeUsers, totalSubmittedAmount]);

  return (
    <div className="w-full flex justify-center bg-gray-800 text-white font-semibold py-1">
      <div data-testid="player-submitted-info">{infoMessage}</div>
    </div>
  );
};

export default PlayerNotificationBar;
