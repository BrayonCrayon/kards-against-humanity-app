export interface Game {
    id: string;
    name: string;
    judge_id: number;
    createdAt?: Date;
    deleted_at?: Date;
    code: string;
    redrawLimit: number;
}

export const initialGameObject = (): Game => {
    return {
        id: "",
        name: "",
        judge_id: 0,
        code: "",
        redrawLimit: 2
    }
}