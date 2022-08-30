export interface UserGameWhiteCard {
  id: number;
  user_id: number;
  game_id: string;
  white_card_id: number;
  selected: boolean;
  createdAt?: Date;
  deleted_at?: Date;
}
