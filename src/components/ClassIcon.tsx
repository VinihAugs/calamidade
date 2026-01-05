import { 
  Sword, 
  Sparkles, 
  Eye, 
  Cross, 
  Target, 
  Shield, 
  Music, 
  Flame 
} from 'lucide-react';
import { CharacterClass } from '@/types/character';

interface ClassIconProps {
  characterClass: CharacterClass;
  className?: string;
}

const iconMap: Record<CharacterClass, React.ComponentType<{ className?: string }>> = {
  warrior: Sword,
  mage: Sparkles,
  rogue: Eye,
  cleric: Cross,
  ranger: Target,
  paladin: Shield,
  bard: Music,
  barbarian: Flame,
};

export const ClassIcon = ({ characterClass, className = "w-5 h-5" }: ClassIconProps) => {
  const Icon = iconMap[characterClass];
  return <Icon className={className} />;
};
