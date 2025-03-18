import { FC } from "react";
import { Button, ButtonVariant } from "@/Components/Atoms/Button";
import { useNavigate } from "react-router-dom";

const CreateGameBanner: FC = () => {
  const navigate = useNavigate();

  function joinGame() {
    navigate("/");
  }

  return (
    <div className="mt-auto bg-black text-white py-7 w-full ">
      <h3 className="font-bold text-3xl text-center leading-relaxed">
        Looking To
        {" "}
        <br />
        Join A Game?
      </h3>
      <div className="flex justify-center mt-4">
        <Button
          text="Join One Now"
          variant={ButtonVariant["light-outline"]}
          className="w-3/4 md:w-1/3"
          onClick={joinGame}
        />
      </div>
    </div>
  );
};

export default CreateGameBanner;
