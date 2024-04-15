import { randNumber, randText } from "@ngneat/falso";
import { BlackCard } from "Types/BlackCard";

export const blackCardFactory = (overrides?: Partial<BlackCard>): BlackCard => {
    const props = {
        id: randNumber({ min: 1 }),
        text: randText(),
        pick: randNumber({ min: 1, max: 3 }),
        expansionId: randNumber({ min: 1, max: 100 }),
        ...overrides
    };
    return new BlackCard(
      props.id,
      props.text,
      props.pick,
      props.expansionId,
      props?.createdAt,
      props?.deleted_at
    )
};