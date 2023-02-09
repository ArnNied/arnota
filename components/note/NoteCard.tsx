import { generateHTML } from '@tiptap/core';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { configuredExtension } from '@/lib/tiptap';

import type { JSONContent } from '@tiptap/core';

type NoteCardProps = {
  href: string;
  title: string;
  body: string;
  createdAt: number;
  owner: string;
};

export default function NoteCard({
  href,
  title,
  body,
  createdAt,
  owner
}: NoteCardProps): JSX.Element {
  const [parsedBody, setParsedBody] = useState<JSX.Element>(
    parse(body) as JSX.Element
  );

  useEffect(() => {
    try {
      const generatedHTML = generateHTML(
        JSON.parse(body) as JSONContent,
        configuredExtension
      );

      const sanitized = DOMPurify.sanitize(generatedHTML);

      // TODO: Somehow limit the amount of html tag that can be parsed
      const parsedHTML = parse(sanitized) as JSX.Element;

      setParsedBody(parsedHTML);
    } catch (error) {
      setParsedBody(parse(body) as JSX.Element);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Link
      href={`/nota/${href}`}
      className='w-full max-h-96 flex flex-col p-2.5 bg-white font-poppins shadow hover:shadow-md hover:shadow-primary/50 rounded overflow-hidden'
    >
      <h2 className='font-bold text-darker break-words'>{title}</h2>
      <h3 className='my-1 text-xs italic text-secondary'>
        Created: {createdAt}
      </h3>
      <div className='text-sm text-darker whitespace-pre-wrap'>
        {parsedBody}
      </div>
      <p className='mt-1 text-xs italic text-secondary'>By: {owner}</p>
    </Link>
  );
}
