import React, { useContext } from "react";
import { AlertContext } from "../../State/Alert/AlertContext";
import Alert from "./Alert";

const ShowAlerts: React.FC = () => {
  const { alerts } = useContext(AlertContext);

  return (
    <div>
      {alerts.map((alert, index) => (
        <Alert alert={alert} id={index + 1} key={index} />
      ))}
    </div>
  );
};

export default ShowAlerts;
