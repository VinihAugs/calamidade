import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Character } from '@/types/character';
import { ClassIcon } from './ClassIcon';
import { Shield, ShieldBan, Dice4, Pencil, Trash2, Skull, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

interface CharacterCardProps {
  character: Character;
  isActive: boolean;
  isCombatMode: boolean;
  onTakeDamage: (id: string, damage: number) => void;
  onHeal: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggleUnconscious?: (id: string) => void;
  onToggleResistance?: (id: string) => void;
}

export const CharacterCard = ({
  character,
  isActive,
  isCombatMode,
  onTakeDamage,
  onHeal,
  onRemove,
  onEdit,
  onToggleUnconscious,
  onToggleResistance,
}: CharacterCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const damageRef = useRef<HTMLDivElement>(null);
  const [damageInput, setDamageInput] = useState('');
  const [showDamagePopup, setShowDamagePopup] = useState(false);
  const [lastDamage, setLastDamage] = useState(0);

  const handleDamage = () => {
    const damage = parseInt(damageInput) || 0;
    if (damage <= 0) return;

    setLastDamage(damage);
    setShowDamagePopup(true);

    // Shake animation
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { x: 0 },
        { 
          x: 4, 
          duration: 0.05, 
          repeat: 7,
          yoyo: true,
          ease: 'power2.inOut',
          onComplete: () => {
            gsap.set(cardRef.current, { x: 0 });
          }
        }
      );
    }

    onTakeDamage(character.id, damage);
    setDamageInput('');

    setTimeout(() => setShowDamagePopup(false), 800);
  };

  const handleHeal = () => {
    const amount = parseInt(damageInput) || 0;
    if (amount <= 0) return;
    onHeal(character.id, amount);
    setDamageInput('');
  };

  const handleCardClick = () => {
    if (isCombatMode && character.type === 'player' && onToggleUnconscious) {
      onToggleUnconscious(character.id);
    }
  };

  const hpPercentage = (character.hp / character.maxHp) * 100;

  const getHpColor = () => {
    if (hpPercentage > 50) return 'bg-success';
    if (hpPercentage > 25) return 'bg-primary';
    return 'bg-destructive';
  };

  // Death animation
  useEffect(() => {
    if (character.isDefeated && cardRef.current) {
      gsap.to(cardRef.current, {
        rotation: 3,
        y: 10,
        duration: 0.5,
        ease: 'power2.out',
      });
    } else if (!character.isDefeated && cardRef.current) {
      gsap.to(cardRef.current, {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [character.isDefeated]);

  // Active turn pulse
  useEffect(() => {
    if (isActive && isCombatMode && cardRef.current) {
      gsap.to(cardRef.current, {
        boxShadow: '0 0 30px hsla(38, 70%, 50%, 0.6)',
        duration: 0.3,
      });
    } else if (cardRef.current) {
      gsap.to(cardRef.current, {
        boxShadow: '0 8px 32px -8px hsla(20, 15%, 5%, 0.8)',
        duration: 0.3,
      });
    }
  }, [isActive, isCombatMode]);

  const typeLabel = character.type === 'player' ? 'Jogador' : character.type === 'npc' ? 'NPC' : 'Monstro';
  const typeBgClass = character.type === 'monster' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary';

  const isPlayerInCombat = isCombatMode && character.type === 'player';

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={`card-parchment p-4 relative overflow-hidden transition-all duration-300 ${
        character.isDefeated ? 'defeated opacity-60' : ''
      } ${isActive && isCombatMode ? 'ring-2 ring-primary' : ''} ${
        isPlayerInCombat ? 'cursor-pointer' : ''
      }`}
    >
      {/* Damage Popup */}
      {showDamagePopup && (
        <div
          ref={damageRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-damage-pop"
        >
          <span className="text-4xl font-medieval font-bold text-destructive text-shadow-lg">
            -{lastDamage}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <ClassIcon characterClass={character.characterClass} className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medieval font-semibold text-lg text-foreground leading-tight">
              {character.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${typeBgClass}`}>
              {typeLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Action buttons - para jogadores, NPCs e monstros (exceto monstro derrotado em combate) */}
          {!(isCombatMode && character.type === 'monster' && character.isDefeated) && (
            <>
              {onEdit && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(character.id);
                  }}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(character.id);
                }}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}

          {character.isDefeated && (
            isCombatMode && character.type === 'monster' ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(character.id);
                }}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                title="Deletar monstro derrotado"
              >
                <Skull className="w-5 h-5" />
              </Button>
            ) : (
              <Skull className="w-5 h-5 text-muted-foreground" />
            )
          )}
        </div>
      </div>

      {/* Content based on mode and character type */}
      {!isCombatMode ? (
        <>
          {/* Modo Exploração */}
          {character.type === 'npc' ? (
            <>
              {/* NPC: Iniciativa, CA e Vida */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Dice4 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medieval font-bold text-primary text-lg">
                      {character.initiative}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medieval font-bold text-primary text-lg">
                      {character.ac}
                    </span>
                  </div>
                </div>
                {/* Barra de Vida */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-destructive" />
                      <span className="text-sm font-medium">
                        {character.hp} / {character.maxHp}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(hpPercentage)}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getHpColor()} transition-all duration-300`}
                      style={{ width: `${Math.max(0, hpPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Jogador: Apenas Iniciativa e CA */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Dice4 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medieval font-bold text-primary text-lg">
                    {character.initiative}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medieval font-bold text-primary text-lg">
                    {character.ac}
                  </span>
                </div>
              </div>
            </>
          )}
        </>
      ) : character.type === 'npc' ? (
        <>
          {/* NPC em Combate: Iniciativa, CA, Vida com barra, Resistência */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Dice4 className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medieval font-bold text-primary text-lg">
                  {character.initiative}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medieval font-bold text-primary text-lg">
                  {character.ac}
                </span>
              </div>
              {/* Resistência ao lado do CA */}
              {character.resistance !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <ShieldBan className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medieval font-bold text-primary text-lg">
                    {character.resistance}
                  </span>
                  {onToggleResistance && (
                    <Checkbox
                      checked={character.resistanceActive || false}
                      onCheckedChange={() => onToggleResistance(character.id)}
                      className="ml-1"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Barra de Vida */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium">
                    {character.hp} / {character.maxHp}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.round(hpPercentage)}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${getHpColor()} transition-all duration-300`}
                  style={{ width: `${Math.max(0, hpPercentage)}%` }}
                />
              </div>
            </div>
          </div>
        </>
      ) : character.type === 'monster' ? (
        <>
          {/* Monstro em Combate: Iniciativa, CA, Vida com barra, Resistência */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Dice4 className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medieval font-bold text-primary text-lg">
                  {character.initiative}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medieval font-bold text-primary text-lg">
                  {character.ac}
                </span>
              </div>
              {/* Resistência ao lado do CA */}
              {character.resistance !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <ShieldBan className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medieval font-bold text-primary text-lg">
                    {character.resistance}
                  </span>
                  {onToggleResistance && (
                    <Checkbox
                      checked={character.resistanceActive || false}
                      onCheckedChange={() => onToggleResistance(character.id)}
                      className="ml-1"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Barra de Vida */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium">
                    {character.hp} / {character.maxHp}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.round(hpPercentage)}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${getHpColor()} transition-all duration-300`}
                  style={{ width: `${Math.max(0, hpPercentage)}%` }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Player em Combate: Iniciativa e CA */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Dice4 className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medieval font-bold text-primary text-lg">
                {character.initiative}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medieval font-bold text-primary text-lg">
                {character.ac}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Combat Controls */}
      {isCombatMode && character.type === 'player' && (
        <div className="flex items-center justify-center mt-3 pt-3 border-t border-border">
          <Button
            size="sm"
            variant={character.isDefeated ? 'default' : 'outline'}
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleUnconscious) {
                onToggleUnconscious(character.id);
              }
            }}
            className={`h-8 ${
              character.isDefeated 
                ? 'bg-primary text-primary-foreground' 
                : 'border-primary text-primary hover:bg-primary/10'
            }`}
          >
            {character.isDefeated ? 'Consciente' : 'Inconsciente'}
          </Button>
        </div>
      )}

      {/* Combat Controls for non-players */}
      {isCombatMode && character.type !== 'player' && !character.isDefeated && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border flex-wrap">
          <Input
            type="number"
            placeholder="Valor"
            value={damageInput}
            onChange={(e) => setDamageInput(e.target.value)}
            className="w-16 sm:w-20 h-8 text-xs sm:text-sm bg-secondary border-border"
            min="1"
          />
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDamage}
            className="h-8 btn-blood text-xs sm:text-sm flex-1 sm:flex-initial"
          >
            Dano
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleHeal}
            className="h-8 border-success text-success hover:bg-success/10 text-xs sm:text-sm flex-1 sm:flex-initial"
          >
            Curar
          </Button>
        </div>
      )}

    </div>
  );
};
