type InputWithLabelProps = {
  value: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchField({
  value,
  onChangeHandler
}: InputWithLabelProps): JSX.Element {
  return (
    <input
      type='text'
      placeholder='Search'
      className='px-2 py-1 rounded focus:outline-secondary focus:outline-none'
      value={value}
      onChange={onChangeHandler}
    />
  );
}
