import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLevelColor(level: string) {
  switch (level) {
    case 'beginner':
      return 'bg-secondary text-secondary-foreground'
    case 'intermediate':
      return 'bg-primary text-primary-foreground'
    case 'advanced':
      return 'bg-accent text-accent-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function getLevelLabel(level: string) {
  switch (level) {
    case 'beginner':
      return 'Mới bắt đầu'
    case 'intermediate':
      return 'Trung cấp'
    case 'advanced':
      return 'Nâng cao'
    default:
      return level
  }
}
