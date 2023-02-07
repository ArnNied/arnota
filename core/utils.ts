import { LoremIpsum } from 'lorem-ipsum';
import { nanoid } from 'nanoid';

import { setNotes } from '@/store/slices/notesSlice';
import { EVisibility } from '@/types/note';

import type { useAppDispatch } from '@/store/hooks';
import type { TNote } from '@/types/note';

export function setNotesIfReduxStateIsEmpty(
  dispatcher: ReturnType<typeof useAppDispatch>
): void {
  const MOCK_CATEGORIES = [
    'Recipe',
    'Work',
    'Travel',
    'Shopping List',
    'School',
    'Personal'
  ];

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 16,
      min: 4
    }
  });
  const temp: TNote[] = [];

  const now = Date.now();
  for (let i = 0; i < 20; i++)
    temp.push({
      id: nanoid(16),
      title: lorem.generateWords(5),
      body: lorem.generateSentences(Math.floor(Math.random() * 200)),
      category:
        Math.random() > 0.5
          ? MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)]
          : null,
      visibility: EVisibility.PUBLIC,
      tags: [],
      createdAt: now,
      lastModified: now
    });

  dispatcher(setNotes(temp));
}
