export interface Game {
    id: string;
    name: string;
    judgeId: number;
    createdAt?: Date;
    deleted_at?: Date;
    code: string;
    redrawLimit: number;
}

export const initialGameObject = (): Game => {
    return {
        id: "",
        name: "",
        judgeId: 0,
        code: "",
        redrawLimit: 2
    }
}