import { createContext } from "react";
import { setState } from "../GeneralTypes";

export type AlertType = "info" | "danger" | "success" | "warning" | "dark";

export interface IAlert {
  type: AlertType;
  text: string;
}

export interface IAlertContext {
  alerts: IAlert[];
  setAlerts: setState<IAlert[]>;
  removeAlert: (alert: IAlert) => void;
}

export const initialState: IAlertContext = {
  alerts: [],
  setAlerts: () => {},
  removeAlert: () => {},
};

export const AlertContext = createContext<IAlertContext>(initialState);
