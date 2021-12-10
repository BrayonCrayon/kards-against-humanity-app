export interface IWhiteCard {
  id: number;
  text: string;
  expansion_id: number;
  selected: boolean;
  created_at?: Date;
  deleted_at?: Date;
}

export class WhiteCard implements IWhiteCard {
  id: number;
  text: string;
  expansion_id: number;
  selected: boolean = false;
  created_at?: Date;
  deleted_at?: Date;

  constructor(id: number = 0, text: string = "", expansion_id: number = 0) {
    this.id = id;
    this.text = text;
    this.expansion_id = expansion_id;
  }
}
