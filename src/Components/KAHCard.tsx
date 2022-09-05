import { FC } from "react";

interface KAHCardProps {
  className?: string
}

export const KAHCard: FC<KAHCardProps> = ({children, className}) => {

  return (<div className={`bg-white flex flex-col p-4 shadow-xl ${className}`}>
    {children}
  </div>)
}