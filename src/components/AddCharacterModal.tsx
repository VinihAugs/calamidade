import { useState, useEffect } from 'react';
import { Character, CharacterType, CharacterClass } from '@/types/character';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { NumberInput } from './ui/number-input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ClassIcon } from './ClassIcon';

interface AddCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (character: Omit<Character, 'id' | 'isDefeated'>) => void;
  defaultType: CharacterType;
  editingCharacter?: Character | null;
  onEdit?: (id: string, character: Omit<Character, 'id' | 'isDefeated'>) => void;
}

const classOptions: { value: CharacterClass; label: string }[] = [
  { value: 'warrior', label: 'Guerreiro' },
  { value: 'mage', label: 'Mago' },
  { value: 'rogue', label: 'Ladino' },
  { value: 'cleric', label: 'Clérigo' },
  { value: 'ranger', label: 'Patrulheiro' },
  { value: 'paladin', label: 'Paladino' },
  { value: 'bard', label: 'Bardo' },
  { value: 'barbarian', label: 'Bárbaro' },
];

export const AddCharacterModal = ({
  isOpen,
  onClose,
  onAdd,
  defaultType,
  editingCharacter,
  onEdit,
}: AddCharacterModalProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<CharacterType>(defaultType);
  const [characterClass, setCharacterClass] = useState<CharacterClass>('warrior');
  const [ac, setAc] = useState('10');
  const [initiative, setInitiative] = useState('10');
  const [resistance, setResistance] = useState('0');
  const [maxHp, setMaxHp] = useState('20');

  // Load editing character data
  useEffect(() => {
    if (editingCharacter) {
      setName(editingCharacter.name);
      setType(editingCharacter.type);
      setCharacterClass(editingCharacter.characterClass);
      setAc(editingCharacter.ac.toString());
      setInitiative(editingCharacter.initiative.toString());
      setResistance((editingCharacter.resistance || 0).toString());
      setMaxHp(editingCharacter.maxHp.toString());
    } else {
      // Reset form when not editing
      setName('');
      setType(defaultType);
      setCharacterClass('warrior');
      setAc('10');
      setInitiative('10');
      setResistance('0');
      setMaxHp('20');
    }
  }, [editingCharacter, defaultType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const hpValue = (currentType === 'npc' || currentType === 'monster')
      ? parseInt(maxHp) || 20 
      : editingCharacter?.hp || 20;
    const maxHpValue = (currentType === 'npc' || currentType === 'monster')
      ? parseInt(maxHp) || 20 
      : editingCharacter?.maxHp || 20;

    const characterData: Omit<Character, 'id' | 'isDefeated'> = {
      name: name.trim(),
      type: currentType,
      characterClass: currentType === 'npc' || currentType === 'monster' ? 'warrior' : characterClass, // NPCs e Monstros não precisam de classe, mas mantemos para compatibilidade
      ac: parseInt(ac) || 10,
      hp: hpValue,
      maxHp: maxHpValue,
      initiative: parseInt(initiative) || 10,
      ...((currentType === 'npc' || currentType === 'monster') && { 
        resistance: parseInt(resistance) || 0,
        resistanceActive: false,
      }),
    };

    if (editingCharacter && onEdit) {
      onEdit(editingCharacter.id, characterData);
    } else {
      onAdd(characterData);
    }

    // Reset form
    setName('');
    setType(defaultType);
    setCharacterClass('warrior');
    setAc('10');
    setInitiative('10');
    setResistance('0');
    setMaxHp('20');
    onClose();
  };

  const isEditing = !!editingCharacter;
  const currentType = editingCharacter?.type || type;
  const title = isEditing 
    ? currentType === 'monster' 
      ? 'Editar Monstro'
      : 'Editar Personagem'
    : defaultType === 'monster' 
      ? 'Adicionar Monstro' 
      : 'Adicionar Jogador/NPC';

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      // Não permite fechar clicando fora ou pressionando ESC
      // Só fecha através dos botões Cancelar, Salvar ou X
    }}>
      <DialogContent 
        className="card-parchment border-border sm:max-w-md"
        onClose={onClose}
      >
        <DialogHeader>
          <DialogTitle className="font-medieval text-xl text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do personagem"
              className="bg-secondary border-border"
              required
            />
          </div>

          {currentType !== 'monster' && (
            <div className="space-y-2">
              <Label className="text-foreground">Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as CharacterType)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="player">Jogador</SelectItem>
                  <SelectItem value="npc">NPC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Classe - apenas para jogadores */}
          {currentType === 'player' && (
            <div className="space-y-2">
              <Label className="text-foreground">Classe</Label>
              <Select value={characterClass} onValueChange={(v) => setCharacterClass(v as CharacterClass)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {classOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <ClassIcon characterClass={option.value} className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="ac" className="text-foreground">CA</Label>
            <NumberInput
              id="ac"
              value={ac}
              onChange={(e) => setAc(e.target.value)}
              placeholder="10"
              className="bg-secondary border-border"
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initiative" className="text-foreground">Iniciativa</Label>
            <NumberInput
              id="initiative"
              value={initiative}
              onChange={(e) => setInitiative(e.target.value)}
              placeholder="10"
              className="bg-secondary border-border"
              required
            />
          </div>

          {/* Campos específicos para NPC e Monstro */}
          {(currentType === 'npc' || currentType === 'monster') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="maxHp" className="text-foreground">Vida Máxima</Label>
                <NumberInput
                  id="maxHp"
                  value={maxHp}
                  onChange={(e) => setMaxHp(e.target.value)}
                  placeholder="20"
                  className="bg-secondary border-border"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resistance" className="text-foreground">Resistência</Label>
                <NumberInput
                  id="resistance"
                  value={resistance}
                  onChange={(e) => setResistance(e.target.value)}
                  placeholder="0"
                  className="bg-secondary border-border"
                  min="0"
                  required
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-medieval text-primary-foreground">
              {isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
