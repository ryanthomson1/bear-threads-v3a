

import { ExclamationCircleIcon, QuestionMarkCircleIcon, BuildingLibraryIcon, SparklesIcon } from '@heroicons/react/24/outline';

export interface TagType {
  label: string;
  color: string;
  Icon: any; // Use 'any' for the icon component type for simplicity
}

export const tagTypes: { [key: string]: TagType } = {
  Snarky: {
    label: 'Snarky',
    color: 'red',
    Icon: ExclamationCircleIcon,
  },
  Existential: {
    label: 'Existential',
    color: 'blue',
    Icon: QuestionMarkCircleIcon,
  },
  Political: {
    label: 'Political',
    color: 'green',
    Icon: BuildingLibraryIcon,
  },
  NewTag: {
    label: 'New Tag',
    color: 'purple',
    Icon: SparklesIcon,
  },
};