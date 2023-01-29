type TopBarNavButtonProps = {
  text: string;
};

export default function TopBarNavButton({
  text
}: TopBarNavButtonProps): JSX.Element {
  return (
    <button className='w-8 h-8 hover:bg-secondary text-darker hover:text-light rounded-full'>
      {text}
    </button>
  );
}
