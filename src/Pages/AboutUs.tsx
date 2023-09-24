import {FC} from "react";

const AboutUs: FC = () => {
  return (
    <div>
      <div className="flex justify-center mt-10">
        <img src="images/logo.png" alt="KAH Logo" className="w-32" />
      </div>
      <div className="flex justify-center mt-10">
        <div className="border-2 border-black w-14"></div>
      </div>
      <div className="flex flex-col max-w-4xl mx-auto center mt-10 px-4 md:px-12">
        <h1 className="text-2xl font-bold self-center tracking-light pb-6 md:text-center">Kards Against Humanity.</h1>
        <p className="pb-5">
          Kards against humanity is a free to play digital version of cards against humanity. There are so many free to
            play versions of this out there and none exceed to our expectations of what it can be. So this site is an
            attempt to make a game playable to what it would be like with real cards.
        </p>
        <p className="pb-5">
          How do you play? Well It&apos;s pretty simple, put in a fake name, create a game and the rest is very similar
            to the real thing, some folks will get offended and others will laugh. If the person judging finds it
            funny you get a point, and keep playing till you had your fill.
        </p>
        <p className="pb-5">
          If you have any issues with our game and can&apos;t figure it out, well too bad…again it&apos;s a free game
          we&apos;re not even putting google ads on the home page. But we still appreciate feedback on your experience
          ;)
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
