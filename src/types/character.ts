export type CharacterType = 'player' | 'npc' | 'monster';

export type CharacterClass = 
  | 'warrior' 
  | 'mage' 
  | 'rogue' 
  | 'cleric' 
  | 'ranger' 
  | 'paladin'
  | 'bard'
  | 'barbarian';

export interface Character {
  id: string;
  name: string;
  type: CharacterType;
  characterClass: CharacterClass;
  ac: number;
  hp: number;
  maxHp: number;
  initiative: number;
  resistance?: number;
  resistanceActive?: boolean;
  isDefeated: boolean;
}
