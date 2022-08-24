import { FC } from "react";
import { Button } from "Components/Button";
import { useHistory } from "react-router-dom";


export const CreateGameBanner: FC = () => {
  const history = useHistory();

  function createGame(){
    history.push('/create');
  }

  return <div className="bg-black text-white py-7 md:mx-16 md:mt-8 md:mb-16">
    <h3 className="font-bold text-3xl text-center leading-relaxed">
      Looking To <br />Create A Game?
    </h3>
    <div className="flex justify-center mt-4">

      <Button text="Create&nbsp;&nbsp;One Now" variant="light-outline" className="w-3/4 md:w-1/3" onClick={createGame}/>
    </div>
  </div>;
};
