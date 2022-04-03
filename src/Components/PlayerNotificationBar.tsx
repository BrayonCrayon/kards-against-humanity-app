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

  return (
    <div>
      <div data-testid="player-submitted-info">
        {totalSubmittedAmount}/{nonJudgeUsers.length} Players Submitted
      </div>
    </div>
  );
};

export default PlayerNotificationBar;
