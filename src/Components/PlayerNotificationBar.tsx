import { User } from "../Types/User";
import { FC, useMemo } from "react";

interface PlayerNotificationBarProps {
  users: User[];
  judge: User;
}

const PlayerNotificationBar: FC<PlayerNotificationBarProps> = ({
  users,
  judge,
}) => {
  const nonJudgeUsers = useMemo(() => {
    return users.filter((item) => item.id !== judge.id);
  }, [users, judge]);

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
    <div className="w-full flex justify-center my-1 mx-2 py-1 rounded-full bg-gray-800 text-white font-semibold">
      <div data-testid="player-submitted-info">{infoMessage}</div>
    </div>
  );
};

export default PlayerNotificationBar;
