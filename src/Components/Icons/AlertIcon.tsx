import { FC } from "react";

interface AlertIconProps {
  className?: string;
  dataTestId?: string;
}

const AlertIcon: FC<AlertIconProps> = ({ className = "", dataTestId = "" }) => {
  return (
    <svg
      data-testid={dataTestId}
      className={className}
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="48.5" stroke="black" stroke-width="3" />
      <path
        d="M54.5564 23.3207L53.8364 56.3687H48.0044L47.2124 23.3207H54.5564ZM50.9564 63.7847C52.3964 63.7847 53.5964 64.2647 54.5564 65.2247C55.5164 66.1847 55.9964 67.3607 55.9964 68.7527C55.9964 70.1447 55.5164 71.3447 54.5564 72.3527C53.5964 73.3127 52.3964 73.7927 50.9564 73.7927C49.5644 73.7927 48.3884 73.3127 47.4284 72.3527C46.4684 71.3447 45.9884 70.1447 45.9884 68.7527C45.9884 67.3607 46.4684 66.1847 47.4284 65.2247C48.3884 64.2647 49.5644 63.7847 50.9564 63.7847Z"
        fill="black"
      />
    </svg>
  );
};

export default AlertIcon;
