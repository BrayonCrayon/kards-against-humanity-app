import { FC } from "react";

const KAHNotification: FC = () => {
  return (
    <div className="w-[400px] h-[75px] fixed top-1/2 left-1/2 translate-[-50%] border border-lukewarmGray-100 shadow-xl p-2 rounded bg-white animate-notification">
      Hello
      <div className="absolute bottom-0 left-0 h-[5px] animate-progress-bar bg-red-500"></div>
    </div>
  );
};

export default KAHNotification;
