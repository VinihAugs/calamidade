import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
// @ts-ignore - GSAP Draggable case sensitivity issue on Windows
import { Draggable } from 'gsap/Draggable';
import { Character } from '@/types/character';
import { CharacterCard } from './CharacterCard';

gsap.registerPlugin(Draggable);

interface InitiativeListProps {
  characters: Character[];
  currentTurn: number;
  isCombatMode: boolean;
  onReorder: (characters: Character[]) => void;
  onTakeDamage: (id: string, damage: number) => void;
  onHeal: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
  onToggleUnconscious?: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggleResistance?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export const InitiativeList = ({
  characters,
  currentTurn,
  isCombatMode,
  onReorder,
  onTakeDamage,
  onHeal,
  onRemove,
  onToggleUnconscious,
  onEdit,
  onToggleResistance,
  onDuplicate,
}: InitiativeListProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const draggablesRef = useRef<Draggable[]>([]);

  const visibleCharacters = isCombatMode 
    ? characters 
    : characters.filter(char => char.type !== 'monster');

  useEffect(() => {
    draggablesRef.current.forEach(d => d.kill());
    draggablesRef.current = [];

    if (!isCombatMode && listRef.current) {
      const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
      
      items.forEach((item, index) => {
        const draggable = Draggable.create(item, {
          type: 'y',
          bounds: listRef.current,
          edgeResistance: 0.65,
          onDragStart: function() {
            gsap.to(item, { scale: 1.02, boxShadow: '0 10px 40px -10px hsla(20, 15%, 5%, 0.9)', duration: 0.2 });
          },
          onDrag: function() {
            const dragY = this.y;
            const itemHeight = item.offsetHeight + 12;
            const newIndex = Math.round(dragY / itemHeight) + index;
            
            items.forEach((otherItem, i) => {
              if (i !== index && otherItem) {
                const offset = i < index ? 
                  (i >= newIndex ? itemHeight : 0) : 
                  (i <= newIndex ? -itemHeight : 0);
                gsap.to(otherItem, { y: offset, duration: 0.2 });
              }
            });
          },
          onDragEnd: function() {
            const dragY = this.y;
            const itemHeight = item.offsetHeight + 12;
            let newIndex = Math.round(dragY / itemHeight) + index;
            newIndex = Math.max(0, Math.min(visibleCharacters.length - 1, newIndex));
            
            items.forEach((otherItem) => {
              if (otherItem) {
                gsap.to(otherItem, { y: 0, scale: 1, boxShadow: '0 8px 32px -8px hsla(20, 15%, 5%, 0.8)', duration: 0.3 });
              }
            });
            
            if (newIndex !== index) {
              const newOrder = [...visibleCharacters];
              const [removed] = newOrder.splice(index, 1);
              newOrder.splice(newIndex, 0, removed);
              
              const fullOrder = [...characters];
              const removedChar = removed;
              const oldIndex = characters.findIndex(c => c.id === removedChar.id);
              if (oldIndex >= 0) {
                fullOrder.splice(oldIndex, 1);
                const insertIndex = newOrder.findIndex(c => c.id === removedChar.id);
                const beforeChar = newOrder[insertIndex - 1];
                if (beforeChar) {
                  const beforeIndex = fullOrder.findIndex(c => c.id === beforeChar.id);
                  fullOrder.splice(beforeIndex + 1, 0, removedChar);
                } else {
                  fullOrder.unshift(removedChar);
                }
              }
              onReorder(fullOrder);
            }
          },
        })[0];
        
        draggablesRef.current.push(draggable);
      });
    }

    return () => {
      draggablesRef.current.forEach(d => d.kill());
    };
  }, [visibleCharacters, isCombatMode, onReorder, characters]);

  const visibleCurrentTurn = isCombatMode 
    ? currentTurn 
    : (() => {
        const visibleIndex = visibleCharacters.findIndex(
          char => char.id === characters[currentTurn]?.id
        );
        return visibleIndex >= 0 ? visibleIndex : 0;
      })();

  if (visibleCharacters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <span className="text-3xl">⚔️</span>
        </div>
        <h3 className="font-medieval text-xl text-muted-foreground mb-2">
          Nenhum combatente
        </h3>
        <p className="text-sm text-muted-foreground">
          Adicione jogadores, NPCs ou monstros para começar
        </p>
      </div>
    );
  }

  return (
    <div ref={listRef} className="space-y-3">
      {visibleCharacters.map((character, index) => (
        <div
          key={character.id}
          ref={(el) => { itemRefs.current[index] = el; }}
          className={`transition-transform ${!isCombatMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          <CharacterCard
            character={character}
            isActive={index === visibleCurrentTurn}
            isCombatMode={isCombatMode}
            onTakeDamage={onTakeDamage}
            onHeal={onHeal}
            onRemove={onRemove}
            onToggleUnconscious={onToggleUnconscious}
            onEdit={onEdit}
            onToggleResistance={onToggleResistance}
            onDuplicate={onDuplicate}
          />
        </div>
      ))}
    </div>
  );
};
