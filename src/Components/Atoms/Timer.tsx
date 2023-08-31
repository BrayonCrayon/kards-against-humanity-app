import {FC, useEffect, useState} from "react";
import {toMinutesSeconds} from "Utilities/helpers";
import moment from "moment";

interface TimerProps {
  /** Timestamp in Seconds */
  end: number;
  onEnd?: () => void;
}

const Timer: FC<TimerProps> = ({ end , onEnd = () => {}}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const difference = moment.unix(end).diff(moment(), "seconds");
      if (difference <= 0) {
        onEnd();
      }
      setSeconds(difference)
    }, 1000)

    return () => clearTimeout(timer)
  }, [seconds])

  useEffect(() => {
    setSeconds(moment.unix(end).diff(moment(), "seconds"));
  }, []);

  return (
  <div data-testid="timer" className=" sticky bottom-2 left-2 w-20 shadow-lg rounded-full flex flex-col items-center py-2 bg-white border border-gray-100">
    <img src="/images/timer.svg" alt="timer image" />
    <p className="font-bold text-sm pt-1">{toMinutesSeconds(seconds)}</p>
  </div>
  );
}

export default Timer;