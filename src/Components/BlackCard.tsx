import React from "react";

interface BlackCardProps {
  id: number;
  text: string;
}

export const BlackCard: React.FC<BlackCardProps> = ({ id, text }) => {
  return <div>{text}</div>;
};
