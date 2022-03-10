import {
  AlertContext,
  IAlert,
  IAlertContext,
  initialState,
} from "./AlertContext";
import React, { useCallback, useState } from "react";

interface AlertContextProviderProps {
  value: IAlertContext;
}

const AlertContextProvider: React.FC<AlertContextProviderProps> = ({
  value = initialState,
  children,
}) => {
  const [alerts, setAlerts] = useState<IAlert[]>(value.alerts);

  const removeAlert = useCallback(
    (alert: IAlert) => {
      setAlerts(alerts.filter((item) => item !== alert));
    },
    [setAlerts]
  );

  return (
    <AlertContext.Provider
      value={{
        alerts,
        setAlerts,
        removeAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContextProvider;
