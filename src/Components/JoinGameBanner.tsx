import { FC } from "react";
import { Button, ButtonVariant } from "Components/Atoms/Button";
import { useHistory } from "react-router-dom";


export const JoinGameBanner: FC = () => {
  const history = useHistory();

  function createGame(){
    history.push('/create');
  }

  return <div className="bg-black text-white py-7 md:mx-16 md:mt-8 md:mb-16">
    <h3 className="font-bold text-3xl text-center leading-relaxed">
      Looking To <br />Create A Game?
    </h3>
    <div className="flex justify-center mt-4">

      <Button text="Create One Now"
              variant={ButtonVariant["light-outline"]}
              className="w-3/4 md:w-1/3"
              onClick={createGame}
      />
    </div>
  </div>;
};
