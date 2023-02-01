import Link from 'next/link';

type NoteCardProps = {
  href: string;
  title: string;
  body: string;
};

export default function NoteCard({
  href,
  title,
  body
}: NoteCardProps): JSX.Element {
  return (
    <Link
      href={`/note/${href}`}
      className='w-full max-h-40 flex flex-col p-2.5 bg-white font-poppins shadow hover:shadow-md hover:shadow-primary/50 rounded overflow-hidden'
    >
      <h2 className='font-semibold text-darker break-words'>{title}</h2>
      <p className='text-sm text-darker break-words'>{body}</p>
    </Link>
  );
}
