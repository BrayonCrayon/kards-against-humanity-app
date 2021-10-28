import React from "react";

interface KardProps {
  id: number;
  text: string;
}

export const Kard: React.FC<KardProps> = ({ id, text }) => {
  return (
    <div
      className="border border-black rounded shadow-md p-8 text-xl md:text-3xl font-weight-800 flex flex-col justify-between"
      data-testid={`white-card-${id}`}
    >
      <span>{text}</span>
      <div className="text-xs self-end hidden md:block">
        Kards Against Humanity
      </div>
    </div>
  );
};
