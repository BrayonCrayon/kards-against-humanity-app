import { FC } from "react";

interface KAHCardProps {
  className?: string
}

export const KAHCard: FC<KAHCardProps> = ({children, className}) => {

  return (<div className={`bg-white flex flex-col p-4 shadow-xl md:w-4/5 xl:w-1/2 ${className}`}>
    {children}
  </div>)
}