type NoteCardProps = {
  title: string;
  body: string;
};

export default function NoteCard({ title, body }: NoteCardProps): JSX.Element {
  return (
    <div className='max-h-40 p-2 bg-white shadow hover:shadow-md hover:shadow-primary/50 rounded overflow-hidden'>
      <h2 className='font-semibold text-darker break-words'>{title}</h2>
      <p className='text-sm text-darker break-words'>{body}</p>
    </div>
  );
}
