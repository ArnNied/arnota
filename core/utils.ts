import { LoremIpsum } from 'lorem-ipsum';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

import { setCategories } from '@/store/slices/notesCategorySlice';
import { setNotes } from '@/store/slices/notesSlice';

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
  for (let i = 0; i < 20; i++)
    temp.push({
      id: nanoid(16),
      title: lorem.generateWords(5),
      body: lorem.generateSentences(Math.floor(Math.random() * 200)),
      category: slugify(
        MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)],
        {
          lower: true
        }
      )
    });

  dispatcher(setNotes(temp));
  dispatcher(setCategories(MOCK_CATEGORIES));
}
