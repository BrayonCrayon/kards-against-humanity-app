import { WhiteCard } from "@/Types/WhiteCard";

export interface IHandState {
  hand: WhiteCard[];
}

export const initialHandState: IHandState = {
  hand: [],
};
