import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Character, CharacterType } from '@/types/character';
import { InitiativeList } from '@/components/InitiativeList';
import { AddCharacterModal } from '@/components/AddCharacterModal';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Skull, 
  Swords, 
  Map, 
  ChevronLeft, 
  SkipForward,
  RotateCcw,
  Trash2
} from 'lucide-react';

const STORAGE_KEY = 'cavaleiros-do-caos-tracker';

const Tracker = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isCombatMode, setIsCombatMode] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addType, setAddType] = useState<CharacterType>('player');
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.characters && Array.isArray(parsed.characters)) {
          setCharacters(parsed.characters);
        }
        if (typeof parsed.isCombatMode === 'boolean') {
          setIsCombatMode(parsed.isCombatMode);
        }
        if (typeof parsed.currentTurn === 'number') {
          setCurrentTurn(parsed.currentTurn);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      const dataToSave = {
        characters,
        isCombatMode,
        currentTurn,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  }, [characters, isCombatMode, currentTurn]);

  useEffect(() => {
    const tl = gsap.timeline();
    
    if (isCombatMode) {
      tl.to(headerRef.current, {
        backgroundColor: 'hsla(0, 70%, 40%, 0.1)',
        duration: 0.5,
      })
      .to(contentRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
      }, '-=0.3');
    } else {
      tl.to(headerRef.current, {
        backgroundColor: 'transparent',
        duration: 0.5,
      })
      .to(contentRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
      }, '-=0.3');
    }
  }, [isCombatMode]);

  const handleAddCharacter = (characterData: Omit<Character, 'id' | 'isDefeated'>) => {
    const newCharacter: Character = {
      ...characterData,
      id: crypto.randomUUID(),
      isDefeated: false,
    };
    
    const newCharacters = [...characters, newCharacter].sort(
      (a, b) => b.initiative - a.initiative
    );
    setCharacters(newCharacters);
  };

  const handleReorder = (newOrder: Character[]) => {
    setCharacters(newOrder);
  };

  const handleTakeDamage = (id: string, damage: number) => {
    setCharacters(prev => prev.map(char => {
      if (char.id !== id) return char;
      
      let finalDamage = damage;
      if ((char.type === 'npc' || char.type === 'monster') && char.resistanceActive && char.resistance !== undefined) {
        finalDamage = Math.max(0, damage - char.resistance);
      }
      
      const newHp = Math.max(0, char.hp - finalDamage);
      return {
        ...char,
        hp: newHp,
        isDefeated: newHp <= 0,
      };
    }));
  };

  const handleHeal = (id: string, amount: number) => {
    setCharacters(prev => prev.map(char => {
      if (char.id !== id) return char;
      const newHp = Math.min(char.maxHp, char.hp + amount);
      return {
        ...char,
        hp: newHp,
        isDefeated: false,
      };
    }));
  };

  const handleRemove = (id: string) => {
    setCharacters(prev => prev.filter(char => char.id !== id));
  };

  const handleToggleUnconscious = (id: string) => {
    setCharacters(prev => prev.map(char => {
      if (char.id === id && char.type === 'player') {
        return {
          ...char,
          isDefeated: !char.isDefeated,
        };
      }
      return char;
    }));
  };

  const handleToggleResistance = (id: string) => {
    setCharacters(prev => prev.map(char => {
      if (char.id === id && (char.type === 'npc' || char.type === 'monster')) {
        return {
          ...char,
          resistanceActive: !char.resistanceActive,
        };
      }
      return char;
    }));
  };

  const handleEdit = (id: string) => {
    const character = characters.find(c => c.id === id);
    if (character) {
      setEditingCharacter(character);
      setIsAddModalOpen(true);
    }
  };

  const handleEditCharacter = (id: string, characterData: Omit<Character, 'id' | 'isDefeated'>) => {
    setCharacters(prev => prev.map(char => {
      if (char.id === id) {
        return {
          ...char,
          ...characterData,
        };
      }
      return char;
    }).sort((a, b) => b.initiative - a.initiative));
    setEditingCharacter(null);
  };

  const handleDuplicate = (id: string) => {
    const characterToDuplicate = characters.find(c => c.id === id);
    if (characterToDuplicate) {
      const originalName = characterToDuplicate.name;
      const baseName = originalName.replace(/\s+\d+$/, '').trim();
      
      const existingMonsters = characters.filter(c => 
        c.type === 'monster' && 
        (c.name === baseName || c.name.startsWith(`${baseName} `))
      );
      
      const hasOriginal = existingMonsters.some(m => m.name === baseName);
      const numberedMonsters = existingMonsters
        .filter(m => m.name.startsWith(`${baseName} `))
        .map(m => {
          const match = m.name.match(/\s+(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter(n => n > 0);
      
      let nextNumber = 1;
      if (numberedMonsters.length > 0) {
        nextNumber = Math.max(...numberedMonsters) + 1;
      } else if (hasOriginal) {
        nextNumber = 1;
      }
      
      const newName = `${baseName} ${nextNumber}`;
      
      const duplicatedCharacter: Character = {
        ...characterToDuplicate,
        id: crypto.randomUUID(),
        name: newName,
        isDefeated: false,
        hp: characterToDuplicate.maxHp,
        resistanceActive: false,
      };
      
      const newCharacters = [...characters, duplicatedCharacter].sort(
        (a, b) => b.initiative - a.initiative
      );
      setCharacters(newCharacters);
    }
  };

  const handleNextTurn = () => {
    const aliveCharacters = characters.filter(c => !c.isDefeated);
    if (aliveCharacters.length === 0) return;

    let nextTurn = currentTurn;
    do {
      nextTurn = (nextTurn + 1) % characters.length;
    } while (characters[nextTurn]?.isDefeated && nextTurn !== currentTurn);

    setCurrentTurn(nextTurn);
  };

  const handleResetCombat = () => {
    setCurrentTurn(0);
    setCharacters(prev => prev.map(char => ({
      ...char,
      hp: char.maxHp,
      isDefeated: false,
    })));
  };

  const openAddModal = (type: CharacterType) => {
    setAddType(type);
    setEditingCharacter(null);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingCharacter(null);
  };

  const handleClearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCharacters([]);
    setIsCombatMode(false);
    setCurrentTurn(0);
    setEditingCharacter(null);
    setIsAddModalOpen(false);
  };

  const aliveCount = characters.filter(c => !c.isDefeated).length;
  const monsterCount = characters.filter(c => c.type === 'monster').length;

  return (
    <div className="min-h-screen flex flex-col relative">
      <div 
        className="hidden md:block fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: 'url(/fundo.png)',
        }}
      >
        <div className="absolute inset-0 bg-background/50" />
      </div>

      <div 
        className="md:hidden fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: 'url(/homesecundarymobile.png)',
        }}
      >
        <div className="absolute inset-0 bg-background/50" />
      </div>

      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md transition-colors shadow-lg"
      >
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <ChevronLeft className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
            
            <h1 className="font-medieval text-lg sm:text-xl text-foreground truncate">
              Iniciativa
            </h1>

            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground shrink-0">
              <span>{aliveCount}/{characters.length}</span>
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={isCombatMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsCombatMode(!isCombatMode)}
              className={isCombatMode ? 'btn-blood' : ''}
            >
              {isCombatMode ? (
                <>
                  <Swords className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Combate</span>
                </>
              ) : (
                <>
                  <Map className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Exploração</span>
                </>
              )}
            </Button>

            <div className="flex-1" />

            <Button
              variant="outline"
              size="sm"
              onClick={() => openAddModal('player')}
              className="text-xs sm:text-sm"
            >
              <Users className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Jogador/NPC</span>
              <span className="sm:hidden">J/NPC</span>
            </Button>
            <div className="relative">
              {!isCombatMode && monsterCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-10">
                  {monsterCount}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => openAddModal('monster')}
                className="border-destructive/50 text-destructive hover:bg-destructive/10 text-xs sm:text-sm"
              >
                <Skull className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Monstro</span>
                <span className="sm:hidden">M</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main ref={contentRef} className="flex-1 container max-w-2xl mx-auto px-4 py-6">
        <InitiativeList
          characters={characters}
          currentTurn={currentTurn}
          isCombatMode={isCombatMode}
          onReorder={handleReorder}
          onTakeDamage={handleTakeDamage}
          onHeal={handleHeal}
          onRemove={handleRemove}
          onToggleUnconscious={handleToggleUnconscious}
          onEdit={handleEdit}
          onToggleResistance={handleToggleResistance}
          onDuplicate={handleDuplicate}
        />
      </main>

      {isCombatMode && characters.length > 0 && (
        <footer className="sticky bottom-0 border-t border-border bg-background/90 backdrop-blur-md shadow-lg">
          <div className="container max-w-2xl mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetCombat}
                className="text-xs sm:text-sm"
              >
                <RotateCcw className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Reiniciar</span>
              </Button>

              <div className="text-center min-w-0 flex-1 px-2">
                <p className="text-xs text-muted-foreground mb-1">Turno Atual</p>
                <p className="font-medieval text-sm sm:text-lg text-primary truncate">
                  {characters[currentTurn]?.name || '-'}
                </p>
              </div>

              <Button
                onClick={handleNextTurn}
                className="btn-medieval text-primary-foreground text-xs sm:text-sm"
              >
                <SkipForward className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Próximo</span>
                <span className="sm:hidden">Próx</span>
              </Button>
            </div>
          </div>
        </footer>
      )}

      {characters.length > 0 && (
        <div className="container max-w-2xl mx-auto px-4 py-6">
          <div className="flex justify-center">
            <Button
              variant="destructive"
              size="lg"
              onClick={handleClearAll}
              className="btn-blood"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Mesa
            </Button>
          </div>
        </div>
      )}

      <AddCharacterModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddCharacter}
        defaultType={addType}
        editingCharacter={editingCharacter}
        onEdit={handleEditCharacter}
      />
    </div>
  );
};

export default Tracker;
