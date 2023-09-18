import {FC, useCallback, useState} from "react";
import {KAHToggler} from "Components/KAHToggler";
import {KAHRange} from "Components/Atoms/KAHRange";
import {toMinutesSeconds} from "Utilities/helpers";
import {Button} from "Components/Atoms/Button";

interface TimerTabProps {
  onChange: (seconds: number) => void;
  onUpdate?: (seconds: number) => void;
  timer?: number | null;
  min?: number;
  max?: number;
}

export const TimerTab: FC<TimerTabProps> = ({ onChange, onUpdate, min = 60, max = 300, timer = 0 }) => {
  const [timerOn, setTimerOn] = useState(!!timer);
  const [seconds, setSeconds] = useState(timer ?? 0);

  const onToggle = useCallback(async () => {
    await onChange(timerOn ? 0 : (max + min) / 2);
    await setSeconds(timerOn ? 0 : (max + min) / 2);

    setTimerOn(!timerOn);
  }, [timerOn, setTimerOn]);

  return (
    <>
      <div className="flex h-5% px-5 py-2 items-center justify-end">
        <KAHToggler role="toggle-timer" on={timerOn} onText="Use Timer" offText="Use Timer" onClick={onToggle} />
      </div>
      <div className="overflow-y-auto px-2 rounded">
        <p className={`text-6xl text-center font-bold mb-4 ${!timerOn ? "opacity-25" : ""}`}>
          {toMinutesSeconds(seconds)}
        </p>
        <KAHRange
          disabled={!timerOn}
          name="timer"
          dataTestid="range-timer"
          onChange={(value) => {
            setSeconds(value);
            onChange(value);
          }}
          timeLimit={seconds}
          max={max}
          min={min}
        />
        <p className="text-sm text-gray-500 text-center mt-4">Max. 5 Minutes</p>
      </div>
      {
        onUpdate &&
        <Button
        className="w-full"
            text="Update" dataTestid="update-timer" onClick={() => onUpdate(seconds)} />
      }
    </>
  );
};
