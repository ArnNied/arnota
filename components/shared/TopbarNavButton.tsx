type TopbarNavButtonProps = {
  text: string;
};

export default function TopbarNavButton({
  text
}: TopbarNavButtonProps): JSX.Element {
  return (
    <button className='w-8 h-8 hover:bg-secondary text-darker hover:text-light rounded-full'>
      {text}
    </button>
  );
}
