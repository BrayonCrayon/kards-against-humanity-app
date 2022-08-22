import { FC } from "react";
import { Button } from "Components/Button";


export const CreateGameBanner: FC = () => {

  return <div className="bg-black text-white py-7">
    <h3 className="font-bold text-3xl text-center leading-relaxed">
      Looking To <br />Create A Game?
    </h3>
    <div className="flex justify-center mt-4">

      <Button text="Create One Now" variant="light-outline" className="w-3/4" />
    </div>
  </div>;
};
