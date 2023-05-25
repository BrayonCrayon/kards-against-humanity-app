import {FC, PropsWithChildren} from "react";

interface KAHCardProps extends PropsWithChildren {
  className?: string
}

export const KAHCard: FC<KAHCardProps> = ({children, className}) => {

  return (<div className={`bg-white flex flex-col p-4 shadow-xl ${className}`}>
    {children}
  </div>)
}