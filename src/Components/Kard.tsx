import React from "react";

interface KardProps {
  id: number;
  text: string;
}

export const Kard: React.FC<KardProps> = ({ id, text }) => {
  return (
    <div
      className="border border-black rounded shadow-md p-8 text-3xl font-weight-800"
      data-testid={`white-card-${id}`}
    >
      {text}
      <div>Kards Against Humanity</div>
    </div>
  );
};
