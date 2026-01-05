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
  ac: number; // Classe de Armadura
  hp: number;
  maxHp: number;
  initiative: number;
  resistance?: number; // Resistência (opcional, para NPCs)
  resistanceActive?: boolean; // Se a resistência está ativa (para NPCs)
  isDefeated: boolean;
}
