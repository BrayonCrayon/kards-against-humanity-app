import { FC, useCallback, useMemo, useState } from "react";
import { ExpansionOption } from "Types/Expansion";
import { KAHToggler } from "../../KAHToggler";
import ExpansionCard from "../../ExpansionCard";
import { KAHRange } from "../../Atoms/KAHRange";
import { toMinutesSeconds } from "../../../Utilities/helpers";

interface TimerTabProps {
  onChange: (seconds: number) => void;
}

export const TimerTab: FC<TimerTabProps> = ({ onChange }) => {
  const [timerOn, setTimerOn] = useState(true);
  const [seconds, setSeconds] = useState(150);

  const onToggle = useCallback(async () => {
    await onChange(timerOn ? 0 : 150);
    await setSeconds(timerOn ? 0 : 150);

    setTimerOn(!timerOn);
  }, [timerOn, setTimerOn]);

  return (
    <>
      <div className="flex h-5% px-5 py-2 items-center justify-end">
        <KAHToggler role="toggle-timer" on={timerOn} onText="Use Timer" offText="Use Timer" onClick={onToggle} />
      </div>
      <div className="overflow-y-scroll px-2 rounded">
        <p className="text-6xl text-center font-bold mb-4">{toMinutesSeconds(seconds)}</p>
        <KAHRange name="timer" dataTestid="range-timer" onChange={(value) => setSeconds(value)} max={300} />
        <p className="text-sm text-gray-500 text-center mt-4">Max. 5 Minutes</p>
      </div>
    </>
  );
};
