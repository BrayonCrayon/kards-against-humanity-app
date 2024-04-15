import { randNumber, randText } from "@ngneat/falso";
import { IWhiteCard, WhiteCard } from "Types/WhiteCard";


export const whiteCardFactory = (overrides?: Partial<IWhiteCard>): WhiteCard => {
    const props = {
        id: randNumber({ min: 1 }),
        text: randText(),
        expansionId: 0,
        order: 0,
        selected: false,
        ...overrides
    };
    return new WhiteCard(
      props.id,
      props.text,
      props.expansionId,
      props.selected,
      props.order
    );
};