import { generateHTML } from '@tiptap/core';
import DOMPurify from 'dompurify';
import { doc, getDoc } from 'firebase/firestore';
import parse from 'html-react-parser';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { usersCollection } from '@/lib/firebase/firestore';
import { configuredExtension } from '@/lib/tiptap';
import { formatDate } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';

import type { TNote } from '@/types/note';
import type { JSONContent } from '@tiptap/core';

type NoteCardProps = {
  note: TNote;
};

export default function NoteCard({ note }: NoteCardProps): JSX.Element {
  const authenticatedUserSelector = useAppSelector(
    (state) => state.authenticatedUser
  );

  const [parsedBody, setParsedBody] = useState<JSX.Element>(
    parse(note.body) as JSX.Element
  );
  const [ownerUsername, setOwnerUsername] = useState<string>('');

  useEffect(() => {
    if (!authenticatedUserSelector) return;

    // Set the username to display according to the note's owner id
    if (note.owner === authenticatedUserSelector.uid) {
      setOwnerUsername(`${authenticatedUserSelector.username} (You)`);
    } else {
      const userDocRef = doc(usersCollection, note.owner);

      getDoc(userDocRef)
        .then((userDocSnap) => {
          if (userDocSnap.exists()) {
            setOwnerUsername(userDocSnap.data().username);
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticatedUserSelector]);

  useEffect(() => {
    // Try to parse the note's body if it's a JSON string from tiptap
    // If it's not a JSON string, then just parse it as a string
    try {
      const generatedHTML = generateHTML(
        JSON.parse(note.body) as JSONContent,
        configuredExtension
      );

      const sanitized = DOMPurify.sanitize(generatedHTML);

      // TODO: Somehow limit the amount of html tag that can be parsed
      const parsedHTML = parse(sanitized) as JSX.Element;

      setParsedBody(parsedHTML);
    } catch (error) {
      setParsedBody(parse(note.body) as JSX.Element);
    }
  }, [note.body]);

  return (
    <Link
      href={`/nota/${note.id}`}
      className='w-full max-h-96 flex flex-col p-2.5 bg-white font-poppins shadow hover:shadow-md hover:shadow-primary/50 rounded overflow-hidden'
    >
      <h2 className='font-bold text-darker break-words'>{note.title}</h2>
      <h3 className='my-1 text-xs italic text-secondary'>
        Created: {formatDate(note.createdAt)}
      </h3>
      <div className='text-sm text-darker whitespace-pre-wrap'>
        {parsedBody}
      </div>
      <p className='mt-1 text-xs italic text-secondary'>By: {ownerUsername}</p>
    </Link>
  );
}
