import React, { useCallback, useState } from "react";

interface KardProps {
  id: number;
  text: string;
}

export const WhiteKard: React.FC<KardProps> = ({ id, text }) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const toggle = useCallback(() => {
    setIsSelected(!isSelected);
  }, [isSelected, setIsSelected]);

  return (
    <div
      className={`rounded shadow-md p-8 text-xl md:text-3xl font-weight-800 flex flex-col justify-between ${
        isSelected ? "border-4 border-blue-400" : "border border-black"
      }`}
      onClick={toggle}
      data-testid={`white-card-${id}`}
    >
      <span>{text}</span>
      <div className="text-xs self-end hidden md:block">
        Kards Against Humanity
      </div>
    </div>
  );
};
