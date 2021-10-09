export interface UserGameWhiteCard {
  id: number;
  user_id: number;
  game_id: string;
  white_card_id: number;
  selected: boolean;
  created_at?: Date;
  deleted_at?: Date;
}
