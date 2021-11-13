import { createContext } from "react";

export type AlertType = "info" | "danger" | "success" | "warning" | "dark";

export interface IAlert {
  type: AlertType;
  text: string;
}

export interface IAlertContext {
  alerts: IAlert[];
}

export const initialState: IAlertContext = {
  alerts: [],
};

export const AlertContext = createContext<IAlertContext>(initialState);
